import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new"
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Logging in to capture Dashboard...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  
  // Fill login
  await page.type('#email', 'admin@example.com');
  await page.type('#password', 'password123'); // Assuming these exist, if not it might fail
  await page.click('button[type="submit"]');

  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  // Wait extra 3s for splash to disappear
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/0d59ea37-e4ce-4572-bea9-2fd218a7bba8/actual_dashboard.png' });
  
  console.log("Dashboard captured!");
  await browser.close();
})();
