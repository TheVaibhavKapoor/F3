const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.paisabazaar.com/fixed-deposit/')
  .then(r => {
    const $ = cheerio.load(r.data);
    $('table').each((i, t) => {
      console.log('Table ' + i);
      $(t).find('tr').slice(0, 3).each((j, r) => {
        console.log($(r).text().replace(/\s+/g, ' ').trim());
      });
    });
  })
  .catch(e => console.log(e.message));
