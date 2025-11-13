// CommonJS Example
const { SchengenChecker } = require('./dist/index.js');

async function main() {
  console.log('🔍 Schengen Randevu Checker - Example\n');

  // Create checker instance
  const checker = new SchengenChecker({ 
    sehir: 'ankara',
    rateLimit: 2000 
  });

  // Example 1: Check single country
  console.log('📍 Example 1: Checking France...');
  const fransa = await checker.musaitRandevuKontrol('fransa');
  console.log('Result:', fransa);
  console.log('');

  // Example 2: Get visa center info
  console.log('📍 Example 2: Visa center information');
  const merkez = checker.vizeMerkeziBilgisi('hollanda');
  console.log('Center:', merkez);
  console.log('');

  // Example 3: Filter by city
  console.log('📍 Example 3: Visa centers in Ankara');
  const ankaraCenters = checker.sehreGoreVizeMerkezleri('ankara');
  console.log(`Found ${ankaraCenters.length} centers`);
  ankaraCenters.slice(0, 3).forEach(center => {
    console.log(`  - ${center.ulke}: ${center.telefon}`);
  });
  console.log('');

  // Example 4: Check multiple countries
  console.log('📍 Example 4: Checking multiple countries...');
  const results = await checker.topluRandevuKontrol(['fransa', 'hollanda']);
  results.forEach(result => {
    console.log(`  ${result.ulke}: ${result.durum} - ${result.mesaj}`);
  });

  console.log('\n✅ All examples completed!');
}

main().catch(console.error);
