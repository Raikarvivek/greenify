const fetch = globalThis.fetch || require('node-fetch')

async function testCookieAuth() {
  try {
    console.log('Testing cookie-based authentication...')
    
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
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie')
      console.log('Cookies set:', cookies ? 'Yes' : 'No')
      
      if (cookies) {
        // Parse cookies for the next request
        const cookieHeader = cookies.split(',').map(cookie => cookie.split(';')[0]).join('; ')
        console.log('Cookie header for next request:', cookieHeader.substring(0, 100) + '...')
        
        // Test /api/auth/me with cookies
        console.log('\nTesting /api/auth/me with cookies...')
        const meResponse = await fetch('http://localhost:3001/api/auth/me', {
          headers: {
            'Cookie': cookieHeader
          }
        })
        
        console.log('Me response status:', meResponse.status)
        
        if (meResponse.ok) {
          const meData = await meResponse.json()
          console.log('Me endpoint successful!')
          console.log('User data:', meData.name, '(' + meData.email + ')')
          console.log('✅ Cookie-based authentication working!')
        } else {
          const errorData = await meResponse.text()
          console.log('❌ Me endpoint failed:', errorData)
        }
      } else {
        console.log('❌ No cookies were set in login response')
      }
      
    } else {
      const errorData = await loginResponse.text()
      console.log('❌ Login failed:', errorData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testCookieAuth()
