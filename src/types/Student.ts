export interface Student {
  studentName: string;
  fatherName: string;
  studentId: string;
  phoneNumber: string;
  address: string;
  admissionFee: string;
  class: string;
  admissionDate: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
