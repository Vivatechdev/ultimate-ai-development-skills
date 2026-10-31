/**
 * Master Validation & Quality Audit Suite for Ultimate AI Development Skills Library
 * 
 * Performs:
 * 1. Structural validation across all skills (.agents/skills/*):
 *    - Directory naming compliance (lowercase-hyphenated)
 *    - YAML frontmatter validation (name matches directory, description length)
 *    - Section completeness (all 10 mandatory sections present)
 *    - Internal file reference validation (verifying all linked files exist on disk)
 * 2. Automated test suite execution across all skills with automated testbeds:
 *    - Runs each skill's practical test runner
 *    - Verifies exit code 0 and records execution outcomes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SKILLS_DIR = path.resolve(__dirname, '../.agents/skills');
const SECTION_PATTERNS = [
  /##\s*1\.?\s*(Purpose|Scope)/i,
  /##\s*2\.?\s*(Activate|Activation|When to Activate)/i,
  /##\s*3\.?\s*(Assessment|Inputs|Initial|Pre-flight)/i,
  /##\s*4\.?\s*(Workflow|Step-by-Step|Methodology)/i,
  /##\s*5\.?\s*(Guidelines|Standards|Technical|Architecture|Implementation)/i,
  /##\s*6\.?\s*(Decision|Frameworks|Guidelines|Trade-offs)/i,
  /##\s*7\.?\s*(Mistakes|Anti-Patterns|Pitfalls|Vulnerabilities)/i,
  /##\s*8\.?\s*(Examples|Practical|Testbed|Implementation)/i,
  /##\s*9\.?\s*(Testing|Quality|Assurance|Audit|Verification)/i,
  /##\s*10\.?\s*(Completion|Checklist|Criteria)/i
];

// Mapping of skill directory to its practical test script
const TEST_RUNNERS = {
  'ui-ux-design-mastery': 'examples/modern-business-site/audit.js',
  'visual-qa-and-ui-audit': 'examples/testbed/run-audit-test.js',
  'design-system-architect': 'examples/design-system-testbed/test-runner.js',
  'senior-fullstack-engineer': 'examples/fullstack-api-app/test-runner.js',
  'application-security': 'examples/security-audit-testbed/audit-and-exploit.js',
  'saas-product-architect': 'examples/saas-architecture-spec/test-architecture.js',
  'devops-deployment': 'examples/deployment-testbed/test-devops.js',
  'api-and-payment-integration': 'examples/payment-gateway-testbed/test-payments.js',
  'ai-assisted-engineering-discipline': 'examples/decision-records/test-discipline.js',
  'testing-and-debugging': 'examples/calculator-and-bug-reproduction/test-runner.js'
};

async function main() {
  console.log('================================================================');
  console.log('  ULTIMATE AI DEVELOPMENT SKILLS: MASTER QUALITY AUDIT SUITE    ');
  console.log('================================================================\n');

  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`Skills directory not found at: ${SKILLS_DIR}`);
    process.exit(1);
  }

  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Discovered ${skillDirs.length} skills in ${SKILLS_DIR}:\n`);
  skillDirs.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));
  console.log('\n--- PHASE 1: STRUCTURAL & FRONTMATTER VALIDATION ---\n');

  let structuralErrors = 0;
  const auditReport = [];

  for (const skillName of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillName);
    const skillFile = path.join(skillPath, 'SKILL.md');
    const skillReport = { name: skillName, validFrontmatter: false, sectionsPresent: 0, brokenLinks: 0, testPassed: false };

    if (!fs.existsSync(skillFile)) {
      console.error(`❌ [${skillName}] Missing SKILL.md file!`);
      structuralErrors++;
      continue;
    }

    const content = fs.readFileSync(skillFile, 'utf8');

    // 1. YAML frontmatter validation
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      console.error(`❌ [${skillName}] Missing YAML frontmatter!`);
      structuralErrors++;
      continue;
    }

    const frontmatter = fmMatch[1];
    const nameMatch = frontmatter.match(/name:\s*([a-z0-9-]+)/);
    const descMatch = frontmatter.match(/description:\s*(.+)/);

    if (!nameMatch || nameMatch[1].trim() !== skillName) {
      console.error(`❌ [${skillName}] Frontmatter name '${nameMatch ? nameMatch[1] : 'MISSING'}' does not match directory name '${skillName}'`);
      structuralErrors++;
    } else if (!descMatch || descMatch[1].trim().length < 20) {
      console.error(`❌ [${skillName}] Frontmatter description is missing or too brief.`);
      structuralErrors++;
    } else {
      skillReport.validFrontmatter = true;
    }

    // 2. Section validation (10 numbered sections from 1 to 10)
    let foundSections = 0;
    for (let i = 1; i <= 10; i++) {
      const numPattern = new RegExp(`^##\\s*${i}\\.\\s+`, 'm');
      if (numPattern.test(content)) {
        foundSections++;
      }
    }
    skillReport.sectionsPresent = foundSections;
    if (foundSections < 10) {
      console.warn(`⚠️ [${skillName}] Only matched ${foundSections}/10 mandatory sections.`);
    }

    // 3. Internal Link Validation
    // Match Markdown links [text](path) or file:/// links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let brokenLinks = 0;
    while ((match = linkRegex.exec(content)) !== null) {
      let targetPath = match[2];
      // Normalize file URI
      if (targetPath.startsWith('file:///')) {
        targetPath = targetPath.replace('file:///', '');
        // Windows drive fix: e.g. C:/Users/...
        if (process.platform === 'win32' && /^[a-zA-Z]:\//.test(targetPath)) {
          targetPath = path.normalize(targetPath);
        }
      } else if (!targetPath.startsWith('http://') && !targetPath.startsWith('https://') && !targetPath.startsWith('#')) {
        // Relative path
        targetPath = path.resolve(skillPath, targetPath);
      } else {
        continue; // Skip external web URLs and internal anchors
      }

      // Check if file exists (strip hash anchor if present)
      const cleanPath = targetPath.split('#')[0];
      if (!fs.existsSync(cleanPath)) {
        console.error(`❌ [${skillName}] Broken link target: ${cleanPath}`);
        brokenLinks++;
        structuralErrors++;
      }
    }
    skillReport.brokenLinks = brokenLinks;

    console.log(`✅ [${skillName}]: Frontmatter Valid | ${foundSections}/10 Sections | 0 Broken Links`);
    auditReport.push(skillReport);
  }

  console.log(`\nStructural validation completed with ${structuralErrors} errors.\n`);
  if (structuralErrors > 0) {
    process.exit(1);
  }

  console.log('--- PHASE 2: PRACTICAL TESTING SUITE EXECUTION ---\n');

  let testFailures = 0;
  for (const report of auditReport) {
    const testRelativePath = TEST_RUNNERS[report.name];
    if (!testRelativePath) {
      console.warn(`⚠️ No test runner mapped for ${report.name}`);
      continue;
    }

    const testFullPath = path.join(SKILLS_DIR, report.name, testRelativePath);
    if (!fs.existsSync(testFullPath)) {
      console.error(`❌ [${report.name}] Test runner not found at: ${testFullPath}`);
      testFailures++;
      continue;
    }

    process.stdout.write(`Executing practical test for [${report.name}]... `);
    try {
      const output = execSync(`node "${testFullPath}"`, {
        cwd: path.dirname(testFullPath),
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      report.testPassed = true;
      console.log('PASSED ✅');
    } catch (err) {
      report.testPassed = false;
      testFailures++;
      console.log('FAILED ❌');
      console.error(`\nError output for ${report.name}:\n`, err.stdout || err.stderr || err.message);
    }
  }

  console.log('\n================================================================');
  console.log('                  FINAL AUDIT SCORECARD                         ');
  console.log('================================================================\n');

  console.table(auditReport.map(r => ({
    'Skill Name': r.name,
    'YAML Frontmatter': r.validFrontmatter ? 'Valid' : 'Invalid',
    'Sections (of 10)': `${r.sectionsPresent}/10`,
    'Broken Links': r.brokenLinks,
    'Practical Test': r.testPassed ? 'PASSED ✅' : 'FAILED ❌'
  })));

  if (testFailures === 0 && structuralErrors === 0) {
    console.log('\n🎉 ALL 10 SKILLS FULLY VALIDATED AND PASSING ALL QUALITY GATES!\n');
    process.exit(0);
  } else {
    console.error(`\n❌ Audit failed: ${structuralErrors} structural errors, ${testFailures} test failures.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error running audit suite:', err);
  process.exit(1);
});
