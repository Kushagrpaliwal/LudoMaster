// Test script to verify rummy transactions are properly recorded
// Run this in the browser console after playing a rummy game

async function testRummyTransaction() {
  try {
    // Get user phone from localStorage
    const userPhone = localStorage.getItem("phone") || localStorage.getItem("userPhone");
    if (!userPhone) {
      console.error("No phone number found in localStorage");
      return;
    }
    
    console.log("Testing transactions for phone:", userPhone);
    
    // Fetch transactions
    const response = await fetch(`/api/transactions?phone=${userPhone}`);
    const data = await response.json();
    
    if (data.success) {
      console.log("Transactions API response:");
      console.log("Total transactions:", data.data.transactions.length);
      
      const betTransactions = data.data.transactions.filter(t => t.type === 'bet');
      console.log("Bet transactions:", betTransactions.length);
      
      const rummyTransactions = betTransactions.filter(t => t.game === 'Rummy');
      console.log("Rummy transactions:", rummyTransactions.length);
      
      console.log("All rummy transactions:", rummyTransactions);
      
      // Check for recent rummy transactions
      const recentRummy = rummyTransactions.slice(-5);
      console.log("Recent rummy transactions:", recentRummy);
      
      // Check stats
      console.log("Stats:", data.data.stats);
      
    } else {
      console.error("Transactions API error:", data.error);
    }
    
  } catch (error) {
    console.error("Test error:", error);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testRummyTransaction = testRummyTransaction;
}

export default testRummyTransaction; 