const http = require('http')

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData)
          resolve({ status: res.statusCode, data: parsed })
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.setTimeout(3000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

async function simpleTest() {
  console.log('Simple activity test...')
  
  // Login
  const login = await makeRequest('/api/auth/login', 'POST', {
    email: 'user@test.com',
    password: 'password123'
  })
  
  const token = login.data.accessToken
  console.log('Token:', token ? 'OK' : 'MISSING')
  
  // Simple activity
  const activity = {
    type: 'recycling',
    title: 'Test Activity',
    description: 'Test description',
    quantity: 1,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10,
      address: 'New York, NY, USA',
      timestamp: Date.now()
    },
    verificationMedia: [{ 
      type: 'image', 
      url: 'https://example.com/test.jpg',
      filename: 'test.jpg'
    }]
  }
  
  console.log('Posting activity...')
  const result = await makeRequest('/api/activities', 'POST', activity, token)
  console.log('Result:', result.status, result.data)
}

simpleTest().catch(console.error)
