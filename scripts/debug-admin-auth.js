const http = require('http')

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) }),
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    }

    console.log(`Making ${method} request to ${path}`)
    if (token) console.log(`Using token: ${token.substring(0, 20)}...`)

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

async function debugAdminAuth() {
  console.log('🔍 Debugging Admin Authentication Issue...\n')
  
  // Step 1: Admin Login
  console.log('1. Testing Admin Login...')
  try {
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin@greenify.com',
      password: 'GreenifyAdmin2024!'
    })
    
    console.log('Login Status:', loginResult.status)
    console.log('Login Response:', JSON.stringify(loginResult.data, null, 2))
    
    if (loginResult.status !== 200) {
      console.log('❌ Admin login failed')
      return
    }
    
    const accessToken = loginResult.data.accessToken
    const user = loginResult.data.user
    
    console.log('✅ Admin login successful')
    console.log('User:', user.name, `(${user.role})`)
    console.log('Access Token Length:', accessToken ? accessToken.length : 'MISSING')
    console.log('Token Preview:', accessToken ? accessToken.substring(0, 50) + '...' : 'NONE')
    
    // Step 2: Test /api/auth/me with token
    console.log('\n2. Testing /api/auth/me with token...')
    
    const meResult = await makeRequest('/api/auth/me', 'GET', null, accessToken)
    
    console.log('Me API Status:', meResult.status)
    console.log('Me API Response:', JSON.stringify(meResult.data, null, 2))
    
    if (meResult.status === 200) {
      console.log('✅ /api/auth/me working correctly')
    } else {
      console.log('❌ /api/auth/me failed - this is the issue!')
    }
    
    // Step 3: Test admin-specific endpoint
    console.log('\n3. Testing admin endpoint access...')
    
    const adminResult = await makeRequest('/api/admin/activities', 'GET', null, accessToken)
    
    console.log('Admin API Status:', adminResult.status)
    
    if (adminResult.status === 200) {
      console.log('✅ Admin endpoints accessible')
    } else {
      console.log('❌ Admin endpoints not accessible')
    }
    
  } catch (error) {
    console.log('❌ Debug error:', error.message)
  }
  
  console.log('\n🎯 Debug Summary:')
  console.log('- If login succeeds but /api/auth/me fails, the issue is token validation')
  console.log('- If admin endpoints fail, the issue is role checking')
  console.log('- Check server logs for additional error details')
}

debugAdminAuth().catch(console.error)
