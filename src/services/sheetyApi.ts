import { Student } from '../types/Student';

const API_URL = import.meta.env.VITE_SHEETY_API_URL;
const API_KEY = import.meta.env.VITE_SHEETY_API_KEY;

export const submitStudentForm = async (studentData: Student): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Student form submitted successfully!',
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit form. Please try again.',
    };
  }
};
