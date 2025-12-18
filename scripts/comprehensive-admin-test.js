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
          resolve({ status: res.statusCode, data: parsed, headers: res.headers })
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers })
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

async function comprehensiveAdminTest() {
  console.log('🔍 Comprehensive Admin Authentication Test...\n')
  
  // Step 1: Test admin login
  console.log('1. Testing Admin Login...')
  try {
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@greenify.com',
      password: 'GreenifyAdmin2024!'
    })
    
    console.log(`   Status: ${loginResult.status}`)
    
    if (loginResult.status !== 200) {
      console.log('❌ Admin login failed')
      console.log('   Response:', JSON.stringify(loginResult.data, null, 2))
      return
    }
    
    const { accessToken, user } = loginResult.data
    console.log('✅ Admin login successful')
    console.log(`   User: ${user.name} (${user.role})`)
    console.log(`   Token length: ${accessToken.length}`)
    
    // Step 2: Test /api/auth/me immediately after login
    console.log('\n2. Testing /api/auth/me with fresh token...')
    const meResult = await makeRequest('/api/auth/me', 'GET', null, accessToken)
    
    console.log(`   Status: ${meResult.status}`)
    
    if (meResult.status === 200) {
      console.log('✅ /api/auth/me working correctly')
      console.log(`   User: ${meResult.data.name} (${meResult.data.role})`)
    } else {
      console.log('❌ /api/auth/me failed')
      console.log('   Response:', JSON.stringify(meResult.data, null, 2))
      return
    }
    
    // Step 3: Test admin-specific endpoint
    console.log('\n3. Testing admin endpoint access...')
    const adminResult = await makeRequest('/api/admin/activities', 'GET', null, accessToken)
    
    console.log(`   Status: ${adminResult.status}`)
    
    if (adminResult.status === 200) {
      console.log('✅ Admin endpoints accessible')
    } else if (adminResult.status === 403) {
      console.log('❌ Admin access denied (role issue)')
    } else {
      console.log('❌ Admin endpoint error')
      console.log('   Response:', JSON.stringify(adminResult.data, null, 2))
    }
    
    // Step 4: Simulate frontend behavior
    console.log('\n4. Simulating Frontend Behavior...')
    
    // Wait a bit (like frontend would)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test /api/auth/me again (like frontend checkAuth would)
    const meResult2 = await makeRequest('/api/auth/me', 'GET', null, accessToken)
    
    console.log(`   Second /api/auth/me status: ${meResult2.status}`)
    
    if (meResult2.status === 200) {
      console.log('✅ Token still valid after delay')
    } else {
      console.log('❌ Token became invalid')
    }
    
    console.log('\n🎯 Test Summary:')
    console.log('- Admin login:', loginResult.status === 200 ? '✅ Working' : '❌ Failed')
    console.log('- Token validation:', meResult.status === 200 ? '✅ Working' : '❌ Failed')
    console.log('- Admin access:', adminResult.status === 200 ? '✅ Working' : '❌ Failed')
    console.log('- Token persistence:', meResult2.status === 200 ? '✅ Working' : '❌ Failed')
    
    if (loginResult.status === 200 && meResult.status === 200 && adminResult.status === 200) {
      console.log('\n🎉 Admin authentication is working correctly!')
      console.log('The issue might be in the frontend AuthProvider or browser behavior.')
    } else {
      console.log('\n⚠️  There are backend authentication issues to resolve.')
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message)
  }
}

comprehensiveAdminTest().catch(console.error)
