import { SchengenChecker } from './src/SchengenChecker';

async function test() {
  console.log('🧪 TypeScript Modül Test Başlıyor...\n');

  const checker = new SchengenChecker({ 
    sehir: 'ankara',
    rateLimit: 2000 
  });

  // Test 1: Tek ülke kontrolü
  console.log('📍 Test 1: Fransa kontrolü');
  const fransa = await checker.musaitRandevuKontrol('fransa');
  console.log('Sonuç:', fransa);
  console.log('');

  // Test 2: Vize merkezi bilgisi
  console.log('📍 Test 2: Vize merkezi bilgisi');
  const merkez = checker.vizeMerkeziBilgisi('hollanda');
  console.log('Merkez:', merkez);
  console.log('');

  // Test 3: Şehre göre filtre
  console.log('📍 Test 3: Ankara\'daki vize merkezleri');
  const ankaraMerkezleri = checker.sehreGoreVizeMerkezleri('ankara');
  console.log(`Toplam ${ankaraMerkezleri.length} merkez bulundu`);
  console.log('');

  console.log('✅ Tüm testler tamamlandı!');
}

test().catch(console.error);
