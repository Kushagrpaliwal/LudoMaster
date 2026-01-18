import dbConnect from './dbConnect';
import User from '../models/User';
import AdminUPI from '../models/AdminUPI';

/**
 * Migration utility to move admin UPIs from User model to AdminUPI model
 * This should be run once to migrate existing data
 */
export async function migrateAdminUPIs() {
  try {
    await dbConnect();
    
    console.log('Starting migration of admin UPIs...');
    
    // Find all users with adminUPIs (this field might still exist in database)
    const usersWithUPIs = await User.find({ 
      adminUPIs: { $exists: true, $ne: [] },
      role: 'admin'
    });
    
    if (usersWithUPIs.length === 0) {
      console.log('No admin UPIs found to migrate.');
      return { success: true, message: 'No data to migrate' };
    }
    
    let totalMigrated = 0;
    let totalSkipped = 0;
    
    for (const user of usersWithUPIs) {
      console.log(`Migrating UPIs for admin: ${user.phone}`);
      
      for (const upi of user.adminUPIs) {
        try {
          // Check if UPI already exists in AdminUPI collection
          const existingUPI = await AdminUPI.findOne({ upiId: upi.upiId });
          
          if (!existingUPI) {
            await AdminUPI.create({
              upiId: upi.upiId,
              name: upi.name,
              description: upi.description || '',
              qrCode: upi.qrCode || '',
              isActive: upi.isActive !== undefined ? upi.isActive : true,
              createdBy: user.phone,
              createdAt: upi.createdAt || new Date(),
            });
            totalMigrated++;
            console.log(`✓ Migrated UPI: ${upi.upiId}`);
          } else {
            totalSkipped++;
            console.log(`- Skipped existing UPI: ${upi.upiId}`);
          }
        } catch (error) {
          console.error(`Error migrating UPI ${upi.upiId}:`, error);
          totalSkipped++;
        }
      }
      
      // Remove adminUPIs field from user document
      await User.updateOne(
        { _id: user._id },
        { $unset: { adminUPIs: 1 } }
      );
      console.log(`✓ Cleaned up adminUPIs field for user: ${user.phone}`);
    }
    
    console.log(`Migration completed:`);
    console.log(`- Total migrated: ${totalMigrated}`);
    console.log(`- Total skipped: ${totalSkipped}`);
    
    return {
      success: true,
      message: 'Migration completed successfully',
      data: {
        totalMigrated,
        totalSkipped,
        usersProcessed: usersWithUPIs.length
      }
    };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: 'Migration failed',
      details: error.message
    };
  }
}

/**
 * Utility to verify the migration was successful
 */
export async function verifyMigration() {
  try {
    await dbConnect();
    
    // Count UPIs in AdminUPI collection
    const adminUPICount = await AdminUPI.countDocuments();
    
    // Check if any users still have adminUPIs field
    const usersWithUPIs = await User.countDocuments({ 
      adminUPIs: { $exists: true, $ne: [] }
    });
    
    // Get sample of migrated UPIs
    const sampleUPIs = await AdminUPI.find().limit(5).select('upiId name createdBy');
    
    return {
      success: true,
      data: {
        adminUPICount,
        usersWithOldUPIs: usersWithUPIs,
        sampleUPIs,
        migrationComplete: usersWithUPIs === 0
      }
    };
    
  } catch (error) {
    console.error('Verification failed:', error);
    return {
      success: false,
      error: 'Verification failed',
      details: error.message
    };
  }
}