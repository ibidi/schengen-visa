export interface VizeMerkezi {
  url: string;
  tip: 'vfs-global' | 'bls-international' | 'konsolosluk';
  sehirler: string[];
  telefonlar: Record<string, string>;
  cityParams?: Record<string, string>; // For dynamic city-based URLs
}

export interface CountryConfig {
  id: string;
  name: string;
  flag: string;
  provider: string;
  bookingBaseUrl: string;
  notes?: string;
}

export interface RandevuKontrolSonuc {
  ulke: string;
  sehir?: string;
  vizeTipi?: string;
  durum: 'musait' | 'dolu' | 'bilinmiyor' | 'hata' | 'timeout';
  mesaj: string;
  url: string;
  siteErisilebilir?: boolean;
  httpDurum?: number;
  kontrolTarihi: Date;
  not?: string;
}

export interface Randevu {
  id: number;
  ad: string;
  soyad: string;
  pasaportNo: string;
  dogumTarihi: string;
  ulke: string;
  sehir: string;
  vizeTipi: string;
  randevuTarihi: Date;
  randevuSaati: string;
  durum: 'beklemede' | 'onaylandı' | 'reddedildi' | 'iptal';
  olusturmaTarihi: Date;
  referansNo: string;
  iptalTarihi?: Date;
  durumGuncellemeTarihi?: Date;
}

export interface SchengenCheckerOptions {
  ulke?: string;
  sehir?: string;
  rateLimit?: number;
  cache?: Partial<CacheOptions>;
  enableStatistics?: boolean;
}

export interface KontrolOptions {
  sehir?: string;
  vizeTipi?: string;
}

export interface ContactInfo {
  country: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  website: string;
  workingHours: string;
  emergencyContact?: string;
}

export interface VisaRequirements {
  country: string;
  visaType: string;
  requiredDocuments: string[];
  processingTime: string;
  visaFee: string;
  validityPeriod: string;
  stayDuration: string;
  additionalInfo?: string[];
}

export interface DocumentChecklist {
  country: string;
  visaType: string;
  mandatory: DocumentItem[];
  optional: DocumentItem[];
  tips: string[];
}

export interface DocumentItem {
  name: string;
  description: string;
  format?: string;
  quantity?: number;
}

export interface CacheOptions {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache entries
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface Statistics {
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  mostCheckedCountries: CountryStat[];
  lastUpdated: Date;
}

export interface CountryStat {
  country: string;
  countryName: string;
  flag: string;
  checkCount: number;
  successRate: number;
  averageResponseTime: number;
}
