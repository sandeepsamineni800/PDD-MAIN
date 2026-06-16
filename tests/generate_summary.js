const fs = require('fs');
const path = require('path');

const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY;

if (!stepSummaryFile) {
  console.log('Not running in a GitHub Actions environment (GITHUB_STEP_SUMMARY not set).');
  process.exit(0);
}

function parseReport(fileName) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error parsing ${fileName}:`, err);
    return [];
  }
}

const webReport = parseReport('e2e_report.json');
const apiReport = parseReport('backend_report.json');
const mobReport = parseReport('mobile_e2e_report.json');

let md = `# 📊 PDD Scheduler Quality Assurance Dashboard

Unified testing metrics across web, backend, and mobile applications.

---

## 1. Testing Summary Dashboard

| Test Suite | Total Tests | Passed | Failed | Pass Rate | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
`;

let overallFailed = false;

// Web Suite Metrics
if (webReport) {
  const total = webReport.length;
  const passed = webReport.filter(r => r.status === 'PASSED').length;
  const failed = webReport.filter(r => r.status === 'FAILED').length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  if (failed > 0) overallFailed = true;
  md += `| **Web App E2E Tests** | ${total} | ${passed} ✅ | ${failed} ${failed > 0 ? '❌' : '✅'} | ${rate}% | ${failed === 0 ? 'PASSED ✅' : 'FAILED ❌'} |\n`;
} else {
  md += `| **Web App E2E Tests** | - | - | - | - | SKIPPED/MISSING |\n`;
}

// Backend API Metrics
if (apiReport) {
  const total = apiReport.length;
  const passed = apiReport.filter(r => r.status === 'PASSED').length;
  const failed = apiReport.filter(r => r.status === 'FAILED').length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  if (failed > 0) overallFailed = true;
  md += `| **Backend API Tests** | ${total} | ${passed} ✅ | ${failed} ${failed > 0 ? '❌' : '✅'} | ${rate}% | ${failed === 0 ? 'PASSED ✅' : 'FAILED ❌'} |\n`;
} else {
  md += `| **Backend API Tests** | - | - | - | - | SKIPPED/MISSING |\n`;
}

// Mobile Emulation Metrics
if (mobReport) {
  const total = mobReport.length;
  const passed = mobReport.filter(r => r.status === 'PASSED').length;
  const failed = mobReport.filter(r => r.status === 'FAILED').length;
  const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  if (failed > 0) overallFailed = true;
  md += `| **Mobile WebView E2E** | ${total} | ${passed} ✅ | ${failed} ${failed > 0 ? '❌' : '✅'} | ${rate}% | ${failed === 0 ? 'PASSED ✅' : 'FAILED ❌'} |\n`;
} else {
  md += `| **Mobile WebView E2E** | - | - | - | - | SKIPPED/MISSING |\n`;
}

md += `
### 🚀 Final Deployment Status: ${overallFailed ? '⚠️ ACTION REQUIRED (Failures Detected)' : 'READY FOR PRODUCTION ✅'}

---

## 2. Web App E2E Test Breakdown
`;

if (webReport && webReport.length > 0) {
  md += `
| Test ID | Name | Type | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
`;
  webReport.forEach(r => {
    md += `| **${r.id}** | ${r.name} | ${r.type} | ${r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |\n`;
  });
} else {
  md += `*No web E2E results recorded.*\n`;
}

md += `
---

## 3. Backend API Test Breakdown
`;

if (apiReport && apiReport.length > 0) {
  md += `
| Test ID | Name | Type | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
`;
  apiReport.forEach(r => {
    md += `| **${r.id}** | ${r.name} | ${r.type} | ${r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |\n`;
  });
} else {
  md += `*No backend API results recorded.*\n`;
}

md += `
---

## 4. Mobile WebView E2E Test Breakdown
`;

if (mobReport && mobReport.length > 0) {
  md += `
| Test ID | Name | Type | Status | Details |
| :--- | :--- | :--- | :--- | :--- |
`;
  mobReport.forEach(r => {
    md += `| **${r.id}** | ${r.name} | ${r.type} | ${r.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${r.details} |\n`;
  });
} else {
  md += `*No mobile WebView E2E results recorded.*\n`;
}

try {
  fs.writeFileSync(stepSummaryFile, md);
  console.log('GitHub Actions Step Summary successfully unified.');
} catch (err) {
  console.error('Error writing unified step summary:', err);
}
