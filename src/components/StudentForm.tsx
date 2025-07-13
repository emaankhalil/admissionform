import React, { useState, useEffect } from 'react';
import { GraduationCap, User, Phone, MapPin, DollarSign, Calendar, Users, AlertTriangle, Settings, CheckCircle, XCircle, TestTube } from 'lucide-react';
import { FormField } from './FormField';
import { LoadingSpinner } from './LoadingSpinner';
import { Alert } from './Alert';
import { Student } from '../types/Student';
import { submitStudentForm, testApiConnection } from '../services/sheetbestApi';

export const StudentForm: React.FC = () => {
  const [formData, setFormData] = useState<Student>({
    studentName: '',
    fatherName: '',
    studentId: '',
    phoneNumber: '',
    address: '',
    admissionFee: '',
    class: '',
    admissionDate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Test API connection on component mount
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    const result = await testApiConnection();
    setApiStatus(result.success ? 'connected' : 'error');
    setIsTesting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitStudentForm(formData);
      
      if (result.success) {
        setAlert({ type: 'success', message: result.message });
        // Reset form after successful submission
        setFormData({
          studentName: '',
          fatherName: '',
          studentId: '',
          phoneNumber: '',
          address: '',
          admissionFee: '',
          class: '',
          admissionDate: '',
        });
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    setAlert(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Student Admission Form</h1>
                  <p className="text-blue-100">Submit to Google Sheets via Sheetbest API</p>
                </div>
              </div>
              
              {/* API Status Indicator */}
              <div className="flex items-center space-x-2">
                {isTesting ? (
                  <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span className="text-sm">Testing...</span>
                  </div>
                ) : (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                    apiStatus === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : apiStatus === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {apiStatus === 'connected' ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>API Connected</span>
                      </>
                    ) : apiStatus === 'error' ? (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>API Error</span>
                      </>
                    ) : (
                      <>
                        <Settings className="h-3 w-3" />
                        <span>Unknown</span>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={testConnection}
                  disabled={isTesting}
                  className="text-white hover:text-blue-200 transition-colors"
                  title="Test API Connection"
                >
                  <TestTube className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Student Name"
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Father's Name"
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                placeholder="Enter father's full name"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Student ID"
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Enter student ID"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Class"
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                placeholder="Enter class/grade"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Admission Fee"
                type="number"
                name="admissionFee"
                value={formData.admissionFee}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
                disabled={isSubmitting}
              />

              <FormField
                label="Admission Date"
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <FormField
              label="Address"
              type="textarea"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter complete address"
              required
              disabled={isSubmitting}
            />

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Submit to Google Sheets</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Setup Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
            Google Sheet Setup Instructions
          </h3>
          <div className="space-y-4 text-sm text-amber-700">
            <p className="font-medium">To fix the permission error, follow these exact steps:</p>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li className="flex flex-col space-y-1">
                <span className="font-medium">Create/Open Google Sheet:</span>
                <span className="text-amber-600">• Create a new Google Sheet titled "student form"</span>
                <span className="text-amber-600">• Or open your existing sheet</span>
              </li>
              <li className="flex flex-col space-y-1">
                <span className="font-medium">Share the Sheet:</span>
                <span className="text-amber-600">• Click "Share" button (top-right corner)</span>
                <span className="text-amber-600">• Change access to "Anyone with the link"</span>
                <span className="text-amber-600">• Set permission to "Editor"</span>
              </li>
              <li className="flex flex-col space-y-1">
                <span className="font-medium">Configure Sheetbest:</span>
                <span className="text-amber-600">• Go to sheetbest.com and create/login to account</span>
                <span className="text-amber-600">• Connect your Google Sheet using the sharing link</span>
                <span className="text-amber-600">• Verify the connection shows as active</span>
              </li>
              <li className="flex flex-col space-y-1">
                <span className="font-medium">Verify Sheet Structure:</span>
                <span className="text-amber-600">• Make sure your sheet is named "Sheet1"</span>
                <span className="text-amber-600">• Column headers will be auto-created on first submission</span>
              </li>
            </ol>
            <div className="mt-4 p-3 bg-amber-100 rounded-lg">
              <p className="font-medium text-amber-800">Current Configuration:</p>
              <p className="text-xs text-amber-600 mt-1">Sheet ID: c42e0de1-d676-40e0-bf51-1af407247e1d</p>
              <p className="text-xs text-amber-600">API Status: {apiStatus === 'connected' ? '✅ Connected' : apiStatus === 'error' ? '❌ Error' : '⚠️ Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-red-50 border border-red-200 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-600" />
            Troubleshooting Common Issues
          </h3>
          <div className="space-y-4 text-sm text-red-700">
            <div className="space-y-2">
              <p className="font-medium">If you're still getting errors:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Double-check that your Google Sheet is publicly accessible</li>
                <li>Verify your Sheetbest API key is correct and active</li>
                <li>Make sure the sheet ID in the URL matches your actual sheet</li>
                <li>Try disconnecting and reconnecting your sheet in Sheetbest dashboard</li>
                <li>Check that you have sufficient quota in your Sheetbest plan</li>
              </ul>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <p className="font-medium text-red-800">Still having issues?</p>
              <p className="text-xs text-red-600 mt-1">
                Open your browser console (F12) to see detailed error logs and API responses.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Important Information
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Phone className="h-4 w-4 mt-0.5 text-blue-500" />
              <p>Please ensure the phone number is active for verification purposes.</p>
            </div>
            <div className="flex items-start space-x-2">
              <DollarSign className="h-4 w-4 mt-0.5 text-green-500" />
              <p>Admission fee should be paid within 7 days of form submission.</p>
            </div>
            <div className="flex items-start space-x-2">
              <Calendar className="h-4 w-4 mt-0.5 text-purple-500" />
              <p>Admission date cannot be more than 30 days from today.</p>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
              <p>Data will be automatically saved to your Google Sheet "student form".</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
