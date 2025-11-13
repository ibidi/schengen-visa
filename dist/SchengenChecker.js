"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchengenChecker = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
class SchengenChecker {
    constructor(options = {}) {
        this.randevular = [];
        this.sehir = options.sehir || 'ankara';
        this.rateLimit = options.rateLimit || 2000;
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
        if (!this.schengenMi(ulke)) {
            throw new Error(`${ulke} Schengen ülkesi değil!`);
        }
        const vizeMerkezi = constants_1.VIZE_MERKEZLERI[ulke.toLowerCase()];
        if (!vizeMerkezi) {
            return {
                ulke,
                durum: 'bilinmiyor',
                mesaj: 'Bu ülke için otomatik kontrol henüz desteklenmiyor',
                url: '',
                kontrolTarihi: new Date()
            };
        }
        const sehir = options.sehir || this.sehir;
        const vizeTipi = options.vizeTipi || 'turist';
        try {
            return await this.gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi);
        }
        catch (error) {
            return {
                ulke,
                durum: 'hata',
                mesaj: `Kontrol sırasında hata: ${error.message}`,
                url: vizeMerkezi.url,
                kontrolTarihi: new Date()
            };
        }
    }
    /**
     * Gerçek HTTP kontrolü
     */
    async gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi) {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
        };
        try {
            const response = await axios_1.default.get(vizeMerkezi.url, {
                headers,
                timeout: 10000,
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
                    url: vizeMerkezi.url,
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
                url: vizeMerkezi.url,
                siteErisilebilir: false,
                httpDurum: response.status,
                kontrolTarihi: new Date()
            };
        }
        catch (error) {
            if (error.code === 'ECONNABORTED') {
                return {
                    ulke,
                    sehir,
                    durum: 'timeout',
                    mesaj: 'Site yanıt vermiyor (timeout)',
                    url: vizeMerkezi.url,
                    siteErisilebilir: false,
                    kontrolTarihi: new Date()
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
    bekle(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.SchengenChecker = SchengenChecker;
