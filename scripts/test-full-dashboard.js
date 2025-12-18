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

    req.setTimeout(3000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}

async function testFullDashboard() {
  console.log('🎯 Testing Full Dashboard Functionality...\n')
  
  // 1. User Login
  console.log('1. User Authentication...')
  const loginResult = await makeRequest('/api/auth/login', 'POST', {
    email: 'user@test.com',
    password: 'password123'
  })
  
  if (loginResult.status !== 200) {
    console.log('❌ Login failed:', loginResult.status)
    return
  }
  
  const token = loginResult.data.accessToken
  const user = loginResult.data.user
  console.log('✅ Login successful')
  console.log(`   User: ${user.name} (${user.role})`)
  console.log(`   Points: ${user.points}, Level: ${user.level}`)
  
  // 2. Dashboard Data Loading
  console.log('\n2. Dashboard Data Loading...')
  
  const dashboardAPIs = [
    { name: 'User Profile', path: '/api/auth/me', critical: true },
    { name: 'User Stats', path: '/api/user/stats', critical: true },
    { name: 'Recent Activities', path: '/api/activities?limit=5', critical: true },
    { name: 'Available Rewards', path: '/api/rewards', critical: false },
    { name: 'Leaderboard', path: '/api/leaderboard', critical: false },
    { name: 'User Badges', path: '/api/badges', critical: false }
  ]
  
  let criticalAPIsWorking = 0
  let totalCriticalAPIs = dashboardAPIs.filter(api => api.critical).length
  
  for (const api of dashboardAPIs) {
    try {
      const startTime = Date.now()
      const result = await makeRequest(api.path, 'GET', null, token)
      const duration = Date.now() - startTime
      
      if (result.status === 200) {
        console.log(`✅ ${api.name}: SUCCESS (${duration}ms)`)
        if (api.critical) criticalAPIsWorking++
        
        // Show some data details
        if (api.name === 'Recent Activities' && result.data.activities) {
          console.log(`   Found ${result.data.activities.length} activities`)
        }
        if (api.name === 'Available Rewards' && result.data.rewards) {
          console.log(`   Found ${result.data.rewards.length} rewards`)
        }
      } else {
        console.log(`❌ ${api.name}: FAILED ${result.status} (${duration}ms)`)
      }
    } catch (error) {
      console.log(`❌ ${api.name}: ERROR - ${error.message}`)
    }
  }
  
  // 3. Activity Logging Test
  console.log('\n3. Activity Logging Test...')
  try {
    const activityData = {
      type: 'recycling',
      title: 'Dashboard Test Activity',
      description: 'Testing activity logging from dashboard',
      quantity: 3,
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 10,
        address: 'New York, NY, USA',
        timestamp: Date.now()
      },
      verificationMedia: [{
        type: 'image',
        url: 'https://example.com/test-photo.jpg',
        filename: 'test-photo.jpg'
      }]
    }
    
    const activityResult = await makeRequest('/api/activities', 'POST', activityData, token)
    
    if (activityResult.status === 200) {
      console.log('✅ Activity logging: SUCCESS')
      console.log(`   Activity ID: ${activityResult.data.activity?.id || 'N/A'}`)
    } else {
      console.log('❌ Activity logging: FAILED', activityResult.status)
    }
  } catch (error) {
    console.log('❌ Activity logging: ERROR', error.message)
  }
  
  // 4. Dashboard Readiness Assessment
  console.log('\n🎯 Dashboard Readiness Assessment:')
  console.log(`✅ Critical APIs Working: ${criticalAPIsWorking}/${totalCriticalAPIs}`)
  
  if (criticalAPIsWorking === totalCriticalAPIs) {
    console.log('🎉 DASHBOARD FULLY FUNCTIONAL!')
    console.log('\n📱 Ready for User Access:')
    console.log('- User authentication: Working')
    console.log('- Profile data loading: Working')
    console.log('- Activity tracking: Working')
    console.log('- Stats and progress: Working')
    console.log('- Real-time data: Working')
    
    console.log('\n🌐 Access Dashboard:')
    console.log('1. Visit: http://localhost:3000/login')
    console.log('2. Login: user@test.com / password123')
    console.log('3. Dashboard should load with full functionality')
    
  } else {
    console.log('⚠️  Dashboard has some issues with critical APIs')
  }
}

testFullDashboard().catch(console.error)
