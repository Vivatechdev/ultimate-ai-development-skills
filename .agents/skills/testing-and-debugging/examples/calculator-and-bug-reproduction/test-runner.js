/**
 * Regression Test Suite for Testing & Debugging Demonstration
 * 
 * Verifies that FixedShoppingCart completely remediates all defects:
 * 1. Integer subunit precision (exact cents, no floating-point rounding errors).
 * 2. High-concurrency safety (mutex locks prevent race conditions on coupon redemption).
 * 3. Deterministic virtual time travel via MockClock (eliminates test flakiness).
 * 4. Rigorous boundary and error handling.
 */

const { FixedShoppingCart } = require('./fixed-cart');

class MockClock {
  constructor(initialIsoString = '2026-10-31T12:00:00.000Z') {
    this.currentTime = new Date(initialIsoString).getTime();
  }

  now() {
    return new Date(this.currentTime);
  }

  advanceSeconds(seconds) {
    this.currentTime += seconds * 1000;
  }

  advanceMinutes(minutes) {
    this.advanceSeconds(minutes * 60);
  }
}

async function runTestSuite() {
  console.log('=== STARTING RIGOROUS REGRESSION TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failed++;
      throw new Error(`Assertion failed: ${message}`);
    } else {
      console.log(`✅ PASS: ${message}`);
      passed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // TEST 1: Floating Point Remediation via Integer Cents
    // -------------------------------------------------------------
    console.log('Test 1: Currency Arithmetic & Precision');
    const cart = new FixedShoppingCart();
    cart.addItem('Product 1', 0.10, 1);
    cart.addItem('Product 2', 0.20, 1);
    
    assert(cart.calculateSubtotalCents() === 30, 'Subtotal for $0.10 + $0.20 is exactly 30 cents');
    assert(cart.formatCentsToCurrency(cart.calculateSubtotalCents()) === '$0.30', 'Formatted currency is $0.30');

    // Complex items with multi-quantity
    const invoiceCart = new FixedShoppingCart();
    invoiceCart.addItem('Pro Plan', 49.99, 1);
    invoiceCart.addItem('Addon User', 9.50, 3); // 3 * 9.50 = 28.50
    // Total subtotal: 49.99 + 28.50 = 78.49 (7849 cents)
    assert(invoiceCart.calculateSubtotalCents() === 7849, 'Subtotal for $49.99 + 3 * $9.50 is 7849 cents ($78.49)');
    
    // Tax at 8.25% (825 basis points): 7849 * 0.0825 = 647.5425 -> rounded to 648 cents ($6.48)
    assert(invoiceCart.calculateTaxCents(825) === 648, 'Tax at 8.25% is exactly 648 cents ($6.48)');
    assert(invoiceCart.calculateTotalCents(825) === 8497, 'Total with tax is 8497 cents ($84.97)');
    assert(invoiceCart.formatCentsToCurrency(invoiceCart.calculateTotalCents(825)) === '$84.97', 'Formatted total matches $84.97');

    // -------------------------------------------------------------
    // TEST 2: Deterministic Virtual Time Travel (No Sleep / Zero Flakiness)
    // -------------------------------------------------------------
    console.log('\nTest 2: Clock Virtualization & Expiration Boundaries');
    const mockClock = new MockClock('2026-10-31T10:00:00.000Z');
    const timeStore = new Map();
    
    timeStore.set('FLASH_ONE_HOUR', {
      code: 'FLASH_ONE_HOUR',
      percentage: 20,
      isUsed: false,
      expiresAt: new Date('2026-10-31T11:00:00.000Z') // Expires in 1 hour
    });

    const timeCart = new FixedShoppingCart(timeStore, mockClock);
    
    // Check at 10:30 (should be valid)
    mockClock.advanceMinutes(30);
    assert(!timeCart.isCouponExpired(timeStore.get('FLASH_ONE_HOUR')), 'Coupon valid at 30 minutes in');

    // Check at 11:01 (should be expired)
    mockClock.advanceMinutes(31);
    assert(timeCart.isCouponExpired(timeStore.get('FLASH_ONE_HOUR')), 'Coupon expired at 61 minutes in');

    let expiredErrorThrown = false;
    try {
      await timeCart.applyCoupon('FLASH_ONE_HOUR');
    } catch (err) {
      expiredErrorThrown = err.message.includes('expired');
    }
    assert(expiredErrorThrown, 'Attempting to apply expired coupon throws descriptive expiration error');

    // -------------------------------------------------------------
    // TEST 3: High-Concurrency Stress Test (10 Parallel Checkout Requests)
    // -------------------------------------------------------------
    console.log('\nTest 3: High-Concurrency Race Condition Prevention');
    const concurrentStore = new Map();
    concurrentStore.set('EXCLUSIVE_SINGLE_USE', {
      code: 'EXCLUSIVE_SINGLE_USE',
      percentage: 25,
      isUsed: false,
      expiresAt: new Date('2026-12-31T23:59:59.000Z')
    });

    // 10 distinct buyers attempting to apply the exact same coupon concurrently
    const buyers = Array.from({ length: 10 }, () => new FixedShoppingCart(concurrentStore));

    const settlement = await Promise.allSettled(
      buyers.map(b => b.applyCoupon('EXCLUSIVE_SINGLE_USE'))
    );

    const fulfilled = settlement.filter(r => r.status === 'fulfilled');
    const rejected = settlement.filter(r => r.status === 'rejected');

    assert(fulfilled.length === 1, `Exactly 1 concurrent request succeeded (Got: ${fulfilled.length})`);
    assert(rejected.length === 9, `Exactly 9 concurrent requests were safely rejected (Got: ${rejected.length})`);
    
    const couponState = concurrentStore.get('EXCLUSIVE_SINGLE_USE');
    assert(couponState.isUsed === true, 'Coupon is marked as used in store');
    assert(couponState.redeemedAt !== undefined, 'Coupon records accurate redemption timestamp');

    // -------------------------------------------------------------
    // TEST 4: Input Validation & Boundary Defense
    // -------------------------------------------------------------
    console.log('\nTest 4: Input Validation & Boundary Enforcement');
    const safeCart = new FixedShoppingCart();

    let invalidQtyError = false;
    try {
      safeCart.addItem('Bad Qty', 10.0, 1.5); // non-integer quantity
    } catch (err) {
      invalidQtyError = true;
    }
    assert(invalidQtyError, 'Rejects non-integer quantity');

    let negativePriceError = false;
    try {
      safeCart.addItem('Negative Price', -5.0, 1);
    } catch (err) {
      negativePriceError = true;
    }
    assert(negativePriceError, 'Rejects negative prices');

    let missingCouponError = false;
    try {
      await safeCart.applyCoupon('NON_EXISTENT');
    } catch (err) {
      missingCouponError = err.message.includes('not found');
    }
    assert(missingCouponError, 'Throws explicit error on non-existent coupon code');

    console.log('\n======================================================');
    console.log(`ALL TESTS PASSED: ${passed} passed, 0 failed.`);
    console.log('======================================================\n');
    return { passed, failed: 0 };
  } catch (error) {
    console.error('\nTest runner terminated due to unexpected error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runTestSuite();
}

module.exports = { runTestSuite };
