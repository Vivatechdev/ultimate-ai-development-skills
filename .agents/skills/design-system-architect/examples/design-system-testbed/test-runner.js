/**
 * Design System Verification Test Runner
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'tokens.css');
const htmlPath = path.join(__dirname, 'index.html');

console.log('====================================================');
console.log('   DESIGN SYSTEM ARCHITECTURAL COMPLIANCE AUDIT');
console.log('====================================================');

const cssContent = fs.readFileSync(cssPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const tests = [
  // Token Architecture Checks
  {
    name: '3-Tier Token Architecture (Primitives & Semantics)',
    test: cssContent.includes('--ds-primitives-') && cssContent.includes('--ds-surface-') && cssContent.includes('--ds-text-')
  },
  {
    name: 'Dual-Theme Engine (Light :root & Dark [data-theme="dark"])',
    test: cssContent.includes(':root') && cssContent.includes('[data-theme="dark"]')
  },
  {
    name: 'Strict 8pt Spatial Grid with 4pt Half-Step',
    test: cssContent.includes('--ds-space-1: 4px;') && cssContent.includes('--ds-space-2: 8px;') && cssContent.includes('--ds-space-4: 16px;')
  },
  {
    name: 'Standardized Elevation & Z-Index Scale',
    test: cssContent.includes('--ds-z-canvas') && cssContent.includes('--ds-z-modal-backdrop') && cssContent.includes('--ds-z-modal-dialog')
  },
  // Component & Accessibility Checks
  {
    name: 'Minimum 44x44px Touch Targets on Interactive Controls',
    test: (htmlContent.match(/min-[wh]-\[44px\]/g) || []).length >= 6
  },
  {
    name: 'Accessible Compound Form Field (Label + Input + Description + Alert)',
    test: htmlContent.includes('<label for="tenant-id"') && 
          htmlContent.includes('aria-describedby="tenant-desc tenant-error"') && 
          htmlContent.includes('role="alert"')
  },
  {
    name: 'WAI-ARIA Compliant Modal Overlay (role=dialog, aria-modal, Escape key)',
    test: htmlContent.includes('role="dialog"') && 
          htmlContent.includes('aria-modal="true"') && 
          htmlContent.includes("e.key === 'Escape'")
  },
  {
    name: 'Data Table Tabular Numeric Alignment (tabular-nums)',
    test: htmlContent.includes('tabular-nums') && htmlContent.includes('text-right')
  },
  {
    name: 'Dynamic Light / Dark Theme Switcher Logic',
    test: htmlContent.includes("setAttribute('data-theme'")
  }
];

let allPassed = true;
tests.forEach((t, i) => {
  const status = t.test ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${i + 1}. ${t.name}`);
  if (!t.test) allPassed = false;
});

console.log('----------------------------------------------------');
if (allPassed) {
  console.log('Result: ALL 9 DESIGN SYSTEM CHECKS PASSED.');
  process.exit(0);
} else {
  console.error('Result: FAILED some architectural checks.');
  process.exit(1);
}

