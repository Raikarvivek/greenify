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

async function testRewardsAPI() {
  console.log('🎁 Testing Rewards API...\n')
  
  // Step 1: Login as user to get token
  console.log('1. Logging in as user...')
  try {
    const loginResult = await makeRequest('/api/auth/login', 'POST', {
      email: 'user@test.com',
      password: 'password123'
    })
    
    if (loginResult.status !== 200) {
      console.log('❌ Login failed:', loginResult.status)
      return
    }
    
    const token = loginResult.data.accessToken
    console.log('✅ Login successful')
    
    // Step 2: Test rewards API
    console.log('\n2. Testing /api/rewards...')
    const rewardsResult = await makeRequest('/api/rewards', 'GET', null, token)
    
    console.log('Status:', rewardsResult.status)
    
    if (rewardsResult.status === 200) {
      console.log('✅ Rewards API working')
      console.log('Rewards found:', rewardsResult.data.rewards?.length || 0)
      console.log('Total rewards:', rewardsResult.data.pagination?.total || 0)
      
      if (rewardsResult.data.rewards && rewardsResult.data.rewards.length > 0) {
        console.log('\nSample rewards:')
        rewardsResult.data.rewards.slice(0, 3).forEach((reward, index) => {
          console.log(`${index + 1}. ${reward.title} - ${reward.pointsCost} points`)
        })
      } else {
        console.log('⚠️  No rewards found in database')
      }
    } else {
      console.log('❌ Rewards API failed')
      console.log('Response:', JSON.stringify(rewardsResult.data, null, 2))
    }
    
    // Step 3: Test with different parameters
    console.log('\n3. Testing rewards with pagination...')
    const paginatedResult = await makeRequest('/api/rewards?page=1&limit=5', 'GET', null, token)
    
    if (paginatedResult.status === 200) {
      console.log('✅ Paginated rewards working')
      console.log('Page 1 rewards:', paginatedResult.data.rewards?.length || 0)
    }
    
  } catch (error) {
    console.log('❌ Test error:', error.message)
  }
}

testRewardsAPI().catch(console.error)
