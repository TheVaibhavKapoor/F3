const axios = require('axios');
const cheerio = require('cheerio');

async function main() {
  const { data: html } = await axios.get('https://www.paisabazaar.com/fixed-deposit/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const $ = cheerio.load(html);

  const scraped = {};

  $('table').each((i, table) => {
    // Try to find indices for 1-year, 3-year, 5-year
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

    // If we didn't find specific tenures, skip this table for multi-tenure scraping.
    // Wait, let's see what we find for each table.
    console.log(`\nTable ${i}: 1yr=${col1yr}, 3yr=${col3yr}, 5yr=${col5yr}`);

    if (col1yr !== -1) {
      // Parse data rows
      rows.slice(1).each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 3) return;
        
        const bankName = $(cells[nameCol]).text().trim();
        if (!bankName || bankName.toLowerCase().includes('slab') || bankName.toLowerCase().includes('citizens')) return;

        const getRate = (cIdx) => {
          if (cIdx === -1 || !cells[cIdx]) return null;
          const match = $(cells[cIdx]).text().trim().match(/([\d.]+)/);
          return match ? parseFloat(match[1]) : null;
        };

        const r1 = getRate(col1yr);
        const r3 = getRate(col3yr);
        const r5 = getRate(col5yr);

        if (r1) {
          scraped[bankName] = { '1': r1, '3': r3, '5': r5 };
          console.log(`Found: ${bankName} -> 1y:${r1}, 3y:${r3}, 5y:${r5}`);
        }
      });
    }
  });

  console.log('\nFinal Scraped Data:', scraped);
}

main().catch(console.error);
