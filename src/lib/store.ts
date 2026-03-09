import { create } from 'zustand';

// Types
export type Status = 'active' | 'inactive' | 'expired' | 'due' | 'ok' | 'warning' | 'critical' | 'pending' | 'approved';

export interface Vehicle {
  id: number;
  regNo: string;
  model: string;
  chassis: string;
  engine: string;
  driver: string;
  driverId?: number;
  gpsId: string;
  fuelCard: string;
  fastagId: string;
  status: 'active' | 'inactive';
  kmReading: number;
  fuelLevel: number;
  photo: string;
  documents: { name: string; expiry: string; status: 'ok' | 'expired' | 'due' }[];
  lastService: string;
  nextService: string;
  location: string;
  purchaseDate: string;
}

export interface Driver {
  id: number;
  name: string;
  empId: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  insurance: string;
  insuranceExpiry: string;
  status: 'active' | 'inactive';
  vehicle: string;
  vehicleId?: number;
  joinDate: string;
  address: string;
  photo: string;
  trips: number;
  kmDriven: number;
  fuelEfficiency: string;
  rating: number;
  violations: number;
  lastTrip: string;
  experience: string;
}

export interface FuelEntry {
  id: number;
  vehicle: string;
  vehicleId?: number;
  driver: string;
  driverId?: number;
  date: string;
  km: number;
  fuel: number;
  cost: number;
  kmpl: number;
  vendor: string;
}

export interface Trip {
  id: number;
  vehicle: string;
  vehicleId?: number;
  driver: string;
  driverId?: number;
  from: string;
  to: string;
  date: string;
  distance: number;
  freight: number;
  fuelCost: number;
  tollCost: number;
  otherCost: number;
  status: 'active' | 'inactive';
}

export interface MaintenanceRecord {
  id: number;
  vehicle: string;
  vehicleId?: number;
  date: string;
  work: string;
  vendor: string;
  cost: number;
  vat: number;
  status: 'pending' | 'approved';
  nextKm: number;
}

export interface FASTag {
  id: number;
  fastagId: string;
  vehicle: string;
  vehicleId?: number;
  driver: string;
  driverId?: number;
  balance: number;
  threshold: number;
  status: 'ok' | 'warning' | 'critical';
  lastToll: string;
  monthlyToll: number;
  bank: string;
}

export interface Tyre {
  id: number;
  vehicle: string;
  vehicleId?: number;
  tyreNo: string;
  position: string;
  size: string;
  brand: string;
  changeDate: string;
  changeKm: number;
  currentKm: number;
  cost: number;
  mileage: number;
  cpkm: number;
}

export interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  msg: string;
  time: string;
  read: boolean;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  lastUpdated: string;
  status: 'ok' | 'low' | 'critical';
}

// Settings types
export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  gstin: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  weeklyReport: boolean;
  maintenanceReminders: boolean;
  fuelAlerts: boolean;
  driverAlerts: boolean;
  vehicleAlerts: boolean;
}

