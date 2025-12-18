const http = require('http')

function testAuth(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password })
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test-auth',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    console.log('Making request to test-auth endpoint...')
    const startTime = Date.now()

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const endTime = Date.now()
        console.log(`Request completed in ${endTime - startTime}ms`)
        
        try {
          const response = JSON.parse(data)
          resolve({
            status: res.statusCode,
            body: response,
            requestTime: endTime - startTime
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            body: data,
            requestTime: endTime - startTime
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

async function runTest() {
  console.log('🧪 Testing Simplified Auth Endpoint...\n')

  try {
    const result = await testAuth('admin@greenify.com', 'GreenifyAdmin2024!')
    
    console.log('Status:', result.status)
    console.log('Request Time:', result.requestTime + 'ms')
    console.log('Response:', JSON.stringify(result.body, null, 2))
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

runTest()
