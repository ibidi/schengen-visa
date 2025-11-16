/**
 * Example: Using Country Configurations from modul.json
 * 
 * This example demonstrates the new country configuration features
 * integrated from modul.json
 */

const { SchengenChecker } = require('./dist/index');

async function main() {
  const checker = new SchengenChecker();

  console.log('🌍 Schengen Country Configuration Examples\n');

  // Example 1: Get all countries
  console.log('1️⃣ All Countries:');
  const allCountries = checker.getAllCountries();
  console.log(`Total: ${allCountries.length} countries\n`);
  allCountries.forEach(c => {
    console.log(`${c.flag} ${c.name} (${c.id}) - ${c.provider}`);
  });
  console.log('\n');

  // Example 2: Get country by ID
  console.log('2️⃣ Get Country by ID:');
  const france = checker.getCountryById('fr');
  console.log('France:', france);
  console.log('\n');

  // Example 3: Get country by name
  console.log('3️⃣ Get Country by Name:');
  const spain = checker.getCountryByName('İspanya');
  console.log('Spain:', spain);
  console.log('\n');

  // Example 4: Filter by provider
  console.log('4️⃣ Countries using VFS Global:');
  const vfsCountries = checker.getCountriesByProvider('VFS Global');
  console.log(`Found ${vfsCountries.length} countries:`);
  vfsCountries.forEach(c => {
    console.log(`  ${c.flag} ${c.name}`);
  });
  console.log('\n');

  // Example 5: Filter by provider (BLS)
  console.log('5️⃣ Countries using BLS International:');
  const blsCountries = checker.getCountriesByProvider('BLS');
  blsCountries.forEach(c => {
    console.log(`  ${c.flag} ${c.name} - ${c.bookingBaseUrl}`);
  });
  console.log('\n');

  // Example 6: Simple list with flags
  console.log('6️⃣ Simple Country List:');
  const simpleList = checker.listCountriesWithFlags();
  simpleList.slice(0, 5).forEach(c => {
    console.log(`${c.flag} ${c.name} - ${c.provider}`);
  });
  console.log('\n');

  // Example 7: Country details with notes
  console.log('7️⃣ Country Details with Notes:');
  const germany = checker.getCountryById('de');
  if (germany) {
    console.log(`${germany.flag} ${germany.name}`);
    console.log(`Provider: ${germany.provider}`);
    console.log(`URL: ${germany.bookingBaseUrl}`);
    console.log(`Notes: ${germany.notes}`);
  