// Initial Data - 30 Vehicles
const initialVehicles: Vehicle[] = [
  {
    id: 1, regNo: 'Rajshahi Metro U-57-1299', model: 'Tata Prima 4028.S', chassis: 'MAT445103K2B12345', engine: '4928CRDL12345',
    driver: 'Md. Rahim Uddin', driverId: 1, gpsId: 'GPS-001', fuelCard: 'FC-2024-001', fastagId: 'FT-TN-001',
    status: 'active', kmReading: 48320, fuelLevel: 72, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-06-15', status: 'ok' },
      { name: 'FC', expiry: '2026-03-20', status: 'ok' },
      { name: 'Insurance', expiry: '2026-11-20', status: 'ok' },
      { name: 'Permit', expiry: '2026-08-10', status: 'ok' },
      { name: 'National Permit', expiry: '2026-05-30', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-04-15', status: 'ok' },
    ],
    lastService: '2025-12-10', nextService: '50,500 KM', location: 'Dhaka, Dhaka Division', purchaseDate: '2022-03-15',
  },
  {
    id: 2, regNo: 'Mymensingh Metro Dha-71-7758', model: 'Ashok Leyland 3518', chassis: 'ALY3518K2B67890', engine: 'H6E4CRDL67890',
    driver: 'Abdul Karim', driverId: 2, gpsId: 'GPS-002', fuelCard: 'FC-2024-002', fastagId: 'FT-TN-002',
    status: 'active', kmReading: 62150, fuelLevel: 45, photo: '',
    documents: [
      { name: 'RC', expiry: '2027-09-20', status: 'ok' },
      { name: 'FC', expiry: '2026-06-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-06-30', status: 'ok' },
      { name: 'Permit', expiry: '2026-11-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-07-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-08-28', status: 'ok' },
    ],
    lastService: '2025-11-05', nextService: '65,000 KM', location: 'Narayanganj, Dhaka Division', purchaseDate: '2021-08-20',
  },
  {
    id: 3, regNo: 'Rajshahi Metro U-54-9222', model: 'Eicher Pro 6031', chassis: 'ECH6031K2B11111', engine: 'E6E5CRDL11111',
    driver: 'Md. Hasan', driverId: 3, gpsId: 'GPS-003', fuelCard: 'FC-2024-003', fastagId: 'FT-TN-003',
    status: 'active', kmReading: 31200, fuelLevel: 88, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-01-10', status: 'ok' },
      { name: 'FC', expiry: '2026-07-25', status: 'ok' },
      { name: 'Insurance', expiry: '2027-09-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-02-28', status: 'ok' },
      { name: 'National Permit', expiry: '2026-12-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-06-20', status: 'ok' },
    ],
    lastService: '2026-01-02', nextService: '35,000 KM', location: 'Comilla, Dhaka Division', purchaseDate: '2023-01-10',
  },
  {
    id: 4, regNo: 'Barisal Metro Cha-94-7010', model: 'Tata LPT 3118', chassis: 'MAT3118K2B22222', engine: '4978CRDL22222',
    driver: 'Md. Shafiqul Islam', driverId: 4, gpsId: 'GPS-004', fuelCard: 'FC-2024-004', fastagId: 'FT-TN-004',
    status: 'inactive', kmReading: 78900, fuelLevel: 20, photo: '',
    documents: [
      { name: 'RC', expiry: '2026-04-30', status: 'ok' },
      { name: 'FC', expiry: '2026-04-15', status: 'ok' },
      { name: 'Insurance', expiry: '2026-08-10', status: 'ok' },
      { name: 'Permit', expiry: '2026-05-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-04-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-05-31', status: 'ok' },
    ],
    lastService: '2025-09-15', nextService: '80,000 KM', location: 'Barisal, Dhaka Division', purchaseDate: '2020-06-05',
  },
  {
    id: 5, regNo: 'Sylhet Metro Gha-27-7683', model: 'BharatBenz 3523R', chassis: 'BBZ3523K2B33333', engine: 'OM457LA33333',
    driver: 'Md. Rakibul Hasan', driverId: 5, gpsId: 'GPS-005', fuelCard: 'FC-2024-005', fastagId: 'FT-TN-005',
    status: 'active', kmReading: 22400, fuelLevel: 60, photo: '',
    documents: [
      { name: 'RC', expiry: '2030-02-20', status: 'ok' },
      { name: 'FC', expiry: '2027-08-10', status: 'ok' },
      { name: 'Insurance', expiry: '2027-11-30', status: 'ok' },
      { name: 'Permit', expiry: '2027-06-15', status: 'ok' },
      { name: 'National Permit', expiry: '2027-01-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-08-25', status: 'ok' },
    ],
    lastService: '2025-12-28', nextService: '25,000 KM', location: 'Gazipur, Dhaka Division', purchaseDate: '2024-02-14',
  },
  {
    id: 6, regNo: 'Dhaka Metro Ga-10-5297', model: 'Mahindra Blazo X 35', chassis: 'MHD35XK2B44444', engine: 'mPower 7.2L44444',
    driver: 'Md. Jamal Uddin', driverId: 6, gpsId: 'GPS-006', fuelCard: 'FC-2024-006', fastagId: 'FT-TN-006',
    status: 'active', kmReading: 41800, fuelLevel: 55, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-08-15', status: 'ok' },
      { name: 'FC', expiry: '2026-10-20', status: 'ok' },
      { name: 'Insurance', expiry: '2027-02-28', status: 'ok' },
      { name: 'Permit', expiry: '2026-12-30', status: 'ok' },
      { name: 'National Permit', expiry: '2026-09-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-07-10', status: 'ok' },
    ],
    lastService: '2025-12-20', nextService: '45,000 KM', location: 'Rangpur, Dhaka Division', purchaseDate: '2023-05-10',
  },
  {
    id: 7, regNo: 'Rangpur Metro Ja-82-6627', model: 'Volvo FM 500', chassis: 'YV2FM500K2A56789', engine: 'D13C50056789',
    driver: 'Md. Abul Bashar', driverId: 7, gpsId: 'GPS-007', fuelCard: 'FC-2024-007', fastagId: 'FT-KA-001',
    status: 'active', kmReading: 89450, fuelLevel: 65, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-05-20', status: 'ok' },
      { name: 'FC', expiry: '2026-11-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-08-25', status: 'ok' },
      { name: 'Permit', expiry: '2027-03-30', status: 'ok' },
      { name: 'National Permit', expiry: '2027-06-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-09-05', status: 'ok' },
    ],
    lastService: '2026-01-05', nextService: '92,000 KM', location: 'Chittagong, Chittagong Division', purchaseDate: '2020-11-20',
  },
  {
    id: 8, regNo: 'Dhaka Metro Ga-18-4485', model: 'Scania P410', chassis: 'YSR410K2A90123', engine: 'DC13 12390123',
    driver: 'Md. Kamal Hossain', driverId: 8, gpsId: 'GPS-008', fuelCard: 'FC-2024-008', fastagId: 'FT-KA-002',
    status: 'active', kmReading: 56780, fuelLevel: 78, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-12-10', status: 'ok' },
      { name: 'FC', expiry: '2026-09-25', status: 'ok' },
      { name: 'Insurance', expiry: '2027-05-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-01-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-11-25', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-06-30', status: 'ok' },
    ],
    lastService: '2025-12-15', nextService: '60,000 KM', location: 'Cox\'s Bazar, Chittagong Division', purchaseDate: '2022-08-15',
  },
  {
    id: 9, regNo: 'Rajshahi Metro U-22-1240', model: 'MAN TGS 33.400', chassis: 'WMA400K2B34567', engine: 'D2676LF0134567',
    driver: 'Md. Nasir Ahmed', driverId: 9, gpsId: 'GPS-009', fuelCard: 'FC-2024-009', fastagId: 'FT-MH-001',
    status: 'active', kmReading: 72340, fuelLevel: 42, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-03-25', status: 'ok' },
      { name: 'FC', expiry: '2026-08-10', status: 'ok' },
      { name: 'Insurance', expiry: '2027-04-20', status: 'ok' },
      { name: 'Permit', expiry: '2026-10-15', status: 'ok' },
      { name: 'National Permit', expiry: '2026-08-30', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-05-20', status: 'ok' },
    ],
    lastService: '2025-11-28', nextService: '75,000 KM', location: 'Khulna, Khulna Division', purchaseDate: '2021-04-10',
  },
  {
    id: 10, regNo: 'Barisal Metro Cha-95-4583', model: 'Tata Signa 4018.T', chassis: 'MAT4018K2C78901', engine: 'CUMINSISB6.778901',
    driver: 'Md. Tanvir Hasan', driverId: 10, gpsId: 'GPS-010', fuelCard: 'FC-2024-010', fastagId: 'FT-DL-001',
    status: 'active', kmReading: 35600, fuelLevel: 90, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-07-15', status: 'ok' },
      { name: 'FC', expiry: '2027-01-20', status: 'ok' },
      { name: 'Insurance', expiry: '2027-10-30', status: 'ok' },
      { name: 'Permit', expiry: '2027-05-25', status: 'ok' },
      { name: 'National Permit', expiry: '2027-03-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-11-15', status: 'ok' },
    ],
    lastService: '2026-01-08', nextService: '38,000 KM', location: 'Sylhet', purchaseDate: '2023-09-05',
  },
  {
    id: 11, regNo: 'Sylhet Metro Gha-84-2312', model: 'Ashok Leyland 4920', chassis: 'ALY4920K2D12345', engine: 'H6E6CRDL12345',
    driver: 'Md. Ruhul Amin', driverId: 11, gpsId: 'GPS-011', fuelCard: 'FC-2024-011', fastagId: 'FT-GJ-001',
    status: 'active', kmReading: 67890, fuelLevel: 38, photo: '',
    documents: [
      { name: 'RC', expiry: '2027-11-30', status: 'ok' },
      { name: 'FC', expiry: '2026-06-05', status: 'ok' },
      { name: 'Insurance', expiry: '2027-03-15', status: 'ok' },
      { name: 'Permit', expiry: '2026-09-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-07-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-04-25', status: 'ok' },
    ],
    lastService: '2025-12-25', nextService: '70,000 KM', location: 'Rajshahi, Rajshahi Division', purchaseDate: '2021-10-20',
  },
  {
    id: 12, regNo: 'Rangpur Metro Ja-42-2558', model: 'Eicher Pro 6055', chassis: 'ECH6055K2E56789', engine: 'E6E6CRDL56789',
    driver: 'Md. Shahidul Islam', driverId: 12, gpsId: 'GPS-012', fuelCard: 'FC-2024-012', fastagId: 'FT-AP-001',
    status: 'active', kmReading: 28450, fuelLevel: 82, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-04-10', status: 'ok' },
      { name: 'FC', expiry: '2026-12-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-09-05', status: 'ok' },
      { name: 'Permit', expiry: '2027-04-30', status: 'ok' },
      { name: 'National Permit', expiry: '2027-02-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-10-20', status: 'ok' },
    ],
    lastService: '2026-01-10', nextService: '32,000 KM', location: 'Mymensingh, Chittagong Division', purchaseDate: '2023-11-15',
  },
  {
    id: 13, regNo: 'Chittagong Metro Ta-29-4217', model: 'Tata Prima 4625.T', chassis: 'MAT4625K2F90123', engine: 'CUMMINSISBE90123',
    driver: 'Md. Mostafizur Rahman', driverId: 13, gpsId: 'GPS-013', fuelCard: 'FC-2024-013', fastagId: 'FT-WB-001',
    status: 'inactive', kmReading: 94560, fuelLevel: 15, photo: '',
    documents: [
      { name: 'RC', expiry: '2026-08-20', status: 'ok' },
      { name: 'FC', expiry: '2026-03-10', status: 'ok' },
      { name: 'Insurance', expiry: '2026-10-25', status: 'ok' },
      { name: 'Permit', expiry: '2026-07-15', status: 'ok' },
      { name: 'National Permit', expiry: '2026-05-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-02-28', status: 'ok' },
    ],
    lastService: '2025-10-05', nextService: '96,000 KM', location: 'Narsingdi, Khulna Division', purchaseDate: '2019-12-18',
  },
  {
    id: 14, regNo: 'Khulna Metro Kha-70-1548', model: 'BharatBenz 2826R', chassis: 'BBZ2826K2G34567', engine: 'OM906LA34567',
    driver: 'Md. Saiful Islam', driverId: 14, gpsId: 'GPS-014', fuelCard: 'FC-2024-014', fastagId: 'FT-UP-001',
    status: 'active', kmReading: 51230, fuelLevel: 68, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-01-25', status: 'ok' },
      { name: 'FC', expiry: '2026-07-30', status: 'ok' },
      { name: 'Insurance', expiry: '2027-06-10', status: 'ok' },
      { name: 'Permit', expiry: '2026-12-25', status: 'ok' },
      { name: 'National Permit', expiry: '2026-10-30', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-05-15', status: 'ok' },
    ],
    lastService: '2025-12-18', nextService: '55,000 KM', location: 'Faridpur, Dhaka Division', purchaseDate: '2022-06-12',
  },
  {
    id: 15, regNo: 'Khulna Metro Kha-45-5477', model: 'Mahindra Blazo X 28', chassis: 'MHD28XK2H78901', engine: 'mPower 6.7L78901',
    driver: 'Md. Anwarul Haque', driverId: 15, gpsId: 'GPS-015', fuelCard: 'FC-2024-015', fastagId: 'FT-TN-007',
    status: 'active', kmReading: 39870, fuelLevel: 75, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-09-15', status: 'ok' },
      { name: 'FC', expiry: '2026-11-20', status: 'ok' },
      { name: 'Insurance', expiry: '2027-07-25', status: 'ok' },
      { name: 'Permit', expiry: '2027-01-10', status: 'ok' },
      { name: 'National Permit', expiry: '2026-11-05', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-08-10', status: 'ok' },
    ],
    lastService: '2025-12-30', nextService: '42,000 KM', location: 'Tangail, Dhaka Division', purchaseDate: '2023-02-28',
  },
  {
    id: 16, regNo: 'Khulna Metro Kha-39-9550', model: 'Volvo FH 520', chassis: 'YV2FH520K2A12345', engine: 'D13K52012345',
    driver: 'Md. Al Amin', driverId: 16, gpsId: 'GPS-016', fuelCard: 'FC-2024-016', fastagId: 'FT-KA-003',
    status: 'active', kmReading: 102340, fuelLevel: 58, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-02-28', status: 'ok' },
      { name: 'FC', expiry: '2027-03-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-12-20', status: 'ok' },
      { name: 'Permit', expiry: '2027-08-05', status: 'ok' },
      { name: 'National Permit', expiry: '2027-05-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-12-25', status: 'ok' },
    ],
    lastService: '2026-01-12', nextService: '105,000 KM', location: 'Jamalpur, Chittagong Division', purchaseDate: '2020-07-08',
  },
  {
    id: 17, regNo: 'Sylhet Metro Gha-31-1771', model: 'Scania R450', chassis: 'YSR450K2B56789', engine: 'DC13 14556789',
    driver: 'Md. Abdul Gaffar', driverId: 17, gpsId: 'GPS-017', fuelCard: 'FC-2024-017', fastagId: 'FT-MH-002',
    status: 'active', kmReading: 81560, fuelLevel: 47, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-06-10', status: 'ok' },
      { name: 'FC', expiry: '2026-10-05', status: 'ok' },
      { name: 'Insurance', expiry: '2027-08-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-02-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-12-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-07-30', status: 'ok' },
    ],
    lastService: '2025-12-22', nextService: '85,000 KM', location: 'Bogra, Khulna Division', purchaseDate: '2021-05-22',
  },
  {
    id: 18, regNo: 'Rangpur Metro Ja-82-2208', model: 'MAN TGX 33.480', chassis: 'WMA480K2C90123', engine: 'D2676LF0290123',
    driver: 'Md. Imam Hossain', driverId: 18, gpsId: 'GPS-018', fuelCard: 'FC-2024-018', fastagId: 'FT-DL-002',
    status: 'active', kmReading: 41200, fuelLevel: 83, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-05-05', status: 'ok' },
      { name: 'FC', expiry: '2027-02-10', status: 'ok' },
      { name: 'Insurance', expiry: '2027-11-25', status: 'ok' },
      { name: 'Permit', expiry: '2027-06-20', status: 'ok' },
      { name: 'National Permit', expiry: '2027-04-05', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-12-10', status: 'ok' },
    ],
    lastService: '2026-01-06', nextService: '44,000 KM', location: 'Narayanganj, Dhaka Division', purchaseDate: '2023-07-30',
  },
  {
    id: 19, regNo: 'Rangpur Metro Ja-70-9341', model: 'Ashok Leyland 4220', chassis: 'ALY4220K2D34567', engine: 'H6E5CRDL34567',
    driver: 'Md. Jashim Uddin', driverId: 19, gpsId: 'GPS-019', fuelCard: 'FC-2024-019', fastagId: 'FT-GJ-002',
    status: 'active', kmReading: 59870, fuelLevel: 52, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-02-20', status: 'ok' },
      { name: 'FC', expiry: '2026-08-25', status: 'ok' },
      { name: 'Insurance', expiry: '2027-05-30', status: 'ok' },
      { name: 'Permit', expiry: '2026-11-10', status: 'ok' },
      { name: 'National Permit', expiry: '2026-09-25', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-06-15', status: 'ok' },
    ],
    lastService: '2025-12-08', nextService: '63,000 KM', location: 'Chandpur, Rajshahi Division', purchaseDate: '2022-03-25',
  },
  {
    id: 20, regNo: 'Sylhet Metro Gha-46-2015', model: 'Eicher Pro 2114', chassis: 'ECH2114K2E78901', engine: 'E6E4CRDL78901',
    driver: 'Md. Rafiqul Islam', driverId: 20, gpsId: 'GPS-020', fuelCard: 'FC-2024-020', fastagId: 'FT-AP-002',
    status: 'inactive', kmReading: 87650, fuelLevel: 25, photo: '',
    documents: [
      { name: 'RC', expiry: '2026-12-15', status: 'ok' },
      { name: 'FC', expiry: '2026-04-20', status: 'ok' },
      { name: 'Insurance', expiry: '2026-11-10', status: 'ok' },
      { name: 'Permit', expiry: '2026-08-05', status: 'ok' },
      { name: 'National Permit', expiry: '2026-06-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-03-15', status: 'ok' },
    ],
    lastService: '2025-11-12', nextService: '90,000 KM', location: 'Jessore, Barisal Division', purchaseDate: '2020-09-10',
  },
  {
    id: 21, regNo: 'Rangpur Metro Ja-82-3157', model: 'Tata LPT 2518', chassis: 'MAT2518K2I12345', engine: '697TCI12345',
    driver: 'Md. Abdul Halim', driverId: 21, gpsId: 'GPS-021', fuelCard: 'FC-2024-021', fastagId: 'FT-TN-008',
    status: 'active', kmReading: 62340, fuelLevel: 40, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-04-25', status: 'ok' },
      { name: 'FC', expiry: '2026-09-30', status: 'ok' },
      { name: 'Insurance', expiry: '2027-06-05', status: 'ok' },
      { name: 'Permit', expiry: '2027-01-15', status: 'ok' },
      { name: 'National Permit', expiry: '2026-11-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-04-10', status: 'ok' },
    ],
    lastService: '2025-12-02', nextService: '65,000 KM', location: 'Kushtia, Dhaka Division', purchaseDate: '2022-01-18',
  },
  {
    id: 22, regNo: 'Rangpur Metro Ja-15-7308', model: 'BharatBenz 1923C', chassis: 'BBZ1923K2A56789', engine: 'OM906LA56789',
    driver: 'Md. Habibur Rahman', driverId: 22, gpsId: 'GPS-022', fuelCard: 'FC-2024-022', fastagId: 'FT-KA-004',
    status: 'active', kmReading: 34560, fuelLevel: 72, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-08-10', status: 'ok' },
      { name: 'FC', expiry: '2026-12-20', status: 'ok' },
      { name: 'Insurance', expiry: '2027-09-25', status: 'ok' },
      { name: 'Permit', expiry: '2027-03-10', status: 'ok' },
      { name: 'National Permit', expiry: '2027-01-05', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-10-05', status: 'ok' },
    ],
    lastService: '2026-01-03', nextService: '37,000 KM', location: 'Sirajganj, Chittagong Division', purchaseDate: '2023-08-22',
  },
  {
    id: 23, regNo: 'Khulna Metro Kha-59-8861', model: 'Ashok Leyland 2820', chassis: 'ALY2820K2B90123', engine: 'H6E4CRDL90123',
    driver: 'Md. Asaduzzaman', driverId: 23, gpsId: 'GPS-023', fuelCard: 'FC-2024-023', fastagId: 'FT-MH-003',
    status: 'active', kmReading: 48920, fuelLevel: 65, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-10-05', status: 'ok' },
      { name: 'FC', expiry: '2026-11-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-07-20', status: 'ok' },
      { name: 'Permit', expiry: '2027-02-05', status: 'ok' },
      { name: 'National Permit', expiry: '2026-12-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-08-15', status: 'ok' },
    ],
    lastService: '2025-12-14', nextService: '52,000 KM', location: 'Pabna, Khulna Division', purchaseDate: '2022-07-15',
  },
  {
    id: 24, regNo: 'Barisal Metro Cha-60-8988', model: 'Tata Ultra 1918.T', chassis: 'MAT1918K2C34567', engine: '3.3L NG34567',
    driver: 'Md. Nizam Uddin', driverId: 24, gpsId: 'GPS-024', fuelCard: 'FC-2024-024', fastagId: 'FT-DL-003',
    status: 'active', kmReading: 26780, fuelLevel: 88, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-12-20', status: 'ok' },
      { name: 'FC', expiry: '2027-04-10', status: 'ok' },
      { name: 'Insurance', expiry: '2027-10-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-06-25', status: 'ok' },
      { name: 'National Permit', expiry: '2027-03-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-11-20', status: 'ok' },
    ],
    lastService: '2026-01-09', nextService: '29,000 KM', location: 'Manikganj, Dhaka Division', purchaseDate: '2024-01-10',
  },
  {
    id: 25, regNo: 'Sylhet Metro Gha-20-1820', model: 'Mahindra Blazo X 16', chassis: 'MHD16XK2D78901', engine: 'mPower 4.7L78901',
    driver: 'Md. Siddiqur Rahman', driverId: 25, gpsId: 'GPS-025', fuelCard: 'FC-2024-025', fastagId: 'FT-GJ-003',
    status: 'active', kmReading: 34560, fuelLevel: 55, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-06-30', status: 'ok' },
      { name: 'FC', expiry: '2026-10-15', status: 'ok' },
      { name: 'Insurance', expiry: '2027-05-20', status: 'ok' },
      { name: 'Permit', expiry: '2026-12-30', status: 'ok' },
      { name: 'National Permit', expiry: '2026-10-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-07-05', status: 'ok' },
    ],
    lastService: '2025-12-26', nextService: '37,000 KM', location: 'Narayanganj (Industrial), Rajshahi Division', purchaseDate: '2023-04-05',
  },
  {
    id: 26, regNo: 'Mymensingh Metro Dha-33-3302', model: 'Eicher Pro 2055', chassis: 'ECH2055K2F12345', engine: 'E6E3CRDL12345',
    driver: 'Md. Ziaur Rahman', driverId: 26, gpsId: 'GPS-026', fuelCard: 'FC-2024-026', fastagId: 'FT-AP-003',
    status: 'active', kmReading: 19870, fuelLevel: 92, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-09-15', status: 'ok' },
      { name: 'FC', expiry: '2027-05-25', status: 'ok' },
      { name: 'Insurance', expiry: '2027-11-10', status: 'ok' },
      { name: 'Permit', expiry: '2027-07-15', status: 'ok' },
      { name: 'National Permit', expiry: '2027-04-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-12-15', status: 'ok' },
    ],
    lastService: '2026-01-11', nextService: '22,000 KM', location: 'Patuakhali, Barisal Division', purchaseDate: '2024-05-20',
  },
  {
    id: 27, regNo: 'Mymensingh Metro Dha-55-3652', model: 'Ashok Leyland 4325', chassis: 'ALY4325K2J56789', engine: 'H6E6CRDL56789',
    driver: 'Md. Abdul Mazid', driverId: 27, gpsId: 'GPS-027', fuelCard: 'FC-2024-027', fastagId: 'FT-TN-009',
    status: 'active', kmReading: 73450, fuelLevel: 35, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-03-20', status: 'ok' },
      { name: 'FC', expiry: '2026-09-05', status: 'ok' },
      { name: 'Insurance', expiry: '2027-08-30', status: 'ok' },
      { name: 'Permit', expiry: '2027-01-25', status: 'ok' },
      { name: 'National Permit', expiry: '2026-11-30', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-05-25', status: 'ok' },
    ],
    lastService: '2025-11-30', nextService: '77,000 KM', location: 'Bhola, Dhaka Division', purchaseDate: '2021-12-08',
  },
  {
    id: 28, regNo: 'Rajshahi Metro U-99-9743', model: 'Volvo FMX 440', chassis: 'YV2FMX440K2A90123', engine: 'D11K44090123',
    driver: 'Md. Habibur Rahim', driverId: 28, gpsId: 'GPS-028', fuelCard: 'FC-2024-028', fastagId: 'FT-KA-005',
    status: 'active', kmReading: 61230, fuelLevel: 48, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-01-30', status: 'ok' },
      { name: 'FC', expiry: '2027-02-20', status: 'ok' },
      { name: 'Insurance', expiry: '2027-10-05', status: 'ok' },
      { name: 'Permit', expiry: '2027-05-10', status: 'ok' },
      { name: 'National Permit', expiry: '2027-02-25', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-09-20', status: 'ok' },
    ],
    lastService: '2025-12-19', nextService: '65,000 KM', location: 'Noakhali, Chittagong Division', purchaseDate: '2022-04-12',
  },
  {
    id: 29, regNo: 'Chittagong Metro Ta-23-5467', model: 'Scania G410', chassis: 'YSR410K2C34567', engine: 'DC13 07834567',
    driver: 'Md. Abdul Quddus', driverId: 29, gpsId: 'GPS-029', fuelCard: 'FC-2024-029', fastagId: 'FT-MH-004',
    status: 'inactive', kmReading: 95670, fuelLevel: 18, photo: '',
    documents: [
      { name: 'RC', expiry: '2026-10-15', status: 'ok' },
      { name: 'FC', expiry: '2026-05-10', status: 'ok' },
      { name: 'Insurance', expiry: '2026-12-20', status: 'ok' },
      { name: 'Permit', expiry: '2026-09-05', status: 'ok' },
      { name: 'National Permit', expiry: '2026-07-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-04-05', status: 'ok' },
    ],
    lastService: '2025-10-20', nextService: '98,000 KM', location: 'Brahmanbaria, Khulna Division', purchaseDate: '2019-11-25',
  },
  {
    id: 30, regNo: 'Dhaka Metro Ga-79-7238', model: 'Tata Signa 5525.S', chassis: 'MAT5525K2D78901', engine: 'CUMMINSISX1178901',
    driver: 'Md. Rizwan Ahmed', driverId: 30, gpsId: 'GPS-030', fuelCard: 'FC-2024-030', fastagId: 'FT-DL-004',
    status: 'active', kmReading: 44560, fuelLevel: 62, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-06-25', status: 'ok' },
      { name: 'FC', expiry: '2027-03-30', status: 'ok' },
      { name: 'Insurance', expiry: '2027-12-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-08-20', status: 'ok' },
      { name: 'National Permit', expiry: '2027-05-25', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-11-30', status: 'ok' },
    ],
    lastService: '2026-01-04', nextService: '47,000 KM', location: 'Narsingdi, Dhaka Division', purchaseDate: '2022-10-15',
  },
];

