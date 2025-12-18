const http = require('http')

function testAdminLogin() {
  const postData = JSON.stringify({
    email: 'admin@greenify.com',
    password: 'GreenifyAdmin2024!'
  })
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  console.log('🔐 Testing Admin Login...')

  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('Status:', res.statusCode)
      
      try {
        const response = JSON.parse(data)
        console.log('Response:', JSON.stringify(response, null, 2))
        
        if (res.statusCode === 200) {
          console.log('✅ Admin login API working')
          console.log('User role:', response.user?.role)
          console.log('Token present:', !!response.accessToken)
          
          // Test /api/auth/me with the token
          if (response.accessToken) {
            testMeEndpoint(response.accessToken)
          }
        } else {
          console.log('❌ Admin login failed')
          console.log('Error:', response.error)
        }
      } catch (e) {
        console.log('❌ Failed to parse response')
        console.log('Raw response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message)
  })

  req.write(postData)
  req.end()
}

function testMeEndpoint(token) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  console.log('\n🔍 Testing /api/auth/me with admin token...')

  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('Me endpoint status:', res.statusCode)
      
      try {
        const response = JSON.parse(data)
        console.log('Me response:', JSON.stringify(response, null, 2))
        
        if (res.statusCode === 200) {
          console.log('✅ Token validation working')
          console.log('Admin user confirmed:', response.role === 'admin')
        } else {
          console.log('❌ Token validation failed')
        }
      } catch (e) {
        console.log('Me raw response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('Me request error:', error.message)
  })

  req.end()
}

testAdminLogin()
