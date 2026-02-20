// Enhanced localStorage-based store with mock data, badges, settings

export interface AttendXEvent {
  id: string;
  name: string;
  courseCode?: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  lat: number;
  lng: number;
  duration: number;
  appId: string;
  status: 'active' | 'upcoming' | 'expired';
  checkIns: number;
  enrolled: number;
  createdAt: string;
  instructor?: string;
}

export interface AttendanceRecord {
  eventId: string;
  eventName: string;
  courseCode?: string;
  instructor?: string;
  date: string;
  proofHash: string;
  txnId: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'failed';
  blockNumber?: number;
  distance?: number;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserSettings {
  role: 'student' | 'instructor' | null;
  displayName: string;
  institution: string;
  theme: 'dark' | 'darker' | 'oled';
  accentColor: string;
  animationIntensity: 'full' | 'reduced' | 'minimal';
  showAttendancePublicly: boolean;
  allowInstructorSeeWallet: boolean;
  participateAnalytics: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();
const generateAppId = () => Math.floor(1000000 + Math.random() * 9000000).toString();
const generateTxnId = () => 'TX' + Array.from({ length: 52 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join('');
const generateProofHash = () => '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Mock data seeding ---
const MOCK_EVENTS: AttendXEvent[] = [
  {
    id: "EVT001", name: "Algorithms & Data Structures", courseCode: "CS301",
    description: "Advanced sorting and graph algorithms",
    date: "2026-02-19", time: "10:00", endTime: "11:30", location: "Room 302, CS Building",
    lat: 37.7749, lng: -122.4194, duration: 90, appId: "4821937",
    status: "active", checkIns: 32, enrolled: 45, createdAt: new Date().toISOString(),
    instructor: "Dr. Sarah Chen"
  },
  {
    id: "EVT002", name: "Calculus II", courseCode: "MATH201",
    description: "Integration techniques and applications",
    date: "2026-02-20", time: "14:00", endTime: "15:30", location: "Lecture Hall A",
    lat: 37.7751, lng: -122.4180, duration: 90, appId: "7293104",
    status: "upcoming", checkIns: 0, enrolled: 60, createdAt: new Date().toISOString(),
    instructor: "Prof. James Miller"
  },
  {
    id: "EVT003", name: "Entrepreneurship 101", courseCode: "BUS101",
    description: "Startup ideation and pitch practice",
    date: "2026-02-17", time: "09:00", endTime: "10:00", location: "Innovation Hub",
    lat: 37.7745, lng: -122.4200, duration: 60, appId: "5610283",
    status: "expired", checkIns: 28, enrolled: 35, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    instructor: "Dr. Lisa Park"
  },
];

const MOCK_RECORDS: AttendanceRecord[] = [
  { eventId: "EVT001", eventName: "Algorithms & Data Structures", courseCode: "CS301", instructor: "Dr. Sarah Chen", date: "2026-02-19", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date().toISOString(), status: "verified", blockNumber: 48291034, distance: 47 },
  { eventId: "EVT003", eventName: "Entrepreneurship 101", courseCode: "BUS101", instructor: "Dr. Lisa Park", date: "2026-02-17", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: "verified", blockNumber: 48288921, distance: 23 },
  { eventId: "EVT001", eventName: "Algorithms & Data Structures", courseCode: "CS301", instructor: "Dr. Sarah Chen", date: "2026-02-18", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000).toISOString(), status: "verified", blockNumber: 48290012, distance: 31 },
  { eventId: "EVT003", eventName: "Entrepreneurship 101", courseCode: "BUS101", instructor: "Dr. Lisa Park", date: "2026-02-15", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), status: "verified", blockNumber: 48285103, distance: 55 },
  { eventId: "EVT002", eventName: "Calculus II", courseCode: "MATH201", instructor: "Prof. James Miller", date: "2026-02-14", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), status: "verified", blockNumber: 48283920, distance: 12 },
  { eventId: "EVT001", eventName: "Algorithms & Data Structures", courseCode: "CS301", instructor: "Dr. Sarah Chen", date: "2026-02-13", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 6).toISOString(), status: "verified", blockNumber: 48282001, distance: 44 },
  { eventId: "EVT003", eventName: "Entrepreneurship 101", courseCode: "BUS101", instructor: "Dr. Lisa Park", date: "2026-02-12", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), status: "verified", blockNumber: 48280103, distance: 67 },
  { eventId: "EVT002", eventName: "Calculus II", courseCode: "MATH201", instructor: "Prof. James Miller", date: "2026-02-11", proofHash: generateProofHash(), txnId: generateTxnId(), timestamp: new Date(Date.now() - 86400000 * 8).toISOString(), status: "verified", blockNumber: 48278421, distance: 29 },
];

