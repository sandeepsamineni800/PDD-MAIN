/**
 * PDD Core Scheduler - Selenium Test Helpers
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');

/**
 * Build a configured Chrome WebDriver instance
 */
async function createDriver() {
  const options = new chrome.Options();
  config.browser.args.forEach(arg => options.addArguments(arg));
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000 });
  return driver;
}

/**
 * Navigate to a relative URL
 */
async function navigateTo(driver, path) {
  await driver.get(`${config.baseUrl}${path}`);
  await driver.sleep(1500);
}

/**
 * Login with test user credentials
 */
async function login(driver, email, password) {
  await navigateTo(driver, '/login');
  await driver.sleep(1000);

  try {
    const emailField = await driver.findElement(By.id('email'));
    await emailField.clear();
    await emailField.sendKeys(email || config.testUser.email);
    
    const passwordField = await driver.findElement(By.id('password'));
    await passwordField.clear();
    await passwordField.sendKeys(password || config.testUser.password);
    
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    
    await driver.sleep(3000);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if element exists on the page
 */
async function elementExists(driver, selector, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    await driver.findElement(by);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get text of an element
 */
async function getElementText(driver, selector, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    return await el.getText();
  } catch (e) {
    return '';
  }
}

/**
 * Get attribute of an element
 */
async function getElementAttribute(driver, selector, attribute, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    return await el.getAttribute(attribute);
  } catch (e) {
    return null;
  }
}

/**
 * Get CSS property of an element
 */
async function getCssValue(driver, selector, property) {
  try {
    const el = await driver.findElement(By.css(selector));
    return await el.getCssValue(property);
  } catch (e) {
    return '';
  }
}

/**
 * Wait for element to be present
 */
async function waitForElement(driver, selector, timeout = 10000, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    await driver.wait(until.elementLocated(by), timeout);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get current page URL
 */
async function getCurrentUrl(driver) {
  return await driver.getCurrentUrl();
}

/**
 * Get page title
 */
async function getPageTitle(driver) {
  return await driver.getTitle();
}

/**
 * Get page source
 */
async function getPageSource(driver) {
  return await driver.getPageSource();
}

/**
 * Execute JavaScript in the browser
 */
async function executeScript(driver, script) {
  try {
    return await driver.executeScript(script);
  } catch (e) {
    return null;
  }
}

/**
 * Set window size
 */
async function setWindowSize(driver, width, height) {
  await driver.manage().window().setRect({ width, height });
}

/**
 * Click element
 */
async function clickElement(driver, selector, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    await el.click();
    await driver.sleep(500);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Type into input
 */
async function typeInto(driver, selector, text, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    await el.clear();
    await el.sendKeys(text);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if element is displayed
 */
async function isDisplayed(driver, selector, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    return await el.isDisplayed();
  } catch (e) {
    return false;
  }
}

/**
 * Check if element is enabled
 */
async function isEnabled(driver, selector, byType = 'css') {
  try {
    const by = byType === 'css' ? By.css(selector) : 
               byType === 'xpath' ? By.xpath(selector) : 
               By.id(selector);
    const el = await driver.findElement(by);
    return await el.isEnabled();
  } catch (e) {
    return false;
  }
}

/**
 * HTTP fetch from Node (for API tests)
 */
async function httpGet(url) {
  try {
    const response = await fetch(url);
    return { status: response.status, ok: response.ok, headers: Object.fromEntries(response.headers) };
  } catch (e) {
    return { status: 0, ok: false, error: e.message };
  }
}

module.exports = {
  createDriver,
  navigateTo,
  login,
  elementExists,
  getElementText,
  getElementAttribute,
  getCssValue,
  waitForElement,
  getCurrentUrl,
  getPageTitle,
  getPageSource,
  executeScript,
  setWindowSize,
  clickElement,
  typeInto,
  isDisplayed,
  isEnabled,
  httpGet,
  By,
  until,
  Key
};
