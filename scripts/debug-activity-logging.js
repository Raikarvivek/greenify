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

    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

async function debugActivityLogging() {
  console.log('🔍 Debugging Activity Logging API...\n')
  
  // First login to get token
  console.log('1. Getting authentication token...')
  const loginResult = await makeRequest('/api/auth/login', 'POST', {
    email: 'user@test.com',
    password: 'password123'
  })
  
  if (loginResult.status !== 200) {
    console.log('❌ Login failed:', loginResult.status)
    return
  }
  
  const token = loginResult.data.accessToken
  console.log('✅ Token obtained')
  
  // Test activity logging with detailed error reporting
  console.log('\n2. Testing activity logging...')
  
  const activityData = {
    type: 'recycling',
    title: 'Plastic Bottle Recycling',
    description: 'Recycled plastic bottles at home',
    quantity: 5,
    unit: 'bottles',
    location: 'Home',
    verificationMedia: [
      {
        type: 'image',
        url: 'https://example.com/recycling-photo.jpg',
        description: 'Photo of recycled bottles'
      }
    ]
  }
  
  console.log('Sending activity data:')
  console.log(JSON.stringify(activityData, null, 2))
  
  try {
    const result = await makeRequest('/api/activities', 'POST', activityData, token)
    
    console.log('\nResponse:')
    console.log('Status:', result.status)
    console.log('Data:', JSON.stringify(result.data, null, 2))
    
    if (result.status === 200 || result.status === 201) {
      console.log('\n✅ Activity logging successful!')
    } else {
      console.log('\n❌ Activity logging failed!')
      console.log('Error details:', result.data.error || result.data)
    }
    
  } catch (error) {
    console.log('\n❌ Request error:', error.message)
  }
}

debugActivityLogging().catch(console.error)
