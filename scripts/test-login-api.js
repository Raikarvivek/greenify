const fetch = require('node-fetch')

async function testLoginAPI() {
  const baseUrl = 'http://localhost:3000'
  
  const testUsers = [
    { email: 'admin@greenify.com', password: 'GreenifyAdmin2024!', role: 'admin' },
    { email: 'user@test.com', password: 'password123', role: 'user' }
  ]

  console.log('🧪 Testing Login API...\n')

  for (const testUser of testUsers) {
    console.log(`Testing ${testUser.role.toUpperCase()} login:`)
    console.log(`Email: ${testUser.email}`)
    console.log(`Password: ${testUser.password}`)
    
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      })

      console.log(`Response Status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Login successful!')
        console.log('User data:', {
          id: data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role
        })
        console.log('Access token received:', data.accessToken ? 'Yes' : 'No')
      } else {
        const errorData = await response.json()
        console.log('❌ Login failed!')
        console.log('Error:', errorData)
      }
    } catch (error) {
      console.log('❌ Request failed!')
      console.log('Error:', error.message)
    }
    
    console.log('─'.repeat(50))
  }
}

testLoginAPI().catch(console.error)
