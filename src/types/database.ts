// Database model types

// Base interface for all database entities
export interface BaseEntity {
  user_id: number;
  created_at: Date;
}

// Users table model
export interface UsersTable {
  id: number;           // Primary Key, Integer(11)
  username: string;          // Varchar(30), Alphanumeric
  email?: string;            // Varchar(50), Email format (optional)
  password: string;          // Varchar(255), Hashed
  firstName: string;         // Varchar(30), Alphabetic
  lastName: string;          // Varchar(30), Alphabetic
  address: string;           // Varchar(100), Alphanumeric
  phone: string;             // Varchar(15), Numeric
  gender: string;            // Varchar(10), Gender
  dateOfBirth: Date;         // Date, YYYY-MM-DD
  profilePicture: string;    // Varchar(255), URL or path
  role: 'admin' | 'doctor' | 'patient'; // Enum, 10 chars
  isActive: boolean;         // Boolean, Account status
  lastLogin?: Date;          // Datetime, YYYY-MM-DD HH:MM:SS (optional)
  created_at: Date;          // Datetime, YYYY-MM-DD HH:MM:SS
  updated_at?: Date;         // Datetime, YYYY-MM-DD HH:MM:SS (optional)
}

// Patient table model
export interface PatientTable {
  id: number;        // Primary Key, Integer(11)
  user_id: number;           // Foreign Key to User, Integer(11)
  first_name: string;        // Varchar(30), Alphabetic
  last_name: string;         // Varchar(30), Alphabetic
  birth_date: Date;          // Date, YYYY-MM-DD
  address: string;           // Varchar(100), Alphanumeric
  contact_no: string;        // Varchar(15), Numeric
}

// Doctor table model
export interface DoctorTable {
  id: number;         // Primary Key, Integer(11)
  user_id: number;           // Foreign Key to User, Integer(11)
  full_name: string;         // Varchar(60), Alphabetic
  specialization: string;    // Varchar(50), Alphabetic
  license_no: string;        // Varchar(20), Alphanumeric
  contact_no: string;        // Varchar(15), Numeric
}

// Admin table model
export interface AdminTable {
  id: number;          // Primary Key, Integer(11)
  user_id: number;           // Foreign Key to User, Integer(11)
  full_name: string;         // Varchar(60), Alphabetic
  office: string;            // Varchar(50), Alphanumeric
}

// Appointment table model
export interface AppointmentTable {
  appointment_id: number;    // Primary Key, Integer(11)
  patient_id: number;        // Foreign Key to Patient, Integer(11)
  doctor_id: number;         // Foreign Key to Doctor, Integer(11)
  schedule_time: Date;       // Datetime, YYYY-MM-DD HH:MM:SS
  status: 'pending' | 'confirmed' | 'completed' | 'canceled'; // Enum, 10 chars
  type: 'in_person' | 'telemedicine'; // Enum, 15 chars
}

// Consultation table model
export interface ConsultationTable {
  consultation_id: number;   // Primary Key, Integer(11)
  appointment_id: number;    // Foreign Key to Appointment, Integer(11)
  notes: string;             // Text, 1000 chars
  prescription: string;      // Text, 1000 chars
  consultation_date: Date;   // Datetime, YYYY-MM-DD HH:MM:SS
  attachment: Blob;          // Blob, binary data
}

// Medical Record table model
export interface MedicalRecordTable {
  record_id: number;         // Primary Key, Integer(11)
  patient_id: number;        // Foreign Key to Patient, Integer(11)
  doctor_id: number;         // Foreign Key to Doctor, Integer(11)
  diagnosis: string;         // Text, 1000 chars
  treatment: string;         // Text, 1000 chars
  record_date: Date;         // Datetime, YYYY-MM-DD HH:MM:SS
}

// Pregnancy Record table model
export interface PregnancyRecordTable {
  preg_record_id: number;    // Primary Key, Integer(11)
  patient_id: number;        // Foreign Key to Patient, Integer(11)
  doctor_id: number;         // Foreign Key to Doctor, Integer(11)
  start_date: Date;          // Date, YYYY-MM-DD
  gestational_age: number;   // Integer, weeks (3 digits)
  milestone: string;         // Varchar(100), Alphanumeric
  notes: string;             // Text, 1000 chars
  status: 'ongoing' | 'completed'; // Enum, 10 chars
}

// Health Report table model
export interface HealthReportTable {
  id: number;         // Primary Key, Integer(11)
  doctor_id: number;         // Foreign Key to Doctor, Integer(11)
  title: string;             // Varchar(100), Report title
  report_type: string;       // Varchar(30), Alphanumeric
  data_collected: string;    // Text, 1000 chars
  report_date: Date;         // Date, YYYY-MM-DD
  status: 'active' | 'archived'; // Enum, 10 chars
}

// Extended types with user information
export interface PatientWithUser extends PatientTable {
  user: UsersTable;
}

export interface DoctorWithUser extends DoctorTable {
  user: UsersTable;
}

export interface AdminWithUser extends AdminTable {
  user: UsersTable;
}

// Extended types with related data
export interface AppointmentWithDetails extends AppointmentTable {
  patient: PatientWithUser;
  doctor: DoctorWithUser;
}

export interface ConsultationWithAppointment extends ConsultationTable {
  appointment: AppointmentWithDetails;
}

