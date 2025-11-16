import axios from 'axios';
import { 
  SchengenCheckerOptions, 
  KontrolOptions, 
  RandevuKontrolSonuc, 
  Randevu,
  VizeMerkezi,
  CountryConfig,
  ContactInfo,
  VisaRequirements,
  DocumentChecklist,
  Statistics
} from './types';
import { 
  SCHENGEN_ULKELERI, 
  VIZE_MERKEZLERI, 
  COUNTRY_CONFIGS,
  getCountryConfig,
  getCountryConfigByName
} from './constants';
import { getContactInfo } from './data/contact-info';
import { getVisaRequirements, getAllVisaTypes } from './data/visa-requirements';
import { getDocumentChecklist } from './data/document-checklist';
import { Cache } from './utils/Cache';
import { StatisticsTracker } from './utils/Statistics';

export class SchengenChecker {
  private sehir: string;
  private rateLimit: number;
  private randevular: Randevu[] = [];
  private cache: Cache;
  private statistics: StatisticsTracker;
  private enableStatistics: boolean;

  constructor(options: SchengenCheckerOptions = {}) {
    this.sehir = options.sehir || 'ankara';
    this.rateLimit = options.rateLimit || 2000;
    this.cache = new Cache(options.cache);
    this.statistics = new StatisticsTracker();
    this.enableStatistics = options.enableStatistics ?? true;
  }

  /**
   * Schengen ülkesi kontrolü
   */
  schengenMi(ulke: string): boolean {
    return SCHENGEN_ULKELERI.includes(ulke.toLowerCase() as any);
  }

