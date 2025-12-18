const http = require('http')

function makeRequest(path, method = 'GET', data = null, token = null, cookies = null) {
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
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(cookies && { 'Cookie': cookies })
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
          resolve({ 
            status: res.statusCode, 
            data: parsed, 
            headers: res.headers,
            cookies: res.headers['set-cookie'] 
          })
        } catch (e) {
          resolve({ 
            status: res.statusCode, 
            data: responseData, 
            headers: res.headers,
            cookies: res.headers['set-cookie'] 
          })
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

async function testAuthFlow() {
  console.log('🔐 Testing Complete Authentication Flow...\n')
  
  let userToken = null
  let adminToken = null
  let refreshCookie = null
  
  // Test 1: User Login
  console.log('1. User Login Flow...')
  try {
    const userLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'user@test.com',
      password: 'password123'
    })
    
    if (userLogin.status === 200) {
      console.log('✅ User login successful')
      userToken = userLogin.data.accessToken
      refreshCookie = userLogin.cookies?.[0]
      console.log('   User:', userLogin.data.user.name, `(${userLogin.data.user.role})`)
      console.log('   Access token:', !!userToken)
      console.log('   Refresh cookie:', !!refreshCookie)
    } else {
      console.log('❌ User login failed:', userLogin.status)
      return
    }
  } catch (error) {
    console.log('❌ User login error:', error.message)
    return
  }
  
  // Test 2: Access Protected Resource
  console.log('\n2. Testing Protected Resource Access...')
  try {
    const meResult = await makeRequest('/api/auth/me', 'GET', null, userToken)
    
    if (meResult.status === 200) {
      console.log('✅ Protected resource access successful')
      console.log('   User data retrieved:', meResult.data.name)
    } else {
      console.log('❌ Protected resource access failed:', meResult.status)
    }
  } catch (error) {
    console.log('❌ Protected resource error:', error.message)
  }
  
  // Test 3: Admin Login
  console.log('\n3. Admin Login Flow...')
  try {
    const adminLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@greenify.com',
      password: 'GreenifyAdmin2024!'
    })
    
    if (adminLogin.status === 200) {
      console.log('✅ Admin login successful')
      adminToken = adminLogin.data.accessToken
      console.log('   Admin:', adminLogin.data.user.name, `(${adminLogin.data.user.role})`)
      console.log('   Access token:', !!adminToken)
    } else {
      console.log('❌ Admin login failed:', adminLogin.status)
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message)
  }
  
  // Test 4: Token Refresh
  console.log('\n4. Testing Token Refresh...')
  try {
    const refreshResult = await makeRequest('/api/auth/refresh', 'POST', null, null, refreshCookie)
    
    if (refreshResult.status === 200) {
      console.log('✅ Token refresh successful')
      console.log('   New token received:', !!refreshResult.data.accessToken)
    } else {
      console.log('❌ Token refresh failed:', refreshResult.status)
    }
  } catch (error) {
    console.log('❌ Token refresh error:', error.message)
  }
  
  // Test 5: Invalid Credentials
  console.log('\n5. Testing Invalid Credentials...')
  try {
    const invalidLogin = await makeRequest('/api/auth/login', 'POST', {
      email: 'wrong@email.com',
      password: 'wrongpassword'
    })
    
    if (invalidLogin.status === 401) {
      console.log('✅ Invalid credentials properly rejected')
    } else {
      console.log('❌ Invalid credentials not properly handled:', invalidLogin.status)
    }
  } catch (error) {
    console.log('❌ Invalid credentials test error:', error.message)
  }
  
  // Test 6: Unauthorized Access
  console.log('\n6. Testing Unauthorized Access...')
  try {
    const unauthorizedResult = await makeRequest('/api/auth/me', 'GET', null, 'invalid-token')
    
    if (unauthorizedResult.status === 401) {
      console.log('✅ Unauthorized access properly blocked')
    } else {
      console.log('❌ Unauthorized access not properly handled:', unauthorizedResult.status)
    }
  } catch (error) {
    console.log('❌ Unauthorized access test error:', error.message)
  }
  
  console.log('\n🎯 Authentication Flow Testing Complete!')
}

testAuthFlow().catch(console.error)
