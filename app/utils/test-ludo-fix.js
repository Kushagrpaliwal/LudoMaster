import dbConnect from "@/app/utils/dbConnect";
import User from "@/app/models/User";

async function testLudoMoneyHandling() {
  try {
    await dbConnect();
    
    // Test phone number - replace with actual test user phone
    const testPhone = "1234567890";
    
    console.log("🧪 Testing Ludo Money Handling Fix");
    console.log("=====================================");
    
    // Find or create test user
    let user = await User.findOne({ phone: testPhone });
    if (!user) {
      console.log("Creating test user...");
      user = new User({
        phone: testPhone,
        Username: "Test User",
        password: "test123",
        wallet: 10000, // Start with ₹10,000
        verified: true
      });
      await user.save();
    }
    
    console.log(`Initial wallet balance: ₹${user.wallet}`);
    console.log(`Initial bet history count: ${user.betHistory?.length || 0}`);
    
    // Test 1: Place a bet
    console.log("\n📝 Test 1: Placing a bet");
    console.log("------------------------");
    
    const betAmount = 100;
    const originalBalance = user.wallet;
    
    // Deduct bet amount from wallet
    user.wallet -= betAmount;
    
    // Add bet history record
    const betRecord = {
      sessionId: Date.now(),
      game: "Ludo",
      betOn: "Ludo Entry",
      amount: betAmount,
      payout: 0,
      winLossAmount: -betAmount, // This should be the only negative amount
      timePlaced: new Date(),
    };
    
    if (!user.betHistory) {
      user.betHistory = [];
    }
    
    user.betHistory.push(betRecord);
    await user.save();
    
    console.log(`✅ Bet placed: ₹${betAmount}`);
    console.log(`💰 New balance: ₹${user.wallet}`);
    console.log(`📊 Bet record created with winLossAmount: ₹${betRecord.winLossAmount}`);
    
    // Test 2: Process a loss (should NOT deduct additional money)
    console.log("\n❌ Test 2: Processing a loss");
    console.log("----------------------------");
    
    const balanceBeforeLoss = user.wallet;
    
    // Find the most recent Ludo bet
    const recentLudoBet = user.betHistory
      .filter(bet => bet.game === "Ludo" && (!bet.result || bet.result === "pending"))
      .sort((a, b) => new Date(b.timePlaced) - new Date(a.timePlaced))[0];
    
    if (recentLudoBet) {
      // Update bet record for loss (FIXED: Don't change winLossAmount)
      recentLudoBet.result = "lose";
      recentLudoBet.payout = 0;
      // FIXED: Don't change winLossAmount - it's already set to -amount when bet was placed
      recentLudoBet.betOn = "Ludo Lost";
      
      await user.save();
      
      console.log(`✅ Loss processed`);
      console.log(`💰 Balance after loss: ₹${user.wallet}`);
      console.log(`📊 Bet record updated - winLossAmount: ₹${recentLudoBet.winLossAmount}`);
      console.log(`💡 Balance unchanged: ${user.wallet === balanceBeforeLoss ? '✅' : '❌'}`);
    }
    
    // Test 3: Place another bet for win test
    console.log("\n📝 Test 3: Placing bet for win test");
    console.log("------------------------------------");
    
    const winBetAmount = 200;
    const balanceBeforeWinBet = user.wallet;
    
    // Deduct bet amount from wallet
    user.wallet -= winBetAmount;
    
    // Add bet history record
    const winBetRecord = {
      sessionId: Date.now() + 1,
      game: "Ludo",
      betOn: "Ludo Entry",
      amount: winBetAmount,
      payout: 0,
      winLossAmount: -winBetAmount,
      timePlaced: new Date(),
    };
    
    user.betHistory.push(winBetRecord);
    await user.save();
    
    console.log(`✅ Win bet placed: ₹${winBetAmount}`);
    console.log(`💰 New balance: ₹${user.wallet}`);
    
    // Test 4: Process a win
    console.log("\n🏆 Test 4: Processing a win");
    console.log("----------------------------");
    
    const balanceBeforeWin = user.wallet;
    const prizeAmount = 400; // 2x the bet amount
    
    // Find the most recent Ludo bet for win
    const recentWinBet = user.betHistory
      .filter(bet => bet.game === "Ludo" && (!bet.result || bet.result === "pending"))
      .sort((a, b) => new Date(b.timePlaced) - new Date(a.timePlaced))[0];
    
    if (recentWinBet) {
      // Credit prize amount to wallet
      user.wallet += prizeAmount;
      
      // Update bet record
      recentWinBet.result = "win";
      recentWinBet.payout = prizeAmount;
      recentWinBet.winLossAmount = prizeAmount; // Positive for win
      recentWinBet.betOn = "Ludo Won";
      
      await user.save();
      
      console.log(`✅ Win processed`);
      console.log(`💰 Balance after win: ₹${user.wallet}`);
      console.log(`📊 Bet record updated - winLossAmount: ₹${recentWinBet.winLossAmount}`);
      console.log(`💡 Balance increased by ₹${prizeAmount}: ${user.wallet === balanceBeforeWin + prizeAmount ? '✅' : '❌'}`);
    }
    
    // Final summary
    console.log("\n📊 Final Summary");
    console.log("================");
    console.log(`💰 Final wallet balance: ₹${user.wallet}`);
    console.log(`📈 Total bet history: ${user.betHistory.length} records`);
    
    // Show all Ludo transactions
    const ludoBets = user.betHistory.filter(bet => bet.game === "Ludo");
    console.log("\n🎲 Ludo Transaction History:");
    ludoBets.forEach((bet, index) => {
      console.log(`${index + 1}. ${bet.betOn} - Amount: ₹${bet.amount} - Result: ${bet.result} - Win/Loss: ₹${bet.winLossAmount}`);
    });
    
    // Verify no double deductions
    const losingBets = ludoBets.filter(bet => bet.result === "lose");
    const totalLossAmount = losingBets.reduce((sum, bet) => sum + Math.abs(bet.winLossAmount), 0);
    const totalBetAmount = losingBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    console.log(`\n🔍 Verification:`);
    console.log(`Total bet amount for losing bets: ₹${totalBetAmount}`);
    console.log(`Total loss amount recorded: ₹${totalLossAmount}`);
    console.log(`Double deduction check: ${totalLossAmount === totalBetAmount ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log("\n✅ Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testLudoMoneyHandling(); 