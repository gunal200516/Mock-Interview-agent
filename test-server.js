const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

console.log('Testing server connection...');

const req = http.request(options, (res) => {
  console.log(`✅ Server responding with status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('Cook')) {
      console.log('✅ Dashboard content loaded successfully');
    } else {
      console.log('⚠️  Unexpected response content');
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.log(`❌ Connection error: ${err.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Request timed out');
  req.destroy();
  process.exit(1);
});

req.setTimeout(5000);
req.end();