// Initial Data - 30 Drivers
const initialDrivers: Driver[] = [
  {
    id: 1, name: 'Md. Rahim Uddin', empId: 'EMP-001', phone: '+880 15- 41813',
    license: 'DHA-2024-0012345', licenseExpiry: '2027-01-25', insurance: 'Sonali Bank-DRV-001', insuranceExpiry: '2027-08-15',
    status: 'active', vehicle: 'Rangpur Metro Ja-19-5851', vehicleId: 1, joinDate: '2020-03-15', address: '12, Gulshan, Dhaka - 8527',
    photo: 'https://images.unsplash.com/photo- 48793211169-0a1dd7228f2d?w=150&q=80',
    trips: 342, kmDriven: 48320, fuelEfficiency: '4.9', rating: 4.7, violations: 0, lastTrip: '2026-01-15', experience: '6 Years',
  },
  {
    id: 2, name: 'Abdul Karim', empId: 'EMP-002', phone: '+880 18- 43160',
    license: 'NAR-2023-0023456', licenseExpiry: '2027-02-10', insurance: 'Popular Life Insurance-DRV-002', insuranceExpiry: '2027-09-20',
    status: 'active', vehicle: 'Mymensingh Metro Dha-99-2012', vehicleId: 2, joinDate: '2019-07-20', address: '45, Dhanmondi, Narayanganj - 3174',
    photo: 'https://images.unsplash.com/photo- 18148767791-00dcc994a43e?w=150&q=80',
    trips: 428, kmDriven: 62150, fuelEfficiency: '4.5', rating: 4.3, violations: 1, lastTrip: '2026-01-14', experience: '7 Years',
  },
  {
    id: 3, name: 'Md. Hasan', empId: 'EMP-003', phone: '+880 16- 14479',
    license: 'COM-2025-0034567', licenseExpiry: '2028-05-30', insurance: 'BRAC Bank-DRV-003', insuranceExpiry: '2028-03-10',
    status: 'active', vehicle: 'Rajshahi Metro U-80-1073', vehicleId: 3, joinDate: '2022-01-10', address: '78, Mirpur, Comilla - 4808',
    photo: 'https://images.unsplash.com/photo- 24529645785-5658abf4ff4e?w=150&q=80',
    trips: 198, kmDriven: 31200, fuelEfficiency: '5.1', rating: 4.8, violations: 0, lastTrip: '2026-01-15', experience: '4 Years',
  },
  {
    id: 4, name: 'Md. Shafiqul Islam', empId: 'EMP-004', phone: '+880 16- 54312',
    license: 'RAJ-2024-0045678', licenseExpiry: '2026-11-15', insurance: 'Sonali Bank-DRV-004', insuranceExpiry: '2027-05-25',
    status: 'inactive', vehicle: 'Sylhet Metro Gha-37-4560', vehicleId: 4, joinDate: '2018-11-05', address: '23, Uttara, Barisal - 3152',
    photo: 'https://images.unsplash.com/photo- 89065360753-af0119f7cbe7?w=150&q=80',
    trips: 512, kmDriven: 78900, fuelEfficiency: '4.2', rating: 3.9, violations: 3, lastTrip: '2025-12-20', experience: '8 Years',
  },
  {
    id: 5, name: 'Md. Rakibul Hasan', empId: 'EMP-005', phone: '+880 19- 30556',
    license: 'SYL-2024-0056789', licenseExpiry: '2028-08-20', insurance: 'Prime Bank-DRV-005', insuranceExpiry: '2028-06-30',
    status: 'active', vehicle: 'Rangpur Metro Ja-82-3488', vehicleId: 5, joinDate: '2023-06-01', address: '56, Mohammadpur, Gazipur - 3308',
    photo: 'https://images.unsplash.com/photo- 91570097-0b93528c311a?w=150&q=80',
    trips: 124, kmDriven: 22400, fuelEfficiency: '5.3', rating: 4.9, violations: 0, lastTrip: '2026-01-15', experience: '3 Years',
  },
  {
    id: 6, name: 'Md. Jamal Uddin', empId: 'EMP-006', phone: '+880 17- 33440',
    license: 'KHA-2023-0067890', licenseExpiry: '2027-12-10', insurance: 'Social Islami Bank-DRV-006', insuranceExpiry: '2027-10-15',
    status: 'active', vehicle: 'Mymensingh Metro Dha-90-8352', vehicleId: 6, joinDate: '2021-04-15', address: '89, Paltan, Narayanganj - 9327',
    photo: 'https://images.unsplash.com/photo- 14702031773-4f4e44671857?w=150&q=80',
    trips: 267, kmDriven: 41800, fuelEfficiency: '4.7', rating: 4.5, violations: 0, lastTrip: '2026-01-12', experience: '5 Years',
  },
  {
    id: 7, name: 'Md. Abul Bashar', empId: 'EMP-007', phone: '+880 19- 85863',
    license: 'DHA-2022-0078901', licenseExpiry: '2027-05-20', insurance: 'BRAC Bank-DRV-007', insuranceExpiry: '2027-12-25',
    status: 'active', vehicle: 'Mymensingh Metro Dha-42-2188', vehicleId: 7, joinDate: '2020-11-20', address: '34, Banani, Chittagong - 5538',
    photo: 'https://images.unsplash.com/photo- 71974778202-cad84cf45f1d?w=150&q=80',
    trips: 456, kmDriven: 89450, fuelEfficiency: '4.8', rating: 4.6, violations: 2, lastTrip: '2026-01-13', experience: '6 Years',
  },
  {
    id: 8, name: 'Md. Kamal Hossain', empId: 'EMP-008', phone: '+880 16- 28760',
    license: 'CG-2021-0089012', licenseExpiry: '2026-09-25', insurance: 'BRAC Bank-DRV-008', insuranceExpiry: '2027-04-15',
    status: 'active', vehicle: 'Chittagong Metro Ta-78-6900', vehicleId: 8, joinDate: '2022-08-15', address: '67, Mogbazar, Cox\'s Bazar - 9199',
    photo: 'https://images.unsplash.com/photo- 87315182560-3f2917c472ef?w=150&q=80',
    trips: 289, kmDriven: 56780, fuelEfficiency: '5.0', rating: 4.7, violations: 0, lastTrip: '2026-01-14', experience: '4 Years',
  },
  {
    id: 9, name: 'Md. Nasir Ahmed', empId: 'EMP-009', phone: '+880 18- 75106',
    license: 'BAR-2020-0090123', licenseExpiry: '2026-08-10', insurance: 'Sonali Bank-DRV-009', insuranceExpiry: '2027-03-30',
    status: 'active', vehicle: 'Khulna Metro Kha-84-9784', vehicleId: 9, joinDate: '2021-04-10', address: '90, Wari, Khulna - 1028',
    photo: 'https://images.unsplash.com/photo- 92039645785-5658abf4ff4e?w=150&q=80',
    trips: 378, kmDriven: 72340, fuelEfficiency: '4.6', rating: 4.4, violations: 1, lastTrip: '2026-01-12', experience: '5 Years',
  },
  {
    id: 10, name: 'Md. Tanvir Hasan', empId: 'EMP-010', phone: '+880 15- 23959',
    license: 'DHA-2023-0101234', licenseExpiry: '2027-01-20', insurance: 'Prime Bank-DRV-010', insuranceExpiry: '2027-08-10',
    status: 'active', vehicle: 'Sylhet Metro Gha-59-3968', vehicleId: 10, joinDate: '2023-09-05', address: '12, Sector 10, Uttara - 4796',
    photo: 'https://images.unsplash.com/photo- 60313211169-0a1dd7228f2d?w=150&q=80',
    trips: 156, kmDriven: 35600, fuelEfficiency: '5.2', rating: 4.8, violations: 0, lastTrip: '2026-01-15', experience: '3 Years',
  },
  {
    id: 11, name: 'Md. Ruhul Amin', empId: 'EMP-011', phone: '+880 18- 59969',
    license: 'RAJ-2021-0112345', licenseExpiry: '2026-06-05', insurance: 'Social Islami Bank-DRV-011', insuranceExpiry: '2027-01-20',
    status: 'active', vehicle: 'Khulna Metro Kha-86-8329', vehicleId: 11, joinDate: '2021-10-20', address: '45, Motijheel, Rajshahi - 9393',
    photo: 'https://images.unsplash.com/photo- 46290097-0b93528c311a?w=150&q=80',
    trips: 398, kmDriven: 67890, fuelEfficiency: '4.4', rating: 4.2, violations: 2, lastTrip: '2026-01-13', experience: '5 Years',
  },
  {
    id: 12, name: 'Md. Shahidul Islam', empId: 'EMP-012', phone: '+880 17- 83943',
    license: 'DHK-2022-0123456', licenseExpiry: '2026-12-15', insurance: 'BRAC Bank-DRV-012', insuranceExpiry: '2027-07-15',
    status: 'active', vehicle: 'Rangpur Metro Ja-64-1348', vehicleId: 12, joinDate: '2023-11-15', address: '78, Lalbagh, Mymensingh - 4495',
    photo: 'https://images.unsplash.com/photo- 60338767791-00dcc994a43e?w=150&q=80',
    trips: 189, kmDriven: 28450, fuelEfficiency: '5.1', rating: 4.7, violations: 0, lastTrip: '2026-01-14', experience: '3 Years',
  },
  {
    id: 13, name: 'Md. Mostafizur Rahman', empId: 'EMP-013', phone: '+880 15- 57843',
    license: 'BAR-2019-0134567', licenseExpiry: '2026-03-10', insurance: 'Popular Life Insurance-DRV-013', insuranceExpiry: '2026-09-20',
    status: 'inactive', vehicle: 'Chittagong Metro Ta-61-7651', vehicleId: 13, joinDate: '2019-12-18', address: '23, Hazaribagh, Narsingdi - 8367',
    photo: 'https://images.unsplash.com/photo- 60155360753-af0119f7cbe7?w=150&q=80',
    trips: 567, kmDriven: 94560, fuelEfficiency: '4.0', rating: 3.8, violations: 4, lastTrip: '2025-12-15', experience: '7 Years',
  },
  {
    id: 14, name: 'Md. Saiful Islam', empId: 'EMP-014', phone: '+880 18- 26484',
    license: 'DHA-2021-0145678', licenseExpiry: '2026-07-30', insurance: 'City Bank-DRV-014', insuranceExpiry: '2027-02-20',
    status: 'active', vehicle: 'Barisal Metro Cha-36-6001', vehicleId: 14, joinDate: '2022-06-12', address: '56, Dilkusha, Faridpur - 6760',
    photo: 'https://images.unsplash.com/photo- 84082031773-4f4e44671857?w=150&q=80',
    trips: 312, kmDriven: 51230, fuelEfficiency: '4.7', rating: 4.5, violations: 1, lastTrip: '2026-01-12', experience: '4 Years',
  },
  {
    id: 15, name: 'Md. Anwarul Haque', empId: 'EMP-015', phone: '+880 16- 39004',
    license: 'RAJ-2022-0156789', licenseExpiry: '2026-11-20', insurance: 'Sonali Bank-DRV-015', insuranceExpiry: '2027-06-10',
    status: 'active', vehicle: 'Rangpur Metro Ja-34-8632', vehicleId: 15, joinDate: '2023-02-28', address: '89, Cantonment, Tangail - 2609',
    photo: 'https://images.unsplash.com/photo- 88334778202-cad84cf45f1d?w=150&q=80',
    trips: 234, kmDriven: 39870, fuelEfficiency: '5.0', rating: 4.6, violations: 0, lastTrip: '2026-01-13', experience: '4 Years',
  },
  {
    id: 16, name: 'Md. Al Amin', empId: 'EMP-016', phone: '+880 16- 45207',
    license: 'DHA-2020-0167890', licenseExpiry: '2027-03-15', insurance: 'Prime Bank-DRV-016', insuranceExpiry: '2027-11-10',
    status: 'active', vehicle: 'Rangpur Metro Ja-54-1676', vehicleId: 16, joinDate: '2020-07-08', address: '12, Shyamoli, Jamalpur - 6276',
    photo: 'https://images.unsplash.com/photo- 99565182560-3f2917c472ef?w=150&q=80',
    trips: 489, kmDriven: 102340, fuelEfficiency: '4.9', rating: 4.8, violations: 1, lastTrip: '2026-01-15', experience: '6 Years',
  },
  {
    id: 17, name: 'Md. Abdul Gaffar', empId: 'EMP-017', phone: '+880 17- 60483',
    license: 'BAR-2021-0178901', licenseExpiry: '2026-10-05', insurance: 'Social Islami Bank-DRV-017', insuranceExpiry: '2027-05-15',
    status: 'active', vehicle: 'Mymensingh Metro Dha-99-5966', vehicleId: 17, joinDate: '2021-05-22', address: '34, Sutrapur, Bogra - 6484',
    photo: 'https://images.unsplash.com/photo- 67089645785-5658abf4ff4e?w=150&q=80',
    trips: 401, kmDriven: 81560, fuelEfficiency: '4.5', rating: 4.3, violations: 2, lastTrip: '2026-01-14', experience: '5 Years',
  },
  {
    id: 18, name: 'Md. Imam Hossain', empId: 'EMP-018', phone: '+880 15- 33613',
    license: 'DHA-2023-0189012', licenseExpiry: '2027-02-10', insurance: 'City Bank-DRV-018', insuranceExpiry: '2027-09-05',
    status: 'active', vehicle: 'Khulna Metro Kha-66-3940', vehicleId: 18, joinDate: '2023-07-30', address: '56, Sector 62, Narayanganj - 5247',
    photo: 'https://images.unsplash.com/photo- 17353211169-0a1dd7228f2d?w=150&q=80',
    trips: 178, kmDriven: 41200, fuelEfficiency: '5.1', rating: 4.7, violations: 0, lastTrip: '2026-01-15', experience: '3 Years',
  },
  {
    id: 19, name: 'Md. Jashim Uddin', empId: 'EMP-019', phone: '+880 19- 77484',
    license: 'RAJ-2022-0190123', licenseExpiry: '2026-08-25', insurance: 'Popular Life Insurance-DRV-019', insuranceExpiry: '2027-03-20',
    status: 'active', vehicle: 'Chittagong Metro Ta-69-8734', vehicleId: 19, joinDate: '2022-03-25', address: '78, Bashundhara, Chandpur - 1717',
    photo: 'https://images.unsplash.com/photo- 29790097-0b93528c311a?w=150&q=80',
    trips: 345, kmDriven: 59870, fuelEfficiency: '4.6', rating: 4.4, violations: 1, lastTrip: '2026-01-13', experience: '4 Years',
  },
  {
    id: 20, name: 'Md. Rafiqul Islam', empId: 'EMP-020', phone: '+880 18- 53042',
    license: 'DHK-2019-0201234', licenseExpiry: '2026-04-20', insurance: 'City Bank-DRV-020', insuranceExpiry: '2026-10-10',
    status: 'inactive', vehicle: 'Mymensingh Metro Dha-91-7418', vehicleId: 20, joinDate: '2020-09-10', address: '23, Mirpur 10, Jessore - 7070',
    photo: 'https://images.unsplash.com/photo- 86878767791-00dcc994a43e?w=150&q=80',
    trips: 523, kmDriven: 87650, fuelEfficiency: '4.1', rating: 3.9, violations: 3, lastTrip: '2025-12-18', experience: '6 Years',
  },
  {
    id: 21, name: 'Md. Abdul Halim', empId: 'EMP-021', phone: '+880 16- 95185',
    license: 'KHA-2021-0212345', licenseExpiry: '2026-09-30', insurance: 'Sonali Bank-DRV-021', insuranceExpiry: '2027-04-05',
    status: 'active', vehicle: 'Khulna Metro Kha-68-8125', vehicleId: 21, joinDate: '2022-01-18', address: '45, Pallabi, Kushtia - 6449',
    photo: 'https://images.unsplash.com/photo- 80422031773-4f4e44671857?w=150&q=80',
    trips: 367, kmDriven: 62340, fuelEfficiency: '4.5', rating: 4.3, violations: 1, lastTrip: '2026-01-12', experience: '5 Years',
  },
  {
    id: 22, name: 'Md. Habibur Rahman', empId: 'EMP-022', phone: '+880 19- 41674',
    license: 'CG-2023-0223456', licenseExpiry: '2026-12-20', insurance: 'Prime Bank-DRV-022', insuranceExpiry: '2027-08-15',
    status: 'active', vehicle: 'Mymensingh Metro Dha-70-6290', vehicleId: 22, joinDate: '2023-08-22', address: '67, Gulshan 2, Sirajganj - 3541',
    photo: 'https://images.unsplash.com/photo- 91224778202-cad84cf45f1d?w=150&q=80',
    trips: 198, kmDriven: 34560, fuelEfficiency: '5.0', rating: 4.6, violations: 0, lastTrip: '2026-01-14', experience: '3 Years',
  },
  {
    id: 23, name: 'Md. Asaduzzaman', empId: 'EMP-023', phone: '+880 17- 20447',
    license: 'BAR-2022-0234567', licenseExpiry: '2026-11-15', insurance: 'Social Islami Bank-DRV-023', insuranceExpiry: '2027-06-05',
    status: 'active', vehicle: 'Dhaka Metro Ga-84-5380', vehicleId: 23, joinDate: '2022-07-15', address: '90, Adabor, Pabna - 3750',
    photo: 'https://images.unsplash.com/photo- 14065182560-3f2917c472ef?w=150&q=80',
    trips: 289, kmDriven: 48920, fuelEfficiency: '4.7', rating: 4.5, violations: 0, lastTrip: '2026-01-13', experience: '4 Years',
  },
  {
    id: 24, name: 'Md. Nizam Uddin', empId: 'EMP-024', phone: '+880 16- 99322',
    license: 'DHA-2024-0245678', licenseExpiry: '2027-04-10', insurance: 'BRAC Bank-DRV-024', insuranceExpiry: '2027-10-05',
    status: 'active', vehicle: 'Rangpur Metro Ja-50-2996', vehicleId: 24, joinDate: '2024-01-10', address: '12, Sector 56, Manikganj - 2597',
    photo: 'https://images.unsplash.com/photo- 50529645785-5658abf4ff4e?w=150&q=80',
    trips: 112, kmDriven: 26780, fuelEfficiency: '5.2', rating: 4.8, violations: 0, lastTrip: '2026-01-15', experience: '2 Years',
  },
  {
    id: 25, name: 'Md. Siddiqur Rahman', empId: 'EMP-025', phone: '+880 18- 34618',
    license: 'RAJ-2022-0256789', licenseExpiry: '2026-10-15', insurance: 'Popular Life Insurance-DRV-025', insuranceExpiry: '2027-04-20',
    status: 'active', vehicle: 'Rajshahi Metro U-19-5673', vehicleId: 25, joinDate: '2023-04-05', address: '34, Elephant Road, Narayanganj (Industrial) - 7639',
    photo: 'https://images.unsplash.com/photo- 82053211169-0a1dd7228f2d?w=150&q=80',
    trips: 234, kmDriven: 34560, fuelEfficiency: '4.8', rating: 4.5, violations: 0, lastTrip: '2026-01-14', experience: '3 Years',
  },
  {
    id: 26, name: 'Md. Ziaur Rahman', empId: 'EMP-026', phone: '+880 19- 76161',
    license: 'DHA-2024-0267890', licenseExpiry: '2027-05-25', insurance: 'BRAC Bank-DRV-026', insuranceExpiry: '2027-11-10',
    status: 'active', vehicle: 'Rangpur Metro Ja-97-6392', vehicleId: 26, joinDate: '2024-05-20', address: '56, Banasree, Patuakhali - 5731',
    photo: 'https://images.unsplash.com/photo- 16800097-0b93528c311a?w=150&q=80',
    trips: 87, kmDriven: 19870, fuelEfficiency: '5.1', rating: 4.7, violations: 0, lastTrip: '2026-01-15', experience: '2 Years',
  },
  {
    id: 27, name: 'Md. Abdul Mazid', empId: 'EMP-027', phone: '+880 18- 64237',
    license: 'RAJ-2020-0278901', licenseExpiry: '2026-09-05', insurance: 'Sonali Bank-DRV-027', insuranceExpiry: '2027-02-20',
    status: 'active', vehicle: 'Mymensingh Metro Dha-85-9678', vehicleId: 27, joinDate: '2021-12-08', address: '78, Khilgaon, Bhola - 8168',
    photo: 'https://images.unsplash.com/photo- 76978767791-00dcc994a43e?w=150&q=80',
    trips: 412, kmDriven: 73450, fuelEfficiency: '4.4', rating: 4.2, violations: 2, lastTrip: '2026-01-12', experience: '5 Years',
  },
  {
    id: 28, name: 'Md. Habibur Rahim', empId: 'EMP-028', phone: '+880 17- 58487',
    license: 'CG-2021-0289012', licenseExpiry: '2027-02-20', insurance: 'Prime Bank-DRV-028', insuranceExpiry: '2027-09-15',
    status: 'active', vehicle: 'Rajshahi Metro U-42-6941', vehicleId: 28, joinDate: '2022-04-12', address: '90, New Market, Noakhali - 4741',
    photo: 'https://images.unsplash.com/photo- 30272031773-4f4e44671857?w=150&q=80',
    trips: 323, kmDriven: 61230, fuelEfficiency: '4.6', rating: 4.4, violations: 1, lastTrip: '2026-01-13', experience: '4 Years',
  },
  {
    id: 29, name: 'Md. Abdul Quddus', empId: 'EMP-029', phone: '+880 17- 64038',
    license: 'BAR-2019-0290123', licenseExpiry: '2026-05-10', insurance: 'Social Islami Bank-DRV-029', insuranceExpiry: '2026-11-05',
    status: 'inactive', vehicle: 'Barisal Metro Cha-46-5845', vehicleId: 29, joinDate: '2019-11-25', address: '23, Dhanmondi 27, Brahmanbaria - 2411',
    photo: 'https://images.unsplash.com/photo- 76165360753-af0119f7cbe7?w=150&q=80',
    trips: 545, kmDriven: 95670, fuelEfficiency: '4.0', rating: 3.8, violations: 3, lastTrip: '2025-12-22', experience: '7 Years',
  },
  {
    id: 30, name: 'Md. Rizwan Ahmed', empId: 'EMP-030', phone: '+880 17- 35802',
    license: 'DHA-2022-0301234', licenseExpiry: '2027-03-30', insurance: 'BRAC Bank-DRV-030', insuranceExpiry: '2027-11-15',
    status: 'active', vehicle: 'Rajshahi Metro U-11-1372', vehicleId: 30, joinDate: '2022-10-15', address: '45, Sector 21, Narsingdi - 5095',
    photo: 'https://images.unsplash.com/photo- 79254778202-cad84cf45f1d?w=150&q=80',
    trips: 289, kmDriven: 44560, fuelEfficiency: '4.7', rating: 4.5, violations: 1, lastTrip: '2026-01-14', experience: '4 Years',
  },
];

