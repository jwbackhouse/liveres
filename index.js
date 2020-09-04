// Set variables
const puppeteer = require('puppeteer');
const DEST_EMAIL = 'xxx@xxx.com';
const START_DATE = '01/09/2014';
const SITES = ['2608','2689','643','2642','644','6816','657','641','2403','663','664','2599','668','2607','2727','669','670','639','4465','677','651','2665','667','4465','677','2282','2581','651','2694','638','1379','994','666','993','640','646','659','665','654','648','652','656','2357','671','7103','676','2725','2628','784','698','767','770','769','764','766','684','776','783','768','772','6877','680','2056','2358','2402','2288','689','697','679','2327','5278','4466','771','4327','773','774','777'];  // IDs of target sites

// Export as environment variables
const LR_USERNAME = process.env.LR_USERNAME;
const LR_PASSWORD = process.env.LR_PASSWORD;

// Scraping function
const scrape = async () => {
  try {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    // Navigate to login page
    await page.goto('https://admin.liveres.co.uk/', {waitUntil: 'load'});
    console.log(page.url());

    // Enter login details
    await page.focus('#Login1_UserName');
    page.keyboard.type(LR_USERNAME);
    await page.waitFor(500);

    await page.focus('#Login1_Password');
    page.keyboard.type(LR_PASSWORD);
    await page.waitFor(500);

    await page.click('#Login1_LoginButton');
    await page.waitFor(2000);

    // Navigate to reports page
    await page.click('#menubut > div > a > span.slicknav_icon.slicknav_no-text');
    await page.click('#menubut > div > nav > div:nth-child(1) > ul > li:nth-child(5) > a');
    await page.waitFor(2000);

    // Select report type
    await page.click('#ctl00_content_DlRepType');
    await page.select('#ctl00_content_DlRepType', 'TransferBookingsReport');
    await page.waitFor(1000);

    // Set dates
    const input = await page.$('#ctl00_content_TextBoxStartDate');
    await input.click({ clickCount: 3 })
    await input.type(START_DATE);
    await page.waitFor(500);

    await page.focus('#ctl00_content_TextBoxEmail');
    page.keyboard.type(DEST_EMAIL);
    await page.waitFor(500);

    // Loop through site IDs and run report
    // Missing sites previously: '2599','2628','2450','5310','2366'
    const sites = SITES;
    for (let i=0; i < sites.length; i++) {
      await page.select('#ctl00_content_DropDownList1', sites[i]);
      await page.waitFor(1000);

      await page.click('#ctl00_content_Button1');
      await page.waitFor(60000);
    };
  }
  catch (err) {
    console.log(err);
    browser.close();
  }
};

// Run scrape
scrape()
// .then((value) => {
//     console.log(value); // Success!
// });
