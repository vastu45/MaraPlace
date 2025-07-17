// Simple test script to test the PATCH endpoint
const testDefaultMeetingDuration = async () => {
  try {
    console.log('Testing PATCH /api/agents/me with defaultMeetingDuration...');
    
    // Create form data with defaultMeetingDuration
    const formData = new FormData();
    formData.append('defaultMeetingDuration', '45');
    
    const response = await fetch('http://localhost:3000/api/agents/me', {
      method: 'PATCH',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response:', data);
    } else {
      const error = await response.text();
      console.log('Error response:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testDefaultMeetingDuration(); 