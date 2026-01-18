// Simple test to add UPI IDs using the existing UPI API
// This bypasses the admin creation and uses the direct UPI API

const testAddUPISimple = async () => {
  try {
    console.log('🧪 Testing UPI API directly...');
    
    // First, let's test if we can fetch existing UPI IDs
    const fetchResponse = await fetch('/api/upi');
    const fetchResult = await fetchResponse.json();
    console.log('📋 Current UPI IDs:', fetchResult);
    
    // Now try to add a UPI ID using the UPI API directly
    const addResponse = await fetch('/api/upi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminPhone: "9999999999",
        upiId: "test@paytm",
        name: "Test Paytm Wallet",
        description: "Test UPI ID"
      }),
    });

    const addResult = await addResponse.json();
    console.log('➕ Add UPI Result:', addResult);
    
    if (addResult.success) {
      console.log('✅ SUCCESS: UPI ID added via direct API!');
      
      // Fetch again to confirm
      const confirmResponse = await fetch('/api/upi');
      const confirmResult = await confirmResponse.json();
      console.log('✅ Confirmed UPI IDs:', confirmResult);
      
      alert('✅ UPI ID added successfully! Check /my/recharge page.');
    } else {
      console.error('❌ Failed to add UPI:', addResult.error);
      alert('❌ Error: ' + addResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error);
    alert('❌ Test Error: ' + error.message);
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.testAddUPISimple = testAddUPISimple;
  console.log('🧪 Simple UPI Test Loaded. Run: testAddUPISimple()');
}