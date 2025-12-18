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

    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

async function testAPIs() {
  console.log('🧪 Testing All Critical API Endpoints...\n')
  
  let accessToken = null
  
  // Test 1: Login API
  console.log('1. Testing Login API...')
  try {
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'user@test.com',
      password: 'password123'
    })
    
    if (loginResult.status === 200) {
      console.log('✅ Login API: SUCCESS')
      accessToken = loginResult.data.accessToken
      console.log('   Token received:', !!accessToken)
    } else {
      console.log('❌ Login API: FAILED', loginResult.status)
    }
  } catch (error) {
    console.log('❌ Login API: ERROR', error.message)
  }
  
  // Test 2: Me API (requires auth)
  console.log('\n2. Testing /api/auth/me...')
  try {
    const meResult = await makeRequest('/api/auth/me', 'GET', null, accessToken)
    
    if (meResult.status === 200) {
      console.log('✅ Me API: SUCCESS')
      console.log('   User:', meResult.data.name, `(${meResult.data.role})`)
    } else {
      console.log('❌ Me API: FAILED', meResult.status)
    }
  } catch (error) {
    console.log('❌ Me API: ERROR', error.message)
  }
  
  // Test 3: Activities API
  console.log('\n3. Testing /api/activities...')
  try {
    const activitiesResult = await makeRequest('/api/activities', 'GET', null, accessToken)
    
    if (activitiesResult.status === 200) {
      console.log('✅ Activities API: SUCCESS')
      console.log('   Activities found:', activitiesResult.data.activities?.length || 0)
    } else {
      console.log('❌ Activities API: FAILED', activitiesResult.status)
    }
  } catch (error) {
    console.log('❌ Activities API: ERROR', error.message)
  }
  
  // Test 4: Rewards API
  console.log('\n4. Testing /api/rewards...')
  try {
    const rewardsResult = await makeRequest('/api/rewards', 'GET', null, accessToken)
    
    if (rewardsResult.status === 200) {
      console.log('✅ Rewards API: SUCCESS')
      console.log('   Rewards found:', rewardsResult.data.rewards?.length || 0)
    } else {
      console.log('❌ Rewards API: FAILED', rewardsResult.status)
    }
  } catch (error) {
    console.log('❌ Rewards API: ERROR', error.message)
  }
  
  // Test 5: User Stats API
  console.log('\n5. Testing /api/user/stats...')
  try {
    const statsResult = await makeRequest('/api/user/stats', 'GET', null, accessToken)
    
    if (statsResult.status === 200) {
      console.log('✅ User Stats API: SUCCESS')
    } else {
      console.log('❌ User Stats API: FAILED', statsResult.status)
    }
  } catch (error) {
    console.log('❌ User Stats API: ERROR', error.message)
  }
  
  // Test 6: Admin Login
  console.log('\n6. Testing Admin Login...')
  try {
    const adminLoginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@greenify.com',
      password: 'GreenifyAdmin2024!'
    })
    
    if (adminLoginResult.status === 200) {
      console.log('✅ Admin Login: SUCCESS')
      console.log('   Admin user:', adminLoginResult.data.user.name, `(${adminLoginResult.data.user.role})`)
    } else {
      console.log('❌ Admin Login: FAILED', adminLoginResult.status)
    }
  } catch (error) {
    console.log('❌ Admin Login: ERROR', error.message)
  }
  
  console.log('\n🎯 API Testing Complete!')
}

testAPIs().catch(console.error)
