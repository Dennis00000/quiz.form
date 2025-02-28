import { toast } from 'react-hot-toast';
import { EventBus } from './performance';
import { supabase } from '../lib/supabase';

/**
 * Handles errors in a consistent way across the application
 * 
 * @param {Error} error - The error object
 * @param {Object} options - Options for error handling
 * @param {string} options.defaultMessage - Default message to show if error doesn't have a message
 * @param {boolean} options.showToast - Whether to show a toast notification (default: true)
 * @param {Function} options.callback - Optional callback to execute after handling the error
 * @returns {Error} - Returns the error for further handling if needed
 */
export const handleError = (error, options = {}) => {
  const {
    defaultMessage = 'An error occurred',
    showToast = true,
    callback
  } = options;

  // Get the error message
  const errorMessage = error?.response?.data?.message || 
                       error?.message || 
                       defaultMessage;
  
  // Log the error to console
  console.error(errorMessage, error);
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(errorMessage);
  }
  
  // Execute callback if provided
  if (typeof callback === 'function') {
    callback(error);
  }
  
  // Return the error for further handling
  return error;
};

/**
 * Transforms API errors into a consistent format
 * @param {Error} error - Error object from API
 * @returns {Object} - Formatted error object
 */
export function formatApiError(error) {
  // Handle Supabase errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST301':
        return {
          message: 'Resource not found',
          status: 404,
          code: error.code,
          originalError: error
        };
      case 'PGRST302':
        return {
          message: 'Permission denied',
          status: 403,
          code: error.code,
          originalError: error
        };
      case '23505':
        return {
          message: 'Duplicate record',
          status: 409,
          code: error.code,
          originalError: error
        };
      case '23503':
        return {
          message: 'Foreign key violation',
          status: 400,
          code: error.code,
          originalError: error
        };
      default:
        return {
          message: error.message || 'An unknown error occurred',
          status: error.status || 500,
          code: error.code,
          originalError: error
        };
    }
  }
  
  // Handle authentication errors
  if (error?.name === 'AuthError') {
    return {
      message: error.message || 'Authentication error',
      status: 401,
      code: 'AUTH_ERROR',
      originalError: error
    };
  }
  
  // Handle network errors
  if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      code: 'NETWORK_ERROR',
      originalError: error
    };
  }
  
  // Handle validation errors
  if (error?.validationErrors) {
    return {
      message: 'Validation error',
      status: 400,
      code: 'VALIDATION_ERROR',
      validationErrors: error.validationErrors,
      originalError: error
    };
  }
  
  // Default error format
  return {
    message: error?.message || 'An unknown error occurred',
    status: error?.status || 500,
    code: error?.code || 'UNKNOWN_ERROR',
    originalError: error
  };
}

/**
 * Handles API errors with appropriate user feedback
 * @param {Error} error - Error from API
 * @param {Function} notifyFn - Function to notify user (toast, alert, etc.)
 * @returns {Object} - Formatted error object
 */
export function handleApiError(error, notifyFn = console.error) {
  const formattedError = formatApiError(error);
  
  // Notify user with appropriate message
  if (notifyFn) {
    notifyFn(formattedError.message);
  }
  
  return formattedError;
}

/**
 * Creates a validation error object
 * @param {Object} validationErrors - Map of field names to error messages
 * @returns {Error} - Error with validation info
 */
export function createValidationError(validationErrors) {
  const error = new Error('Validation error');
  error.validationErrors = validationErrors;
  return error;
}

/**
 * Global error handler for the application
 */
class ErrorHandler {
  constructor() {
    // Set up global error listeners
    this.setupGlobalHandlers();
  }
  
