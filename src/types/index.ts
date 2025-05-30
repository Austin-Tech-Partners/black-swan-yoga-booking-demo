export interface Class {
  id: string;
  name: string;
  style: string;
  teacher: Teacher;
  studio: Studio;
  startTime: string;
  endTime: string;
  heatLevel: number;
  spotsLeft: number;
  maxSpots: number;
}

export interface Teacher {
  id: string;
  name: string;
  bio: string;
  photoUrl?: string;
}

export interface Studio {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  upcomingClasses: Class[];
  pastClasses: Class[];
  membershipStatus?: 'none' | 'active' | 'expired';
}

export interface Booking {
  id: string;
  classId: string;
  userId: string;
  donationAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
} 