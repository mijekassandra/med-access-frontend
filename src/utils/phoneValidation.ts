/**
 * Phone number validation utility functions for Philippine numbers
 * Matches backend validation: /^[\+]?[1-9][\d]{0,15}$/
 * Optimized for Philippine phone numbers (+639)
 */

/**
 * Validates phone number format according to backend requirements
 * @param phoneNumber - The phone number to validate
 * @returns boolean - true if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  
  // Backend regex: /^[\+]?[1-9][\d]{0,15}$/
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber.trim());
};

/**
 * Validates Philippine phone number format specifically
 * @param phoneNumber - The phone number to validate
 * @returns boolean - true if valid Philippine number, false otherwise
 */
export const isValidPhilippinePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  
  const trimmed = phoneNumber.trim();
  
  // Philippine mobile numbers: +639XXXXXXXXX (10 digits after +639)
  // Or 09XXXXXXXXX (10 digits starting with 09)
  const philippineRegex = /^(\+639|639|09)\d{9}$/;
  
  return philippineRegex.test(trimmed);
};

/**
 * Formats phone number input to match backend requirements
 * Optimized for Philippine numbers - defaults to +639 format
 * @param input - Raw phone number input
 * @returns string - Formatted phone number
 */
export const formatPhoneNumber = (input: string): string => {
  if (!input) return '';
  
  // Remove all characters except digits and +
  let formatted = input.replace(/[^\d+]/g, '');
  
  // Handle Philippine number formatting
  if (formatted.startsWith('09')) {
    // Convert 09XXXXXXXXX to +639XXXXXXXXX
    formatted = '+639' + formatted.slice(2);
  } else if (formatted.startsWith('9') && !formatted.startsWith('+639')) {
    // Convert 9XXXXXXXXX to +639XXXXXXXXX
    formatted = '+639' + formatted;
  } else if (formatted.startsWith('639') && !formatted.startsWith('+639')) {
    // Convert 639XXXXXXXXX to +639XXXXXXXXX
    formatted = '+' + formatted;
  }
  
  // Ensure + is only at the beginning
  if (formatted.includes('+')) {
    const plusIndex = formatted.indexOf('+');
    if (plusIndex > 0) {
      // Remove + if it's not at the beginning
      formatted = formatted.replace(/\+/g, '');
    } else {
      // Keep only the first +
      formatted = '+' + formatted.slice(1).replace(/\+/g, '');
    }
  }
  
  return formatted;
};

/**
 * Gets phone number validation error message
 * @param phoneNumber - The phone number to validate
 * @returns string - Error message or empty string if valid
 */
export const getPhoneValidationError = (phoneNumber: string): string => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return 'This field is required';
  }
  
  // Check if it's just the default prefix without additional digits
  if (phoneNumber.trim() === '+639') {
    return 'This field is required';
  }
  
  // First check if it's a valid Philippine number
  if (isValidPhilippinePhoneNumber(phoneNumber)) {
    return '';
  }
  
  // Then check general format
  if (!isValidPhoneNumber(phoneNumber)) {
    return 'Please enter a valid Philippine phone number (e.g., +639123456789, 09123456789, or 9123456789).';
  }
  
  return '';
};

/**
 * Phone number input handler that formats input in real-time
 * @param value - Current input value
 * @param onChange - Callback function to update the value
 */
export const handlePhoneNumberChange = (
  value: string,
  onChange: (value: string) => void
): void => {
  const formatted = formatPhoneNumber(value);
  onChange(formatted);
};

/**
 * Auto-completes Philippine phone number with +639 prefix
 * @param value - Current input value
 * @returns string - Auto-completed phone number
 */
export const autoCompletePhilippineNumber = (value: string): string => {
  if (!value) return '';
  
  const digits = value.replace(/\D/g, '');
  
  // If user types 9 digits starting with 9, auto-add +639
  if (digits.length === 10 && digits.startsWith('9')) {
    return '+639' + digits;
  }
  
  // If user types 11 digits starting with 09, convert to +639
  if (digits.length === 11 && digits.startsWith('09')) {
    return '+639' + digits.slice(1);
  }
  
  return formatPhoneNumber(value);
};

/**
 * Philippine phone number input handler with max length validation
 * Pre-fills +639 and limits input to 13 characters total (+639XXXXXXXXX)
 * @param value - Current input value
 * @param onChange - Callback function to update the value
 */
export const handlePhilippinePhoneNumberChange = (
  value: string,
  onChange: (value: string) => void
): void => {
  if (!value) {
    onChange('+639');
    return;
  }
  
  // If user clears the field, reset to +639
  if (value.length < 4) {
    onChange('+639');
    return;
  }
  
  // Ensure it starts with +639
  if (!value.startsWith('+639')) {
    // If user types digits, prepend +639
    const digits = value.replace(/\D/g, '');
    if (digits.length > 0) {
      const formatted = '+639' + digits;
      // Limit to 13 characters (+639XXXXXXXXX)
      onChange(formatted.slice(0, 13));
    } else {
      onChange('+639');
    }
    return;
  }
  
  // Remove all non-digit characters except the leading +
  const digits = value.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +639
  let formatted = '+639';
  if (digits.length > 4) {
    // Add the remaining digits after +639
    const remainingDigits = digits.slice(4);
    formatted = '+639' + remainingDigits;
  }
  
  // Limit to 13 characters total (+639XXXXXXXXX)
  if (formatted.length > 13) {
    formatted = formatted.slice(0, 13);
  }
  
  onChange(formatted);
};
