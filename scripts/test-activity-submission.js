// Use built-in fetch (Node.js 18+) or install node-fetch
const fetch = globalThis.fetch || require('node-fetch');

async function testActivitySubmission() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Activity Submission Authentication...\n');
  
  try {
    // Step 1: Login to get cookies
    console.log('1. Logging in as test user...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@test.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData.user.name);
    
    // Extract cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies received:', cookies ? 'Yes' : 'No');
    
    // Step 2: Test activity submission with cookies
    console.log('\n2. Testing activity submission...');
    
    const activityData = {
      type: 'recycling',
      title: 'Test Recycling Activity',
      description: 'Testing recycling submission with authentication',
      quantity: 5,
      unit: 'bottles',
      verificationMedia: [
        {
          type: 'image',
          url: 'test-image-url',
          filename: 'recycling-photo.jpg'
        }
      ],
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 10,
        address: 'New York, NY, USA',
        timestamp: Date.now()
      }
    };
    
    const activityResponse = await fetch(`${baseUrl}/api/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify(activityData)
    });
    
    const activityResult = await activityResponse.text();
    
    if (activityResponse.ok) {
      console.log('✅ Activity submission successful!');
      console.log('📊 Response:', JSON.parse(activityResult));
    } else {
      console.error('❌ Activity submission failed:', activityResponse.status);
      console.error('📄 Error details:', activityResult);
    }
    
    // Step 3: Test getting activities
    console.log('\n3. Testing activity retrieval...');
    
    const getActivitiesResponse = await fetch(`${baseUrl}/api/activities`, {
      method: 'GET',
      headers: {
        'Cookie': cookies || ''
      }
    });
    
    if (getActivitiesResponse.ok) {
      const activitiesData = await getActivitiesResponse.json();
      console.log('✅ Activities retrieved successfully!');
      console.log('📋 Total activities:', activitiesData.activities.length);
    } else {
      console.error('❌ Failed to retrieve activities:', getActivitiesResponse.status);
    }
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
  }
}

// Run the test
testActivitySubmission();
