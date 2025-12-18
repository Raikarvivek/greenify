const fetch = globalThis.fetch || require('node-fetch')

async function testAdminActivities() {
  try {
    console.log('Testing admin activities API with cookie authentication...')
    
    // First, login as admin
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
      console.log('Admin login successful!')
      console.log('User:', loginData.user.name, '(' + loginData.user.email + ')')
      console.log('Role:', loginData.user.role)
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie')
      
      if (cookies) {
        // Parse cookies for the next request
        const cookieHeader = cookies.split(',').map(cookie => cookie.split(';')[0]).join('; ')
        
        // Test admin activities API
        console.log('\nTesting /api/admin/activities...')
        const activitiesResponse = await fetch('http://localhost:3001/api/admin/activities?status=pending', {
          headers: {
            'Cookie': cookieHeader
          }
        })
        
        console.log('Activities response status:', activitiesResponse.status)
        
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json()
          console.log('✅ Admin activities API working!')
          console.log(`Found ${activitiesData.activities.length} pending activities`)
          
          if (activitiesData.activities.length > 0) {
            console.log('\nFirst few activities:')
            activitiesData.activities.slice(0, 3).forEach((activity, index) => {
              console.log(`${index + 1}. ${activity.title} by ${activity.user.name}`)
              console.log(`   Status: ${activity.status}, Points: ${activity.pointsEarned}`)
            })
          }
          
          console.log('\nStats:', activitiesData.stats)
        } else {
          const errorData = await activitiesResponse.text()
          console.log('❌ Activities API failed:', errorData)
        }
      } else {
        console.log('❌ No cookies were set in login response')
      }
      
    } else {
      const errorData = await loginResponse.text()
      console.log('❌ Admin login failed:', errorData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testAdminActivities()
