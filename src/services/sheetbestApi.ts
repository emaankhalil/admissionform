import { Student } from '../types/Student';

const API_URL = import.meta.env.VITE_SHEETBEST_API_URL || 'https://api.sheetbest.com/sheets/c42e0de1-d676-40e0-bf51-1af407247e1d';
const API_KEY = import.meta.env.VITE_SHEETBEST_API_KEY || 'mkQCZsdl32IJIzc3nr$xkGw5a12H$h6nBU-nNzw7V__YllA@xROWvxUZ98Yhj!74';

// Demo mode flag - set to true to test without API
const DEMO_MODE = false;

export const submitStudentForm = async (studentData: Student): Promise<{ success: boolean; message: string; data?: any }> => {
  // Demo mode - simulate successful submission
  if (DEMO_MODE) {
    console.log('DEMO MODE: Form data that would be submitted:', studentData);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return {
      success: true,
      message: 'Demo Mode: Form data logged to console successfully!',
      data: studentData
    };
  }

  try {
    // Format data according to Google Sheets column structure
    const formattedData = {
      'Student Name': studentData.studentName,
      'Father Name': studentData.fatherName,
      'Student ID': studentData.studentId,
      'Phone Number': studentData.phoneNumber,
      'Address': studentData.address,
      'Admission Fee': studentData.admissionFee,
      'Class': studentData.class,
      'Admission Date': studentData.admissionDate,
      'Timestamp': new Date().toISOString(),
    };

    console.log('🚀 Submitting to Sheetbest API...');
    console.log('📊 API URL:', API_URL);
    console.log('📝 Formatted data:', formattedData);
    console.log('🔑 Using API Key:', API_KEY ? 'API Key Present' : 'No API Key');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY,
      },
      body: JSON.stringify(formattedData),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      console.error('❌ API Error Response:', errorData);
      
      // Handle specific error cases
      if (response.status === 403) {
        if (typeof errorData === 'object' && errorData.detail && errorData.detail.includes('Connection to the origin sheet denied')) {
          throw new Error('SHEET_PERMISSION_ERROR');
        }
      }
      
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      }
      
      if (response.status === 404) {
        throw new Error('SHEET_NOT_FOUND');
      }
      
      throw new Error(`HTTP_ERROR_${response.status}`);
    }

    const responseData = await response.json();
    console.log('✅ Success response:', responseData);
    
    return {
      success: true,
      message: 'Student form submitted successfully to Google Sheets!',
      data: responseData
    };
  } catch (error) {
    console.error('💥 Error submitting form:', error);
    
    // Enhanced error handling with specific messages
    if (error instanceof Error) {
      switch (error.message) {
        case 'SHEET_PERMISSION_ERROR':
          return {
            success: false,
            message: 'Google Sheet Access Denied: Please follow the detailed setup instructions below to configure your sheet permissions.',
          };
        case 'INVALID_API_KEY':
          return {
            success: false,
            message: 'Invalid API Key: Please check your Sheetbest API key configuration.',
          };
        case 'SHEET_NOT_FOUND':
          return {
            success: false,
            message: 'Sheet Not Found: Please verify your sheet ID and Sheetbest connection.',
          };
        default:
          if (error.message.startsWith('HTTP_ERROR_')) {
            const statusCode = error.message.replace('HTTP_ERROR_', '');
            return {
              success: false,
              message: `API Error (${statusCode}): Please check your configuration and try again.`,
            };
          }
          break;
      }
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network Error: Please check your internet connection and try again.',
      };
    }
    
    return {
      success: false,
      message: 'Unexpected Error: Please try again later or contact support.',
    };
  }
};

// Test API connection function
export const testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (response.ok) {
      return { success: true, message: 'API connection successful!' };
    } else {
      return { success: false, message: `API test failed with status: ${response.status}` };
    }
  } catch (error) {
    return { success: false, message: 'Failed to connect to API' };
  }
};
