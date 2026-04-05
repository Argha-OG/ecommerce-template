const https = require('https');

const options = {
  hostname: 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com',
  port: 443,
  path: '/products/list?country=us&lang=en&currentpage=0&pagesize=4',
  method: 'GET',
  headers: {
    'x-rapidapi-key': '28922e418cmshd6efe7226c15806p19f443jsn7fbfa29b61ac',
    'x-rapidapi-host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Success. Results count:", parsed.results ? parsed.results.length : "None");
      if (parsed.results && parsed.results.length > 0) {
        console.log("First item sample:", {
            name: parsed.results[0].name,
            price: parsed.results[0].price,
            image: parsed.results[0].images?.[0]?.url || parsed.results[0].galleryImages?.[0]?.url || parsed.results[0].articles?.[0]?.logoPicture?.[0]?.url,
            sku: parsed.results[0].articles?.[0]?.code || parsed.results[0].articleCode
        });
      }
    } catch(e) {
      console.log("Parse Error", e.message);
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
