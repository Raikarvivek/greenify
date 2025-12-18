const http = require('http')

function testAdminLogin() {
  return new Promise((resolve, reject) => {
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

    console.log('Testing admin login...')

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          console.log('Status:', res.statusCode)
          console.log('Response:', JSON.stringify(response, null, 2))
          
          if (res.statusCode === 200 && response.accessToken) {
            console.log('✅ Admin login successful')
            console.log('Token length:', response.accessToken.length)
            console.log('User role:', response.user.role)
            
            // Now test /api/auth/me
            testMeEndpoint(response.accessToken)
          } else {
            console.log('❌ Admin login failed')
          }
          
        } catch (e) {
          console.log('Parse error:', e.message)
          console.log('Raw data:', data)
        }
      })
    })

    req.on('error', (error) => {
      console.error('Request error:', error.message)
    })

    req.write(postData)
    req.end()
  })
}

function testMeEndpoint(token) {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  console.log('\nTesting /api/auth/me with token...')
  console.log('Token preview:', token.substring(0, 50) + '...')

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
