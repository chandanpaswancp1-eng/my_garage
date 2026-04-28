/**
 * Utility functions for financial calculations across the Garage Management System.
 */

export const VAT_RATE = 0.13;

/**
 * Calculates the total amount after adding VAT.
 */
export const calculateTotalWithVAT = (subtotal: number, isVAT: boolean = true): number => {
  if (!isVAT) return subtotal;
  return subtotal * (1 + VAT_RATE);
};

/**
 * Calculates just the VAT amount for a given subtotal.
 */
export const calculateVATAmount = (subtotal: number, isVAT: boolean = true): number => {
  if (!isVAT) return 0;
  return subtotal * VAT_RATE;
};

/**
 * Formats a number into Nepalese Rupee (NPR) display string.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculates work duration in hours and minutes between two time strings (HH:MM).
 */
export const calculateWorkDuration = (checkIn: string, checkOut?: string): string => {
  if (!checkIn || !checkOut) return 'N/A';
  
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  
  let diffInMinutes = (outH * 60 + outM) - (inH * 60 + inM);
  
  // Handle night shifts if necessary (though usually not for a garage)
  if (diffInMinutes < 0) diffInMinutes += 24 * 60;
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  
  return `${hours}h ${minutes}m`;
};
