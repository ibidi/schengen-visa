"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchengenChecker = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const contact_info_1 = require("./data/contact-info");
const visa_requirements_1 = require("./data/visa-requirements");
const document_checklist_1 = require("./data/document-checklist");
const Cache_1 = require("./utils/Cache");
const Statistics_1 = require("./utils/Statistics");
class SchengenChecker {
    constructor(options = {}) {
        this.randevular = [];
        this.sehir = options.sehir || 'ankara';
        this.rateLimit = options.rateLimit || 2000;
        this.cache = new Cache_1.Cache(options.cache);
        this.statistics = new Statistics_1.StatisticsTracker();
        this.enableStatistics = options.enableStatistics ?? true;
    }
    /**
     * Schengen ülkesi kontrolü
     */
    schengenMi(ulke) {
        return constants_1.SCHENGEN_ULKELERI.includes(ulke.toLowerCase());
    }
    /**
     * Müsait randevu kontrolü
     */
    async musaitRandevuKontrol(ulke, options = {}) {
        const startTime = Date.now();
        if (!this.schengenMi(ulke)) {
            throw new Error(`${ulke} Schengen ülkesi değil!`);
        }
        const sehir = options.sehir || this.sehir;
        const vizeTipi = options.vizeTipi || 'turist';
        const cacheKey = `${ulke}-${sehir}-${vizeTipi}`;
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
            const responseTime = Date.now() - startTime;
            if (this.enableStatistics) {
                this.statistics.recordCheck(cached, responseTime, true);
            }
            return cached;
        }
        const vizeMerkezi = constants_1.VIZE_MERKEZLERI[ulke.toLowerCase()];
        if (!vizeMerkezi) {
            const result = {
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
        }
        catch (error) {
            const result = {
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
    async gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi) {
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
            const response = await axios_1.default.get(url, {
                headers,
                timeout: 30000, // Increased to 30 seconds for slow government sites
                maxRedirects: 5,
                validateStatus: (status) => status < 500
            });
            if (response.status === 200) {
                const html = response.data.toLowerCase();
                const musaitAnahtarlar = ['available', 'müsait', 'musait', 'appointment'];
                const doluAnahtarlar = ['no appointment', 'randevu yok', 'dolu', 'full'];
                let durum = 'bilinmiyor';
                let mesaj = 'Site erişilebilir ancak randevu durumu belirlenemedi';
                if (doluAnahtarlar.some(anahtar => html.includes(anahtar))) {
                    durum = 'dolu';
                    mesaj = 'Şu an müsait randevu bulunmuyor';
                }
                else if (musaitAnahtarlar.some(anahtar => html.includes(anahtar))) {
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
        }
        catch (error) {
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
    async topluRandevuKontrol(ulkeler, options = {}) {
        const sonuclar = [];
        for (const ulke of ulkeler) {
            try {
                console.log(`${ulke} kontrol ediliyor...`);
                const sonuc = await this.musaitRandevuKontrol(ulke, options);
                sonuclar.push(sonuc);
                await this.bekle(this.rateLimit);
            }
            catch (error) {
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
    async tumUlkelerKontrol(options = {}) {
        const desteklenenUlkeler = Object.keys(constants_1.VIZE_MERKEZLERI);
        console.log(`${desteklenenUlkeler.length} ülke kontrol edilecek...`);
        return await this.topluRandevuKontrol(desteklenenUlkeler, options);
    }
    /**
     * Vize merkezi bilgisi
     */
    vizeMerkeziBilgisi(ulke) {
        const merkez = constants_1.VIZE_MERKEZLERI[ulke.toLowerCase()];
        if (!merkez)
            return null;
        return { ulke, ...merkez };
    }
    /**
     * Tüm vize merkezlerini listele
     */
    vizeMerkezleriListele() {
        return Object.keys(constants_1.VIZE_MERKEZLERI).map(ulke => ({
            ulke,
            ...constants_1.VIZE_MERKEZLERI[ulke]
        }));
    }
    /**
     * Şehre göre filtrele
     */
    sehreGoreVizeMerkezleri(sehir) {
        return Object.keys(constants_1.VIZE_MERKEZLERI)
            .filter(ulke => constants_1.VIZE_MERKEZLERI[ulke].sehirler.includes(sehir.toLowerCase()))
            .map(ulke => ({
            ulke,
            url: constants_1.VIZE_MERKEZLERI[ulke].url,
            tip: constants_1.VIZE_MERKEZLERI[ulke].tip,
            telefon: constants_1.VIZE_MERKEZLERI[ulke].telefonlar[sehir.toLowerCase()]
        }));
    }
    /**
     * Tüm ülke konfigürasyonlarını getir
     */
    getAllCountries() {
        return constants_1.COUNTRY_CONFIGS;
    }
    /**
     * Ülke ID'sine göre konfigürasyon getir
     */
    getCountryById(countryId) {
        return (0, constants_1.getCountryConfig)(countryId);
    }
    /**
     * Ülke adına göre konfigürasyon getir
     */
    getCountryByName(countryName) {
        return (0, constants_1.getCountryConfigByName)(countryName);
    }
    /**
     * Provider'a göre ülkeleri filtrele
     */
    getCountriesByProvider(provider) {
        return constants_1.COUNTRY_CONFIGS.filter(c => c.provider.toLowerCase().includes(provider.toLowerCase()));
    }
    /**
     * Ülke bilgilerini flag ile birlikte listele
     */
    listCountriesWithFlags() {
        return constants_1.COUNTRY_CONFIGS.map(c => ({
            id: c.id,
            name: c.name,
            flag: c.flag,
            provider: c.provider
        }));
    }
    /**
     * Konsolosluk/Vize merkezi iletişim bilgilerini getir
     */
    getContactInfo(countryId, city) {
        return (0, contact_info_1.getContactInfo)(countryId, city);
    }
    /**
     * Vize gereksinimlerini getir
     */
    getVisaRequirements(countryId, visaType = 'tourist') {
        return (0, visa_requirements_1.getVisaRequirements)(countryId, visaType);
    }
    /**
     * Ülkenin tüm vize türlerini getir
     */
    getAllVisaTypes(countryId) {
        return (0, visa_requirements_1.getAllVisaTypes)(countryId);
    }
    /**
     * Dokümantasyon kontrol listesini getir
     */
    getDocumentChecklist(countryId, visaType = 'tourist') {
        return (0, document_checklist_1.getDocumentChecklist)(countryId, visaType);
    }
    /**
     * Ülke hakkında kapsamlı bilgi getir
     */
    getCountryFullInfo(countryId) {
        const config = (0, constants_1.getCountryConfig)(countryId);
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
    clearCache() {
        this.cache.clear();
    }
    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
        this.cache.clearExpired();
    }
    /**
     * Enable/disable cache
     */
    setCacheEnabled(enabled) {
        this.cache.setEnabled(enabled);
    }
    /**
     * Set cache TTL
     */
    setCacheTTL(ttl) {
        this.cache.setTTL(ttl);
    }
    /**
     * Get statistics
     */
    getStatistics() {
        return this.statistics.getStatistics();
    }
    /**
     * Get country-specific statistics
     */
    getCountryStatistics(country) {
        return this.statistics.getCountryStatistics(country);
    }
    /**
     * Reset statistics
     */
    resetStatistics() {
        this.statistics.reset();
    }
    /**
     * Get success rate
     */
    getSuccessRate() {
        return this.statistics.getSuccessRate();
    }
    /**
     * Get cache hit rate
     */
    getCacheHitRate() {
        return this.statistics.getCacheHitRate();
    }
    bekle(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.SchengenChecker = SchengenChecker;