// Initial Data - 30 Fuel Entries
const initialFuelEntries: FuelEntry[] = [
  { id: 1, vehicle: 'Sylhet Metro Gha-65-7571', vehicleId: 1, driver: 'Md. Rahim Uddin', driverId: 1, date: '2026-01-15', km: 48320, fuel: 85, cost: 8415, kmpl: 4.9, vendor: 'Padma Oil Filling Station, Dhaka' },
  { id: 2, vehicle: 'Barisal Metro Cha-13-9989', vehicleId: 2, driver: 'Abdul Karim', driverId: 2, date: '2026-01-14', km: 62150, fuel: 92, cost: 9108, kmpl: 4.5, vendor: 'Bangladesh Petroleum, Narayanganj' },
  { id: 3, vehicle: 'Sylhet Metro Gha-62-2927', vehicleId: 3, driver: 'Md. Hasan', driverId: 3, date: '2026-01-14', km: 31200, fuel: 78, cost: 7722, kmpl: 5.1, vendor: 'Meghna Filling Station, Comilla' },
  { id: 4, vehicle: 'Chittagong Metro Ta-24-4355', vehicleId: 5, driver: 'Md. Rakibul Hasan', driverId: 5, date: '2026-01-13', km: 22400, fuel: 65, cost: 6435, kmpl: 5.3, vendor: 'Jamuna Filling Station, Gazipur' },
  { id: 5, vehicle: 'Sylhet Metro Gha-89-8645', vehicleId: 1, driver: 'Md. Rahim Uddin', driverId: 1, date: '2026-01-10', km: 47800, fuel: 88, cost: 8712, kmpl: 4.8, vendor: 'Bangladesh Petroleum, Dhaka' },
  { id: 6, vehicle: 'Rangpur Metro Ja-87-5740', vehicleId: 7, driver: 'Md. Abul Bashar', driverId: 7, date: '2026-01-15', km: 89450, fuel: 145, cost: 14355, kmpl: 4.8, vendor: 'Shell, Chittagong' },
  { id: 7, vehicle: 'Barisal Metro Cha-50-6191', vehicleId: 9, driver: 'Md. Nasir Ahmed', driverId: 9, date: '2026-01-14', km: 72340, fuel: 128, cost: 12672, kmpl: 4.6, vendor: 'Padma Filling Station, Khulna' },
  { id: 8, vehicle: 'Chittagong Metro Ta-84-3785', vehicleId: 10, driver: 'Md. Tanvir Hasan', driverId: 10, date: '2026-01-13', km: 35600, fuel: 58, cost: 5742, kmpl: 5.2, vendor: 'Surma Filling Station, Sylhet' },
  { id: 9, vehicle: 'Khulna Metro Kha-39-7671', vehicleId: 11, driver: 'Md. Ruhul Amin', driverId: 11, date: '2026-01-12', km: 67890, fuel: 115, cost: 11385, kmpl: 4.4, vendor: 'Bashundhara Filling Station, Rajshahi' },
  { id: 10, vehicle: 'Khulna Metro Kha-16-6075', vehicleId: 6, driver: 'Md. Jamal Uddin', driverId: 6, date: '2026-01-11', km: 41800, fuel: 75, cost: 7425, kmpl: 4.7, vendor: 'Padma Filling Station, Rangpur' },
  { id: 11, vehicle: 'Rajshahi Metro U-41-7077', vehicleId: 8, driver: 'Md. Kamal Hossain', driverId: 8, date: '2026-01-10', km: 56780, fuel: 98, cost: 9702, kmpl: 5.0, vendor: 'Bangladesh Petroleum, Cox\'s Bazar' },
  { id: 12, vehicle: 'Khulna Metro Kha-18-9452', vehicleId: 14, driver: 'Md. Saiful Islam', driverId: 14, date: '2026-01-09', km: 51230, fuel: 92, cost: 9108, kmpl: 4.7, vendor: 'Meghna Filling Station, Faridpur' },
  { id: 13, vehicle: 'Barisal Metro Cha-88-5711', vehicleId: 15, driver: 'Md. Anwarul Haque', driverId: 15, date: '2026-01-08', km: 39870, fuel: 70, cost: 6930, kmpl: 5.0, vendor: 'Padma Filling Station, Barisal' },
  { id: 14, vehicle: 'Barisal Metro Cha-19-6361', vehicleId: 16, driver: 'Md. Al Amin', driverId: 16, date: '2026-01-07', km: 102340, fuel: 168, cost: 16632, kmpl: 4.9, vendor: 'Shell, Jamalpur' },
  { id: 15, vehicle: 'Chittagong Metro Ta-82-3544', vehicleId: 17, driver: 'Md. Abdul Gaffar', driverId: 17, date: '2026-01-06', km: 81560, fuel: 142, cost: 14058, kmpl: 4.5, vendor: 'Bangladesh Petroleum, Bogra' },
  { id: 16, vehicle: 'Dhaka Metro Ga-86-7049', vehicleId: 2, driver: 'Abdul Karim', driverId: 2, date: '2026-01-05', km: 61600, fuel: 89, cost: 8811, kmpl: 4.6, vendor: 'Meghna Filling Station, Narayanganj' },
  { id: 17, vehicle: 'Rajshahi Metro U-41-8839', vehicleId: 18, driver: 'Md. Imam Hossain', driverId: 18, date: '2026-01-04', km: 41200, fuel: 72, cost: 7128, kmpl: 5.1, vendor: 'Padma Filling Station, Narayanganj' },
  { id: 18, vehicle: 'Mymensingh Metro Dha-25-6349', vehicleId: 19, driver: 'Md. Jashim Uddin', driverId: 19, date: '2026-01-03', km: 59870, fuel: 104, cost: 10296, kmpl: 4.6, vendor: 'Bashundhara Filling Station, Chandpur' },
  { id: 19, vehicle: 'Sylhet Metro Gha-85-2607', vehicleId: 21, driver: 'Md. Abdul Halim', driverId: 21, date: '2026-01-02', km: 62340, fuel: 108, cost: 10692, kmpl: 4.5, vendor: 'Bangladesh Petroleum, Kushtia' },
  { id: 20, vehicle: 'Sylhet Metro Gha-79-9516', vehicleId: 22, driver: 'Md. Habibur Rahman', driverId: 22, date: '2026-01-01', km: 34560, fuel: 62, cost: 6138, kmpl: 5.0, vendor: 'Shell, Sirajganj' },
  { id: 21, vehicle: 'Chittagong Metro Ta-72-3617', vehicleId: 23, driver: 'Md. Asaduzzaman', driverId: 23, date: '2025-12-31', km: 48920, fuel: 86, cost: 8514, kmpl: 4.7, vendor: 'Meghna Filling Station, Pabna' },
  { id: 22, vehicle: 'Barisal Metro Cha-44-7064', vehicleId: 24, driver: 'Md. Nizam Uddin', driverId: 24, date: '2025-12-30', km: 26780, fuel: 48, cost: 4752, kmpl: 5.2, vendor: 'Padma Filling Station, Manikganj' },
  { id: 23, vehicle: 'Barisal Metro Cha-69-1375', vehicleId: 25, driver: 'Md. Siddiqur Rahman', driverId: 25, date: '2025-12-29', km: 34560, fuel: 60, cost: 5940, kmpl: 4.8, vendor: 'Bashundhara Filling Station, Narayanganj (Industrial)' },
  { id: 24, vehicle: 'Dhaka Metro Ga-91-4444', vehicleId: 26, driver: 'Md. Ziaur Rahman', driverId: 26, date: '2025-12-28', km: 19870, fuel: 35, cost: 3465, kmpl: 5.1, vendor: 'Surma Filling Station, Patuakhali' },
  { id: 25, vehicle: 'Dhaka Metro Ga-16-7065', vehicleId: 27, driver: 'Md. Abdul Mazid', driverId: 27, date: '2025-12-27', km: 73450, fuel: 128, cost: 12672, kmpl: 4.4, vendor: 'Padma Filling Station, Bhola' },
  { id: 26, vehicle: 'Mymensingh Metro Dha-73-6672', vehicleId: 28, driver: 'Md. Habibur Rahim', driverId: 28, date: '2025-12-26', km: 61230, fuel: 108, cost: 10692, kmpl: 4.6, vendor: 'Bangladesh Petroleum, Noakhali' },
  { id: 27, vehicle: 'Dhaka Metro Ga-13-7683', vehicleId: 3, driver: 'Md. Hasan', driverId: 3, date: '2025-12-25', km: 30800, fuel: 55, cost: 5445, kmpl: 5.0, vendor: 'Shell, Comilla' },
  { id: 28, vehicle: 'Mymensingh Metro Dha-84-6554', vehicleId: 30, driver: 'Md. Rizwan Ahmed', driverId: 30, date: '2025-12-24', km: 44560, fuel: 78, cost: 7722, kmpl: 4.7, vendor: 'Surma Filling Station, Narsingdi' },
  { id: 29, vehicle: 'Chittagong Metro Ta-57-4489', vehicleId: 5, driver: 'Md. Rakibul Hasan', driverId: 5, date: '2025-12-23', km: 22000, fuel: 38, cost: 3762, kmpl: 5.2, vendor: 'Padma Filling Station, Gazipur' },
  { id: 30, vehicle: 'Rajshahi Metro U-66-5143', vehicleId: 7, driver: 'Md. Abul Bashar', driverId: 7, date: '2025-12-22', km: 88900, fuel: 140, cost: 13860, kmpl: 4.7, vendor: 'Bashundhara Filling Station, Chittagong' },
];

