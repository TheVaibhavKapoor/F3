const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.paisabazaar.com/fixed-deposit/')
  .then(r => {
    const $ = cheerio.load(r.data);
    require('fs').writeFileSync('table.html', $('table').eq(0).html());
  })
  .catch(e => console.log(e.message));