export interface MedicalRecordWithDetails extends MedicalRecordTable {
  patient: PatientWithUser;
  doctor: DoctorWithUser;
}

export interface PregnancyRecordWithDetails extends PregnancyRecordTable {
  patient: PatientWithUser;
  doctor: DoctorWithUser;
}

export interface HealthReportWithDoctor extends HealthReportTable {
  doctor: DoctorWithUser;
}

// Medicine table model
export interface MedicineTable {
  id: number | string;       // Primary Key, Integer(11)
  name: string;              // Varchar(40), Alphanumeric
  description: string;       // Text, 200 chars
  dosage: string;            // Varchar(30), Alphanumeric
  stock: number;             // Integer, 6 digits
  expiration_date: Date;     // Date, YYYY-MM-DD
  batch_no: string;          // Varchar(20), Alphanumeric
}

// Inventory table model
export interface InventoryTable {
  inventory_id: number;      // Primary Key, Integer(11)
  medicine_id: number;       // Foreign Key to Medicine, Integer(11)
  batch_no: string;          // Varchar(20), Alphanumeric
  quantity: number;          // Integer, 6 digits
  threshold: number;         // Integer, 6 digits
  last_updated: Date;        // Datetime, YYYY-MM-DD HH:MM:SS
}

// Health Education Content table model
export interface HealthEducationContentTable {
  id: number;        // Primary Key, Integer(11)
  title: string;             // Varchar(100), Alphanumeric
  headline: string;             // Varchar(100), Alphanumeric
  content_type: 'article' | 'video'; // Enum, 10 chars
  category: string;            // Varchar(100), Alphanumeric
  body: string;              // Text, 2000 chars
  url: string;         
  isPublished: boolean; // Boolean, Publication status
  created_by: number;        // User ID of creator, Integer(11)
  created_at: Date;          // Datetime, YYYY-MM-DD HH:MM:SS
}

// Feedback table model
export interface FeedbackTable {
  feedback_id: number;       // Primary Key, Integer(11)
  patient_id: number;        // Foreign Key to Patient, Integer(11)
  content: string;           // Text, 1000 chars
  submitted_at: Date;        // Datetime, YYYY-MM-DD HH:MM:SS
}

// Notifications table model
export interface NotificationsTable {
  notification_id: number;   // Primary Key, Integer(11)
  user_id: number;           // Foreign Key to User, Integer(11)
  message: string;           // Text, 300 chars
  notif_type: string;        // Varchar(30), Alphanumeric
  status: 'sent' | 'read' | 'acknowledged'; // Enum, 15 chars
  timestamp: Date;           // Datetime, YYYY-MM-DD HH:MM:SS
}

// Access Log table model
export interface AccessLogTable {
  log_id: number;            // Primary Key, Integer(11)
  user_id: number;           // Foreign Key to User, Integer(11)
  action: string;            // Varchar(100), Alphanumeric
  timestamp: Date;           // Datetime, YYYY-MM-DD HH:MM:SS
}

// Announcement table model
export interface AnnouncementTable {
  id: number | string;       // Primary Key, Integer(11)
  title: string;             // Varchar(200), Announcement title
  content: string;           // Text, 2000 chars
  author_id: number;         // Foreign Key to User, Integer(11)
  created_at: Date;          // Datetime, YYYY-MM-DD HH:MM:SS
  updated_at?: Date;         // Datetime, YYYY-MM-DD HH:MM:SS (optional)
  isPublished: boolean;     // Boolean, Publication status
  attachment_url?: string;   // Varchar(255), URL or path (optional)
}

// Additional extended types for new tables
export interface InventoryWithMedicine extends InventoryTable {
  medicine: MedicineTable;
}

export interface HealthEducationContentWithCreator extends HealthEducationContentTable {
  creator: UsersTable;
}

export interface FeedbackWithPatient extends FeedbackTable {
  patient: PatientWithUser;
}

export interface NotificationWithUser extends NotificationsTable {
  user: UsersTable;
}

export interface AccessLogWithUser extends AccessLogTable {
  user: UsersTable;
}

export interface AnnouncementWithAuthor extends AnnouncementTable {
  author: UsersTable;
}

// Frontend-specific user types for components
export interface User extends UsersTable {
  // Additional frontend-specific properties can be added here
}

export interface Patient extends PatientTable {
  user: UsersTable;
  // Additional frontend-specific properties
  username: string; // From user table
  email?: string; // From user table
  contactNumber: string; // Maps to contact_no
  dateRegistered: string; // ISO date string for frontend
}

export interface Personnel extends DoctorTable {
  user: UsersTable;
  // Additional frontend-specific properties
  fullName: string; // Maps to full_name
  contactNumber: string; // Maps to contact_no
}

// Database models collection
export interface DatabaseModels {
  users: UsersTable;
  patients: PatientTable;
  doctors: DoctorTable;
  admins: AdminTable;
  appointments: AppointmentTable;
  consultations: ConsultationTable;
  medical_records: MedicalRecordTable;
  pregnancy_records: PregnancyRecordTable;
  health_reports: HealthReportTable;
  medicines: MedicineTable;
  inventory: InventoryTable;
  health_education_content: HealthEducationContentTable;
  feedback: FeedbackTable;
  notifications: NotificationsTable;
  access_logs: AccessLogTable;
  announcements: AnnouncementTable;
}
