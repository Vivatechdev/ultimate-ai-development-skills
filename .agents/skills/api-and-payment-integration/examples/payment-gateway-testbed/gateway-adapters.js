/**
 * Multi-Provider Payment Gateway Adapters
 * Standardized implementations for Paystack, Flutterwave, and Stripe
 */

const crypto = require('crypto');

// ================= 1. PAYSTACK ADAPTER =================
class PaystackAdapter {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  // Format amount to kobo (smallest currency subunit)
  toKobo(amountNaira) {
    return Math.round(amountNaira * 100);
  }

  // Initialize Transaction Payload
  createInitializationPayload({ email, amountNaira, reference, callbackUrl }) {
    return {
      email,
      amount: this.toKobo(amountNaira), // Subunit requirement
      reference,
      callback_url: callbackUrl
    };
  }

  // Cryptographic Webhook Signature Verification (HMAC-SHA512)
  verifyWebhookSignature(rawBody, signatureHeader) {
    if (!signatureHeader || !rawBody) return false;

    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex');

    const expectedBuf = Buffer.from(hash, 'hex');
    const headerBuf = Buffer.from(signatureHeader, 'hex');

    if (expectedBuf.length !== headerBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, headerBuf);
  }
}

// ================= 2. FLUTTERWAVE ADAPTER =================
class FlutterwaveAdapter {
  constructor(secretKey, webhookSecretHash) {
    this.secretKey = secretKey;
    this.webhookSecretHash = webhookSecretHash;
  }

  // Flutterwave uses standard decimal amounts
  createInitializationPayload({ txRef, amount, currency = 'NGN', redirectUrl, customerEmail }) {
    return {
      tx_ref: txRef,
      amount: Number(amount).toFixed(2),
      currency,
      redirect_url: redirectUrl,
      customer: { email: customerEmail }
    };
  }

  // Webhook validation via secret hash header (verif-hash)
  verifyWebhookSecret(headerHash) {
    if (!headerHash || !this.webhookSecretHash) return false;
    return headerHash === this.webhookSecretHash;
  }
}

// ================= 3. STRIPE ADAPTER =================
class StripeAdapter {
  constructor(secretKey, webhookEndpointSecret) {
    this.secretKey = secretKey;
    this.webhookEndpointSecret = webhookEndpointSecret;
  }

  // Format amount to cents (smallest subunit)
  toCents(amountDollars) {
    return Math.round(amountDollars * 100);
  }

  createPaymentIntentPayload({ amountDollars, currency = 'usd', customerId }) {
    return {
      amount: this.toCents(amountDollars),
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: { enabled: true }
    };
  }

  // Cryptographic Webhook Verification (HMAC-SHA256 with Replay Timestamp Check)
  verifyWebhookSignature(rawBody, signatureHeader, maxToleranceSeconds = 300) {
    if (!signatureHeader || !rawBody) return false;

    // Header format: t=1614555555,v1=5257a869e7...
    const parts = {};
    signatureHeader.split(',').forEach(item => {
      const [k, v] = item.split('=');
      if (k && v) parts[k.trim()] = v.trim();
    });

    const timestamp = parts['t'];
    const signature = parts['v1'];

    if (!timestamp || !signature) return false;

    // Check for replay attacks (5 minute window)
    const currentTime = Math.floor(Date.now() / 1000);
    const eventTime = parseInt(timestamp, 10);
    if (Math.abs(currentTime - eventTime) > maxToleranceSeconds) {
      return false; // Replay attack or expired
    }

    // Compute expected HMAC-SHA256 signature over "timestamp.rawBody"
    const signedPayload = `${timestamp}.${rawBody}`;
    const hash = crypto
      .createHmac('sha256', this.webhookEndpointSecret)
      .update(signedPayload)
      .digest('hex');

    const expectedBuf = Buffer.from(hash, 'hex');
    const headerBuf = Buffer.from(signature, 'hex');

    if (expectedBuf.length !== headerBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, headerBuf);
  }
}

module.exports = { PaystackAdapter, FlutterwaveAdapter, StripeAdapter };
