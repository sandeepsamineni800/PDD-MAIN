const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, 'e2e_report.json');
const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY;

if (!stepSummaryFile) {
  console.log('Not running in a GitHub Actions environment (GITHUB_STEP_SUMMARY not set).');
  process.exit(0);
}

if (!fs.existsSync(reportPath)) {
  fs.appendFileSync(stepSummaryFile, '### ❌ Error: E2E Test report file not found.\n');
  process.exit(0);
}

try {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const total = report.length;
  const passed = report.filter(r => r.status === 'PASSED').length;
  const failed = report.filter(r => r.status === 'FAILED').length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  let md = `## 📊 E2E Selenium Test Results

| Metric | Value |
| :--- | :--- |
| **Total Tests** | ${total} |
| **Passed** | ${passed} ✅ |
| **Failed** | ${failed} ${failed > 0 ? '❌' : '✅'} |
| **Pass Rate** | ${rate}% |

### Detailed Test Breakdown

| Test ID | Name | Type | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
`;

  report.forEach(r => {
    const statusText = r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED';
    md += `| **${r.id}** | ${r.name} | ${r.type} | ${statusText} | ${r.details} |\n`;
  });

  md += `\n### 🚀 Deployment Status: ${failed === 0 ? 'READY' : 'ACTION REQUIRED'}\n`;

  fs.appendFileSync(stepSummaryFile, md);
  console.log('GitHub Actions Step Summary successfully generated.');
} catch (err) {
  fs.appendFileSync(stepSummaryFile, `### ❌ Error parsing E2E test report: ${err.message}\n`);
  console.error('Error generating summary:', err);
}
