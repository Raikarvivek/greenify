const http = require('http')

async function testAdminLoginDirect() {
  console.log('🔐 Testing Admin Login API Directly...\n')
  
  // Test 1: Login API
  const loginData = JSON.stringify({
    email: 'admin@greenify.com',
    password: 'GreenifyAdmin2024!'
  })
  
  const loginOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  }

  return new Promise((resolve) => {
    const req = http.request(loginOptions, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log('1. LOGIN API TEST')
        console.log('Status:', res.statusCode)
        
        try {
          const response = JSON.parse(data)
          console.log('Response keys:', Object.keys(response))
          
          if (res.statusCode === 200) {
            console.log('✅ Login API successful')
            console.log('- AccessToken present:', !!response.accessToken)
            console.log('- User present:', !!response.user)
            console.log('- User role:', response.user?.role)
            console.log('- User email:', response.user?.email)
            
            // Test 2: Verify token with /api/auth/me
            if (response.accessToken) {
              testMeEndpoint(response.accessToken)
            }
          } else {
            console.log('❌ Login API failed')
            console.log('Error:', response.error)
          }
        } catch (e) {
          console.log('❌ Failed to parse login response')
          console.log('Raw response:', data)
        }
        resolve()
      })
    })

    req.on('error', (error) => {
      console.error('❌ Login request error:', error.message)
      resolve()
    })

    req.write(loginData)
    req.end()
  })
}

function testMeEndpoint(token) {
  const meOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  console.log('\n2. TOKEN VERIFICATION TEST')
  console.log('Token (first 20 chars):', token.substring(0, 20) + '...')

  const req = http.request(meOptions, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('Status:', res.statusCode)
      
      try {
        const response = JSON.parse(data)
        
        if (res.statusCode === 200) {
          console.log('✅ Token verification successful')
          console.log('- User ID:', response.id)
          console.log('- User role:', response.role)
          console.log('- User email:', response.email)
        } else {
          console.log('❌ Token verification failed')
          console.log('Error:', response.error)
        }
      } catch (e) {
        console.log('❌ Failed to parse me response')
        console.log('Raw response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('❌ Me request error:', error.message)
  })

  req.end()
}

testAdminLoginDirect()
