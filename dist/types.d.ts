export interface VizeMerkezi {
    url: string;
    tip: 'vfs-global' | 'bls-international' | 'konsolosluk';
    sehirler: string[];
    telefonlar: Record<string, string>;
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
}
export interface KontrolOptions {
    sehir?: string;
    vizeTipi?: string;
}
