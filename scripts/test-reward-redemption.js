const fetch = globalThis.fetch || require('node-fetch')

async function testRewardRedemption() {
  try {
    console.log('Testing reward redemption with cookie authentication...')
    
    // First, login as a regular user
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@test.com',
        password: 'password123'
      }),
    })

    console.log('Login response status:', loginResponse.status)
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('User login successful!')
      console.log('User:', loginData.user.name, '(' + loginData.user.email + ')')
      console.log('Points:', loginData.user.points)
      
      // Extract cookies from response
      const cookies = loginResponse.headers.get('set-cookie')
      
      if (cookies) {
        // Parse cookies for the next request
        const cookieHeader = cookies.split(',').map(cookie => cookie.split(';')[0]).join('; ')
        
        // Test rewards API
        console.log('\nTesting /api/rewards...')
        const rewardsResponse = await fetch('http://localhost:3001/api/rewards', {
          headers: {
            'Cookie': cookieHeader
          }
        })
        
        console.log('Rewards response status:', rewardsResponse.status)
        
        if (rewardsResponse.ok) {
          const rewardsData = await rewardsResponse.json()
          console.log(`✅ Found ${rewardsData.rewards.length} rewards`)
          
          if (rewardsData.rewards.length > 0) {
            // Try to redeem the cheapest reward
            const cheapestReward = rewardsData.rewards.reduce((min, reward) => 
              reward.pointsCost < min.pointsCost ? reward : min
            )
            
            console.log(`\nTrying to redeem: ${cheapestReward.title} (${cheapestReward.pointsCost} points)`)
            
            if (loginData.user.points >= cheapestReward.pointsCost) {
              const redeemResponse = await fetch('http://localhost:3001/api/rewards/redeem', {
                method: 'POST',
                headers: {
                  'Cookie': cookieHeader,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rewardId: cheapestReward._id })
              })
              
              console.log('Redeem response status:', redeemResponse.status)
              
              if (redeemResponse.ok) {
                const redeemData = await redeemResponse.json()
                console.log('✅ Reward redeemed successfully!')
                console.log('Voucher code:', redeemData.voucher.voucherCode)
                console.log('Remaining points:', redeemData.userPoints)
              } else {
                const errorData = await redeemResponse.text()
                console.log('❌ Redemption failed:', errorData)
              }
            } else {
              console.log('❌ User does not have enough points for redemption')
              console.log(`User has ${loginData.user.points} points, needs ${cheapestReward.pointsCost}`)
            }
          }
        } else {
          const errorData = await rewardsResponse.text()
          console.log('❌ Rewards API failed:', errorData)
        }
      } else {
        console.log('❌ No cookies were set in login response')
      }
      
    } else {
      const errorData = await loginResponse.text()
      console.log('❌ User login failed:', errorData)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testRewardRedemption()
