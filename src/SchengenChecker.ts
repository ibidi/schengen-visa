import axios from 'axios';
import { 
  SchengenCheckerOptions, 
  KontrolOptions, 
  RandevuKontrolSonuc, 
  Randevu,
  VizeMerkezi 
} from './types';
import { SCHENGEN_ULKELERI, VIZE_MERKEZLERI } from './constants';

export class SchengenChecker {
  private sehir: string;
  private rateLimit: number;
  private randevular: Randevu[] = [];

  constructor(options: SchengenCheckerOptions = {}) {
    this.sehir = options.sehir || 'ankara';
    this.rateLimit = options.rateLimit || 2000;
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
    if (!this.schengenMi(ulke)) {
      throw new Error(`${ulke} Schengen ülkesi değil!`);
    }

    const vizeMerkezi = VIZE_MERKEZLERI[ulke.toLowerCase()];
    
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
    } catch (error: any) {
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
  private async gercekRandevuKontrol(
    ulke: string,
    sehir: string,
    vizeTipi: string,
    vizeMerkezi: VizeMerkezi
  ): Promise<RandevuKontrolSonuc> {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    try {
      const response = await axios.get(vizeMerkezi.url, {
        headers,
        timeout: 10000,
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
    } catch (error: any) {
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

  private bekle(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
