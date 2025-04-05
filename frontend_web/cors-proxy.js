import express from 'express';
import cors from 'cors';
import http from 'http';
import httpProxy from 'http-proxy';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const proxy = httpProxy.createProxyServer({});

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pre-flight OPTIONS handling
app.options('*', cors());

// Debug middleware
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length) {
    console.log('[Proxy] Request body:', req.body);
  }
  next();
});

// Define API URL at the top of the file
const API_URL = 'http://localhost:8000';

// Special handling for registration endpoint
app.post('/users/register/User', async (req, res) => {
  try {
    console.log('[Proxy] Handling registration with special logic');
    console.log('[Proxy] Request body:', req.body);
    
    // Convert body to URL-encoded format
    const formBody = new URLSearchParams();
    Object.entries(req.body).forEach(([key, value]) => {
      formBody.append(key, value);
    });
    
    // Forward to backend
    const response = await fetch('http://localhost:8000/users/register/User', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });
    
    // Get response data
    const responseData = await response.json();
    console.log('[Proxy] Response status:', response.status);
    console.log('[Proxy] Response data:', responseData);
    
    // Add CORS headers
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    
    // Return the response
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('[Proxy] Registration error:', error);
    res.status(500).json({ detail: 'Proxy error: ' + error.message });
  }
});

// Special handling for mentor profile creation
app.put('/users/mentor/profile_creation', async (req, res) => {
  try {
    console.log('[Proxy] Special handling for mentor profile creation');
    console.log('[Proxy] Request body:', req.body);
    console.log('[Proxy] Authorization header:', req.headers.authorization?.substring(0, 20) + '...');
    
    // Try first with JSON format
    let options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify({
        name: req.body.name,
        designation: req.body.designation,
        exp: typeof req.body.exp === 'string' ? parseInt(req.body.exp) : req.body.exp,
        contact: req.body.contact
      })
    };
    
    console.log('[Proxy] Sending JSON request to backend:', options.body);
    
    let response = await fetch(`${API_URL}/users/mentor/profile_creation`, options);
    
    // If JSON fails, try with form data
    if (response.status === 500) {
      console.log('[Proxy] JSON approach failed, trying form data');
      
      const formData = new URLSearchParams();
      formData.append('name', req.body.name);
      formData.append('designation', req.body.designation);
      formData.append('exp', req.body.exp.toString());
      formData.append('contact', req.body.contact);
      
      options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': req.headers.authorization || ''
        },
        body: formData.toString()
      };
      
      console.log('[Proxy] Sending form data to backend:', options.body);
      response = await fetch(`${API_URL}/users/mentor/profile_creation`, options);
    }
    
    // Try to parse response as JSON
    let responseBody;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    
    console.log('[Proxy] Response status:', response.status);
    console.log('[Proxy] Response body:', responseBody);
    
    // Set CORS headers
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    // Return the same status and data
    if (typeof responseBody === 'string') {
      res.status(response.status).send(responseBody);
    } else {
      res.status(response.status).json(responseBody);
    }
  } catch (error) {
    console.error('[Proxy] Mentor profile creation error:', error);
    res.status(500).json({ detail: 'Proxy error: ' + error.message });
  }
});

// Special handling for mentor skills endpoint
app.post('/users/mentor/skills', async (req, res) => {
  try {
    console.log('[Proxy] Special handling for mentor skills');
    console.log('[Proxy] Request body:', req.body);
    console.log('[Proxy] Authorization header:', req.headers.authorization?.substring(0, 20) + '...');
    
    // Try first with JSON format
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify({ skills: req.body.skills })
    };
    
    console.log('[Proxy] Sending request to backend:', options.body);
    
    const response = await fetch(`${API_URL}/users/mentor/skills`, options);
    
    // Try to parse response as JSON
    let responseBody;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    
    console.log('[Proxy] Response status:', response.status);
    console.log('[Proxy] Response body:', responseBody);
    
    // Set CORS headers
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    // Return the same status and data
    if (typeof responseBody === 'string') {
      res.status(response.status).send(responseBody);
    } else {
      res.status(response.status).json(responseBody);
    }
  } catch (error) {
    console.error('[Proxy] Mentor skills error:', error);
    res.status(500).json({ detail: 'Proxy error: ' + error.message });
  }
});

// Add CORS headers to proxy responses
proxy.on('proxyRes', function(proxyRes, req, res) {
  proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
  proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
});

// Error handling
proxy.on('error', function(err, req, res) {
  console.error('[Proxy] Error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end('Proxy error: ' + err.message);
});

// Proxy all other requests to the backend
app.all('*', async (req, res) => {
  const targetURL = `${API_URL}${req.url}`;
  console.log(`Proxying request to: ${targetURL}`);
  console.log(`Method: ${req.method}`);
  
  // Log headers for debugging
  console.log('Request headers:', req.headers);
  
  // Log body for debugging (especially for PUT and POST)
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', req.body);
    
    // For the profile creation endpoint, log exact payload format
    if (req.url.includes('/mentor/profile_creation')) {
      console.log('Mentor profile creation payload:', JSON.stringify(req.body, null, 2));
      console.log('Content-Type:', req.headers['content-type']);
    }
  }
  
  try {
    if (req.url === '/') {
      return res.send('CORS Proxy Server is running. Use http://localhost:3001/any-backend-path to access the backend.');
    }
    
    proxy.web(req, res, { 
      target: 'http://localhost:8000',
      changeOrigin: true
    });
  } catch (error) {
    console.error('[Proxy] Error:', error);
    res.status(500).json({ detail: 'Proxy error: ' + error.message });
  }
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to http://localhost:8000`);
  console.log(`Access your backend through http://localhost:${PORT}`);
}); 