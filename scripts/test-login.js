// Use Node.js built-in fetch (Node 18+)
const fetch = globalThis.fetch || require('node-fetch')

async function testLogin() {
  try {
    console.log('Testing admin login...')
    
    // Test login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@greenify.com',
        password: 'GreenifyAdmin2024!'
      }),
    })

    console.log('Login response status:', loginResponse.status)
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('Login successful!')
      console.log('User:', loginData.user.name, '(' + loginData.user.email + ')')
      console.log('Role:', loginData.user.role)
      console.log('Access token length:', loginData.accessToken.length)
      console.log('Access token starts with:', loginData.accessToken.substring(0, 20) + '...')
      
      // Test /api/auth/me with the token
      console.log('\nTesting /api/auth/me...')
      const meResponse = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      })
      
      console.log('Me response status:', meResponse.status)
      
      if (meResponse.ok) {
        const meData = await meResponse.json()
        console.log('Me endpoint successful!')
        console.log('User data:', meData.name, '(' + meData.email + ')')
      } else {
        const errorData = await meResponse.text()
        console.log('Me endpoint failed:', errorData)
      }
      
    } else {
      const errorData = await loginResponse.text()
      console.log('Login failed:', errorData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testLogin()
