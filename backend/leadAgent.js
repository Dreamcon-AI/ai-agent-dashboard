// LeadAgent.js - Automates project lead scraping from PlanCenterNW.com
import puppeteer from 'puppeteer';
import fs from 'fs';

const USERNAME = '10982';
const PASSWORD = '?B0nd!!1';

const LeadAgent = async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  const output = [];

  try {
    // Login
    await page.goto('https://www.plancenternw.com', { waitUntil: 'domcontentloaded' });
    await page.type('input[name="uid"]', USERNAME);
    await page.type('input[name="pwd"]', PASSWORD);
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    console.log('✅ Logged in');

    // Omni Search
    await page.click('a:has-text("Omni Search")');
    await page.waitForSelector('input[name="txtKeyWords"]');
    await page.type('input[name="txtKeyWords"]', 'fence fencing');
    await Promise.all([
      page.click('input[value="Search Projects"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    console.log('🔍 Searching for fencing projects');

    // Get project rows
    const rows = await page.$$('table tbody tr');

    for (const row of rows) {
      const state = await row.$eval('td:nth-child(1)', el => el.textContent.trim());
      if (!['OR', 'WA'].includes(state)) continue;

      const projectLink = await row.$('td:nth-child(3) a');
      if (!projectLink) continue;

      const [projectPage] = await Promise.all([
        new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
        projectLink.click(),
      ]);

      await projectPage.bringToFront();
      await projectPage.waitForTimeout(3000);

      // Scrape info
      const planNo = await projectPage.$eval('span[id^="TopsRepeater_PlanNo_"]', el => el.textContent.trim());
      const bidDate = await projectPage.$eval('span[id^="TopsRepeater_BidDt_"]', el => el.textContent.trim());
      const address = await projectPage.$eval('span[id^="TopsRepeater_Address_"]', el => el.textContent.trim());
      const wage = await projectPage.$eval('h7:contains("Prevailing Wage") + td', el => el.textContent.trim());

      // Plans
      await projectPage.click('span.rpText:contains("Drawings")');
      await projectPage.waitForSelector('input[id="rpbPDFDocuments_i2_i0_cbMerge_PAll"]');
      await projectPage.click('input[id="rpbPDFDocuments_i2_i0_cbMerge_PAll"]');
      await projectPage.click('input[id="butMerge"]');
      await projectPage.waitForTimeout(5000); // Wait for popup to appear (assume manual download)

      // Specs
      await projectPage.click('span.rpText:contains("Specifications")');
      await projectPage.waitForTimeout(1000);
      const specLinks = await projectPage.$$('div#specs-section a'); // adjust selector as needed

      for (const link of specLinks) {
        const href = await link.evaluate(a => a.href);
        const filename = href.split('/').pop();
        const file = fs.createWriteStream(`downloads/${filename}`);
        const response = await fetch(href);
        response.body.pipe(file);
      }

      output.push({ planNo, bidDate, address, wage });
      await projectPage.close();
    }

    console.log('✅ Done collecting leads');
    fs.writeFileSync('leads.json', JSON.stringify(output, null, 2));
    await browser.close();
  } catch (err) {
    console.error('❌ Error in LeadAgent:', err);
    await browser.close();
  }
};

LeadAgent();

