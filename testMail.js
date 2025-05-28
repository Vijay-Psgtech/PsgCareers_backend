const net = require('net');

const client = net.createConnection({ port: 465, host: 'smtp.gmail.com' }, () => {
  console.log('✅ Connected to SMTP server');
  client.end();
});

client.on('error', (err) => {
  console.error('❌ Connection failed:', err.message);
});