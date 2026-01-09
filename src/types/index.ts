export type USState =
  | 'Alabama' | 'Alaska' | 'Arizona' | 'Arkansas' | 'California' | 'Colorado'
  | 'Connecticut' | 'Delaware' | 'Florida' | 'Georgia' | 'Hawaii' | 'Idaho'
  | 'Illinois' | 'Indiana' | 'Iowa' | 'Kansas' | 'Kentucky' | 'Louisiana'
  | 'Maine' | 'Maryland' | 'Massachusetts' | 'Michigan' | 'Minnesota'
  | 'Mississippi' | 'Missouri' | 'Montana' | 'Nebraska' | 'Nevada'
  | 'New Hampshire' | 'New Jersey' | 'New Mexico' | 'New York'
  | 'North Carolina' | 'North Dakota' | 'Ohio' | 'Oklahoma' | 'Oregon'
  | 'Pennsylvania' | 'Rhode Island' | 'South Carolina' | 'South Dakota'
  | 'Tennessee' | 'Texas' | 'Utah' | 'Vermont' | 'Virginia' | 'Washington'
  | 'West Virginia' | 'Wisconsin' | 'Wyoming';

export type Role =
  | 'General Contractor'
  | 'Subcontractor'
  | 'Supplier'
  | 'Equipment Lessor';

export type ContractWith =
  | 'Property Owner'
  | 'General Contractor (Original Contractor)'
  | 'Subcontractor'
  | 'Supplier';

export type ProjectType = 'Private' | 'Public' | 'Federal';

export interface ProjectDetails {
  projectName: string;
  state: USState;
  role: Role;
  contractWith: ContractWith;
  projectType: ProjectType;
  firstFurnishingDate: Date | null;
  lastFurnishingDate: Date | null;
  projectCompletionDate: Date | null;
}

export interface ValidationErrors {
  projectName?: string;
  state?: string;
  role?: string;
  contractWith?: string;
  projectType?: string;
  firstFurnishingDate?: string;
  lastFurnishingDate?: string;
}

export interface DeadlineResult {
  title: string;
  date: Date;
  daysRemaining: number;
  requirement: string;
  type: 'primary' | 'secondary';
}

export interface RemedyStep {
  title: string;
  description: string;
  order: number;
}

export interface CalculationResult {
  id?: string;
  projectDetails: ProjectDetails;
  deadlines: DeadlineResult[];
  remedies: RemedyStep[];
  calculatedAt: Date;
}

export interface ContactRow {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  directPhone: string;
  cell: string;
  role?: string;
}

export interface CompanyInfo {
  name: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
}

export interface SavedContact {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  role?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fullCompanyInfo: CompanyInfo;
  fullContactRows: ContactRow[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ProjectTask {
  id: string;
  action: string;
  dueDate: any;
  dateCompleted: any;
  emailNotification: boolean;
  comments: string;
}

export interface ContractDetails {
  baseContractAmount: number;
  additionalCosts: number;
  paymentsCredits: number;
  jobNo: number;
  waiverAmount: number;
  receivableStatus: string;
  calculationStatus: string;
}
