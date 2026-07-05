const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/chat',
  method: 'GET',
  timeout: 5000
};

console.log('Testing chat page...');

const req = http.request(options, (res) => {
  console.log(`✅ Chat page responding with status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('Chat with AI Mentor') && !data.includes('Coming soon')) {
      console.log('✅ Chat interface loaded successfully (no longer shows "Coming soon")');
    } else if (data.includes('Coming soon')) {
      console.log('⚠️  Still showing "Coming soon" - may need server restart');
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