  /**
   * Müsait randevu kontrolü
   */
  async musaitRandevuKontrol(
    ulke: string, 
    options: KontrolOptions = {}
  ): Promise<RandevuKontrolSonuc> {
    const startTime = Date.now();
    
    if (!this.schengenMi(ulke)) {
      throw new Error(`${ulke} Schengen ülkesi değil!`);
    }

    const sehir = options.sehir || this.sehir;
    const vizeTipi = options.vizeTipi || 'turist';
    const cacheKey = `${ulke}-${sehir}-${vizeTipi}`;

    // Check cache first
    const cached = this.cache.get<RandevuKontrolSonuc>(cacheKey);
    if (cached) {
      const responseTime = Date.now() - startTime;
      if (this.enableStatistics) {
        this.statistics.recordCheck(cached, responseTime, true);
      }
      return cached;
    }

    const vizeMerkezi = VIZE_MERKEZLERI[ulke.toLowerCase()];
    
    if (!vizeMerkezi) {
      const result: RandevuKontrolSonuc = {
        ulke,
        durum: 'bilinmiyor',
        mesaj: 'Bu ülke için otomatik kontrol henüz desteklenmiyor',
        url: '',
        kontrolTarihi: new Date()
      };
      return result;
    }

    try {
      const result = await this.gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi);
      
      // Cache the result
      this.cache.set(cacheKey, result);
      
      // Record statistics
      const responseTime = Date.now() - startTime;
      if (this.enableStatistics) {
        this.statistics.recordCheck(result, responseTime, false);
      }
      
      return result;
    } catch (error: any) {
      const result: RandevuKontrolSonuc = {
        ulke,
        durum: 'hata',
        mesaj: `Kontrol sırasında hata: ${error.message}`,
        url: vizeMerkezi.url,
        kontrolTarihi: new Date()
      };
      
      const responseTime = Date.now() - startTime;
      if (this.enableStatistics) {
        this.statistics.recordCheck(result, responseTime, false);
      }
      
      return result;
    }
  }

  /**
   * Gerçek HTTP kontrolü
   */
  private async gercekRandevuKontrol(
    ulke: string,
    sehir: string,
    vizeTipi: string,
    vizeMerkezi: VizeMerkezi
  ): Promise<RandevuKontrolSonuc> {
    // Build URL with city parameters if available
    let url = vizeMerkezi.url;
    
    // Debug: Check if cityParams exists
    if (vizeMerkezi.cityParams) {
      const cityCode = vizeMerkezi.cityParams[sehir.toLowerCase()];
      if (cityCode) {
        url = `${url}?locationCode=${cityCode}&request_locale=tr`;
      }
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    };

    try {
      const response = await axios.get(url, {
        headers,
        timeout: 30000, // Increased to 30 seconds for slow government sites
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });

      if (response.status === 200) {
        const html = response.data.toLowerCase();
        
        const musaitAnahtarlar = ['available', 'müsait', 'musait', 'appointment'];
        const doluAnahtarlar = ['no appointment', 'randevu yok', 'dolu', 'full'];
        
        let durum: RandevuKontrolSonuc['durum'] = 'bilinmiyor';
        let mesaj = 'Site erişilebilir ancak randevu durumu belirlenemedi';
        
        if (doluAnahtarlar.some(anahtar => html.includes(anahtar))) {
          durum = 'dolu';
          mesaj = 'Şu an müsait randevu bulunmuyor';
        } else if (musaitAnahtarlar.some(anahtar => html.includes(anahtar))) {
          durum = 'musait';
          mesaj = 'Randevu sistemi aktif - Detaylı kontrol için siteyi ziyaret edin';
        }

        return {
          ulke,
          sehir,
          vizeTipi,
          durum,
          mesaj,
          url, // Use the dynamically built URL
          siteErisilebilir: true,
          httpDurum: response.status,
          kontrolTarihi: new Date(),
          not: 'Kesin bilgi için resmi siteyi kontrol edin'
        };
      }

      return {
        ulke,
        sehir,
        durum: 'hata',
        mesaj: `Site erişim sorunu (HTTP ${response.status})`,
        url,
        siteErisilebilir: false,
        httpDurum: response.status,
        kontrolTarihi: new Date()
      };
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return {
          ulke,
          sehir,
          durum: 'timeout',
          mesaj: 'Site yanıt vermiyor (timeout - 30s). Resmi siteyi tarayıcıdan kontrol edin.',
          url,
          siteErisilebilir: false,
          kontrolTarihi: new Date(),
          not: 'Bazı resmi siteler bot koruması kullanır ve otomatik kontrol engellenebilir.'
        };
      }
      throw error;
    }
  }

  /**
   * Toplu kontrol
   */
  async topluRandevuKontrol(
    ulkeler: string[], 
    options: KontrolOptions = {}
  ): Promise<RandevuKontrolSonuc[]> {
    const sonuclar: RandevuKontrolSonuc[] = [];
    
    for (const ulke of ulkeler) {
      try {
        console.log(`${ulke} kontrol ediliyor...`);
        const sonuc = await this.musaitRandevuKontrol(ulke, options);
        sonuclar.push(sonuc);
        
        await this.bekle(this.rateLimit);
      } catch (error: any) {
        sonuclar.push({
          ulke,
          durum: 'hata',
          mesaj: error.message,
          url: '',
          kontrolTarihi: new Date()
        });
      }
    }
    
    return sonuclar;
  }

  /**
   * Tüm ülkeleri kontrol et
   */
  async tumUlkelerKontrol(options: KontrolOptions = {}): Promise<RandevuKontrolSonuc[]> {
    const desteklenenUlkeler = Object.keys(VIZE_MERKEZLERI);
    console.log(`${desteklenenUlkeler.length} ülke kontrol edilecek...`);
    return await this.topluRandevuKontrol(desteklenenUlkeler, options);
  }

  /**
   * Vize merkezi bilgisi
   */
  vizeMerkeziBilgisi(ulke: string): (VizeMerkezi & { ulke: string }) | null {
    const merkez = VIZE_MERKEZLERI[ulke.toLowerCase()];
    if (!merkez) return null;
    return { ulke, ...merkez };
  }

  /**
   * Tüm vize merkezlerini listele
   */
  vizeMerkezleriListele() {
    return Object.keys(VIZE_MERKEZLERI).map(ulke => ({
      ulke,
      ...VIZE_MERKEZLERI[ulke]
    }));
  }

  /**
   * Şehre göre filtrele
   */
  sehreGoreVizeMerkezleri(sehir: string) {
    return Object.keys(VIZE_MERKEZLERI)
      .filter(ulke => VIZE_MERKEZLERI[ulke].sehirler.includes(sehir.toLowerCase()))
      .map(ulke => ({
        ulke,
        url: VIZE_MERKEZLERI[ulke].url,
        tip: VIZE_MERKEZLERI[ulke].tip,
        telefon: VIZE_MERKEZLERI[ulke].telefonlar[sehir.toLowerCase()]
      }));
  }

  /**
   * Tüm ülke konfigürasyonlarını getir
   */
  getAllCountries(): CountryConfig[] {
    return COUNTRY_CONFIGS;
  }

  /**
   * Ülke ID'sine göre konfigürasyon getir
   */
  getCountryById(countryId: string): CountryConfig | undefined {
    return getCountryConfig(countryId);
  }

  /**
   * Ülke adına göre konfigürasyon getir
   */
  getCountryByName(countryName: string): CountryConfig | undefined {
    return getCountryConfigByName(countryName);
  }

  /**
   * Provider'a göre ülkeleri filtrele
   */
  getCountriesByProvider(provider: string): CountryConfig[] {
    return COUNTRY_CONFIGS.filter(c => 
      c.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  /**
   * Ülke bilgilerini flag ile birlikte listele
   */
  listCountriesWithFlags(): Array<{ id: string; name: string; flag: string; provider: string }> {
    return COUNTRY_CONFIGS.map(c => ({
      id: c.id,
      name: c.name,
      flag: c.flag,
      provider: c.provider
    }));
  }

  /**
   * Konsolosluk/Vize merkezi iletişim bilgilerini getir
   */
  getContactInfo(countryId: string, city?: string): ContactInfo[] {
    return getContactInfo(countryId, city);
  }

  /**
   * Vize gereksinimlerini getir
   */
  getVisaRequirements(countryId: string, visaType: string = 'tourist'): VisaRequirements | undefined {
    return getVisaRequirements(countryId, visaType);
  }

  /**
   * Ülkenin tüm vize türlerini getir
   */
  getAllVisaTypes(countryId: string): VisaRequirements[] {
    return getAllVisaTypes(countryId);
  }

  /**
   * Dokümantasyon kontrol listesini getir
   */
  getDocumentChecklist(countryId: string, visaType: string = 'tourist'): DocumentChecklist | undefined {
    return getDocumentChecklist(countryId, visaType);
  }

  /**
   * Ülke hakkında kapsamlı bilgi getir
   */
  getCountryFullInfo(countryId: string) {
    const config = getCountryConfig(countryId);
    const contacts = this.getContactInfo(countryId);
    const requirements = this.getVisaRequirements(countryId);
    const checklist = this.getDocumentChecklist(countryId);

    return {
      config,
      contacts,
      requirements,
      checklist,
      hasFullInfo: !!(config && contacts.length > 0 && requirements && checklist)
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    this.cache.clearExpired();
  }

  /**
   * Enable/disable cache
   */
  setCacheEnabled(enabled: boolean): void {
    this.cache.setEnabled(enabled);
  }

  /**
   * Set cache TTL
   */
  setCacheTTL(ttl: number): void {
    this.cache.setTTL(ttl);
  }

  /**
   * Get statistics
   */
  getStatistics(): Statistics {
    return this.statistics.getStatistics();
  }

  /**
   * Get country-specific statistics
   */
  getCountryStatistics(country: string) {
    return this.statistics.getCountryStatistics(country);
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.statistics.reset();
  }

  /**
   * Get success rate
   */
  getSuccessRate(): number {
    return this.statistics.getSuccessRate();
  }

  /**
   * Get cache hit rate
   */
  getCacheHitRate(): number {
    return this.statistics.getCacheHitRate();
  }

  private bekle(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
