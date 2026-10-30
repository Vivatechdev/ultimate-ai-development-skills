/**
 * Reusable SaaS Subscription & Entitlement Engine
 */

const PLAN_LIMITS = {
  starter: { maxNodes: 5, maxMembers: 3, alertChannels: ['email'] },
  pro: { maxNodes: 50, maxMembers: 15, alertChannels: ['email', 'slack', 'webhook'] },
  enterprise: { maxNodes: 1000, maxMembers: 100, alertChannels: ['email', 'slack', 'pagerduty', 'webhook'] }
};

class EntitlementGuard {
  static assertCanAddRobot(tenant, currentRobotCount) {
    // 1. Check Subscription Status
    if (tenant.subscriptionStatus === 'canceled') {
      const err = new Error('Subscription is canceled. Reactivate to add more robotic nodes.');
      err.statusCode = 402;
      err.code = 'SUBSCRIPTION_CANCELED';
      throw err;
    }

    // 2. Check Plan Quota Limit
    const limits = PLAN_LIMITS[tenant.planTier] || PLAN_LIMITS.starter;
    if (currentRobotCount >= limits.maxNodes) {
      const err = new Error(`Quota limit reached (${limits.maxNodes} nodes) for plan '${tenant.planTier}'. Upgrade required.`);
      err.statusCode = 402;
      err.code = 'QUOTA_EXCEEDED';
      throw err;
    }

    return true;
  }
}

class BillingStateMachine {
  constructor() {
    this.processedEvents = new Set();
  }

  processWebhookEvent(event, tenant) {
    // 1. Idempotency Check
    if (this.processedEvents.has(event.id)) {
      return { status: 'ignored_duplicate', eventId: event.id };
    }

    // 2. State Transition Logic
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        tenant.subscriptionStatus = event.data.status; // 'active', 'past_due', etc.
        tenant.planTier = event.data.planTier || tenant.planTier;
        break;

      case 'invoice.payment_failed':
        tenant.subscriptionStatus = 'past_due';
        break;

      case 'customer.subscription.deleted':
        tenant.subscriptionStatus = 'canceled';
        break;

      default:
        // Ignore unhandled events gracefully
        break;
    }

    this.processedEvents.add(event.id);
    return { status: 'processed', newStatus: tenant.subscriptionStatus, eventId: event.id };
  }
}

module.exports = { EntitlementGuard, BillingStateMachine, PLAN_LIMITS };

