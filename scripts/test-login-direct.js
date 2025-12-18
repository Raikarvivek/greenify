const http = require('http')

function testLoginAPI(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password })
    
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

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data)
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: response
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(postData)
    req.end()
  })
}

async function runTests() {
  console.log('🧪 Testing Login API Endpoints...\n')

  const testCases = [
    { email: 'admin@greenify.com', password: 'GreenifyAdmin2024!', expected: 'success' },
    { email: 'user@test.com', password: 'password123', expected: 'success' },
    { email: 'wrong@email.com', password: 'wrongpass', expected: 'fail' }
  ]

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.email}`)
    console.log(`Expected: ${testCase.expected}`)
    
    try {
      const result = await testLoginAPI(testCase.email, testCase.password)
      
      console.log(`Status: ${result.status}`)
      
      if (result.status === 200) {
        console.log('✅ SUCCESS')
        console.log('User:', result.body.user?.name, `(${result.body.user?.role})`)
        console.log('Token received:', !!result.body.accessToken)
      } else {
        console.log('❌ FAILED')
        console.log('Error:', result.body.error || result.body)
      }
    } catch (error) {
      console.log('❌ REQUEST FAILED')
      console.log('Error:', error.message)
    }
    
    console.log('─'.repeat(50))
  }
}

runTests().catch(console.error)
