const http = require('http')

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET'
    }

    console.log(`Testing: ${path}`)

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log(`${path} - Status: ${res.statusCode}`)
        if (res.statusCode !== 200) {
          console.log(`Response preview: ${data.substring(0, 100)}...`)
        }
        resolve({ status: res.statusCode, data })
      })
    })

    req.on('error', (error) => {
      console.error(`${path} - Error: ${error.message}`)
      resolve({ status: 'ERROR', error: error.message })
    })

    req.setTimeout(3000, () => {
      console.log(`${path} - TIMEOUT`)
      req.destroy()
      resolve({ status: 'TIMEOUT' })
    })

    req.end()
  })
}

async function testServerEndpoints() {
  console.log('🔍 Testing Server Endpoints on Port 3001...\n')
  
  const endpoints = [
    '/',
    '/api',
    '/api/auth',
    '/api/auth/login',
    '/api/auth/me',
    '/login',
    '/dashboard'
  ]
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint)
  }
  
  console.log('\n🎯 Endpoint Test Complete')
  console.log('If /api/auth/login returns 404, there\'s a routing issue')
  console.log('If it returns 405, the endpoint exists but method is wrong')
}

testServerEndpoints().catch(console.error)
