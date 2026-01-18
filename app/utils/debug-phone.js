// Debug utility to check and fix phone number storage issues
// Run this in browser console to debug localStorage phone issues

const debugPhone = () => {
  console.log('🔍 Debugging phone number storage...');
  
  // Check all possible localStorage keys
  const possibleKeys = [
    'phone',
    'userPhone', 
    'user_phone',
    'phoneNumber',
    'user_phoneNumber',
    'loginPhone',
    'currentUserPhone'
  ];
  
  console.log('\n📱 Checking localStorage for phone numbers:');
  possibleKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  });
  
  // Check all localStorage keys that might contain phone
  console.log('\n🔍 All localStorage keys containing "phone":');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.toLowerCase().includes('phone')) {
      console.log(`${key}: ${localStorage.getItem(key)}`);
    }
  }
  
  // Show all localStorage contents
  console.log('\n📦 All localStorage contents:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
  
  return {
    possiblePhones: possibleKeys.map(key => ({
      key,
      value: localStorage.getItem(key)
    })).filter(item => item.value),
    allKeys: Array.from({length: localStorage.length}, (_, i) => localStorage.key(i))
  };
};

const setTestPhone = (phone = '1234567890') => {
  console.log(`📱 Setting test phone number: ${phone}`);
  
  // Set phone in multiple possible keys
  localStorage.setItem('phone', phone);
  localStorage.setItem('userPhone', phone);
  localStorage.setItem('user_phone', phone);
  
  console.log('✅ Phone number set in localStorage');
  
  // Test the API call
  testPhoneAPI(phone);
};

const testPhoneAPI = async (phone) => {
  if (!phone) {
    const storedPhone = 
      localStorage.getItem("userPhone") ||
      localStorage.getItem("phone") ||
      localStorage.getItem("user_phone");
    phone = storedPhone;
  }
  
  if (!phone) {
    console.log('❌ No phone number found to test');
    return;
  }
  
  console.log(`🧪 Testing API with phone: ${phone}`);
  
  try {
    const response = await fetch(`/api/getUsers?phone=${phone}`);
    const data = await response.json();
    
    console.log('📡 API Response:', data);
    console.log('📊 Response Status:', response.status);
    
    if (data.success === false && data.debug) {
      console.log('🔍 Debug info from API:', data.debug);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API call failed:', error);
  }
};

const createTestUser = async (phone = '1234567890') => {
  console.log(`👤 Creating test user with phone: ${phone}`);
  
  try {
    // This would need a create user API endpoint
    const response = await fetch('/api/create-test-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        Username: 'Test User',
        password: 'test123',
        wallet: 1000, // Start with some balance
      }),
    });
    
    const data = await response.json();
    console.log('👤 Create user response:', data);
    
    if (data.success) {
      // Set the phone in localStorage
      setTestPhone(phone);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Failed to create test user:', error);
  }
};

// Auto-run debug when script loads
if (typeof window !== 'undefined') {
  console.log('🚀 Phone Debug Script Loaded');
  console.log('📞 Available functions:');
  console.log('  - debugPhone() - Check phone storage');
  console.log('  - setTestPhone("1234567890") - Set test phone');
  console.log('  - testPhoneAPI("1234567890") - Test API call');
  console.log('  - createTestUser("1234567890") - Create test user');
  
  // Make functions globally available
  window.debugPhone = debugPhone;
  window.setTestPhone = setTestPhone;
  window.testPhoneAPI = testPhoneAPI;
  window.createTestUser = createTestUser;
  
  // Auto-run debug
  setTimeout(() => {
    console.log('\n🔍 Auto-running phone debug...');
    debugPhone();
  }, 1000);
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debugPhone, setTestPhone, testPhoneAPI, createTestUser };
}