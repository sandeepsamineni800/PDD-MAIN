const fs = require('fs');
const path = require('path');

const targetUrl = 'https://pdd-main-oyhb.onrender.com';
const results = [];

function logTest(id, name, type, status, details, error = null) {
  const result = { id, name, type, status, details, error: error ? error.message : null, timestamp: new Date().toISOString() };
  results.push(result);
  console.log(`[${status}] ${id}: ${name} - ${details}`);
  if (error) console.error(error);
}

// Override global fetch to enforce an 8-second request timeout
const originalFetch = globalThis.fetch || fetch;
globalThis.fetch = async function (resource, options = {}) {
  const timeout = options.timeout || 8000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await originalFetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

async function runTests() {
  console.log(`Starting Backend API Functionality Tests against ${targetUrl}...`);

  // Test Case 1: GET /api/auth/me (Unauthorized)
  try {
    const res = await fetch(`${targetUrl}/api/auth/me`);
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status === 401 || data.error) {
      logTest('TC-API-001', 'Auth Profile - Unauthorized Access', 'Security', 'PASSED', 'Successfully rejected request without auth cookies/token (Status 401).');
    } else {
      logTest('TC-API-001', 'Auth Profile - Unauthorized Access', 'Security', 'FAILED', `Expected 401 Unauthorized but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-001', 'Auth Profile - Unauthorized Access', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 2: POST /api/auth/login (Missing Password)
  try {
    const res = await fetch(`${targetUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status >= 400 && (data.error || res.ok === false)) {
      logTest('TC-API-002', 'Login - Missing Password Payload', 'Validation', 'PASSED', `Rejected login missing password successfully (Status ${status}: "${data.error || 'Bad Request'}").`);
    } else {
      logTest('TC-API-002', 'Login - Missing Password Payload', 'Validation', 'FAILED', `Expected error status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-002', 'Login - Missing Password Payload', 'Validation', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 3: POST /api/auth/login (Invalid Credentials)
  try {
    const res = await fetch(`${targetUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@example.com', password: 'wrongpassword123' })
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status === 401 || (status >= 400 && data.error)) {
      logTest('TC-API-003', 'Login - Invalid Credentials Rejection', 'Security', 'PASSED', `Correctly rejected invalid credentials (Status ${status}: "${data.error}").`);
    } else {
      logTest('TC-API-003', 'Login - Invalid Credentials Rejection', 'Security', 'FAILED', `Expected authentication failure status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-003', 'Login - Invalid Credentials Rejection', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 4: POST /api/auth/send-signup-otp (Missing Email)
  try {
    const res = await fetch(`${targetUrl}/api/auth/send-signup-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status >= 400 && (data.error || res.ok === false)) {
      logTest('TC-API-004', 'OTP Request - Missing Email Field', 'Validation', 'PASSED', `Rejected OTP request without email field successfully (Status ${status}).`);
    } else {
      logTest('TC-API-004', 'OTP Request - Missing Email Field', 'Validation', 'FAILED', `Expected error code but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-004', 'OTP Request - Missing Email Field', 'Validation', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 5: POST /api/auth/send-signup-otp (Invalid Email format)
  try {
    const res = await fetch(`${targetUrl}/api/auth/send-signup-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'invalid-email-format' })
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status >= 400 && (data.error || res.ok === false)) {
      logTest('TC-API-005', 'OTP Request - Invalid Email Format', 'Validation', 'PASSED', `Correctly validated email format check (Status ${status}: "${data.error}").`);
    } else {
      logTest('TC-API-005', 'OTP Request - Invalid Email Format', 'Validation', 'FAILED', `Expected validation failure status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-005', 'OTP Request - Invalid Email Format', 'Validation', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 6: POST /api/auth/verify-otp (Invalid OTP verification attempt)
  try {
    const res = await fetch(`${targetUrl}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', otp: '000000' })
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status >= 400 && (data.error || res.ok === false)) {
      logTest('TC-API-006', 'OTP Verify - Invalid OTP Code Rejection', 'Security', 'PASSED', `Verification failed successfully with incorrect code (Status ${status}: "${data.error}").`);
    } else {
      logTest('TC-API-006', 'OTP Verify - Invalid OTP Code Rejection', 'Security', 'FAILED', `Expected OTP mismatch error code but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-006', 'OTP Verify - Invalid OTP Code Rejection', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 7: POST /api/auth/register (Missing Signup payload keys)
  try {
    const res = await fetch(`${targetUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status >= 400 && (data.error || res.ok === false)) {
      logTest('TC-API-007', 'Register - Incomplete Payload Validation', 'Validation', 'PASSED', `Successfully blocked registration request missing name/password keys (Status ${status}).`);
    } else {
      logTest('TC-API-007', 'Register - Incomplete Payload Validation', 'Validation', 'FAILED', `Expected bad request error code but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-007', 'Register - Incomplete Payload Validation', 'Validation', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 8: GET /api/domains (Access control block check)
  try {
    const res = await fetch(`${targetUrl}/api/domains`);
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status === 401 || data.error) {
      logTest('TC-API-008', 'Domains List - Access Control', 'Security', 'PASSED', 'Successfully rejected unauthorized domain requests (Status 401).');
    } else {
      logTest('TC-API-008', 'Domains List - Access Control', 'Security', 'FAILED', `Expected unauthorized status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-008', 'Domains List - Access Control', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 9: GET /api/invitations (Access control block check)
  try {
    const res = await fetch(`${targetUrl}/api/invitations`);
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status === 401 || data.error) {
      logTest('TC-API-009', 'Invitations List - Access Control', 'Security', 'PASSED', 'Successfully rejected unauthorized invitations requests (Status 401).');
    } else {
      logTest('TC-API-009', 'Invitations List - Access Control', 'Security', 'FAILED', `Expected unauthorized status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-009', 'Invitations List - Access Control', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Test Case 10: GET /api/progress (Access control block check)
  try {
    const res = await fetch(`${targetUrl}/api/progress`);
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    if (status === 401 || data.error) {
      logTest('TC-API-010', 'Progress Calculation - Access Control', 'Security', 'PASSED', 'Successfully rejected unauthorized progress calculation requests (Status 401).');
    } else {
      logTest('TC-API-010', 'Progress Calculation - Access Control', 'Security', 'FAILED', `Expected unauthorized status but got Status ${status}`);
    }
  } catch (err) {
    logTest('TC-API-010', 'Progress Calculation - Access Control', 'Security', 'FAILED', 'Connection error occurred', err);
  }

  // Save report data
  const reportDir = path.join(__dirname, '..', 'tests');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir);
  }

  const jsonReportPath = path.join(reportDir, 'backend_report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(results, null, 2));
  console.log(`Saved raw JSON Backend report to ${jsonReportPath}`);

  // Generate HTML Report
  const htmlReportPath = path.join(reportDir, 'backend_report.html');
  const htmlContent = generateHTMLReport(results);
  fs.writeFileSync(htmlReportPath, htmlContent);
  console.log(`Saved visual HTML Backend report to ${htmlReportPath}`);
}

function generateHTMLReport(data) {
  const passed = data.filter(r => r.status === 'PASSED').length;
  const failed = data.filter(r => r.status === 'FAILED').length;
  const total = data.length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

  const rows = data.map(r => `
    <tr class="${r.status.toLowerCase()}">
      <td><strong>${r.id}</strong></td>
      <td>${r.name}</td>
      <td><span class="badge type-${r.type.toLowerCase()}">${r.type}</span></td>
      <td><span class="status-indicator status-${r.status.toLowerCase()}">${r.status}</span></td>
      <td>${r.details}</td>
      <td>${r.error ? `<pre class="error-log">${r.error}</pre>` : '-'}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backend API Test Report - PDD Scheduler</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090d16;
      --bg-card: #111827;
      --border-color: #1f2937;
      --text-main: #f9fafb;
      --text-muted: #9ca3af;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
    }
    
    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }

    header {
      background-color: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 24px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .container {
      max-width: 1400px;
      margin: 40px auto;
      padding: 0 24px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .summary-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .card-total::before { background-color: var(--primary); }
    .card-passed::before { background-color: var(--success); }
    .card-failed::before { background-color: var(--danger); }
    .card-rate::before { background-color: var(--warning); }

    .card-title {
      font-size: 14px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 36px;
      font-weight: 700;
    }

    .results-table-container {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background-color: rgba(17, 24, 39, 0.6);
      padding: 16px 24px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-color);
    }

    td {
      padding: 18px 24px;
      font-size: 14px;
      border-bottom: 1px solid var(--border-color);
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .type-validation { background-color: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .type-security { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
    }

    .status-passed {
      background-color: rgba(16, 185, 129, 0.15);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-failed {
      background-color: rgba(239, 68, 68, 0.15);
      color: var(--danger);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .error-log {
      margin: 0;
      padding: 8px 12px;
      background-color: #020617;
      color: var(--danger);
      border-radius: 6px;
      font-family: monospace;
      font-size: 12px;
      white-space: pre-wrap;
      max-width: 400px;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .footer {
      text-align: center;
      padding: 40px 0;
      color: var(--text-muted);
      font-size: 14px;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <h1>PDD Scheduler - Backend API Verification Report</h1>
      <div style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">Target Host: <a href="${targetUrl}" style="color: var(--primary); text-decoration: none;" target="_blank">${targetUrl}</a></div>
    </div>
    <div style="font-size: 14px; color: var(--text-muted);">Executed on: ${new Date().toLocaleString()}</div>
  </header>

  <div class="container">
    <div class="summary-grid">
      <div class="summary-card card-total">
        <div class="card-title">Total API Endpoints Checked</div>
        <div class="card-value">${total}</div>
      </div>
      <div class="summary-card card-passed">
        <div class="card-title">Passed Assertions</div>
        <div class="card-value" style="color: var(--success);">${passed}</div>
      </div>
      <div class="summary-card card-failed">
        <div class="card-title">Failed Assertions</div>
        <div class="card-value" style="color: ${failed > 0 ? 'var(--danger)' : 'var(--text-main)'};">${failed}</div>
      </div>
      <div class="summary-card card-rate">
        <div class="card-title">Compliance Rate</div>
        <div class="card-value" style="color: var(--warning);">${passRate}%</div>
      </div>
    </div>

    <div class="results-table-container">
      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
            <th>Error Context</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>

    <div class="footer">
      Generated automatically by Antigravity AI Code Companion. All API connections verified using Node Fetch.
    </div>
  </div>

</body>
</html>
  `;
}

runTests();
