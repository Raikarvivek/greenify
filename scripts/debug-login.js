const http = require('http')

function debugLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ 
      email: 'user@test.com', 
      password: 'password123' 
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

    console.log('🔍 Debug: Testing login API...')
    const startTime = Date.now()

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        console.log(`Response received in ${duration}ms`)
        console.log(`Status: ${res.statusCode}`)
        console.log(`Headers:`, res.headers)
        console.log(`Body:`, data)
        
        resolve({ status: res.statusCode, duration, data, headers: res.headers })
      })
    })

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message)
      reject(error)
    })

    req.setTimeout(10000, () => {
      console.error('❌ Request timed out')
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.write(postData)
    req.end()
  })
}

debugLogin().catch(console.error)
