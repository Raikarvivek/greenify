const http = require('http')

function quickTest() {
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

  console.log('Quick admin login test...')

  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('Status:', res.statusCode)
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data)
          console.log('✅ Login successful')
          console.log('User:', response.user.name, response.user.role)
          console.log('Token length:', response.accessToken.length)
          
          // Now test /api/auth/me
          testMe(response.accessToken)
        } catch (e) {
          console.log('Parse error:', e.message)
        }
      } else {
        console.log('❌ Login failed')
        console.log('Response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('Error:', error.message)
  })

  req.write(postData)
  req.end()
}

function testMe(token) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }

  console.log('\nTesting /api/auth/me...')

  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('Me Status:', res.statusCode)
      if (res.statusCode === 200) {
        console.log('✅ /api/auth/me working')
      } else {
        console.log('❌ /api/auth/me failed')
        console.log('Response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.error('Me Error:', error.message)
  })

  req.end()
}

quickTest()
