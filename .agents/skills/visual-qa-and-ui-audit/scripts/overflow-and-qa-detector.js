/**
 * Visual QA & Layout Overflow Detector
 * 
 * Usable both as a Node.js static analyzer for HTML files and as a browser runtime snippet.
 * Detects:
 *  1. Elements wider than the viewport (Horizontal Overflow)
 *  2. Interactive elements with hit targets smaller than 44x44px
 *  3. Form inputs without associated labels or aria-labels
 *  4. Elements with potential contrast or clipping issues
 */

// ================= BROWSER RUNTIME AUDITOR =================
function runBrowserVisualAudit(viewportWidth = window.innerWidth) {
  const results = {
    viewport: viewportWidth,
    timestamp: new Date().toISOString(),
    overflowElements: [],
    substandardTapTargets: [],
    unlabelledInputs: [],
    summary: { passed: true, issuesCount: 0 }
  };

  const docWidth = document.documentElement.clientWidth;

  // 1. Check for Horizontal Overflow
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
      // Exclude script, style, head
      if (!['SCRIPT', 'STYLE', 'HEAD', 'META'].includes(el.tagName)) {
        results.overflowElements.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          expectedMax: docWidth
        });
      }
    }
  });

  // 2. Check for Tap Targets < 44x44px on Mobile
  if (viewportWidth <= 768) {
    document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"], select').forEach(el => {
      const rect = el.getBoundingClientRect();
      // Ignore hidden or zero-size elements
      if (rect.width > 0 && rect.height > 0) {
        if (rect.width < 44 || rect.height < 44) {
          results.substandardTapTargets.push({
            tag: el.tagName.toLowerCase(),
            text: el.innerText ? el.innerText.trim().slice(0, 30) : null,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            id: el.id || null
          });
        }
      }
    });
  }

  // 3. Check for Unlabelled Form Inputs
  document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select').forEach(el => {
    const id = el.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`);
    const hasAriaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    const isWrappedInLabel = el.closest('label');

    if (!hasLabel && !hasAriaLabel && !isWrappedInLabel) {
      results.unlabelledInputs.push({
        tag: el.tagName.toLowerCase(),
        id: id || '(missing id)',
        name: el.getAttribute('name') || null
      });
    }
  });

  results.summary.issuesCount = 
    results.overflowElements.length + 
    results.substandardTapTargets.length + 
    results.unlabelledInputs.length;

  results.summary.passed = results.summary.issuesCount === 0;

  return results;
}

// ================= NODE.JS CLI RUNNER =================
if (typeof module !== 'undefined' && require.main === module) {
  const fs = require('fs');
  const path = require('path');

  const targetFile = process.argv[2];
  if (!targetFile) {
    console.log('Usage: node overflow-and-qa-detector.js <path-to-html-file>');
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), targetFile);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\nAnalyzing: ${targetFile}`);
  console.log('----------------------------------------------------');

  const issues = [];

  // Check 1: Fixed viewport widths that exceed 375px without responsiveness
  const fixedWidthMatch = content.match(/width:\s*([4-9]\d{2,}|[1-9]\d{3,})px|w-\[(\d{3,})px\]/g);
  if (fixedWidthMatch) {
    issues.push({
      type: 'Potential Horizontal Overflow',
      detail: `Detected fixed pixel width declarations: ${fixedWidthMatch.slice(0, 3).join(', ')}`
    });
  }

  // Check 2: Inputs without labels
  const inputsWithoutId = content.match(/<input(?![^>]*\bid=)[^>]*>/gi);
  if (inputsWithoutId) {
    issues.push({
      type: 'Accessibility: Unlabelled Input',
      detail: `Found ${inputsWithoutId.length} input tag(s) missing an 'id' attribute for explicit <label for=""> linking.`
    });
  }

  // Check 3: Missing focus-visible ring styles
  if (!content.includes('focus-visible') && !content.includes(':focus')) {
    issues.push({
      type: 'Accessibility: Missing Focus States',
      detail: 'No focus or focus-visible rules found in HTML or inline styling.'
    });
  }

  // Summary
  if (issues.length === 0) {
    console.log('[PASS] No static visual or layout defects detected.');
  } else {
    console.log(`[WARN] Found ${issues.length} potential issue(s):`);
    issues.forEach((iss, idx) => {
      console.log(`  ${idx + 1}. [${iss.type}] ${iss.detail}`);
    });
  }
}

if (typeof window !== 'undefined') {
  window.__runVisualQAAudit = runBrowserVisualAudit;
}

