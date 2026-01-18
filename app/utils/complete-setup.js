// Complete setup script to fix phone issues and test withdrawal functionality
// Run this in browser console to set up everything

const completeSetup = async () => {
  console.log('🚀 Starting complete setup...');
  
  try {
    // Step 1: Set up phone number
    console.log('\n1️⃣ Setting up phone number...');
    const testPhone = '1234567890';
    localStorage.setItem('phone', testPhone);
    localStorage.setItem('userPhone', testPhone);
    localStorage.setItem('user_phone', testPhone);
    console.log('✅ Phone number set in localStorage:', testPhone);
    
    // Step 2: Create/verify test user
    console.log('\n2️⃣ Creating test user...');
    const userResponse = await fetch('/api/create-test-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhone,
        Username: 'Test User',
        password: 'test123',
        wallet: 2000, // Give enough balance for testing
      }),
    });
    const userData = await userResponse.json();
    console.log('👤 User setup result:', userData);
    
    // Step 3: Test getUsers API
    console.log('\n3️⃣ Testing getUsers API...');
    const getUserResponse = await fetch(`/api/getUsers?phone=${testPhone}`);
    const getUserData = await getUserResponse.json();
    console.log('📡 getUsers API result:', getUserData);
    
    if (getUserResponse.status === 400) {
      console.log('❌ getUsers API still failing - check the debug info above');
      return;
    }
    
    // Step 4: Add sample UPIs for recharge testing
    console.log('\n4️⃣ Setting up admin UPIs...');
    const upiResponse = await fetch('/api/admin/add-upi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminPhone: '9999999999',
        upiIds: [
          {
            upiId: 'k@paytm',
            name: 'kushagra',
            description: 'Primary payment method',
          },
          {
            upiId: 'test@phonepe',
            name: 'Test PhonePe',
            description: 'Test payment method',
          },
        ],
      }),
    });
    const upiData = await upiResponse.json();
    console.log('💳 UPI setup result:', upiData);
    
    // Step 5: Create a test withdrawal
    console.log('\n5️⃣ Creating test withdrawal...');
    const withdrawalResponse = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhone,
        amount: 500,
        accountDetails: 'test@paytm',
        accountType: 'UPI',
      }),
    });
    const withdrawalData = await withdrawalResponse.json();
    console.log('💰 Withdrawal creation result:', withdrawalData);
    
    // Step 6: Complete the withdrawal (simulate admin approval)
    if (withdrawalData.success) {
      console.log('\n6️⃣ Completing withdrawal (admin approval)...');
      const adminResponse = await fetch('/api/admin/withdraw', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPhone: '9999999999',
          userPhone: testPhone,
          transactionId: withdrawalData.data.transactionId,
          status: 'completed',
          adminNotes: 'Test completion by setup script',
        }),
      });
      const adminData = await adminResponse.json();
      console.log('👨‍💼 Admin approval result:', adminData);
    }
    
    // Step 7: Test transactions API
    console.log('\n7️⃣ Testing transactions API...');
    const transResponse = await fetch(`/api/transactions?phone=${testPhone}`);
    const transData = await transResponse.json();
    console.log('📊 Transactions API result:', transData);
    
    if (transData.success) {
      console.log('📈 Final stats:', transData.data.stats);
      console.log('💸 Total withdrawn:', transData.data.stats.totalWithdrawal);
      
      if (transData.data.stats.totalWithdrawal > 0) {
        console.log('✅ SUCCESS: Total withdrawn is now showing!');
      } else {
        console.log('⚠️ Total withdrawn still showing 0 - check debug info:');
        console.log('🔍 Debug info:', transData.data.stats.debug);
      }
    }
    
    // Step 8: Final instructions
    console.log('\n8️⃣ Setup complete! Next steps:');
    console.log('📱 Visit /my/transactions to see your transaction history');
    console.log('💰 Visit /my/withdraw to test withdrawal functionality');
    console.log('👨‍💼 Visit /admin/withdraw to manage withdrawals');
    console.log('📊 Your test phone number is:', testPhone);
    console.log('💳 Your test wallet balance should be around 1500 (2000 - 500 withdrawal)');
    
    return {
      success: true,
      testPhone,
      message: 'Complete setup finished successfully'
    };
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Complete Setup Script Loaded');
  console.log('📞 Run completeSetup() to set up everything');
  window.completeSetup = completeSetup;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { completeSetup };
}