// Initial Data - 30 Trips
const initialTrips: Trip[] = [
  { id: 1, vehicle: 'Barisal Metro Cha-21-4722', vehicleId: 1, driver: 'Md. Rahim Uddin', driverId: 1, from: 'Dhaka', to: 'Chittagong', date: '2026-01-15', distance: 350, freight: 28000, fuelCost: 9800, tollCost: 1200, otherCost: 800, status: 'active' },
  { id: 2, vehicle: 'Mymensingh Metro Dha-77-3386', vehicleId: 2, driver: 'Abdul Karim', driverId: 2, from: 'Narayanganj', to: 'Mymensingh', date: '2026-01-14', distance: 620, freight: 45000, fuelCost: 17360, tollCost: 2400, otherCost: 1200, status: 'active' },
  { id: 3, vehicle: 'Rangpur Metro Ja-78-6663', vehicleId: 3, driver: 'Md. Hasan', driverId: 3, from: 'Comilla', to: 'Dhaka', date: '2026-01-13', distance: 460, freight: 32000, fuelCost: 12880, tollCost: 1800, otherCost: 600, status: 'inactive' },
  { id: 4, vehicle: 'Rangpur Metro Ja-26-9543', vehicleId: 5, driver: 'Md. Rakibul Hasan', driverId: 5, from: 'Gazipur', to: 'Bogra', date: '2026-01-12', distance: 1100, freight: 72000, fuelCost: 30800, tollCost: 4200, otherCost: 2000, status: 'inactive' },
  { id: 5, vehicle: 'Sylhet Metro Gha-27-7574', vehicleId: 7, driver: 'Md. Abul Bashar', driverId: 7, from: 'Chittagong', to: 'Khulna', date: '2026-01-15', distance: 980, freight: 85000, fuelCost: 39200, tollCost: 5800, otherCost: 3000, status: 'active' },
  { id: 6, vehicle: 'Khulna Metro Kha-57-8434', vehicleId: 9, driver: 'Md. Nasir Ahmed', driverId: 9, from: 'Khulna', to: 'Rajshahi', date: '2026-01-14', distance: 540, freight: 42000, fuelCost: 22680, tollCost: 3200, otherCost: 1500, status: 'active' },
  { id: 7, vehicle: 'Sylhet Metro Gha-80-2429', vehicleId: 10, driver: 'Md. Tanvir Hasan', driverId: 10, from: 'Sylhet', to: 'Rangamati', date: '2026-01-13', distance: 280, freight: 22000, fuelCost: 10640, tollCost: 900, otherCost: 500, status: 'inactive' },
  { id: 8, vehicle: 'Chittagong Metro Ta-46-1622', vehicleId: 11, driver: 'Md. Ruhul Amin', driverId: 11, from: 'Rajshahi', to: 'Khulna', date: '2026-01-12', distance: 540, freight: 41000, fuelCost: 22680, tollCost: 3200, otherCost: 1400, status: 'inactive' },
  { id: 9, vehicle: 'Dhaka Metro Ga-71-8484', vehicleId: 6, driver: 'Md. Jamal Uddin', driverId: 6, from: 'Rangpur', to: 'Dhaka', date: '2026-01-11', distance: 400, freight: 30000, fuelCost: 12800, tollCost: 1500, otherCost: 700, status: 'active' },
  { id: 10, vehicle: 'Rajshahi Metro U-44-3950', vehicleId: 8, driver: 'Md. Kamal Hossain', driverId: 8, from: 'Cox\'s Bazar', to: 'Dhaka', date: '2026-01-10', distance: 480, freight: 35000, fuelCost: 15360, tollCost: 1800, otherCost: 800, status: 'active' },
  { id: 11, vehicle: 'Barisal Metro Cha-18-6255', vehicleId: 14, driver: 'Md. Saiful Islam', driverId: 14, from: 'Faridpur', to: 'Sylhet', date: '2026-01-09', distance: 550, freight: 38000, fuelCost: 17600, tollCost: 2000, otherCost: 1000, status: 'inactive' },
  { id: 12, vehicle: 'Khulna Metro Kha-43-6002', vehicleId: 15, driver: 'Md. Anwarul Haque', driverId: 15, from: 'Barisal', to: 'Chittagong', date: '2026-01-08', distance: 450, freight: 33000, fuelCost: 14400, tollCost: 1700, otherCost: 750, status: 'active' },
  { id: 13, vehicle: 'Dhaka Metro Ga-43-2469', vehicleId: 16, driver: 'Md. Al Amin', driverId: 16, from: 'Jamalpur', to: 'Bogra', date: '2026-01-07', distance: 620, freight: 48000, fuelCost: 24800, tollCost: 2400, otherCost: 1200, status: 'inactive' },
  { id: 14, vehicle: 'Khulna Metro Kha-40-2392', vehicleId: 17, driver: 'Md. Abdul Gaffar', driverId: 17, from: 'Bogra', to: 'Mymensingh', date: '2026-01-06', distance: 560, freight: 44000, fuelCost: 24640, tollCost: 2200, otherCost: 1100, status: 'active' },
  { id: 15, vehicle: 'Rajshahi Metro U-79-1717', vehicleId: 18, driver: 'Md. Imam Hossain', driverId: 18, from: 'Narayanganj', to: 'Rangamati', date: '2026-01-05', distance: 260, freight: 20000, fuelCost: 9880, tollCost: 850, otherCost: 450, status: 'inactive' },
  { id: 16, vehicle: 'Dhaka Metro Ga-93-2457', vehicleId: 19, driver: 'Md. Jashim Uddin', driverId: 19, from: 'Chandpur', to: 'Khulna', date: '2026-01-04', distance: 300, freight: 24000, fuelCost: 12000, tollCost: 1000, otherCost: 500, status: 'active' },
  { id: 17, vehicle: 'Rajshahi Metro U-58-3854', vehicleId: 21, driver: 'Md. Abdul Halim', driverId: 21, from: 'Kushtia', to: 'Dhaka', date: '2026-01-03', distance: 140, freight: 12000, fuelCost: 5600, tollCost: 400, otherCost: 200, status: 'inactive' },
  { id: 18, vehicle: 'Khulna Metro Kha-54-6675', vehicleId: 22, driver: 'Md. Habibur Rahman', driverId: 22, from: 'Sirajganj', to: 'Chittagong', date: '2026-01-02', distance: 510, freight: 38000, fuelCost: 16320, tollCost: 1900, otherCost: 900, status: 'active' },
  { id: 19, vehicle: 'Chittagong Metro Ta-17-6873', vehicleId: 23, driver: 'Md. Asaduzzaman', driverId: 23, from: 'Pabna', to: 'Bogra', date: '2026-01-01', distance: 720, freight: 56000, fuelCost: 31680, tollCost: 2800, otherCost: 1400, status: 'inactive' },
  { id: 20, vehicle: 'Barisal Metro Cha-99-1055', vehicleId: 24, driver: 'Md. Nizam Uddin', driverId: 24, from: 'Manikganj', to: 'Sylhet', date: '2025-12-31', distance: 30, freight: 5000, fuelCost: 1200, tollCost: 100, otherCost: 50, status: 'active' },
  { id: 21, vehicle: 'Chittagong Metro Ta-80-3231', vehicleId: 25, driver: 'Md. Siddiqur Rahman', driverId: 25, from: 'Narayanganj (Industrial)', to: 'Rajshahi', date: '2025-12-30', distance: 220, freight: 18000, fuelCost: 8800, tollCost: 700, otherCost: 350, status: 'inactive' },
  { id: 22, vehicle: 'Barisal Metro Cha-88-9648', vehicleId: 26, driver: 'Md. Ziaur Rahman', driverId: 26, from: 'Patuakhali', to: 'Mymensingh', date: '2025-12-29', distance: 620, freight: 46000, fuelCost: 24800, tollCost: 2400, otherCost: 1200, status: 'active' },
  { id: 23, vehicle: 'Barisal Metro Cha-68-8832', vehicleId: 27, driver: 'Md. Abdul Mazid', driverId: 27, from: 'Bhola', to: 'Dhaka', date: '2025-12-28', distance: 650, freight: 48000, fuelCost: 28600, tollCost: 2500, otherCost: 1300, status: 'inactive' },
  { id: 24, vehicle: 'Barisal Metro Cha-44-5023', vehicleId: 28, driver: 'Md. Habibur Rahim', driverId: 28, from: 'Noakhali', to: 'Chittagong', date: '2025-12-27', distance: 350, freight: 28000, fuelCost: 14000, tollCost: 1200, otherCost: 600, status: 'active' },
  { id: 25, vehicle: 'Barisal Metro Cha-38-5137', vehicleId: 1, driver: 'Md. Rahim Uddin', driverId: 1, from: 'Dhaka', to: 'Mymensingh', date: '2025-12-26', distance: 620, freight: 45000, fuelCost: 21600, tollCost: 2400, otherCost: 1200, status: 'inactive' },
  { id: 26, vehicle: 'Barisal Metro Cha-43-9864', vehicleId: 30, driver: 'Md. Rizwan Ahmed', driverId: 30, from: 'Narsingdi', to: 'Bandarban', date: '2025-12-25', distance: 180, freight: 15000, fuelCost: 7200, tollCost: 500, otherCost: 250, status: 'active' },
  { id: 27, vehicle: 'Rajshahi Metro U-82-9364', vehicleId: 2, driver: 'Abdul Karim', driverId: 2, from: 'Narayanganj', to: 'Sylhet', date: '2025-12-24', distance: 180, freight: 16000, fuelCost: 6480, tollCost: 800, otherCost: 400, status: 'inactive' },
  { id: 28, vehicle: 'Mymensingh Metro Dha-53-4777', vehicleId: 7, driver: 'Md. Abul Bashar', driverId: 7, from: 'Chittagong', to: 'Dhaka', date: '2025-12-23', distance: 350, freight: 28000, fuelCost: 14000, tollCost: 1200, otherCost: 600, status: 'active' },
  { id: 29, vehicle: 'Mymensingh Metro Dha-12-8989', vehicleId: 9, driver: 'Md. Nasir Ahmed', driverId: 9, from: 'Khulna', to: 'Bogra', date: '2025-12-22', distance: 150, freight: 12000, fuelCost: 6000, tollCost: 600, otherCost: 300, status: 'inactive' },
  { id: 30, vehicle: 'Mymensingh Metro Dha-40-7969', vehicleId: 11, driver: 'Md. Ruhul Amin', driverId: 11, from: 'Rajshahi', to: 'Chandpur', date: '2025-12-21', distance: 265, freight: 21000, fuelCost: 10560, tollCost: 900, otherCost: 450, status: 'active' },
];