  /**
   * Set up global error handlers
   */
  setupGlobalHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason || 'Unhandled Promise Rejection');
      
      // Log to monitoring service
      EventBus.emit('error:unhandled-rejection', {
        message: event.reason?.message || 'Unknown error',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle uncaught exceptions
    window.addEventListener('error', (event) => {
      this.handleError(event.error || event.message);
      
      // Log to monitoring service
      EventBus.emit('error:uncaught-exception', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
      
      // Prevent default browser error handling
      event.preventDefault();
    });
  }
  
  /**
   * Handle an error
   * @param {Error|string} error - Error to handle
   */
  handleError(error) {
    const errorMessage = error?.message || error || 'An unknown error occurred';
    
    // Display user-friendly error message
    toast.error(this.getUserFriendlyMessage(errorMessage));
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by global handler:', error);
    }
  }
  
  /**
   * Convert technical error messages to user-friendly messages
   * @param {string} message - Technical error message
   * @returns {string} - User-friendly error message
   */
  getUserFriendlyMessage(message) {
    // Map of technical error patterns to user-friendly messages
    const errorMap = {
      'Network Error': 'Unable to connect to the server. Please check your internet connection.',
      'Unauthorized': 'Your session has expired. Please log in again.',
      'Failed to fetch': 'Unable to reach the server. Please try again later.',
      'Internal Server Error': 'The server encountered an error. Our team has been notified.',
      'TypeError': 'A technical error occurred. Please try again.',
      'CSRF token': 'Your session security token is invalid. Please refresh the page.'
    };
    
    // Check for matching patterns
    for (const [pattern, friendlyMessage] of Object.entries(errorMap)) {
      if (message.includes(pattern)) {
        return friendlyMessage;
      }
    }
    
    // Default message for unmatched errors
    return 'An error occurred. Please try again or contact support if the problem persists.';
  }
  
  /**
   * Handle API response errors
   * @param {Object} response - API response object
   * @returns {Promise} - Rejected promise with error details
   */
  async handleApiError(response) {
    // Try to parse error from response
    try {
      const errorData = await response.json();
      const errorMessage = errorData.message || errorData.error || 'Unknown API error';
      
      // Log to monitoring service
      EventBus.emit('error:api', {
        status: response.status,
        message: errorMessage,
        url: response.url,
        timestamp: new Date().toISOString()
      });
      
      return Promise.reject(new Error(errorMessage));
    } catch (e) {
      // If we can't parse the response, create a generic error
      return Promise.reject(new Error(`Request failed with status ${response.status}`));
    }
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Handle API errors in a standardized way
 * @param {Error} error - The error object
 * @param {string} customMessage - Optional custom message to display
 * @param {boolean} silent - If true, don't show a toast notification
 * @returns {string} The error message
 */
export const handleApiError = (error, customMessage = null, silent = false) => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage || 'An unexpected error occurred';
  
  // Handle different error types
  if (error.response) {
    // Server responded with an error status code
    const serverError = error.response.data;
    errorMessage = serverError.message || serverError.error || `Error ${error.response.status}: ${errorMessage}`;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from server. Please check your connection.';
  } else if (error.code) {
    // Handle specific error codes
    switch (error.code) {
      case 'ECONNABORTED':
        errorMessage = 'Request timed out. Please try again.';
        break;
      case 'ERR_NETWORK':
        errorMessage = 'Network error. Please check your connection.';
        break;
      case 'ERR_BAD_REQUEST':
        errorMessage = 'Bad request. Please check your input.';
        break;
      default:
        // Use the error message if available
        errorMessage = error.message || errorMessage;
    }
  }
  
  // Show toast notification unless silent is true
  if (!silent) {
    toast.error(errorMessage);
  }
  
  return errorMessage;
};

/**
 * Handle Supabase errors in a standardized way
 * @param {Error} error - The error object
 * @param {string} customMessage - Optional custom message to display
 * @param {boolean} silent - If true, don't show a toast notification
 * @returns {string} The error message
 */
export const handleSupabaseError = (error, customMessage = null, silent = false) => {
  console.error('Supabase Error:', error);
  
  let errorMessage = customMessage || 'An unexpected error occurred';
  
  if (error) {
    // Handle specific Supabase error codes
    switch (error.code) {
      case '23505':
        errorMessage = 'This record already exists.';
        break;
      case '23503':
        errorMessage = 'This operation violates referential integrity.';
        break;
      case '42P01':
        errorMessage = 'The requested table does not exist.';
        break;
      case 'PGRST116':
        errorMessage = 'No results found.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'User not found.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Invalid password.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email already in use.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      default:
        // Use the error message if available
        errorMessage = error.message || errorMessage;
    }
  }
  
  // Show toast notification unless silent is true
  if (!silent) {
    toast.error(errorMessage);
  }
  
  return errorMessage;
};

/**
 * Handle Supabase errors with consistent formatting
 * @param {Error} error - The error object from Supabase
 * @param {string} defaultMessage - Default message to show if error is not specific
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {string} - Formatted error message
 */
export const handleSupabaseError = (error, defaultMessage = 'An error occurred', showToast = false) => {
  console.error('Error:', error);
  
  let errorMessage = defaultMessage;
  
  // Handle Supabase specific errors
  if (error?.message) {
    errorMessage = error.message;
  }
  
  // Handle authentication errors
  if (error?.code === 'auth/invalid-email') {
    errorMessage = 'Invalid email address';
  } else if (error?.code === 'auth/wrong-password') {
    errorMessage = 'Incorrect password';
  } else if (error?.code === 'auth/user-not-found') {
    errorMessage = 'User not found';
  } else if (error?.code === 'auth/email-already-in-use') {
    errorMessage = 'Email already in use';
  }
  
  // Show toast if requested
  if (showToast) {
    toast.error(errorMessage);
  }
  
  return errorMessage;
};

/**
 * Handle form validation errors
 * @param {Object} errors - Form validation errors object
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {Object} - Formatted errors object
 */
export const handleFormErrors = (errors, showToast = true) => {
  if (showToast) {
    toast.error('Please fix the errors in the form');
  }
  
  return errors;
};

export default {
  handleApiError,
  handleSupabaseError,
  handleFormErrors
}; 