const DEFAULT_BADGES: Badge[] = [
  { id: "first", name: "First Attendance", emoji: "🥇", description: "Recorded your first attendance", unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "streak7", name: "7-Day Streak", emoji: "🔥", description: "Attended 7 days in a row", unlocked: true, unlockedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "perfect", name: "Perfect Month", emoji: "💯", description: "100% attendance for a full month", unlocked: false },
  { id: "courses10", name: "10 Courses", emoji: "🎓", description: "Attended 10 different courses", unlocked: false },
  { id: "early", name: "Early Bird", emoji: "⚡", description: "First to check in to an event", unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "privacy", name: "Privacy Champion", emoji: "🛡️", description: "All data stays anonymous", unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "veteran", name: "Chain Veteran", emoji: "⛓️", description: "50+ on-chain records", unlocked: false },
];

function seedMockData() {
  if (!localStorage.getItem('attendx_seeded')) {
    saveToStorage('attendx_events', MOCK_EVENTS);
    saveToStorage('attendx_attendance', MOCK_RECORDS);
    saveToStorage('attendx_badges', DEFAULT_BADGES);
    localStorage.setItem('attendx_seeded', 'true');
  }
}

// Auto-seed on import
seedMockData();

// Events
export function getEvents(): AttendXEvent[] {
  return loadFromStorage<AttendXEvent[]>('attendx_events', []);
}

export function saveEvent(event: Omit<AttendXEvent, 'id' | 'appId' | 'status' | 'checkIns' | 'enrolled' | 'createdAt'>): AttendXEvent {
  const events = getEvents();
  const newEvent: AttendXEvent = {
    ...event,
    id: generateId(),
    appId: generateAppId(),
    status: 'active',
    checkIns: 0,
    enrolled: Math.floor(20 + Math.random() * 40),
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveToStorage('attendx_events', events);
  return newEvent;
}

// Attendance
export function getAttendanceRecords(): AttendanceRecord[] {
  return loadFromStorage<AttendanceRecord[]>('attendx_attendance', []);
}

export function submitAttendance(eventId: string, eventName: string): { record: AttendanceRecord; txnId: string } {
  const records = getAttendanceRecords();
  const txnId = generateTxnId();
  const record: AttendanceRecord = {
    eventId,
    eventName,
    date: new Date().toLocaleDateString(),
    proofHash: generateProofHash(),
    txnId,
    timestamp: new Date().toISOString(),
    status: 'verified',
    blockNumber: 48290000 + Math.floor(Math.random() * 10000),
    distance: Math.floor(10 + Math.random() * 80),
  };
  records.push(record);
  saveToStorage('attendx_attendance', records);

  const events = getEvents();
  const idx = events.findIndex(e => e.id === eventId);
  if (idx >= 0) {
    events[idx].checkIns++;
    saveToStorage('attendx_events', events);
  }

  return { record, txnId };
}

// Wallet
export function getWallet(): string | null {
  return localStorage.getItem('attendx_wallet');
}

export function connectWallet(): string {
  const addr = 'ALGO' + Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join('') + '...X7F2';
  localStorage.setItem('attendx_wallet', addr);
  return addr;
}

export function disconnectWallet() {
  localStorage.removeItem('attendx_wallet');
}

// Badges
export function getBadges(): Badge[] {
  return loadFromStorage<Badge[]>('attendx_badges', DEFAULT_BADGES);
}

// Settings
export function getSettings(): UserSettings {
  return loadFromStorage<UserSettings>('attendx_settings', {
    role: null,
    displayName: '',
    institution: '',
    theme: 'dark',
    accentColor: 'mint',
    animationIntensity: 'full',
    showAttendancePublicly: false,
    allowInstructorSeeWallet: false,
    participateAnalytics: true,
  });
}

export function saveSettings(settings: Partial<UserSettings>) {
  const current = getSettings();
  saveToStorage('attendx_settings', { ...current, ...settings });
}

// Role
export function getRole(): 'student' | 'instructor' | null {
  return getSettings().role;
}

export function setRole(role: 'student' | 'instructor') {
  saveSettings({ role });
}

// Mock Algorand block counter
export function getBlockHeight(): number {
  const base = 48291000;
  const elapsed = Math.floor((Date.now() - new Date('2026-02-19').getTime()) / 4000);
  return base + Math.max(0, elapsed);
}
