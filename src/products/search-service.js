const AWS = require('aws-sdk');
const https = require('https');

module.exports = {
  searchProducts(query) {
    return new Promise((resolve, reject) => {
      // 1. Prepare the OpenSearch request
      const endpoint = process.env.ES_ENDPOINT.replace(/^https?:\/\//, '');
      const path = `/products/_search?q=${encodeURIComponent(query)}`;
      const region = process.env.AWS_REGION || 'us-east-1';

      // 2. Create and sign the request
      const request = new AWS.HttpRequest(
        new AWS.Endpoint(process.env.ES_ENDPOINT),
        region
      );
      request.method = 'GET';
      request.path = path;
      request.headers['Host'] = endpoint;
      request.headers['Content-Type'] = 'application/json';

      // 3. Sign the request with Lambda's credentials
      const signer = new AWS.Signers.V4(request, 'es');
      signer.addAuthorization(AWS.config.credentials, new Date());

      // 4. Make the HTTPS request Simple hange
      const req = https.request({
        hostname: endpoint,
        path: path,
        method: 'GET',
        headers: request.headers
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const body = JSON.parse(data);
            if (res.statusCode !== 200) {
              console.error('OpenSearch error response:', body);
              return reject(new Error(body.message || 'OpenSearch error'));
            }
            resolve(body.hits?.hits.map(hit => hit._source) || []);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }
};