// Initial Data - 30 Maintenance Records
const initialMaintenance: MaintenanceRecord[] = [
  { id: 1, vehicle: 'Chittagong Metro Ta-22-5730', vehicleId: 1, date: '2025-12-10', work: 'Engine oil change, Filter replacement', vendor: 'Al-Haj Auto Works', cost: 8500, vat: 1530, status: 'approved', nextKm: 50500 },
  { id: 2, vehicle: 'Rajshahi Metro U-33-8227', vehicleId: 2, date: '2025-11-05', work: 'Brake pad replacement, Wheel alignment', vendor: 'Karim Auto Service', cost: 15200, vat: 2736, status: 'approved', nextKm: 65000 },
  { id: 3, vehicle: 'Barisal Metro Cha-14-4937', vehicleId: 3, date: '2026-01-02', work: 'AC service, Coolant flush', vendor: 'Rahman Motors', cost: 6800, vat: 1224, status: 'pending', nextKm: 35000 },
  { id: 4, vehicle: 'Dhaka Metro Ga-43-4675', vehicleId: 4, date: '2025-09-15', work: 'Major service - 75,000 KM', vendor: 'Dhaka Motor Service', cost: 32000, vat: 5760, status: 'approved', nextKm: 80000 },
  { id: 5, vehicle: 'Dhaka Metro Ga-74-4084', vehicleId: 5, date: '2025-12-28', work: 'Tyre rotation, Battery check', vendor: 'Quick Fix BD', cost: 3200, vat: 576, status: 'approved', nextKm: 25000 },
  { id: 6, vehicle: 'Sylhet Metro Gha-68-8644', vehicleId: 6, date: '2025-12-20', work: 'Gearbox oil change', vendor: 'Bengal Commercial Service', cost: 12500, vat: 2250, status: 'approved', nextKm: 45000 },
  { id: 7, vehicle: 'Rangpur Metro Ja-24-8790', vehicleId: 7, date: '2026-01-05', work: 'Suspension repair, Shock absorber replacement', vendor: 'Volvo Trucks Bangladesh', cost: 45000, vat: 8100, status: 'pending', nextKm: 92000 },
  { id: 8, vehicle: 'Mymensingh Metro Dha-76-2711', vehicleId: 8, date: '2025-12-15', work: 'Engine tune-up, Injector cleaning', vendor: 'Scania Bangladesh', cost: 28000, vat: 5040, status: 'approved', nextKm: 60000 },
  { id: 9, vehicle: 'Dhaka Metro Ga-80-7853', vehicleId: 9, date: '2025-11-28', work: 'Clutch replacement, Flywheel resurfacing', vendor: 'MAN Trucks Bangladesh', cost: 52000, vat: 9360, status: 'approved', nextKm: 75000 },
  { id: 10, vehicle: 'Chittagong Metro Ta-85-4691', vehicleId: 10, date: '2026-01-08', work: 'Regular service - 35,000 KM', vendor: 'Dhaka Motor Service', cost: 18500, vat: 3330, status: 'pending', nextKm: 38000 },
  { id: 11, vehicle: 'Chittagong Metro Ta-54-5792', vehicleId: 11, date: '2025-12-25', work: 'Differential overhaul', vendor: 'ACI Motors', cost: 35000, vat: 6300, status: 'approved', nextKm: 70000 },
  { id: 12, vehicle: 'Dhaka Metro Ga-75-5225', vehicleId: 12, date: '2026-01-10', work: 'Brake system overhaul', vendor: 'Rahim Afroz Motors', cost: 22000, vat: 3960, status: 'pending', nextKm: 32000 },
  { id: 13, vehicle: 'Mymensingh Metro Dha-14-4501', vehicleId: 13, date: '2025-10-05', work: 'Engine rebuild', vendor: 'Tata Bangladesh Service', cost: 185000, vat: 33300, status: 'approved', nextKm: 96000 },
  { id: 14, vehicle: 'Mymensingh Metro Dha-11-9360', vehicleId: 14, date: '2025-12-18', work: 'Transmission repair', vendor: 'Mercedes-Benz Bangladesh', cost: 42000, vat: 7560, status: 'approved', nextKm: 55000 },
  { id: 15, vehicle: 'Mymensingh Metro Dha-31-9177', vehicleId: 15, date: '2025-12-30', work: 'Air brake system check', vendor: 'Mahindra Bangladesh', cost: 8500, vat: 1530, status: 'approved', nextKm: 42000 },
  { id: 16, vehicle: 'Barisal Metro Cha-12-4368', vehicleId: 16, date: '2026-01-12', work: 'Radiator replacement, Coolant flush', vendor: 'Volvo Trucks Bangladesh', cost: 38000, vat: 6840, status: 'pending', nextKm: 105000 },
  { id: 17, vehicle: 'Chittagong Metro Ta-65-4959', vehicleId: 17, date: '2025-12-22', work: 'Exhaust system repair', vendor: 'Scania Bangladesh', cost: 18000, vat: 3240, status: 'approved', nextKm: 85000 },
  { id: 18, vehicle: 'Chittagong Metro Ta-35-8458', vehicleId: 18, date: '2026-01-06', work: 'Engine oil change, Air filter replacement', vendor: 'MAN Trucks Bangladesh', cost: 14000, vat: 2520, status: 'pending', nextKm: 44000 },
  { id: 19, vehicle: 'Rangpur Metro Ja-43-6057', vehicleId: 19, date: '2025-12-08', work: 'Steering box repair', vendor: 'ACI Motors', cost: 19500, vat: 3510, status: 'approved', nextKm: 63000 },
  { id: 20, vehicle: 'Rajshahi Metro U-97-8668', vehicleId: 20, date: '2025-11-12', work: 'Complete brake system replacement', vendor: 'Rahim Afroz Service Center', cost: 28500, vat: 5130, status: 'approved', nextKm: 90000 },
  { id: 21, vehicle: 'Rajshahi Metro U-72-1432', vehicleId: 21, date: '2025-12-02', work: 'Fuel pump replacement', vendor: 'Dhaka Motor Service', cost: 32000, vat: 5760, status: 'approved', nextKm: 65000 },
  { id: 22, vehicle: 'Dhaka Metro Ga-68-4750', vehicleId: 22, date: '2026-01-03', work: 'Power steering fluid change', vendor: 'Mercedes-Benz Bangladesh', cost: 7500, vat: 1350, status: 'pending', nextKm: 37000 },
  { id: 23, vehicle: 'Mymensingh Metro Dha-62-1068', vehicleId: 23, date: '2025-12-14', work: 'Electrical system check', vendor: 'ACI Motors', cost: 9500, vat: 1710, status: 'approved', nextKm: 52000 },
  { id: 24, vehicle: 'Rajshahi Metro U-29-7777', vehicleId: 24, date: '2026-01-09', work: 'Wheel alignment, Balancing', vendor: 'Tata Service Center', cost: 5500, vat: 990, status: 'pending', nextKm: 29000 },
  { id: 25, vehicle: 'Rangpur Metro Ja-58-7409', vehicleId: 25, date: '2025-12-26', work: 'Alternator replacement', vendor: 'Mahindra Bangladesh', cost: 18000, vat: 3240, status: 'approved', nextKm: 37000 },
  { id: 26, vehicle: 'Rangpur Metro Ja-50-9863', vehicleId: 26, date: '2026-01-11', work: 'First service - 20,000 KM', vendor: 'Rahim Afroz Motors', cost: 12000, vat: 2160, status: 'pending', nextKm: 22000 },
  { id: 27, vehicle: 'Rangpur Metro Ja-16-6336', vehicleId: 27, date: '2025-11-30', work: 'Clutch plate replacement', vendor: 'ACI Motors', cost: 28000, vat: 5040, status: 'approved', nextKm: 77000 },
  { id: 28, vehicle: 'Mymensingh Metro Dha-68-4416', vehicleId: 28, date: '2025-12-19', work: 'Engine overhaul', vendor: 'Volvo Trucks Bangladesh', cost: 95000, vat: 17100, status: 'approved', nextKm: 65000 },
  { id: 29, vehicle: 'Khulna Metro Kha-36-7948', vehicleId: 29, date: '2025-10-20', work: 'Crankshaft replacement', vendor: 'Scania Bangladesh', cost: 125000, vat: 22500, status: 'approved', nextKm: 98000 },
  { id: 30, vehicle: 'Khulna Metro Kha-80-5585', vehicleId: 30, date: '2026-01-04', work: 'Turbocharger repair', vendor: 'MAN Trucks Bangladesh', cost: 35000, vat: 6300, status: 'pending', nextKm: 47000 },
];

// Initial Data - 30 FASTag
const initialFASTags: FASTag[] = [
  { id: 1, fastagId: 'BD-001', vehicle: 'Rangpur Metro Ja-77-5572', vehicleId: 1, driver: 'Md. Rahim Uddin', driverId: 1, balance: 2450, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 4200, bank: 'Dutch-Bangla Bank' },
  { id: 2, fastagId: 'BD-002', vehicle: 'Dhaka Metro Ga-18-9771', vehicleId: 2, driver: 'Abdul Karim', driverId: 2, balance: 380, threshold: 500, status: 'warning', lastToll: '2026-01-14', monthlyToll: 3800, bank: 'BRAC Bank' },
  { id: 3, fastagId: 'BD-003', vehicle: 'Chittagong Metro Ta-75-9436', vehicleId: 3, driver: 'Md. Hasan', driverId: 3, balance: 1820, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 2900, bank: 'Sonali Bank' },
  { id: 4, fastagId: 'BD-004', vehicle: 'Dhaka Metro Ga-27-3075', vehicleId: 4, driver: 'Md. Shafiqul Islam', driverId: 4, balance: 120, threshold: 500, status: 'critical', lastToll: '2025-12-20', monthlyToll: 1200, bank: 'City Bank' },
  { id: 5, fastagId: 'BD-005', vehicle: 'Barisal Metro Cha-17-6906', vehicleId: 5, driver: 'Md. Rakibul Hasan', driverId: 5, balance: 3100, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 5100, bank: 'Dutch-Bangla Bank' },
  { id: 6, fastagId: 'BD-006', vehicle: 'Sylhet Metro Gha-30-4913', vehicleId: 6, driver: 'Md. Jamal Uddin', driverId: 6, balance: 650, threshold: 500, status: 'ok', lastToll: '2026-01-12', monthlyToll: 3400, bank: 'Pubali Bank' },
  { id: 7, fastagId: 'BD-007', vehicle: 'Dhaka Metro Ga-95-1909', vehicleId: 7, driver: 'Md. Abul Bashar', driverId: 7, balance: 5200, threshold: 1000, status: 'ok', lastToll: '2026-01-15', monthlyToll: 6800, bank: 'Dutch-Bangla Bank' },
  { id: 8, fastagId: 'BD-008', vehicle: 'Sylhet Metro Gha-85-6561', vehicleId: 8, driver: 'Md. Kamal Hossain', driverId: 8, balance: 890, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 4200, bank: 'BRAC Bank' },
  { id: 9, fastagId: 'BD-009', vehicle: 'Sylhet Metro Gha-21-8923', vehicleId: 9, driver: 'Md. Nasir Ahmed', driverId: 9, balance: 420, threshold: 500, status: 'warning', lastToll: '2026-01-14', monthlyToll: 5600, bank: 'Sonali Bank' },
  { id: 10, fastagId: 'BD-010', vehicle: 'Sylhet Metro Gha-73-2258', vehicleId: 10, driver: 'Md. Tanvir Hasan', driverId: 10, balance: 1850, threshold: 500, status: 'ok', lastToll: '2026-01-13', monthlyToll: 1800, bank: 'City Bank' },
  { id: 11, fastagId: 'BD-011', vehicle: 'Barisal Metro Cha-43-1377', vehicleId: 11, driver: 'Md. Ruhul Amin', driverId: 11, balance: 750, threshold: 500, status: 'ok', lastToll: '2026-01-12', monthlyToll: 4900, bank: 'Pubali Bank' },
  { id: 12, fastagId: 'BD-012', vehicle: 'Khulna Metro Kha-96-3749', vehicleId: 12, driver: 'Md. Shahidul Islam', driverId: 12, balance: 2340, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 3200, bank: 'Dutch-Bangla Bank' },
  { id: 13, fastagId: 'BD-013', vehicle: 'Rangpur Metro Ja-27-6129', vehicleId: 13, driver: 'Md. Mostafizur Rahman', driverId: 13, balance: 85, threshold: 500, status: 'critical', lastToll: '2025-12-15', monthlyToll: 1500, bank: 'BRAC Bank' },
  { id: 14, fastagId: 'BD-014', vehicle: 'Barisal Metro Cha-95-9814', vehicleId: 14, driver: 'Md. Saiful Islam', driverId: 14, balance: 1650, threshold: 500, status: 'ok', lastToll: '2026-01-13', monthlyToll: 3800, bank: 'Sonali Bank' },
  { id: 15, fastagId: 'BD-015', vehicle: 'Chittagong Metro Ta-33-5605', vehicleId: 15, driver: 'Md. Anwarul Haque', driverId: 15, balance: 980, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 4100, bank: 'City Bank' },
  { id: 16, fastagId: 'BD-016', vehicle: 'Sylhet Metro Gha-72-3439', vehicleId: 16, driver: 'Md. Al Amin', driverId: 16, balance: 3400, threshold: 1000, status: 'ok', lastToll: '2026-01-15', monthlyToll: 7200, bank: 'Dutch-Bangla Bank' },
  { id: 17, fastagId: 'BD-017', vehicle: 'Sylhet Metro Gha-63-8381', vehicleId: 17, driver: 'Md. Abdul Gaffar', driverId: 17, balance: 520, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 5400, bank: 'Pubali Bank' },
  { id: 18, fastagId: 'BD-018', vehicle: 'Mymensingh Metro Dha-20-9688', vehicleId: 18, driver: 'Md. Imam Hossain', driverId: 18, balance: 1420, threshold: 500, status: 'ok', lastToll: '2026-01-13', monthlyToll: 2100, bank: 'BRAC Bank' },
  { id: 19, fastagId: 'BD-019', vehicle: 'Mymensingh Metro Dha-21-2687', vehicleId: 19, driver: 'Md. Jashim Uddin', driverId: 19, balance: 640, threshold: 500, status: 'ok', lastToll: '2026-01-12', monthlyToll: 3600, bank: 'Sonali Bank' },
  { id: 20, fastagId: 'BD-020', vehicle: 'Rangpur Metro Ja-41-1488', vehicleId: 20, driver: 'Md. Rafiqul Islam', driverId: 20, balance: 180, threshold: 500, status: 'critical', lastToll: '2025-12-18', monthlyToll: 1900, bank: 'City Bank' },
  { id: 21, fastagId: 'BD-021', vehicle: 'Rangpur Metro Ja-37-1213', vehicleId: 21, driver: 'Md. Abdul Halim', driverId: 21, balance: 2150, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 4300, bank: 'Dutch-Bangla Bank' },
  { id: 22, fastagId: 'BD-022', vehicle: 'Rajshahi Metro U-93-8171', vehicleId: 22, driver: 'Md. Habibur Rahman', driverId: 22, balance: 780, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 2800, bank: 'BRAC Bank' },
  { id: 23, fastagId: 'BD-023', vehicle: 'Chittagong Metro Ta-98-1572', vehicleId: 23, driver: 'Md. Asaduzzaman', driverId: 23, balance: 430, threshold: 500, status: 'warning', lastToll: '2026-01-13', monthlyToll: 3900, bank: 'Pubali Bank' },
  { id: 24, fastagId: 'BD-024', vehicle: 'Rangpur Metro Ja-62-8304', vehicleId: 24, driver: 'Md. Nizam Uddin', driverId: 24, balance: 2850, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 2200, bank: 'Sonali Bank' },
  { id: 25, fastagId: 'BD-025', vehicle: 'Barisal Metro Cha-60-2057', vehicleId: 25, driver: 'Md. Siddiqur Rahman', driverId: 25, balance: 920, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 3400, bank: 'Dutch-Bangla Bank' },
  { id: 26, fastagId: 'BD-026', vehicle: 'Rangpur Metro Ja-38-6955', vehicleId: 26, driver: 'Md. Ziaur Rahman', driverId: 26, balance: 1680, threshold: 500, status: 'ok', lastToll: '2026-01-15', monthlyToll: 2600, bank: 'BRAC Bank' },
  { id: 27, fastagId: 'BD-027', vehicle: 'Rangpur Metro Ja-22-3464', vehicleId: 27, driver: 'Md. Abdul Mazid', driverId: 27, balance: 340, threshold: 500, status: 'warning', lastToll: '2026-01-12', monthlyToll: 5200, bank: 'City Bank' },
  { id: 28, fastagId: 'BD-028', vehicle: 'Khulna Metro Kha-87-2776', vehicleId: 28, driver: 'Md. Habibur Rahim', driverId: 28, balance: 1950, threshold: 500, status: 'ok', lastToll: '2026-01-13', monthlyToll: 4600, bank: 'Pubali Bank' },
  { id: 29, fastagId: 'BD-029', vehicle: 'Mymensingh Metro Dha-71-3565', vehicleId: 29, driver: 'Md. Abdul Quddus', driverId: 29, balance: 95, threshold: 500, status: 'critical', lastToll: '2025-12-22', monthlyToll: 1700, bank: 'Sonali Bank' },
  { id: 30, fastagId: 'BD-030', vehicle: 'Dhaka Metro Ga-46-7058', vehicleId: 30, driver: 'Md. Rizwan Ahmed', driverId: 30, balance: 2680, threshold: 500, status: 'ok', lastToll: '2026-01-14', monthlyToll: 3900, bank: 'Dutch-Bangla Bank' },
];

