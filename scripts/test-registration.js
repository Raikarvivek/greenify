const http = require('http')

function testRegistration() {
  const testUser = {
    name: 'Test User Registration',
    email: 'testuser' + Date.now() + '@example.com', // Unique email
    password: 'password123'
  }

  const postData = JSON.stringify(testUser)
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  console.log('🔧 Testing User Registration...')
  console.log('Test user data:', testUser)

  const req = http.request(options, (res) => {
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      console.log('\nRegistration API Response:')
      console.log('Status:', res.statusCode)
      
      try {
        const response = JSON.parse(data)
        console.log('Response:', JSON.stringify(response, null, 2))
        
        if (res.statusCode === 201) {
          console.log('✅ Registration successful!')
          console.log('User created:', response.user.name, '(' + response.user.email + ')')
          console.log('Token received:', response.accessToken ? 'Yes' : 'No')
        } else {
          console.log('❌ Registration failed')
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

  req.setTimeout(10000, () => {
    console.log('❌ Request timeout')
    req.destroy()
  })

  req.write(postData)
  req.end()
}

testRegistration()
