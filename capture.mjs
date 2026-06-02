import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: "new"
  });
  const page = await browser.newPage();
  
  // Set viewport to 1080p
  await page.setViewport({ width: 1920, height: 1080 });

  console.log("Capturing Splash Screen...");
  await page.goto('http://localhost:3000/');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/0d59ea37-e4ce-4572-bea9-2fd218a7bba8/actual_splash.png' });

  console.log("Capturing Login...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/0d59ea37-e4ce-4572-bea9-2fd218a7bba8/actual_login.png' });

  console.log("Capturing Register...");
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:/Users/DELL/.gemini/antigravity/brain/0d59ea37-e4ce-4572-bea9-2fd218a7bba8/actual_register.png' });

  console.log("Screenshots captured successfully!");
  await browser.close();
})();
