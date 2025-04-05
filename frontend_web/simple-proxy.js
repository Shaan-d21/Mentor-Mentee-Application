import http from 'http';
import httpProxy from 'http-proxy';

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:8000',
  changeOrigin: true
});

// Add CORS headers to all responses
proxy.on('proxyRes', function(proxyRes, req, res) {
  proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
  proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
});

// Handle errors
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end('Proxy error: ' + err.message);
});

// Create a server that uses the proxy
const server = http.createServer(function(req, res) {
  // Handle OPTIONS requests directly (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Length': '0'
    });
    return res.end();
  }
  
  // Log requests
  console.log(`${req.method} ${req.url}`);
  
  // Forward the request to the target server
  proxy.web(req, res);
});

// Start the server
const PORT = 3001;
server.listen(PORT, function() {
  console.log(`Simple CORS Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to http://localhost:8000`);
  console.log(`Access your backend through http://localhost:${PORT}`);
}); 