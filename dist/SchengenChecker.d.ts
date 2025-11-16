import { SchengenCheckerOptions, KontrolOptions, RandevuKontrolSonuc, VizeMerkezi, CountryConfig, ContactInfo, VisaRequirements, DocumentChecklist, Statistics } from './types';
export declare class SchengenChecker {
    private sehir;
    private rateLimit;
    private randevular;
    private cache;
    private statistics;
    private enableStatistics;
    constructor(options?: SchengenCheckerOptions);
    /**
     * Schengen ülkesi kontrolü
     */
    schengenMi(ulke: string): boolean;
    /**
     * Müsait randevu kontrolü
     */
    musaitRandevuKontrol(ulke: string, options?: KontrolOptions): Promise<RandevuKontrolSonuc>;
    /**
     * Gerçek HTTP kontrolü
     */
    private gercekRandevuKontrol;
    /**
     * Toplu kontrol
     */
    topluRandevuKontrol(ulkeler: string[], options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>;
    /**
     * Tüm ülkeleri kontrol et
     */
    tumUlkelerKontrol(options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>;
    /**
     * Vize merkezi bilgisi
     */
    vizeMerkeziBilgisi(ulke: string): (VizeMerkezi & {
        ulke: string;
    }) | null;
    /**
     * Tüm vize merkezlerini listele
     */
    vizeMerkezleriListele(): {
        url: string;
        tip: "vfs-global" | "bls-international" | "konsolosluk";
        sehirler: string[];
        telefonlar: Record<string, string>;
        cityParams?: Record<string, string>;
        ulke: string;
    }[];
    /**
     * Şehre göre filtrele
     */
    sehreGoreVizeMerkezleri(sehir: string): {
        ulke: string;
        url: string;
        tip: "vfs-global" | "bls-international" | "konsolosluk";
        telefon: string;
    }[];
    /**
     * Tüm ülke konfigürasyonlarını getir
     */
    getAllCountries(): CountryConfig[];
    /**
     * Ülke ID'sine göre konfigürasyon getir
     */
    getCountryById(countryId: string): CountryConfig | undefined;
    /**
     * Ülke adına göre konfigürasyon getir
     */
    getCountryByName(countryName: string): CountryConfig | undefined;
    /**
     * Provider'a göre ülkeleri filtrele
     */
    getCountriesByProvider(provider: string): CountryConfig[];
    /**
     * Ülke bilgilerini flag ile birlikte listele
     */
    listCountriesWithFlags(): Array<{
        id: string;
        name: string;
        flag: string;
        provider: string;
    }>;
    /**
     * Konsolosluk/Vize merkezi iletişim bilgilerini getir
     */
    getContactInfo(countryId: string, city?: string): ContactInfo[];
    /**
     * Vize gereksinimlerini getir
     */
    getVisaRequirements(countryId: string, visaType?: string): VisaRequirements | undefined;
    /**
     * Ülkenin tüm vize türlerini getir
     */
    getAllVisaTypes(countryId: string): VisaRequirements[];
    /**
     * Dokümantasyon kontrol listesini getir
     */
    getDocumentChecklist(countryId: string, visaType?: string): DocumentChecklist | undefined;
    /**
     * Ülke hakkında kapsamlı bilgi getir
     */
    getCountryFullInfo(countryId: string): {
        config: CountryConfig | undefined;
        contacts: ContactInfo[];
        requirements: VisaRequirements | undefined;
        checklist: DocumentChecklist | undefined;
        hasFullInfo: boolean;
    };
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        maxSize: number;
        hits: number;
        misses: number;
        hitRate: string;
        enabled: boolean;
        ttl: number;
    };
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Clear expired cache entries
     */
    clearExpiredCache(): void;
    /**
     * Enable/disable cache
     */
    setCacheEnabled(enabled: boolean): void;
    /**
     * Set cache TTL
     */
    setCacheTTL(ttl: number): void;
    /**
     * Get statistics
     */
    getStatistics(): Statistics;
    /**
     * Get country-specific statistics
     */
    getCountryStatistics(country: string): import("./types").CountryStat | null;
    /**
     * Reset statistics
     */
    resetStatistics(): void;
    /**
     * Get success rate
     */
    getSuccessRate(): number;
    /**
     * Get cache hit rate
     */
    getCacheHitRate(): number;
    private bekle;
}
