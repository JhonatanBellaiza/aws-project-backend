const https = require('https');

module.exports = {
  searchProducts(query) {
    // Validate OpenSearch configuration
    if (!process.env.ES_ENDPOINT) {
      throw new Error('ES_ENDPOINT environment variable not set');
    }

    // Clean and validate the endpoint URL
    let cleanedEndpoint;
    try {
      cleanedEndpoint = process.env.ES_ENDPOINT
        .replace(/\/$/, '') // Remove trailing slash
        .replace(/^https?:\/\//, ''); // Remove protocol
    } catch (e) {
      throw new Error(`Invalid ES_ENDPOINT format: ${process.env.ES_ENDPOINT}`);
    }

    return new Promise((resolve, reject) => {
      const options = {
        hostname: cleanedEndpoint,
        path: `/products/_search?q=${encodeURIComponent(query)}`,
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          // Add if your OpenSearch requires authentication
          // 'Authorization': `Basic ${Buffer.from('username:password').toString('base64')}`
        },
        timeout: 5000 // 5-second timeout
      };

      console.log('OpenSearch request options:', options);

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log('Raw OpenSearch response:', data); 
          try {
            const response = JSON.parse(data);
            if (response.hits && response.hits.hits) {
              const results = response.hits.hits.map(hit => hit._source);
              resolve(results);
            } else {
              reject(new Error('Unexpected OpenSearch response format'));
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse OpenSearch response: ${parseError.message}`));
          }
        });
      });

      req.on('error', (err) => {
        console.error('OpenSearch request failed:', err);
        reject(new Error('Search service unavailable'));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('OpenSearch request timed out'));
      });

      req.end();
    });
  }
};  