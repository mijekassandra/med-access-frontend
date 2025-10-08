/**
 * Date utility functions for form handling
 */

/**
 * Formats a Date object to DD/MM/YYYY string for display
 * @param date - Date object to format
 * @returns Formatted date string (DD/MM/YYYY) or empty string if invalid
 */
export const formatDateForDisplay = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "";
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return "";
  }
};

/**
 * Parses DD/MM/YYYY string to Date object
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export const parseDateFromDisplay = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === "") return null;
  
  try {
    // Remove any whitespace
    const cleanString = dateString.trim();
    
    // Check if it matches DD/MM/YYYY format
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = cleanString.match(dateRegex);
    
    if (!match) return null;
    
    const [, day, month, year] = match;
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Validate date components
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900) {
      return null;
    }
    
    // Create date object (month is 0-indexed in Date constructor)
    const date = new Date(yearNum, monthNum - 1, dayNum);
    
    // Check if the date is valid (handles cases like 31/02/2024)
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Formats a Date object to YYYY-MM-DD string for HTML date input
 * @param date - Date object to format
 * @returns Formatted date string (YYYY-MM-DD) or empty string if invalid
 */
export const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "";
    
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return "";
  }
};

/**
 * Parses YYYY-MM-DD string (from HTML date input) to Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object or null if invalid
 */
export const parseDateFromInput = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === "") return null;
  
  try {
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    
    return date;
  } catch (error) {
    console.error('Error parsing date from input:', error);
    return null;
  }
};

/**
 * Checks if a date is in the future (after today)
 * @param date - Date to check
 * @returns true if date is in the future, false otherwise
 */
export const isDateInFuture = (date: Date | string | null | undefined): boolean => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return dateObj > today;
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
};

/**
 * Gets today's date as a Date object with time reset to 00:00:00
 * @returns Date object representing today at midnight
 */
export const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
