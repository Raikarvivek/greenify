const http = require('http')

function testUserLogin() {
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

    console.log('⚡ Testing USER login...')
    const startTime = Date.now()

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        console.log(`✅ Response received in ${duration}ms`)
        console.log(`Status: ${res.statusCode}`)
        
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data)
            console.log('🎉 USER LOGIN SUCCESS!')
            console.log('User:', response.user.name, `(${response.user.role})`)
            console.log('Token received:', !!response.accessToken)
          } catch (e) {
            console.log('Response:', data)
          }
        } else {
          console.log('❌ USER LOGIN FAILED')
          console.log('Response:', data)
        }
        
        resolve({ status: res.statusCode, duration, data })
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

testUserLogin().catch(console.error)
