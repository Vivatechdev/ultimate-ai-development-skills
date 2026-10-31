/**
 * Secure Order & Fulfillment Service
 * Enforces the Cardinal Rule: Never fulfill from frontend claims alone.
 */

class OrderService {
  constructor() {
    this.orders = new Map();
    this.processedTransactions = new Set();
  }

  createOrder({ orderId, customerId, expectedAmount, currency }) {
    const order = {
      orderId,
      customerId,
      expectedAmount,
      currency,
      status: 'pending',
      fulfilledAt: null
    };
    this.orders.set(orderId, order);
    return order;
  }

  // ❌ Insecure Attempt: Trying to fulfill directly from client redirect parameters
  fulfillFromClientCallback(orderId, clientQueryStatus) {
    if (clientQueryStatus === 'success') {
      throw new Error('SECURITY VIOLATION: Refusing order fulfillment from unverified client callback. Must verify via server API or webhook.');
    }
  }

  // ✅ Secure Fulfillment: Requires verified transaction from server API or validated webhook
  fulfillVerifiedTransaction({ orderId, transactionReference, verifiedAmount, verifiedCurrency }) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 1. Idempotency Check: Prevent double-fulfillment
    if (this.processedTransactions.has(transactionReference)) {
      return { status: 'already_fulfilled', orderId, transactionReference };
    }

    // 2. Amount and Currency Integrity Check
    if (verifiedAmount !== order.expectedAmount || verifiedCurrency !== order.currency) {
      throw new Error(`Payment mismatch! Expected ${order.expectedAmount} ${order.currency}, received ${verifiedAmount} ${verifiedCurrency}`);
    }

    // 3. Update Order State
    order.status = 'paid';
    order.fulfilledAt = new Date().toISOString();
    order.transactionReference = transactionReference;

    this.processedTransactions.add(transactionReference);

    return { status: 'fulfilled', orderId, transactionReference };
  }
}

module.exports = { OrderService };

