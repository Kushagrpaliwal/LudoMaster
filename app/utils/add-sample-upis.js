// Quick script to add sample UPI IDs to your database using the new AdminUPI model
// Run this in browser console on your website

const addSampleUPIs = async () => {
  const sampleData = {
    adminPhone: "9999999999", // This will create an admin user
    upiIds: [
      {
        upiId: "k@paytm",
        name: "kushagra",
        description: "Primary payment method - Paytm"
      },
      {
        upiId: "admin@phonepe",
        name: "PhonePe Wallet", 
        description: "Secondary payment method - PhonePe"
      },
      {
        upiId: "admin@googlepay",
        name: "Google Pay",
        description: "Google Pay UPI ID"
      },
      {
        upiId: "9876543210@ybl",
        name: "Bank UPI",
        description: "Direct bank UPI ID"
      },
      {
        upiId: "admin@amazonpay",
        name: "Amazon Pay",
        description: "Amazon Pay UPI ID"
      }
    ]
  };

  try {
    console.log('Adding UPI IDs...');
    
    const response = await fetch('/api/admin/add-upi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleData),
    });

    const result = await response.json();
    console.log('UPI Setup Result:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS: UPI IDs added successfully!');
      console.log(`📱 Admin Phone: ${sampleData.adminPhone}`);
      console.log(`💳 Total UPIs: ${result.data?.totalUPIs || sampleData.upiIds.length}`);
      
      // Test fetching UPI IDs
      const fetchResponse = await fetch('/api/upi');
      const fetchResult = await fetchResponse.json();
      console.log('📋 Available UPI IDs:', fetchResult);
      
      alert('✅ UPI IDs added successfully! Check console for details.');
    } else {
      console.error('❌ ERROR:', result.error);
      alert('❌ Error: ' + result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Network Error:', error);
    alert('❌ Network Error: ' + error.message);
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addSampleUPIs };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 UPI Setup Script Loaded');
  console.log('📞 Run addSampleUPIs() to add sample UPI IDs');
}

// Make function globally available in browser
if (typeof window !== 'undefined') {
  window.addSampleUPIs = addSampleUPIs;
}