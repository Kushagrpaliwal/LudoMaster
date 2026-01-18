// Test utility to create sample withdrawal data and debug withdrawal issues
// Run this in browser console or as a Node.js script

const testWithdrawal = async () => {
  try {
    console.log('🧪 Testing withdrawal functionality...');
    
    // Test phone number (change this to your actual phone number)
    const testPhone = localStorage.getItem("phone") || localStorage.getItem("userPhone") || "1234567890";
    console.log('📱 Using phone:', testPhone);
    
    // Step 1: Check current user data
    console.log('\n1️⃣ Checking current user data...');
    const userResponse = await fetch(`/api/getUsers?phone=${testPhone}`);
    const userData = await userResponse.json();
    console.log('👤 User data:', userData);
    
    // Step 2: Check current transactions
    console.log('\n2️⃣ Checking current transactions...');
    const transResponse = await fetch(`/api/transactions?phone=${testPhone}`);
    const transData = await transResponse.json();
    console.log('💳 Transaction data:', transData);
    
    if (transData.success) {
      console.log('📊 Stats:', transData.data.stats);
      console.log('🔍 Debug info:', transData.data.stats.debug);
      console.log('💸 Withdrawal transactions:', 
        transData.data.transactions.filter(t => t.type === 'withdrawal')
      );
    }
    
    // Step 3: Create a test withdrawal (if user has balance)
    if (userData.wallet && userData.wallet > 100) {
      console.log('\n3️⃣ Creating test withdrawal...');
      const withdrawalResponse = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: testPhone,
          amount: 50,
          accountDetails: 'test@paytm',
          accountType: 'UPI',
        }),
      });
      
      const withdrawalResult = await withdrawalResponse.json();
      console.log('💰 Withdrawal result:', withdrawalResult);
      
      if (withdrawalResult.success) {
        // Step 4: Check transactions again after withdrawal
        console.log('\n4️⃣ Checking transactions after withdrawal...');
        const newTransResponse = await fetch(`/api/transactions?phone=${testPhone}`);
        const newTransData = await newTransResponse.json();
        
        if (newTransData.success) {
          console.log('📊 Updated stats:', newTransData.data.stats);
          console.log('🔍 Updated debug info:', newTransData.data.stats.debug);
          console.log('💸 All withdrawal transactions:', 
            newTransData.data.transactions.filter(t => t.type === 'withdrawal')
          );
        }
      }
    } else {
      console.log('\n⚠️ User has insufficient balance for test withdrawal');
      console.log('💰 Current balance:', userData.wallet);
    }
    
    // Step 5: Test admin withdrawal status update (if there are pending withdrawals)
    const pendingWithdrawals = transData.success ? 
      transData.data.transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending') : [];
    
    if (pendingWithdrawals.length > 0) {
      console.log('\n5️⃣ Found pending withdrawals, testing admin update...');
      const testWithdrawal = pendingWithdrawals[0];
      
      const adminResponse = await fetch('/api/admin/withdraw', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPhone: '9999999999', // Default admin phone
          userPhone: testPhone,
          transactionId: testWithdrawal.id,
          status: 'completed',
          adminNotes: 'Test completion by debug script',
        }),
      });
      
      const adminResult = await adminResponse.json();
      console.log('👨‍💼 Admin update result:', adminResult);
      
      if (adminResult.success) {
        // Check final stats
        console.log('\n6️⃣ Final check after admin completion...');
        const finalTransResponse = await fetch(`/api/transactions?phone=${testPhone}`);
        const finalTransData = await finalTransResponse.json();
        
        if (finalTransData.success) {
          console.log('📊 Final stats:', finalTransData.data.stats);
          console.log('✅ Total withdrawn should now show:', finalTransData.data.stats.totalWithdrawal);
        }
      }
    } else {
      console.log('\n5️⃣ No pending withdrawals found for admin testing');
    }
    
    console.log('\n✅ Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 Withdrawal Test Script Loaded');
  console.log('📞 Run testWithdrawal() to test withdrawal functionality');
  window.testWithdrawal = testWithdrawal;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testWithdrawal };
}