// Initial Data - 30 Tyres
const initialTyres: Tyre[] = [
  { id: 1, vehicle: 'Sylhet Metro Gha-18-2148', vehicleId: 1, tyreNo: 'TYR-001', position: 'Front LHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-08-10', changeKm: 42000, currentKm: 48320, cost: 18500, mileage: 80000, cpkm: 0.23 },
  { id: 2, vehicle: 'Khulna Metro Kha-23-9945', vehicleId: 1, tyreNo: 'TYR-002', position: 'Front RHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-08-10', changeKm: 42000, currentKm: 48320, cost: 18500, mileage: 80000, cpkm: 0.23 },
  { id: 3, vehicle: 'Mymensingh Metro Dha-29-7395', vehicleId: 1, tyreNo: 'TYR-003', position: 'Axle LHS Inner', size: '295/80 R22.5', brand: 'Apollo', changeDate: '2025-06-15', changeKm: 38000, currentKm: 48320, cost: 17200, mileage: 80000, cpkm: 0.22 },
  { id: 4, vehicle: 'Rangpur Metro Ja-47-4237', vehicleId: 1, tyreNo: 'TYR-004', position: 'Axle LHS Outer', size: '295/80 R22.5', brand: 'Apollo', changeDate: '2025-06-15', changeKm: 38000, currentKm: 48320, cost: 17200, mileage: 80000, cpkm: 0.22 },
  { id: 5, vehicle: 'Rajshahi Metro U-26-3031', vehicleId: 1, tyreNo: 'TYR-005', position: 'Axle RHS Inner', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-04-20', changeKm: 34000, currentKm: 48320, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 6, vehicle: 'Rajshahi Metro U-45-7983', vehicleId: 1, tyreNo: 'TYR-006', position: 'Axle RHS Outer', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-04-20', changeKm: 34000, currentKm: 48320, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 7, vehicle: 'Dhaka Metro Ga-89-8888', vehicleId: 2, tyreNo: 'TYR-007', position: 'Front LHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-09-20', changeKm: 55000, currentKm: 62150, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 8, vehicle: 'Rajshahi Metro U-55-8250', vehicleId: 2, tyreNo: 'TYR-008', position: 'Front RHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-09-20', changeKm: 55000, currentKm: 62150, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 9, vehicle: 'Khulna Metro Kha-61-1097', vehicleId: 2, tyreNo: 'TYR-009', position: 'Axle LHS Inner', size: '295/80 R22.5', brand: 'JK', changeDate: '2025-07-10', changeKm: 51000, currentKm: 62150, cost: 15500, mileage: 75000, cpkm: 0.21 },
  { id: 10, vehicle: 'Sylhet Metro Gha-56-7151', vehicleId: 2, tyreNo: 'TYR-010', position: 'Axle LHS Outer', size: '295/80 R22.5', brand: 'JK', changeDate: '2025-07-10', changeKm: 51000, currentKm: 62150, cost: 15500, mileage: 75000, cpkm: 0.21 },
  { id: 11, vehicle: 'Rajshahi Metro U-48-2320', vehicleId: 2, tyreNo: 'TYR-011', position: 'Axle RHS Inner', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-05-15', changeKm: 48000, currentKm: 62150, cost: 19500, mileage: 90000, cpkm: 0.22 },
  { id: 12, vehicle: 'Sylhet Metro Gha-57-9624', vehicleId: 2, tyreNo: 'TYR-012', position: 'Axle RHS Outer', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-05-15', changeKm: 48000, currentKm: 62150, cost: 19500, mileage: 90000, cpkm: 0.22 },
  { id: 13, vehicle: 'Rajshahi Metro U-45-5526', vehicleId: 3, tyreNo: 'TYR-013', position: 'Front LHS', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-11-05', changeKm: 25000, currentKm: 31200, cost: 22000, mileage: 100000, cpkm: 0.22 },
  { id: 14, vehicle: 'Dhaka Metro Ga-98-1494', vehicleId: 3, tyreNo: 'TYR-014', position: 'Front RHS', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-11-05', changeKm: 25000, currentKm: 31200, cost: 22000, mileage: 100000, cpkm: 0.22 },
  { id: 15, vehicle: 'Mymensingh Metro Dha-53-1042', vehicleId: 3, tyreNo: 'TYR-015', position: 'Axle LHS Inner', size: '10.00R20', brand: 'Michelin', changeDate: '2025-09-12', changeKm: 22000, currentKm: 31200, cost: 24500, mileage: 120000, cpkm: 0.20 },
  { id: 16, vehicle: 'Mymensingh Metro Dha-60-5146', vehicleId: 3, tyreNo: 'TYR-016', position: 'Axle LHS Outer', size: '10.00R20', brand: 'Michelin', changeDate: '2025-09-12', changeKm: 22000, currentKm: 31200, cost: 24500, mileage: 120000, cpkm: 0.20 },
  { id: 17, vehicle: 'Chittagong Metro Ta-24-6131', vehicleId: 7, tyreNo: 'TYR-017', position: 'Front LHS', size: '315/80 R22.5', brand: 'MRF', changeDate: '2025-07-20', changeKm: 75000, currentKm: 89450, cost: 21500, mileage: 90000, cpkm: 0.24 },
  { id: 18, vehicle: 'Rangpur Metro Ja-23-9258', vehicleId: 7, tyreNo: 'TYR-018', position: 'Front RHS', size: '315/80 R22.5', brand: 'MRF', changeDate: '2025-07-20', changeKm: 75000, currentKm: 89450, cost: 21500, mileage: 90000, cpkm: 0.24 },
  { id: 19, vehicle: 'Dhaka Metro Ga-59-2892', vehicleId: 7, tyreNo: 'TYR-019', position: 'Axle LHS Inner', size: '315/80 R22.5', brand: 'Apollo', changeDate: '2025-05-10', changeKm: 72000, currentKm: 89450, cost: 19800, mileage: 85000, cpkm: 0.23 },
  { id: 20, vehicle: 'Chittagong Metro Ta-45-6616', vehicleId: 7, tyreNo: 'TYR-020', position: 'Axle LHS Outer', size: '315/80 R22.5', brand: 'Apollo', changeDate: '2025-05-10', changeKm: 72000, currentKm: 89450, cost: 19800, mileage: 85000, cpkm: 0.23 },
  { id: 21, vehicle: 'Khulna Metro Kha-76-2475', vehicleId: 9, tyreNo: 'TYR-021', position: 'Front LHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-08-15', changeKm: 62000, currentKm: 72340, cost: 17800, mileage: 85000, cpkm: 0.21 },
  { id: 22, vehicle: 'Barisal Metro Cha-47-1400', vehicleId: 9, tyreNo: 'TYR-022', position: 'Front RHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-08-15', changeKm: 62000, currentKm: 72340, cost: 17800, mileage: 85000, cpkm: 0.21 },
  { id: 23, vehicle: 'Mymensingh Metro Dha-19-4609', vehicleId: 9, tyreNo: 'TYR-023', position: 'Axle LHS Inner', size: '295/80 R22.5', brand: 'JK', changeDate: '2025-06-05', changeKm: 58000, currentKm: 72340, cost: 16200, mileage: 80000, cpkm: 0.20 },
  { id: 24, vehicle: 'Khulna Metro Kha-89-5988', vehicleId: 9, tyreNo: 'TYR-024', position: 'Axle LHS Outer', size: '295/80 R22.5', brand: 'JK', changeDate: '2025-06-05', changeKm: 58000, currentKm: 72340, cost: 16200, mileage: 80000, cpkm: 0.20 },
  { id: 25, vehicle: 'Dhaka Metro Ga-49-2520', vehicleId: 10, tyreNo: 'TYR-025', position: 'Front LHS', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-10-25', changeKm: 30000, currentKm: 35600, cost: 20500, mileage: 95000, cpkm: 0.22 },
  { id: 26, vehicle: 'Mymensingh Metro Dha-40-9124', vehicleId: 10, tyreNo: 'TYR-026', position: 'Front RHS', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-10-25', changeKm: 30000, currentKm: 35600, cost: 20500, mileage: 95000, cpkm: 0.22 },
  { id: 27, vehicle: 'Dhaka Metro Ga-87-2437', vehicleId: 10, tyreNo: 'TYR-027', position: 'Axle LHS Inner', size: '295/80 R22.5', brand: 'Michelin', changeDate: '2025-08-18', changeKm: 27000, currentKm: 35600, cost: 22800, mileage: 110000, cpkm: 0.21 },
  { id: 28, vehicle: 'Dhaka Metro Ga-28-6258', vehicleId: 10, tyreNo: 'TYR-028', position: 'Axle LHS Outer', size: '295/80 R22.5', brand: 'Michelin', changeDate: '2025-08-18', changeKm: 27000, currentKm: 35600, cost: 22800, mileage: 110000, cpkm: 0.21 },
  { id: 29, vehicle: 'Khulna Metro Kha-30-8272', vehicleId: 6, tyreNo: 'TYR-029', position: 'Front LHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-09-28', changeKm: 35000, currentKm: 41800, cost: 18900, mileage: 85000, cpkm: 0.22 },
  { id: 30, vehicle: 'Chittagong Metro Ta-40-2674', vehicleId: 6, tyreNo: 'TYR-030', position: 'Front RHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-09-28', changeKm: 35000, currentKm: 41800, cost: 18900, mileage: 85000, cpkm: 0.22 },
];

// Initial Data - 30 Alerts
const initialAlerts: Alert[] = [
  { id: 1, type: 'critical', msg: 'Mymensingh Metro Dha-16-8662 — FASTag balance critically low (৳120)', time: '1h ago', read: false },
  { id: 2, type: 'warning', msg: 'Khulna Metro Kha-41-8615 — FASTag balance below threshold (৳380)', time: '2h ago', read: false },
  { id: 3, type: 'warning', msg: 'Mymensingh Metro Dha-37-5788 — FASTag balance below threshold (৳420)', time: '3h ago', read: false },
  { id: 4, type: 'critical', msg: 'Sylhet Metro Gha-47-5552 — FASTag balance critically low (৳85)', time: '4h ago', read: false },
  { id: 5, type: 'critical', msg: 'Dhaka Metro Ga-26-8231 — FASTag balance critically low (৳180)', time: '5h ago', read: false },
  { id: 6, type: 'warning', msg: 'Dhaka Metro Ga-17-6717 — FASTag balance below threshold (৳340)', time: '6h ago', read: false },
  { id: 7, type: 'warning', msg: 'Rangpur Metro Ja-32-7809 — FASTag balance below threshold (৳430)', time: '7h ago', read: false },
  { id: 8, type: 'critical', msg: 'Rajshahi Metro U-73-8689 — FASTag balance critically low (৳95)', time: '8h ago', read: false },
  { id: 9, type: 'info', msg: 'Mymensingh Metro Dha-81-6590 — Service pending approval (৳6,800)', time: '12h ago', read: false },
  { id: 10, type: 'info', msg: 'Chittagong Metro Ta-68-7002 — Service pending approval (৳45,000)', time: '14h ago', read: false },
  { id: 11, type: 'info', msg: 'Khulna Metro Kha-47-8564 — Service pending approval (৳18,500)', time: '16h ago', read: false },
  { id: 12, type: 'info', msg: 'Khulna Metro Kha-49-5022 — Service pending approval (৳22,000)', time: '18h ago', read: false },
  { id: 13, type: 'info', msg: 'Khulna Metro Kha-19-4310 — Service pending approval (৳38,000)', time: '20h ago', read: false },
  { id: 14, type: 'info', msg: 'Chittagong Metro Ta-43-4446 — Service pending approval (৳14,000)', time: '22h ago', read: false },
  { id: 15, type: 'info', msg: 'Barisal Metro Cha-97-1931 — Service pending approval (৳7,500)', time: '1d ago', read: false },
  { id: 16, type: 'info', msg: 'Barisal Metro Cha-63-9310 — Service pending approval (৳5,500)', time: '1d ago', read: false },
  { id: 17, type: 'info', msg: 'Dhaka Metro Ga-63-9525 — Service pending approval (৳12,000)', time: '1d ago', read: false },
  { id: 18, type: 'info', msg: 'Sylhet Metro Gha-42-5313 — Service pending approval (৳35,000)', time: '2d ago', read: false },
  { id: 19, type: 'warning', msg: 'Vehicle 6 — Overdue for service (41,800 KM vs 45,000 KM)', time: '2d ago', read: true },
  { id: 20, type: 'warning', msg: 'Vehicle 14 — Service due soon (51,230 KM vs 55,000 KM)', time: '3d ago', read: true },
  { id: 21, type: 'warning', msg: 'Vehicle 15 — Service due soon (39,870 KM vs 42,000 KM)', time: '3d ago', read: true },
  { id: 22, type: 'warning', msg: 'Vehicle 21 — Service due soon (62,340 KM vs 65,000 KM)', time: '4d ago', read: true },
  { id: 23, type: 'warning', msg: 'Vehicle 23 — Service due soon (48,920 KM vs 52,000 KM)', time: '4d ago', read: true },
  { id: 24, type: 'info', msg: 'Driver Md. Rahim Uddin — Completed 342 trips, 4.9 KMPL efficiency', time: '5d ago', read: true },
  { id: 25, type: 'info', msg: 'Driver Abdul Karim — Achieved 4.8 KMPL efficiency', time: '5d ago', read: true },
  { id: 26, type: 'warning', msg: 'Driver Md. Shafiqul Islam — 3 violations recorded this month', time: '7d ago', read: true },
  { id: 27, type: 'warning', msg: 'Driver Md. Mostafizur Rahman — 3 violations recorded this month', time: '7d ago', read: true },
  { id: 28, type: 'warning', msg: 'Driver Md. Rafiqul Islam — 3 violations recorded this month', time: '7d ago', read: true },
  { id: 29, type: 'info', msg: 'Fleet average fuel efficiency: 4.7 KMPL', time: '10d ago', read: true },
  { id: 30, type: 'info', msg: 'Monthly fuel consumption: 2,145 liters across 30 vehicles', time: '15d ago', read: true },
];

// Initial Data - 30 Inventory Items
const initialInventory: InventoryItem[] = [
  { id: 1, name: 'Engine Oil 15W40', category: 'Lubricants', quantity: 45, unit: 'L', minStock: 20, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 2, name: 'Brake Pads - Front', category: 'Brakes', quantity: 8, unit: 'sets', minStock: 10, location: 'Warehouse B', lastUpdated: '2026-01-14', status: 'low' },
  { id: 3, name: 'Air Filter - Heavy', category: 'Filters', quantity: 25, unit: 'pcs', minStock: 15, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 4, name: 'Coolant - Red', category: 'Fluids', quantity: 3, unit: 'L', minStock: 10, location: 'Warehouse A', lastUpdated: '2026-01-13', status: 'critical' },
  { id: 5, name: 'Tyre Tubes - 295/80', category: 'Tyres', quantity: 12, unit: 'pcs', minStock: 8, location: 'Warehouse C', lastUpdated: '2026-01-12', status: 'ok' },
  { id: 6, name: 'Headlight Bulbs - H4', category: 'Electrical', quantity: 18, unit: 'pcs', minStock: 10, location: 'Warehouse B', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 7, name: 'Wiper Blades - 24"', category: 'Accessories', quantity: 6, unit: 'sets', minStock: 10, location: 'Warehouse B', lastUpdated: '2026-01-10', status: 'low' },
  { id: 8, name: 'Transmission Oil', category: 'Lubricants', quantity: 30, unit: 'L', minStock: 15, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 9, name: 'Brake Pads - Rear', category: 'Brakes', quantity: 15, unit: 'sets', minStock: 12, location: 'Warehouse B', lastUpdated: '2026-01-14', status: 'ok' },
  { id: 10, name: 'Oil Filter - Primary', category: 'Filters', quantity: 32, unit: 'pcs', minStock: 20, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 11, name: 'Diesel Filter', category: 'Filters', quantity: 18, unit: 'pcs', minStock: 15, location: 'Warehouse A', lastUpdated: '2026-01-13', status: 'ok' },
  { id: 12, name: 'Brake Fluid DOT4', category: 'Fluids', quantity: 8, unit: 'L', minStock: 10, location: 'Warehouse A', lastUpdated: '2026-01-12', status: 'low' },
  { id: 13, name: 'Power Steering Oil', category: 'Fluids', quantity: 22, unit: 'L', minStock: 12, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 14, name: 'Tyre - 295/80 R22.5', category: 'Tyres', quantity: 4, unit: 'pcs', minStock: 6, location: 'Warehouse C', lastUpdated: '2026-01-14', status: 'low' },
  { id: 15, name: 'Battery - 12V 180Ah', category: 'Electrical', quantity: 3, unit: 'pcs', minStock: 5, location: 'Warehouse B', lastUpdated: '2026-01-10', status: 'critical' },
  { id: 16, name: 'Alternator - 24V', category: 'Electrical', quantity: 2, unit: 'pcs', minStock: 3, location: 'Warehouse B', lastUpdated: '2026-01-08', status: 'low' },
  { id: 17, name: 'Starter Motor', category: 'Electrical', quantity: 2, unit: 'pcs', minStock: 3, location: 'Warehouse B', lastUpdated: '2026-01-05', status: 'low' },
  { id: 18, name: 'Side Mirror - LHS', category: 'Accessories', quantity: 8, unit: 'pcs', minStock: 10, location: 'Warehouse B', lastUpdated: '2026-01-15', status: 'low' },
  { id: 19, name: 'Side Mirror - RHS', category: 'Accessories', quantity: 7, unit: 'pcs', minStock: 10, location: 'Warehouse B', lastUpdated: '2026-01-14', status: 'low' },
  { id: 20, name: 'Wheel Nuts - M24', category: 'Parts', quantity: 150, unit: 'pcs', minStock: 100, location: 'Warehouse C', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 21, name: 'Gear Oil 80W90', category: 'Lubricants', quantity: 28, unit: 'L', minStock: 15, location: 'Warehouse A', lastUpdated: '2026-01-13', status: 'ok' },
  { id: 22, name: 'Clutch Plate - 430mm', category: 'Parts', quantity: 4, unit: 'pcs', minStock: 6, location: 'Warehouse C', lastUpdated: '2026-01-12', status: 'low' },
  { id: 23, name: 'Brake Linings', category: 'Brakes', quantity: 20, unit: 'sets', minStock: 15, location: 'Warehouse B', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 24, name: 'Radiator Hose', category: 'Parts', quantity: 6, unit: 'pcs', minStock: 8, location: 'Warehouse C', lastUpdated: '2026-01-10', status: 'low' },
  { id: 25, name: 'Fuel Filter', category: 'Filters', quantity: 22, unit: 'pcs', minStock: 18, location: 'Warehouse A', lastUpdated: '2026-01-14', status: 'ok' },
  { id: 26, name: 'Hydraulic Oil', category: 'Fluids', quantity: 35, unit: 'L', minStock: 20, location: 'Warehouse A', lastUpdated: '2026-01-15', status: 'ok' },
  { id: 27, name: 'Tail Light Assembly', category: 'Electrical', quantity: 5, unit: 'pcs', minStock: 8, location: 'Warehouse B', lastUpdated: '2026-01-08', status: 'low' },
  { id: 28, name: 'Indicator Light', category: 'Electrical', quantity: 12, unit: 'pcs', minStock: 15, location: 'Warehouse B', lastUpdated: '2026-01-15', status: 'low' },
  { id: 29, name: 'Seat Belt', category: 'Accessories', quantity: 15, unit: 'pcs', minStock: 20, location: 'Warehouse B', lastUpdated: '2026-01-12', status: 'low' },
  { id: 30, name: 'Engine Gasket Set', category: 'Parts', quantity: 3, unit: 'sets', minStock: 5, location: 'Warehouse C', lastUpdated: '2026-01-06', status: 'low' },
];

// Initial Settings Data (In-Memory Only)
const initialCompanyInfo: CompanyInfo = {
  name: 'Fleet Management Solutions',
  email: 'contact@fleetmgmt.com',
  phone: '+880 2-98765432',
  address: '123 Gulshan Avenue, Dhaka - 1212, Bangladesh',
  website: 'www.fleetmgmt.com',
  gstin: 'BD-123456789'
};

const initialUserProfile: UserProfile = {
  name: 'Admin User',
  email: 'admin@fleetmgmt.com',
  phone: '+880 1XXXXXXXXX',
  role: 'Fleet Manager'
};

const initialNotifications: NotificationSettings = {
  emailAlerts: true,
  pushNotifications: true,
  smsAlerts: false,
  weeklyReport: true,
  maintenanceReminders: true,
  fuelAlerts: true,
  driverAlerts: true,
  vehicleAlerts: true
};

interface FleetStore {
  vehicles: Vehicle[];
  drivers: Driver[];
  fuelEntries: FuelEntry[];
  trips: Trip[];
  maintenance: MaintenanceRecord[];
  fastags: FASTag[];
  tyres: Tyre[];
  alerts: Alert[];
  inventory: InventoryItem[];

  // Settings (In-Memory Only)
  companyInfo: CompanyInfo;
  userProfile: UserProfile;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';

  // Vehicle actions
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: number) => void;

  // Driver actions
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: number, driver: Partial<Driver>) => void;
  deleteDriver: (id: number) => void;

  // Fuel actions
  addFuelEntry: (entry: Omit<FuelEntry, 'id'>) => void;
  deleteFuelEntry: (id: number) => void;

  // Trip actions
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: number, trip: Partial<Trip>) => void;
  deleteTrip: (id: number) => void;

  // Maintenance actions
  addMaintenance: (record: Omit<MaintenanceRecord, 'id'>) => void;
  updateMaintenance: (id: number, record: Partial<MaintenanceRecord>) => void;
  deleteMaintenance: (id: number) => void;

  // FASTag actions
  addFASTag: (fastag: Omit<FASTag, 'id'>) => void;
  updateFASTag: (id: number, fastag: Partial<FASTag>) => void;
  deleteFASTag: (id: number) => void;
  rechargeFASTag: (id: number, amount: number) => void;

  // Tyre actions
  addTyre: (tyre: Omit<Tyre, 'id'>) => void;
  updateTyre: (id: number, tyre: Partial<Tyre>) => void;
  deleteTyre: (id: number) => void;

  // Alert actions
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  markAlertRead: (id: number) => void;
  clearAlerts: () => void;
  deleteAlert: (id: number) => void;

  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: number) => void;

  // Settings actions (In-Memory Only)
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useFleetStore = create<FleetStore>((set, get) => ({
  vehicles: initialVehicles,
  drivers: initialDrivers,
  fuelEntries: initialFuelEntries,
  trips: initialTrips,
  maintenance: initialMaintenance,
  fastags: initialFASTags,
  tyres: initialTyres,
  alerts: initialAlerts,
  inventory: initialInventory,

  // Settings (In-Memory Only)
  companyInfo: initialCompanyInfo,
  userProfile: initialUserProfile,
  notifications: initialNotifications,
  theme: 'light',

  // Vehicle actions
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [...state.vehicles, { ...vehicle, id: Math.max(0, ...state.vehicles.map(v => v.id)) + 1 }]
  })),
  updateVehicle: (id, vehicle) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...vehicle } : v)
  })),
  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),

  // Driver actions
  addDriver: (driver) => set((state) => ({
    drivers: [...state.drivers, { ...driver, id: Math.max(0, ...state.drivers.map(d => d.id)) + 1 }]
  })),
  updateDriver: (id, driver) => set((state) => ({
    drivers: state.drivers.map(d => d.id === id ? { ...d, ...driver } : d)
  })),
  deleteDriver: (id) => set((state) => ({
    drivers: state.drivers.filter(d => d.id !== id)
  })),

  // Fuel actions
  addFuelEntry: (entry) => set((state) => ({
    fuelEntries: [...state.fuelEntries, { ...entry, id: Math.max(0, ...state.fuelEntries.map(e => e.id)) + 1 }]
  })),
  deleteFuelEntry: (id) => set((state) => ({
    fuelEntries: state.fuelEntries.filter(e => e.id !== id)
  })),

  // Trip actions
  addTrip: (trip) => set((state) => ({
    trips: [...state.trips, { ...trip, id: Math.max(0, ...state.trips.map(t => t.id)) + 1 }]
  })),
  updateTrip: (id, trip) => set((state) => ({
    trips: state.trips.map(t => t.id === id ? { ...t, ...trip } : t)
  })),
  deleteTrip: (id) => set((state) => ({
    trips: state.trips.filter(t => t.id !== id)
  })),

  // Maintenance actions
  addMaintenance: (record) => set((state) => ({
    maintenance: [...state.maintenance, { ...record, id: Math.max(0, ...state.maintenance.map(r => r.id)) + 1 }]
  })),
  updateMaintenance: (id, record) => set((state) => ({
    maintenance: state.maintenance.map(r => r.id === id ? { ...r, ...record } : r)
  })),
  deleteMaintenance: (id) => set((state) => ({
    maintenance: state.maintenance.filter(r => r.id !== id)
  })),

  // FASTag actions
  addFASTag: (fastag) => set((state) => ({
    fastags: [...state.fastags, { ...fastag, id: Math.max(0, ...state.fastags.map(f => f.id)) + 1 }]
  })),
  updateFASTag: (id, fastag) => set((state) => ({
    fastags: state.fastags.map(f => f.id === id ? { ...f, ...fastag } : f)
  })),
  deleteFASTag: (id) => set((state) => ({
    fastags: state.fastags.filter(f => f.id !== id)
  })),
  rechargeFASTag: (id, amount) => set((state) => ({
    fastags: state.fastags.map(f => {
      if (f.id !== id) return f;
      const newBalance = f.balance + amount;
      return {
        ...f,
        balance: newBalance,
        status: newBalance >= f.threshold ? 'ok' : (newBalance > 0 ? 'warning' : 'critical')
      };
    })
  })),

  // Tyre actions
  addTyre: (tyre) => set((state) => ({
    tyres: [...state.tyres, { ...tyre, id: Math.max(0, ...state.tyres.map(t => t.id)) + 1 }]
  })),
  updateTyre: (id, tyre) => set((state) => ({
    tyres: state.tyres.map(t => t.id === id ? { ...t, ...tyre } : t)
  })),
  deleteTyre: (id) => set((state) => ({
    tyres: state.tyres.filter(t => t.id !== id)
  })),

  // Alert actions
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, { ...alert, id: Math.max(0, ...state.alerts.map(a => a.id)) + 1 }]
  })),
  markAlertRead: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a)
  })),
  clearAlerts: () => set({ alerts: [] }),
  deleteAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),

  // Inventory actions
  addInventoryItem: (item) => set((state) => ({
    inventory: [...state.inventory, { ...item, id: Math.max(0, ...state.inventory.map(i => i.id)) + 1 }]
  })),
  updateInventoryItem: (id, item) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...item } : i)
  })),
  deleteInventoryItem: (id) => set((state) => ({
    inventory: state.inventory.filter(i => i.id !== id)
  })),

  // Settings actions (In-Memory Only)
  updateCompanyInfo: (info) => set((state) => ({
    companyInfo: { ...state.companyInfo, ...info }
  })),
  updateUserProfile: (profile) => set((state) => ({
    userProfile: { ...state.userProfile, ...profile }
  })),
  updateNotifications: (notifications) => set((state) => ({
    notifications: { ...state.notifications, ...notifications }
  })),
  setTheme: (theme) => set({ theme }),
}));
