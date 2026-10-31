/**
 * Deterministic Bug Reproduction Harness
 * 
 * Demonstrates the exact failure modes in BuggyShoppingCart:
 * 1. Floating point calculation errors producing fractional cents and IEEE 754 drift.
 * 2. Concurrency race conditions permitting duplicate redemptions of a single-use coupon.
 * 3. Wall-clock flakiness at coupon expiration boundaries.
 */

const { BuggyShoppingCart } = require('./buggy-cart');

async function runReproduction() {
  console.log('=== RUNNING DETERMINISTIC BUG REPRODUCTION HARNESS ===\n');
  const findings = [];

  // -------------------------------------------------------------
  // REPRODUCTION 1: Floating-point precision error
  // -------------------------------------------------------------
  console.log('1. Testing Floating-Point Precision:');
  const cart = new BuggyShoppingCart();
  // Classic 0.10 + 0.20 addition in JS produces 0.30000000000000004
  cart.addItem('Item A', 0.10, 1);
  cart.addItem('Item B', 0.20, 1);
  const subtotal = cart.calculateSubtotal();
  const isFloatDrift = subtotal !== 0.30;

  console.log(`   - Input: $0.10 + $0.20`);
  console.log(`   - Raw Subtotal Output: ${subtotal}`);
  console.log(`   - Exact match with 0.30: ${!isFloatDrift}`);
  if (isFloatDrift) {
    findings.push({
      bug: 'Floating Point Imprecision',
      observed: `${subtotal} !== 0.30`,
      rootCause: 'IEEE 754 binary floating-point representation drift.'
    });
  }

  // -------------------------------------------------------------
  // REPRODUCTION 2: Race Condition in Concurrent Coupon Redemption
  // -------------------------------------------------------------
  console.log('\n2. Testing Asynchronous Race Condition on Single-Use Coupon:');
  const sharedCouponStore = new Map();
  sharedCouponStore.set('SAVE50', {
    code: 'SAVE50',
    percentage: 50,
    isUsed: false,
    expiresAt: new Date(Date.now() + 60000)
  });

  const buyer1Cart = new BuggyShoppingCart(sharedCouponStore);
  const buyer2Cart = new BuggyShoppingCart(sharedCouponStore);

  // Both buyers fire coupon application simultaneously
  const results = await Promise.allSettled([
    buyer1Cart.applyCoupon('SAVE50'),
    buyer2Cart.applyCoupon('SAVE50')
  ]);

  const bothSucceeded = results[0].status === 'fulfilled' && results[1].status === 'fulfilled';
  console.log(`   - Buyer 1 result: ${results[0].status}`);
  console.log(`   - Buyer 2 result: ${results[1].status}`);
  console.log(`   - Race Condition Triggered (Both redeemed single-use coupon): ${bothSucceeded}`);

  if (bothSucceeded) {
    findings.push({
      bug: 'Coupon Race Condition',
      observed: 'Two parallel checkouts successfully redeemed a single-use coupon.',
      rootCause: 'Check-then-act vulnerability without atomic locking during simulated I/O latency.'
    });
  }

  // -------------------------------------------------------------
  // REPRODUCTION 3: Clock Flakiness
  // -------------------------------------------------------------
  console.log('\n3. Testing Wall-Clock Boundary Flakiness:');
  const edgeCouponStore = new Map();
  // Coupon that expires in 5 milliseconds
  edgeCouponStore.set('FLASH_EXPIRING', {
    code: 'FLASH_EXPIRING',
    percentage: 20,
    isUsed: false,
    expiresAt: new Date(Date.now() + 5)
  });

  const cartClock = new BuggyShoppingCart(edgeCouponStore);
  // Sleep 15ms so the real clock ticks past expiration
  await new Promise(r => setTimeout(r, 15));

  let expiredThrown = false;
  try {
    await cartClock.applyCoupon('FLASH_EXPIRING');
  } catch (err) {
    expiredThrown = true;
    console.log(`   - Expected failure caught: "${err.message}"`);
  }

  findings.push({
    bug: 'Wall Clock Coupling',
    observed: 'Test timing depends on real-time sleep and CPU scheduler jitter rather than virtualized time.',
    rootCause: 'Hardcoded new Date() dependency prevents deterministic time travel testing.'
  });

  console.log('\n=== REPRODUCTION FINDINGS SUMMARY ===');
  console.table(findings);
  return findings;
}

if (require.main === module) {
  runReproduction().catch(console.error);
}

module.exports = { runReproduction };

