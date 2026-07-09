/**
 * F3 FD Rate Fetcher — GitHub Actions Daily Scraper
 * 
 * Strategy:
 *   1. Primary:  Scrape Paisabazaar FD comparison page (structured HTML table)
 *   2. Fallback: Load the existing fd_rates.json and keep it unchanged
 *
 * Output: public/fd_rates.json (read by frontend at load time)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'fd_rates.json');

// ─── Canonical bank metadata (booking URLs, categories, DICGC status) ────────
// Rates are overwritten by the scraper; these fields are static.
const BANK_META = {
  'SBI':                   { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.onlinesbi.sbi/', ratesUrl: 'https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits' },
  'PNB':                   { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.pnbindia.in/', ratesUrl: 'https://www.pnbindia.in/interest-rate-on-deposits.html' },
  'Bank of Baroda':        { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.bankofbaroda.in/', ratesUrl: 'https://www.bankofbaroda.in/interest-rate-and-service-charges/deposit-rates' },
  'Canara Bank':           { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://canarabank.com/', ratesUrl: 'https://canarabank.com/user_page.aspx?menuid=9&submenuId=141' },
  'Union Bank':            { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.unionbankofindia.co.in/', ratesUrl: 'https://www.unionbankofindia.co.in/english/interest-rate.aspx' },
  'Bank of India':         { category: 'PSU',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.bankofindia.co.in/', ratesUrl: 'https://www.bankofindia.co.in/English/FDRates.aspx' },
  'HDFC Bank':             { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.hdfcbank.com/personal/save/deposits/fixed-deposit', ratesUrl: 'https://www.hdfcbank.com/personal/resources/rates-fees/deposit-rates' },
  'ICICI Bank':            { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.icicibank.com/personal-banking/deposits/fixed-deposit', ratesUrl: 'https://www.icicibank.com/personal-banking/deposits/fixed-deposit/fd-interest-rates' },
  'Axis Bank':             { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.axisbank.com/retail/fixed-deposit', ratesUrl: 'https://www.axisbank.com/retail/fixed-deposit/fd-rates' },
  'Kotak Mahindra Bank':   { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.kotak.com/en/personal-banking/deposits/fixed-deposit.html', ratesUrl: 'https://www.kotak.com/en/personal-banking/deposits/fixed-deposit/fd-interest-rates.html' },
  'YES Bank':              { category: 'Private', dicgcProtected: true, seniorBonus: 0.75, bookingUrl: 'https://www.yesbank.in/personal-banking/yes-deposits/fixed-deposit', ratesUrl: 'https://www.yesbank.in/personal-banking/yes-deposits/fixed-deposit/deposit-interest-rates' },
  'RBL Bank':              { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.rblbank.com/fixed-deposits', ratesUrl: 'https://www.rblbank.com/fixed-deposits/interest-rates' },
  'IDFC FIRST Bank':       { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.idfcfirstbank.com/personal-banking/accounts-deposits/fixed-deposit', ratesUrl: 'https://www.idfcfirstbank.com/personal-banking/accounts-deposits/fixed-deposit/interest-rates' },
  'IndusInd Bank':         { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.indusind.com/in/en/personal/deposits/fixed-deposit.html', ratesUrl: 'https://www.indusind.com/in/en/personal/deposits/fixed-deposit/fixed-deposit-rates.html' },
  'Bandhan Bank':          { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.bandhanbank.com/personal/deposits/fixed-deposit', ratesUrl: 'https://www.bandhanbank.com/personal/deposits/fixed-deposit/interest-rates' },
  'DCB Bank':              { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.dcbbank.com/personal-banking/deposits/fixed-deposit', ratesUrl: 'https://www.dcbbank.com/personal-banking/deposits/fixed-deposit/interest-rates' },
  'Federal Bank':          { category: 'Private', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.federalbank.co.in/deposits', ratesUrl: 'https://www.federalbank.co.in/deposits/term-deposit-rates' },
  'AU Small Finance Bank': { category: 'SFB',     dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.aubank.in/fixed-deposits', ratesUrl: 'https://www.aubank.in/fixed-deposits/fd-interest-rates' },
  'Ujjivan Small Finance Bank': { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.ujjivansfb.in/fixed-deposits', ratesUrl: 'https://www.ujjivansfb.in/fixed-deposits/interest-rates' },
  'Suryoday Small Finance Bank': { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.suryodaybank.com/fixed-deposit', ratesUrl: 'https://www.suryodaybank.com/fixed-deposit/interest-rate' },
  'Utkarsh Small Finance Bank':  { category: 'SFB', dicgcProtected: true, seniorBonus: 0.75, bookingUrl: 'https://www.utkarsh.bank/fixed-deposit/', ratesUrl: 'https://www.utkarsh.bank/fixed-deposit/interest-rates/' },
  'Jana Small Finance Bank':     { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.janabank.com/fixed-deposit/', ratesUrl: 'https://www.janabank.com/fixed-deposit/interest-rates/' },
  'Unity Small Finance Bank':    { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.unitybank.in/fixed-deposit', ratesUrl: 'https://www.unitybank.in/fixed-deposit-interest-rates' },
  'Equitas Small Finance Bank':  { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://www.equitasbank.com/fixed-deposits', ratesUrl: 'https://www.equitasbank.com/fixed-deposits/interest-rates' },
  'ESAF Small Finance Bank':     { category: 'SFB', dicgcProtected: true, seniorBonus: 0.50, bookingUrl: 'https://esafbank.com/fixed-deposit/', ratesUrl: 'https://esafbank.com/fixed-deposit/interest-rates/' },
  'HSBC India':            { category: 'Foreign', dicgcProtected: true, seniorBonus: 0.25, bookingUrl: 'https://www.hsbc.co.in/accounts/products/fixed-deposit/', ratesUrl: 'https://www.hsbc.co.in/accounts/products/fixed-deposit/interest-rates/' },
  'DBS Bank India':        { category: 'Foreign', dicgcProtected: true, seniorBonus: 0.25, bookingUrl: 'https://www.dbs.com/in/personal/deposits/fixed-deposits.page', ratesUrl: 'https://www.dbs.com/in/personal/rates/fixed-deposit-rates.page' },
  'Standard Chartered India': { category: 'Foreign', dicgcProtected: true, seniorBonus: 0.25, bookingUrl: 'https://www.sc.com/in/deposits/fixed-deposits/', ratesUrl: 'https://www.sc.com/in/deposits/fixed-deposits/' },
};

// ─── Hardcoded verified baseline rates (fallback if scraping fails) ─────────
// Source: Bank official websites, verified July 2025
const BASELINE_RATES = {
  'SBI':                        { '1': 6.25, '2': 6.25, '3': 6.30, '5': 6.05, '7': 5.75 },
  'PNB':                        { '1': 6.25, '2': 6.25, '3': 6.25, '5': 6.25, '7': 6.00 },
  'Bank of Baroda':             { '1': 6.25, '2': 6.25, '3': 6.50, '5': 6.25, '7': 6.00 },
  'Canara Bank':                { '1': 6.25, '2': 6.25, '3': 6.25, '5': 6.10, '7': 5.75 },
  'Union Bank':                 { '1': 6.00, '2': 6.10, '3': 6.25, '5': 6.00, '7': 5.50 },
  'Bank of India':              { '1': 5.75, '2': 6.00, '3': 6.00, '5': 5.50, '7': 5.50 },
  'HDFC Bank':                  { '1': 6.60, '2': 6.50, '3': 6.50, '5': 6.40, '7': 6.40 },
  'ICICI Bank':                 { '1': 6.25, '2': 6.50, '3': 6.50, '5': 6.50, '7': 6.25 },
  'Axis Bank':                  { '1': 6.60, '2': 6.60, '3': 6.60, '5': 6.60, '7': 6.60 },
  'Kotak Mahindra Bank':        { '1': 6.50, '2': 6.40, '3': 6.40, '5': 6.25, '7': 6.00 },
  'YES Bank':                   { '1': 6.65, '2': 6.75, '3': 7.00, '5': 6.75, '7': 6.50 },
  'RBL Bank':                   { '1': 7.00, '2': 7.10, '3': 7.20, '5': 6.70, '7': 6.50 },
  'IDFC FIRST Bank':            { '1': 6.50, '2': 7.00, '3': 7.35, '5': 6.75, '7': 6.50 },
  'IndusInd Bank':              { '1': 6.75, '2': 6.75, '3': 7.00, '5': 6.75, '7': 6.25 },
  'Bandhan Bank':               { '1': 7.35, '2': 7.25, '3': 7.25, '5': 6.75, '7': 6.75 },
  'DCB Bank':                   { '1': 7.25, '2': 7.30, '3': 7.35, '5': 7.10, '7': 6.75 },
  'Federal Bank':               { '1': 6.40, '2': 6.50, '3': 6.60, '5': 6.40, '7': 6.25 },
  'AU Small Finance Bank':      { '1': 6.35, '2': 7.25, '3': 7.40, '5': 6.75, '7': 6.50 },
  'Ujjivan Small Finance Bank': { '1': 7.25, '2': 7.25, '3': 7.25, '5': 7.20, '7': 6.50 },
  'Suryoday Small Finance Bank':{ '1': 7.25, '2': 7.50, '3': 7.25, '5': 7.90, '7': 7.00 },
  'Utkarsh Small Finance Bank': { '1': 6.00, '2': 7.00, '3': 7.50, '5': 7.00, '7': 6.50 },
  'Jana Small Finance Bank':    { '1': 7.30, '2': 7.75, '3': 8.00, '5': 6.25, '7': 6.00 },
  'Unity Small Finance Bank':   { '1': 7.50, '2': 7.50, '3': 6.75, '5': 6.75, '7': 6.25 },
  'Equitas Small Finance Bank': { '1': 7.25, '2': 7.25, '3': 7.10, '5': 7.00, '7': 6.50 },
  'ESAF Small Finance Bank':    { '1': 4.75, '2': 5.50, '3': 6.00, '5': 5.75, '7': 5.50 },
  'HSBC India':                 { '1': 6.00, '2': 6.00, '3': 6.00, '5': 5.50, '7': 5.00 },
  'DBS Bank India':             { '1': 6.50, '2': 6.50, '3': 6.50, '5': 6.25, '7': 6.00 },
  'Standard Chartered India':   { '1': 6.25, '2': 6.25, '3': 6.25, '5': 5.75, '7': 5.50 },
};

// ─── Validity check ───────────────────────────────────────────────────────────
function isValidRate(r) {
  return typeof r === 'number' && r >= 3.0 && r <= 13.0;
}

// ─── Build the final output object ──────────────────────────────────────────
function buildOutput(tenureRatesMap, source) {
  const banks = [];

  for (const [bankName, meta] of Object.entries(BANK_META)) {
    const rates = tenureRatesMap[bankName] || BASELINE_RATES[bankName];
    if (!rates) continue;

    // Validate all rates
    const cleanRates = {};
    for (const [yr, rate] of Object.entries(rates)) {
      cleanRates[yr] = isValidRate(rate) ? rate : BASELINE_RATES[bankName]?.[yr] ?? null;
    }

    // headline = best 1yr rate for display
    const headlineRate = cleanRates['1'] || cleanRates['2'] || cleanRates['3'];
    const seniorRate = +(headlineRate + (meta.seniorBonus || 0.5)).toFixed(2);

    banks.push({
      bankName,
      category: meta.category,
      headlineRate,
      seniorRate,
      seniorBonus: meta.seniorBonus,
      tenureRates: cleanRates,
      rating: meta.category === 'PSU' ? 'Sovereign/Highest' :
              meta.category === 'SFB' ? 'AA/A+ Rated' :
              meta.category === 'Foreign' ? 'Global AAA' : 'AAA/AA+ Rated',
      prematurePenalty: '0.5% – 1.0%',
      dicgcProtected: meta.dicgcProtected,
      minTenureDays: 7,
      maxTenureDays: 3650,
      bookingUrl: meta.bookingUrl,
      ratesUrl: meta.ratesUrl,
    });
  }

  return {
    lastUpdated: new Date().toISOString(),
    source,
    disclaimer: 'Rates are indicative and sourced from public aggregators. Always verify on the bank\'s official website before investing.',
    banks,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔍 Fetching FD rates from Paisabazaar...');

  let output;

  try {
    // Attempt scrape from Paisabazaar (best public source)
    const { data: html } = await axios.get(
      'https://www.paisabazaar.com/fixed-deposit/',
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; F3RateBot/1.0)' },
        timeout: 15000,
      }
    );

    const $ = cheerio.load(html);
    const scraped = {};

    // Parse tables for bank names and specific tenure rates
    $('table').each((i, table) => {
      let col1yr = -1;
      let col3yr = -1;
      let col5yr = -1;
      let nameCol = 0; // Usually first column

      const rows = $(table).find('tr');
      
      // Check first 2 rows for headers
      rows.slice(0, 2).each((rIdx, row) => {
        $(row).find('th, td').each((cIdx, cell) => {
          const text = $(cell).text().trim().toLowerCase();
          if (text.includes('1-year') || text.includes('1 year')) col1yr = cIdx;
          if (text.includes('3-year') || text.includes('3 year')) col3yr = cIdx;
          if (text.includes('5-year') || text.includes('5 year')) col5yr = cIdx;
        });
      });

      if (col1yr !== -1) {
        // Parse data rows
        rows.slice(1).each((_, row) => {
          const cells = $(row).find('td');
          if (cells.length < 3) return;
          
          const bankCell = $(cells[nameCol]).text().trim();
          if (!bankCell || bankCell.toLowerCase().includes('slab') || bankCell.toLowerCase().includes('citizens')) return;

          const getRate = (cIdx) => {
            if (cIdx === -1 || !cells[cIdx]) return null;
            const match = $(cells[cIdx]).text().trim().match(/([\d.]+)/);
            return match ? parseFloat(match[1]) : null;
          };

          const r1 = getRate(col1yr);
          const r3 = getRate(col3yr);
          const r5 = getRate(col5yr);

          // Match bank name to our canonical list
          for (const bankName of Object.keys(BANK_META)) {
            // Adjust names for matching (e.g. IndusInd vs Induslnd)
            const shortName = bankName.replace(' Small Finance Bank', '').replace(' Bank', '').toLowerCase();
            const cellName = bankCell.replace(' Small Finance Bank', '').replace(' Bank', '').toLowerCase();
            
            if (cellName.includes(shortName) || shortName.includes(cellName)) {
              if (!scraped[bankName]) scraped[bankName] = {};
              if (r1 && isValidRate(r1)) scraped[bankName]['1'] = r1;
              if (r3 && isValidRate(r3)) scraped[bankName]['3'] = r3;
              if (r5 && isValidRate(r5)) scraped[bankName]['5'] = r5;
              break;
            }
          }
        });
      }
    });

    const scrapeCount = Object.keys(scraped).length;
    console.log(`✅ Scraped ${scrapeCount} banks from Paisabazaar.`);

    if (scrapeCount < 5) {
      throw new Error('Too few banks scraped — falling back to baseline.');
    }

    // Merge scraped rates with baseline
    const merged = {};
    for (const [bank, baseline] of Object.entries(BASELINE_RATES)) {
      merged[bank] = { ...baseline };
      
      const s = scraped[bank];
      if (s) {
        if (s['1']) merged[bank]['1'] = s['1'];
        if (s['3']) merged[bank]['3'] = s['3'];
        if (s['5']) merged[bank]['5'] = s['5'];
        
        // Interpolate 2-year if 1 and 3 are present
        if (s['1'] && s['3']) {
          merged[bank]['2'] = +((s['1'] + s['3']) / 2).toFixed(2);
        } else if (s['1']) {
          // If only 1-year is present, do a flat shift for the rest
          const diff = s['1'] - baseline['1'];
          for (const yr of Object.keys(merged[bank])) {
            if (yr !== '1') merged[bank][yr] = +(baseline[yr] + diff).toFixed(2);
          }
        }

        // For 7-year, shift it relative to the 5-year rate
        if (s['5']) {
          const diff5 = s['5'] - baseline['5'];
          merged[bank]['7'] = +(baseline['7'] + diff5).toFixed(2);
        }
      }
    }

    output = buildOutput(merged, 'Paisabazaar (multi-tenure) + baseline');
    console.log(`💾 Built output with ${output.banks.length} banks.`);

  } catch (err) {
    console.warn(`⚠️  Scrape failed: ${err.message}`);
    console.log('📋 Using verified baseline rates (no change to existing file if present).');

    // If scraping fails, check if the existing file is < 3 days old
    if (fs.existsSync(OUTPUT_PATH)) {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
      const age = Date.now() - new Date(existing.lastUpdated).getTime();
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      if (age < threeDays) {
        console.log('✅ Existing file is fresh (< 3 days). Keeping it.');
        process.exit(0); // Exit cleanly — no write, no git diff
      }
    }

    // File is stale or missing — write baseline
    output = buildOutput(BASELINE_RATES, 'Verified baseline (scrape unavailable)');
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
  console.log(`✅ Wrote ${output.banks.length} banks to public/fd_rates.json`);
  console.log(`   Last updated: ${output.lastUpdated}`);
  console.log(`   Source: ${output.source}`);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
