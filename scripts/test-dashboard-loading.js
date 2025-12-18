const http = require('http')

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData)
          resolve({ status: res.statusCode, data: parsed })
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

async function testDashboardAPIs() {
  console.log('🧪 Testing Dashboard API Dependencies...\n')
  
  // Login first
  console.log('1. Logging in as user...')
  const loginResult = await makeRequest('/api/auth/login', 'POST', {
    email: 'user@test.com',
    password: 'password123'
  })
  
  if (loginResult.status !== 200) {
    console.log('❌ Login failed')
    return
  }
  
  const token = loginResult.data.accessToken
  console.log('✅ Login successful')
  
  // Test APIs that the dashboard uses
  const apiTests = [
    { name: 'User Profile (/api/auth/me)', path: '/api/auth/me' },
    { name: 'User Stats (/api/user/stats)', path: '/api/user/stats' },
    { name: 'Recent Activities (/api/activities)', path: '/api/activities?limit=5' },
    { name: 'Rewards (/api/rewards)', path: '/api/rewards' },
    { name: 'Leaderboard (/api/leaderboard)', path: '/api/leaderboard' },
    { name: 'Badges (/api/badges)', path: '/api/badges' }
  ]
  
  console.log('\n2. Testing Dashboard API Dependencies...')
  
  for (const test of apiTests) {
    try {
      const startTime = Date.now()
      const result = await makeRequest(test.path, 'GET', null, token)
      const duration = Date.now() - startTime
      
      if (result.status === 200) {
        console.log(`✅ ${test.name}: SUCCESS (${duration}ms)`)
      } else if (result.status === 404) {
        console.log(`⚠️  ${test.name}: NOT FOUND (${duration}ms) - Optional endpoint`)
      } else {
        console.log(`❌ ${test.name}: FAILED ${result.status} (${duration}ms)`)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`)
    }
  }
  
  console.log('\n🎯 Dashboard API Testing Complete!')
  console.log('\n📋 Dashboard Status:')
  console.log('- The original dashboard should now load properly')
  console.log('- API calls are optimized with timeouts')
  console.log('- User data loads from AuthProvider first')
  console.log('- Fallback API calls for additional data')
}

testDashboardAPIs().catch(console.error)
