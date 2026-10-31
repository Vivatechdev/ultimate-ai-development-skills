/**
 * Production-Hardened Shopping Cart & Checkout Engine
 * 
 * Remediations applied:
 * 1. Integer subunit arithmetic (cents) eliminating IEEE 754 floating point imprecision.
 * 2. Mutex / atomic lock on coupon redemption preventing race conditions under high concurrency.
 * 3. Injected deterministic Clock interface eliminating wall-clock flakiness.
 */

class SystemClock {
  now() {
    return new Date();
  }
}

class FixedShoppingCart {
  // Shared static mutex locks across all cart instances to protect shared stores
  static _globalRedemptionLocks = new Set();

  constructor(couponStore, clock = new SystemClock()) {
    this.items = [];
    this.couponStore = couponStore || new Map();
    this.appliedCoupon = null;
    this.clock = clock;
  }

  /**
   * Add item with price converted to integer cents
   * @param {string} name
   * @param {number|string} price - Price in dollars (e.g. 19.99)
   * @param {number} quantity
   */
  addItem(name, price, quantity = 1) {
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      throw new Error(`Quantity must be a positive integer.`);
    }
    // Normalize to integer cents
    const priceInCents = Math.round(Number(price) * 100);
    if (isNaN(priceInCents) || priceInCents < 0) {
      throw new Error(`Invalid price value.`);
    }
    this.items.push({ name, priceInCents, quantity });
  }

  /**
   * Subtotal in integer cents
   */
  calculateSubtotalCents() {
    return this.items.reduce((sum, item) => sum + (item.priceInCents * item.quantity), 0);
  }

  /**
   * Discount in integer cents
   */
  calculateDiscountCents() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.calculateSubtotalCents();
    // Integer division with standard banker's rounding
    return Math.round((subtotal * this.appliedCoupon.percentage) / 100);
  }

  /**
   * Tax in integer cents with configurable basis points (e.g., 825 basis points = 8.25%)
   */
  calculateTaxCents(taxBasisPoints = 825) {
    const taxableSubtotal = this.calculateSubtotalCents() - this.calculateDiscountCents();
    return Math.round((taxableSubtotal * taxBasisPoints) / 10000);
  }

  /**
   * Total in integer cents
   */
  calculateTotalCents(taxBasisPoints = 825) {
    return this.calculateSubtotalCents() - this.calculateDiscountCents() + this.calculateTaxCents(taxBasisPoints);
  }

  /**
   * Display formatted currency string ($XX.YY)
   */
  formatCentsToCurrency(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  isCouponExpired(coupon) {
    const currentTime = this.clock.now().getTime();
    return currentTime > coupon.expiresAt.getTime();
  }

  /**
   * Concurrency-safe coupon redemption using atomic in-flight mutex locking
   */
  async applyCoupon(code) {
    // Acquire lock on coupon code to serialize concurrent attempts
    while (FixedShoppingCart._globalRedemptionLocks.has(code)) {
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    FixedShoppingCart._globalRedemptionLocks.add(code);

    try {
      const coupon = this.couponStore.get(code);
      if (!coupon) {
        throw new Error(`Coupon '${code}' not found.`);
      }

      if (this.isCouponExpired(coupon)) {
        throw new Error(`Coupon '${code}' has expired.`);
      }

      if (coupon.isUsed) {
        throw new Error(`Coupon '${code}' has already been redeemed.`);
      }

      // Simulate async database write latency
      await new Promise(resolve => setTimeout(resolve, 10));

      // Mark redeemed
      coupon.isUsed = true;
      coupon.redeemedAt = this.clock.now().toISOString();
      this.appliedCoupon = coupon;

      return {
        success: true,
        discountPercentage: coupon.percentage,
        redeemedAt: coupon.redeemedAt
      };
    } finally {
      // Always release lock
      FixedShoppingCart._globalRedemptionLocks.delete(code);
    }
  }
}

module.exports = { FixedShoppingCart, SystemClock };
