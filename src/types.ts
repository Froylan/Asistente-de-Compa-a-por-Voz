export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  instructions: string;
  takenToday: boolean;
  lastConfirmedTime?: string;
}

export interface FamilyPhoto {
  id: string;
  title: string;
  caption: string;
  url: string;
  dateAdded: string;
}

export interface FamilyMessage {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  played: boolean;
}

export interface ProactiveSchedule {
  morningEnabled: boolean;
  morningTime: string;
  afternoonEnabled: boolean;
  afternoonTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
}

export interface FamilySettings {
  assistantName: string;
  grandmotherName: string;
  formality: 'usted' | 'tu';
  wakeWordSensitivity: number; // 1 to 5
  speechSpeed: number; // 0.7 to 1.1
  speechPitch: number;
  maleVoiceName?: 'Charon' | 'Fenrir' | 'Orus' | 'Puck';
  proactiveSchedule?: ProactiveSchedule;
  emergencyContacts: EmergencyContact[];
  medications: Medication[];
  photos: FamilyPhoto[];
  familyMessages: FamilyMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  intent?: string;
  suggestedReplies?: string[];
}
