
export enum UserRole {
  GUEST = 'GUEST',
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  avatar?: string;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED_UNPAID = 'APPROVED_UNPAID', // Waiting for payment
  APPROVED_PAID = 'APPROVED_PAID', // Active
  REJECTED = 'REJECTED'
}

export interface CompanyApplication {
  id: string;
  companyName: string;
  employeeCount: number;
  contactEmail: string;
  status: ApplicationStatus;
  date: string;
  invoiceAmount?: string; // Admin sets this
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  image: string;
  date: string;
  type: 'Standard' | 'Vegetarian' | 'Vegan';
  ingredients?: string[];
  nutrition?: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// New Types for Dashboards
export interface Employee {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Invited' | 'Inactive';
  dietary?: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: string;
}

export interface SupportTicket {
  id: string;
  user: string;
  subject: string;
  status: 'Open' | 'Resolved';
  lastMessage: string;
  date: string;
}

export interface EventInquiry {
  id: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  contactName: string;
  contactEmail: string;
  location: string;
  status: 'New' | 'In Discussion' | 'Confirmed' | 'Declined';
  budget: string;
}
