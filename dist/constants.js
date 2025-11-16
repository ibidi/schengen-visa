"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIZE_MERKEZLERI = exports.getCountryConfigByName = exports.getCountryConfig = exports.COUNTRY_CONFIGS = exports.SCHENGEN_ULKELERI = void 0;
exports.SCHENGEN_ULKELERI = [
    'almanya', 'avusturya', 'belcika', 'cekyarepublik', 'danimarka',
    'estonya', 'finlandiya', 'fransa', 'hollanda', 'isvec', 'isvicre',
    'ispanya', 'italya', 'izlanda', 'letonya', 'litvanya', 'luksemburg',
    'macaristan', 'malta', 'norvec', 'polonya', 'portekiz', 'slovakya',
    'slovenya', 'yunanistan', 'bulgaristan', 'hirvatistan'
];
/**
 * Ülke konfigürasyonları - modul.json'dan entegre edildi
 */
exports.COUNTRY_CONFIGS = [
    {
        id: 'fr',
        name: 'Fransa',
        flag: '🇫🇷',
        provider: 'TLScontact',
        bookingBaseUrl: 'https://fr.tlscontact.com',
        notes: 'Şehir bazlı subdomain yapısı kullanılıyor.'
    },
    {
        id: 'nl',
        name: 'Hollanda',
        flag: '🇳🇱',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Ülke ve başvuru ülkesi seçimi sonrası randevu ekranı geliyor.'
    },
    {
        id: 'de',
        name: 'Almanya',
        flag: '🇩🇪',
        provider: 'iDATA',
        bookingBaseUrl: 'https://idata.com.tr',
        notes: 'Türkiye başvuruları iDATA üzerinden, diğer ülkelerde VFS de olabiliyor.'
    },
    {
        id: 'es',
        name: 'İspanya',
        flag: '🇪🇸',
        provider: 'BLS International',
        bookingBaseUrl: 'https://spain.blsspainvisa.com',
        notes: 'Schengen İspanya randevuları BLS üzerinden dönüyor.'
    },
    {
        id: 'it',
        name: 'İtalya',
        flag: '🇮🇹',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Bazı ülkelerde TLS/BLS varyasyonları var ama ana operatör VFS kabul edilebilir.'
    },
    {
        id: 'se',
        name: 'İsveç',
        flag: '🇸🇪',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'İsveç çoğu ülkede VFS ile çalışıyor.'
    },
    {
        id: 'cz',
        name: 'Çekya',
        flag: '🇨🇿',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Bazı yerlerde Çekya için farklı partnerler olsa da VFS ana giriş kapısı gibi düşün.'
    },
    {
        id: 'hr',
        name: 'Hırvatistan',
        flag: '🇭🇷',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Schengen sonrası da çoğu yerde VFS üzerinden devam ediyor.'
    },
    {
        id: 'bg',
        name: 'Bulgaristan',
        flag: '🇧🇬',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Bulgaristan için de yaygın olarak VFS var.'
    },
    {
        id: 'fi',
        name: 'Finlandiya',
        flag: '🇫🇮',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Finlandiya Schengen için VFS Global temel entry point gibi.'
    },
    {
        id: 'si',
        name: 'Slovenya',
        flag: '🇸🇮',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Slovenya için de VFS ağırlıklı çalışıyor.'
    },
    {
        id: 'dk',
        name: 'Danimarka',
        flag: '🇩🇰',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Ayrıca resmi başvuru portalı olarak applyvisa.um.dk var.'
    },
    {
        id: 'no',
        name: 'Norveç',
        flag: '🇳🇴',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Asıl karar ve başvuru tarafı UDI (udi.no) ile ilişkili, ama randevu ayağı VFS üzerinden dönüyor.'
    },
    {
        id: 'ee',
        name: 'Estonya',
        flag: '🇪🇪',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Estonya da VFS ile yürüyor çoğu ülkede.'
    },
    {
        id: 'lt',
        name: 'Litvanya',
        flag: '🇱🇹',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Litvanya da VFS üzerinden yürütülüyor.'
    },
    {
        id: 'lu',
        name: 'Lüksemburg',
        flag: '🇱🇺',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Lüksemburg da VFS üzerinden yürütülüyor çoğu başvuru ülkesinde.'
    },
    {
        id: 'lv',
        name: 'Letonya',
        flag: '🇱🇻',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Letonya için de standart VFS booking flow\'u var.'
    },
    {
        id: 'pl',
        name: 'Polonya',
        flag: '🇵🇱',
        provider: 'VFS Global',
        bookingBaseUrl: 'https://visa.vfsglobal.com',
        notes: 'Polonya da VFS Global üzerinden randevu sistemi çalışıyor.'
    }
];
/**
 * Ülke ID'sine göre config getir
 */
const getCountryConfig = (countryId) => {
    return exports.COUNTRY_CONFIGS.find(c => c.id === countryId.toLowerCase());
};
exports.getCountryConfig = getCountryConfig;
/**
 * Ülke adına göre config getir
 */
const getCountryConfigByName = (countryName) => {
    return exports.COUNTRY_CONFIGS.find(c => c.name.toLowerCase() === countryName.toLowerCase());
};
exports.getCountryConfigByName = getCountryConfigByName;
exports.VIZE_MERKEZLERI = {
    fransa: {
        url: 'https://france-visas.gouv.fr/web/france-visas/accueil',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 455 4545', istanbul: '+90 212 334 8730' }
    },
    hollanda: {
        url: 'https://www.vfsvisaonline.com/Netherlands-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 409 1800', istanbul: '+90 212 393 2121' }
    },
    almanya: {
        url: 'https://service2.diplo.de/rktermin/extern/choose_categoryList.do',
        tip: 'konsolosluk',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 455 5100', istanbul: '+90 212 334 6100' },
        cityParams: {
            ankara: 'anka',
            istanbul: 'ista',
            izmir: 'izmi'
        }
    },
    ispanya: {
        url: 'https://blsspain-turkey.com/ankara/appointment.php',
        tip: 'bls-international',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 440 2169', istanbul: '+90 212 334 6915' }
    },
    italya: {
        url: 'https://prenotaonline.esteri.it/',
        tip: 'konsolosluk',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 457 4200', istanbul: '+90 212 243 1024' }
    }
};
