/**
 * Comprehensive API & Payment Integration Verification Test
 */

const crypto = require('crypto');
const { PaystackAdapter, FlutterwaveAdapter, StripeAdapter } = require('./gateway-adapters');
const { ResilientClient } = require('./resilient-client');
const { OrderService } = require('./order-service');

async function runPaymentTests() {
  console.log('====================================================');
  console.log('   API & PAYMENT GATEWAY ARCHITECTURAL AUDIT');
  console.log('====================================================');

  const PAYSTACK_SECRET = 'sk_test_paystack_secret_key_884920';
  const STRIPE_WEBHOOK_SECRET = 'whsec_stripe_test_secret_381924';

  const paystack = new PaystackAdapter(PAYSTACK_SECRET);
  const stripe = new StripeAdapter('sk_test_stripe_secret', STRIPE_WEBHOOK_SECRET);
  const orderService = new OrderService();

  // 1. Cardinal Rule: Reject Client Callback Direct Fulfillment
  const order = orderService.createOrder({
    orderId: 'ord_101',
    customerId: 'cust_abc',
    expectedAmount: 500000, // 5000 NGN in Kobo
    currency: 'NGN'
  });

  let clientFulfillBlocked = false;
  try {
    orderService.fulfillFromClientCallback('ord_101', 'success');
  } catch (err) {
    if (err.message.includes('SECURITY VIOLATION')) {
      clientFulfillBlocked = true;
    }
  }
  if (!clientFulfillBlocked) throw new Error('Failed to block client-side payment fulfillment');
  console.log('[PASS] 1. Security: Blocked unverified frontend callback fulfillment attempt');

  // 2. Paystack Initialization & Subunit Math
  const paystackInit = paystack.createInitializationPayload({
    email: 'buyer@corp.com',
    amountNaira: 5000,
    reference: 'ref_paystack_001',
    callbackUrl: 'https://app.com/checkout/callback'
  });
  if (paystackInit.amount === 500000) {
    console.log('[PASS] 2. Paystack: Subunit conversion verified (₦5,000 -> 500,000 kobo)');
  } else {
    throw new Error('Paystack subunit calculation failed');
  }

  // 3. Cryptographic Paystack Webhook Validation (HMAC-SHA512)
  const paystackRawBody = JSON.stringify({
    event: 'charge.success',
    data: { reference: 'ref_paystack_001', amount: 500000, currency: 'NGN', status: 'success' }
  });
  const validPaystackSig = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(paystackRawBody)
    .digest('hex');

  const isPaystackValid = paystack.verifyWebhookSignature(paystackRawBody, validPaystackSig);
  if (isPaystackValid) {
    console.log('[PASS] 3. Paystack: Validated authentic HMAC-SHA512 webhook signature');
  } else {
    throw new Error('Paystack authentic signature failed verification');
  }

  // 4. Paystack Tampered Body Detection
  const tamperedBody = paystackRawBody.replace('500000', '100000'); // Attacker tries to alter amount
  const isTamperedValid = paystack.verifyWebhookSignature(tamperedBody, validPaystackSig);
  if (!isTamperedValid) {
    console.log('[PASS] 4. Paystack: Successfully detected and rejected tampered webhook payload');
  } else {
    throw new Error('Failed to reject tampered payload');
  }

  // 5. Stripe Webhook Verification (HMAC-SHA256 with Timestamp Replay Protection)
  const stripeRawBody = JSON.stringify({
    id: 'evt_stripe_99',
    type: 'payment_intent.succeeded',
    data: { object: { id: 'pi_123', amount: 5000, currency: 'usd', status: 'succeeded' } }
  });
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const stripeSignedPayload = `${currentTimestamp}.${stripeRawBody}`;
  const validStripeSig = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(stripeSignedPayload)
    .digest('hex');
  const stripeHeader = `t=${currentTimestamp},v1=${validStripeSig}`;

  const isStripeValid = stripe.verifyWebhookSignature(stripeRawBody, stripeHeader);
  if (isStripeValid) {
    console.log('[PASS] 5. Stripe: Validated authentic HMAC-SHA256 signature with timestamp');
  } else {
    throw new Error('Stripe authentic signature failed verification');
  }

  // 6. Stripe Replay Attack Mitigation (Expired Timestamp > 5 mins)
  const expiredTimestamp = currentTimestamp - 600; // 10 minutes ago
  const expiredSignedPayload = `${expiredTimestamp}.${stripeRawBody}`;
  const expiredStripeSig = crypto
    .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
    .update(expiredSignedPayload)
    .digest('hex');
  const expiredHeader = `t=${expiredTimestamp},v1=${expiredStripeSig}`;

  const isReplayValid = stripe.verifyWebhookSignature(stripeRawBody, expiredHeader);
  if (!isReplayValid) {
    console.log('[PASS] 6. Stripe: Replay attack mitigated (rejected expired timestamp)');
  } else {
    throw new Error('Failed to reject expired webhook timestamp');
  }

  // 7. Verified Order Fulfillment & Idempotency Deduplication
  const fulfillRes1 = orderService.fulfillVerifiedTransaction({
    orderId: 'ord_101',
    transactionReference: 'ref_paystack_001',
    verifiedAmount: 500000,
    verifiedCurrency: 'NGN'
  });
  if (fulfillRes1.status === 'fulfilled' && order.status === 'paid') {
    console.log('[PASS] 7. Order Service: Order successfully fulfilled via verified transaction');
  }

  // Duplicate webhook delivery test (Idempotency)
  const fulfillRes2 = orderService.fulfillVerifiedTransaction({
    orderId: 'ord_101',
    transactionReference: 'ref_paystack_001',
    verifiedAmount: 500000,
    verifiedCurrency: 'NGN'
  });
  if (fulfillRes2.status === 'already_fulfilled') {
    console.log('[PASS] 8. Idempotency: Duplicate transaction reference safely deduplicated');
  } else {
    throw new Error('Idempotency deduplication failed');
  }

  // 8. Resilient HTTP Client: Backoff & Jitter on Transient Failures
  const client = new ResilientClient({ maxRetries: 3, baseDelayMs: 10, maxDelayMs: 100 });
  let attempts = 0;
  const simulatedCall = async () => {
    attempts++;
    if (attempts < 3) {
      const err = new Error('Rate Limited');
      err.status = 429;
      throw err;
    }
    return { data: 'Payment API Response OK' };
  };

  const retryRes = await client.execute(simulatedCall);
  if (retryRes.data === 'Payment API Response OK' && attempts === 3) {
    console.log('[PASS] 9. Resilient Client: Transient 429 recovered via exponential backoff');
  } else {
    throw new Error('Retry logic failed');
  }

  console.log('----------------------------------------------------');
  console.log('Result: ALL 9 API & PAYMENT INTEGRATION CHECKS PASSED.');
}

runPaymentTests().catch(err => {
  console.error('[FAIL] Integration check failed:', err);
  process.exit(1);
});
