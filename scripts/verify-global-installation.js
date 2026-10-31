/**
 * Global Installation & Discovery Verification Script
 * 
 * Verifies that all 10 skills in the Ultimate AI Development Skills Library
 * are properly installed and discoverable in the Antigravity global configuration:
 * ~/.gemini/config/skills/ (C:\Users\user\.gemini\config\skills)
 */

const fs = require('fs');
const path = require('path');

const GLOBAL_SKILLS_DIR = path.resolve(
  process.env.USERPROFILE || process.env.HOME,
  '.gemini/config/skills'
);

const LOCAL_SKILLS_DIR = path.resolve(__dirname, '../.agents/skills');

const EXPECTED_SKILLS = [
  'ui-ux-design-mastery',
  'visual-qa-and-ui-audit',
  'design-system-architect',
  'senior-fullstack-engineer',
  'application-security',
  'testing-and-debugging',
  'saas-product-architect',
  'devops-deployment',
  'api-and-payment-integration',
  'ai-assisted-engineering-discipline'
];

function verifyGlobalInstallation() {
  console.log('================================================================');
  console.log('      ANTIGRAVITY IDE: GLOBAL SKILL DISCOVERY VERIFICATION      ');
  console.log('================================================================\n');

  console.log(`Checking Global Target Path: ${GLOBAL_SKILLS_DIR}`);

  if (!fs.existsSync(GLOBAL_SKILLS_DIR)) {
    console.error(`❌ Global skills directory does not exist: ${GLOBAL_SKILLS_DIR}`);
    process.exit(1);
  }

  const globalEntries = fs.readdirSync(GLOBAL_SKILLS_DIR);
  console.log(`Discovered ${globalEntries.length} total entries in global directory.\n`);

  const results = [];
  let allHealthy = true;

  for (const skillName of EXPECTED_SKILLS) {
    const globalSkillPath = path.join(GLOBAL_SKILLS_DIR, skillName);
    const globalSkillFile = path.join(globalSkillPath, 'SKILL.md');
    const localSkillPath = path.join(LOCAL_SKILLS_DIR, skillName);
    const localSkillFile = path.join(localSkillPath, 'SKILL.md');

    const entry = {
      name: skillName,
      installed: false,
      hasSkillMd: false,
      matchesLocal: false,
      fileCount: 0
    };

    if (fs.existsSync(globalSkillPath)) {
      entry.installed = true;
      if (fs.existsSync(globalSkillFile)) {
        entry.hasSkillMd = true;
        const localContent = fs.readFileSync(localSkillFile);
        const globalContent = fs.readFileSync(globalSkillFile);
        entry.matchesLocal = localContent.equals(globalContent);

        // Count files
        const countFiles = (dir) => {
          let count = 0;
          fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            if (fs.statSync(p).isDirectory()) count += countFiles(p);
            else count++;
          });
          return count;
        };
        entry.fileCount = countFiles(globalSkillPath);
      }
    }

    if (!entry.installed || !entry.hasSkillMd || !entry.matchesLocal) {
      allHealthy = false;
    }

    results.push(entry);
  }

  console.table(results.map(r => ({
    'Skill Name': r.name,
    'Installed Globally': r.installed ? 'YES ✅' : 'NO ❌',
    'SKILL.md Present': r.hasSkillMd ? 'YES ✅' : 'NO ❌',
    'Matches Workspace': r.matchesLocal ? 'YES (100% Match) ✅' : 'DIFFERS / OUTDATED ❌',
    'Global File Count': r.fileCount
  })));

  // Check for external conflicts
  const externalSkills = globalEntries.filter(e => !EXPECTED_SKILLS.includes(e));
  console.log(`\nPreserved Non-Library Global Customizations: ${externalSkills.length}`);
  externalSkills.forEach(ext => console.log(`  - ${ext} (Safe & Untouched)`));

  if (allHealthy) {
    console.log('\n🎉 ALL 10 LIBRARY SKILLS ARE GLOBALLY ACTIVE & VERIFIED IN ANTIGRAVITY IDE!\n');
    process.exit(0);
  } else {
    console.error('\n❌ Discrepancies detected in global installation.');
    process.exit(1);
  }
}

verifyGlobalInstallation();
