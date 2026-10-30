const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const checks = [
  { name: 'HTML5 DOCTYPE and Lang', test: html.includes('<!DOCTYPE html>') && html.includes('lang="en"') },
  { name: 'Viewport Meta Tag', test: html.includes('name="viewport"') },
  { name: 'Title and Meta Description', test: html.includes('<title>') && html.includes('name="description"') },
  { name: 'Semantic Landmarks (header, nav, main, section, footer)', test: ['<header', '<nav', '<main', '<section', '<footer'].every(tag => html.includes(tag)) },
  { name: 'Zero Floating Blobs / Gradients in Background', test: !html.includes('bg-gradient-to-r from-purple') && !html.includes('blur-3xl rounded-full') },
  { name: 'Zero Generic Emojis in Bullet Points', test: !/\p{Extended_Pictographic}/u.test(html) },
  { name: 'Focus Visible Management', test: html.includes(':focus-visible') },
  { name: 'Tabular Numbers for Numerical Data', test: html.includes('tabular-nums') },
  { name: 'Interactive States (hover, active, disabled, loading)', test: ['hover:', 'active:', 'disabled:', 'btn-spinner'].every(s => html.includes(s)) },
  { name: 'Accessible Form Controls (labels, required)', test: html.includes('<label for=') && html.includes('required') },
  { name: 'Negative Tracking on Headings', test: html.includes('tracking-display') || html.includes('tracking-tight') },
  { name: '60-30-10 Color System Tokens', test: html.includes('canvas') && html.includes('surface') && html.includes('accent') }
];

console.log('=== UI/UX MASTERY CODEBASE AUDIT ===');
let allPassed = true;
checks.forEach(c => {
  const status = c.test ? '[PASS]' : '[FAIL]';
  console.log(`${status} ${c.name}`);
  if (!c.test) allPassed = false;
});

if (allPassed) {
  console.log('\nResult: ALL 12 AUDIT CRITERIA PASSED.');
  process.exit(0);
} else {
  console.error('\nResult: FAILED some criteria.');
  process.exit(1);
}
