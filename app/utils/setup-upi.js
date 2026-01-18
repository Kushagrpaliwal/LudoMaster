// Sample script to add UPI IDs to your database
// You can run this by calling the API endpoint

const sampleUPIIds = [
  {
    upiId: "admin@paytm",
    name: "Paytm Wallet",
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
];

// Function to add UPI IDs via API call
export const setupUPIIds = async (adminPhone = "9999999999") => {
  try {
    const response = await fetch('/api/admin/add-upi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminPhone: adminPhone,
        upiIds: sampleUPIIds,
      }),
    });

    const data = await response.json();
    console.log('UPI Setup Result:', data);
    return data;
  } catch (error) {
    console.error('Error setting up UPI IDs:', error);
    return { success: false, error: error.message };
  }
};

// You can also use this data directly in your API calls
export { sampleUPIIds };