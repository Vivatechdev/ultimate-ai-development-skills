/**
 * Buggy Shopping Cart & Checkout Engine
 * 
 * Intentionally contains 3 classic production bugs:
 * 1. Floating-point imprecision in tax & discount calculations (e.g., $0.1 + $0.2 rounding artifacts).
 * 2. Asynchronous race condition on single-use promo code redemption.
 * 3. Wall-clock dependency causing non-deterministic coupon expiration failures.
 */

class BuggyShoppingCart {
  constructor(couponStore) {
    this.items = [];
    this.couponStore = couponStore || new Map();
    this.appliedCoupon = null;
  }

  addItem(name, price, quantity = 1) {
    // BUG 1: Storing prices as floating-point numbers ($19.99)
    this.items.push({ name, price: Number(price), quantity: Number(quantity) });
  }

  calculateSubtotal() {
    // BUG 1: Naive floating point addition
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0.0);
  }

  calculateTax(taxRate = 0.0825) { // 8.25% sales tax
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount();
    // BUG 1: Floating point multiplication without integer cents rounding
    return (subtotal - discount) * taxRate;
  }

  calculateDiscount() {
    if (!this.appliedCoupon) return 0.0;
    const subtotal = this.calculateSubtotal();
    return (subtotal * this.appliedCoupon.percentage) / 100.0;
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount();
    const tax = this.calculateTax();
    return subtotal - discount + tax;
  }

  // BUG 3: Direct wall-clock dependency (Date.now()) makes testing at boundaries flaky
  isCouponExpired(coupon) {
    const now = new Date();
    return now.getTime() > coupon.expiresAt.getTime();
  }

  // BUG 2: Async race condition. Non-atomic check-and-set with simulated I/O latency
  async applyCoupon(code) {
    const coupon = this.couponStore.get(code);
    if (!coupon) {
      throw new Error(`Coupon '${code}' not found.`);
    }

    if (this.isCouponExpired(coupon)) {
      throw new Error(`Coupon '${code}' has expired.`);
    }

    // Vulnerable window: read state, simulate DB latency (5ms), then update state
    if (coupon.isUsed) {
      throw new Error(`Coupon '${code}' has already been redeemed.`);
    }

    // Simulating async network/database delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // Mark as used after delay - concurrent requests slip through!
    coupon.isUsed = true;
    this.appliedCoupon = coupon;

    return { success: true, discountPercentage: coupon.percentage };
  }
}

module.exports = { BuggyShoppingCart };
