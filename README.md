# 🔍 Schengen Visa

[![npm version](https://img.shields.io/npm/v/schengen-randevu-checker.svg)](https://www.npmjs.com/package/schengen-randevu-checker)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern TypeScript library for checking Schengen visa appointment availability across 17+ countries. Built with type safety, rate limiting, and error handling.

## ⚠️ Legal Disclaimer

**This library is for educational and informational purposes only.**

- ❌ Does NOT create official appointments
- ❌ Does NOT automate booking systems
- ❌ Does NOT interfere with embassy systems

**Always use official channels for visa appointments!**

## 🚀 Installation

```bash
npm install schengen-randevu-checker
```

## 📖 Quick Start

### TypeScript

```typescript
import { SchengenChecker } from 'schengen-randevu-checker';

const checker = new SchengenChecker({ 
  sehir: 'ankara',
  rateLimit: 2000,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  },
  enableStatistics: true
});

// Check single country (first call - cache miss)
const result1 = await checker.musaitRandevuKontrol('fransa'); // ~300ms
console.log(result1);

// Check again (cache hit - blazing fast!)
const result2 = await checker.musaitRandevuKontrol('fransa'); // ~0.03ms

// Get statistics
const stats = checker.getStatistics();
console.log(`Success Rate: ${checker.getSuccessRate()}%`);
console.log(`Cache Hit Rate: ${checker.getCacheHitRate()}%`);
console.log(`Avg Response Time: ${stats.averageResponseTime}ms`);
```

### JavaScript (CommonJS)

```javascript
const { SchengenChecker } = require('schengen-randevu-checker');

const checker = new SchengenChecker({ sehir: 'ankara' });

checker.musaitRandevuKontrol('fransa').then(result => {
  console.log(result);
});
```

## 🌍 Supported Countries (18)

| Country | Code | Cities |
|---------|------|--------|
| 🇫🇷 France | `fransa` | Ankara, Istanbul, Izmir |
| 🇳🇱 Netherlands | `hollanda` | Ankara, Istanbul |
| 🇩🇪 Germany | `almanya` | Ankara, Istanbul, Izmir |
| 🇪🇸 Spain | `ispanya` | Ankara, Istanbul, Izmir |
| 🇮🇹 Italy | `italya` | Ankara, Istanbul, Izmir |
| 🇸🇪 Sweden | `isvec` | Ankara, Istanbul |
| 🇨🇿 Czech Republic | `cekyarepublik` | Ankara, Istanbul |
| 🇭🇷 Croatia | `hirvatistan` | Ankara |
| 🇧🇬 Bulgaria | `bulgaristan` | Ankara, Istanbul |
| 🇫🇮 Finland | `finlandiya` | Ankara, Istanbul |
| 🇸🇮 Slovenia | `slovenya` | Ankara |
| 🇩🇰 Denmark | `danimarka` | Ankara, Istanbul |
| 🇳🇴 Norway | `norvec` | Ankara, Istanbul |
| 🇪🇪 Estonia | `estonya` | Ankara |
| 🇱🇹 Lithuania | `litvanya` | Ankara |
| 🇱🇺 Luxembourg | `luksemburg` | Ankara |
| 🇱🇻 Latvia | `letonya` | Ankara |
| 🇵🇱 Poland | `polonya` | Ankara, Istanbul |

## 🆕 What's New in v2.2.0

- ⚡ **In-Memory Caching** - Blazing fast repeated checks (300ms → 0.03ms)
- 📊 **Statistics Tracking** - Monitor success rates, response times, and usage
- 🎯 **Performance Monitoring** - Track cache hit rates and average response times
- 🔧 **Configurable Cache** - Customize TTL, size, and enable/disable on the fly

### Previous Releases

**v2.1.0:**
- ✅ Contact Information - Embassy/consulate contact details
- ✅ Visa Requirements - Detailed visa requirements for each country
- ✅ Document Checklist - Complete document checklist for applications
- ✅ Comprehensive Country Info - All information in one call

## 📚 API Reference

### Constructor

```typescript
new SchengenChecker(options?: SchengenCheckerOptions)
```

**Options:**
- `sehir?: string` - Default city (default: `'ankara'`)
- `rateLimit?: number` - Delay between requests in ms (default: `2000`)
- `cache?: CacheOptions` - Cache configuration
  - `enabled?: boolean` - Enable/disable cache (default: `true`)
  - `ttl?: number` - Time to live in ms (default: `300000` - 5 minutes)
  - `maxSize?: number` - Maximum cache entries (default: `100`)
- `enableStatistics?: boolean` - Enable statistics tracking (default: `true`)

### Methods

#### `musaitRandevuKontrol(ulke: string, options?: KontrolOptions): Promise<RandevuKontrolSonuc>`

Check appointment availability for a single country.

```typescript
const result = await checker.musaitRandevuKontrol('fransa', {
  sehir: 'istanbul',
  vizeTipi: 'turist'
});
```

#### `topluRandevuKontrol(ulkeler: string[], options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>`

Check multiple countries with rate limiting.

```typescript
const results = await checker.topluRandevuKontrol([
  'fransa',
  'hollanda',
  'almanya'
]);
```

#### `tumUlkelerKontrol(options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>`

Check all supported countries.

```typescript
const allResults = await checker.tumUlkelerKontrol();
```

#### `vizeMerkeziBilgisi(ulke: string): VizeMerkezi | null`

Get visa center information for a country.

```typescript
const info = checker.vizeMerkeziBilgisi('fransa');
// {
//   ulke: 'fransa',
//   url: 'https://france-visas.gouv.fr/...',
//   tip: 'vfs-global',
//   sehirler: ['ankara', 'istanbul', 'izmir'],
//   telefonlar: { ankara: '+90 312 455 4545', ... }
// }
```

#### `vizeMerkezleriListele(): Array<VizeMerkezi & { ulke: string }>`

List all visa centers.

```typescript
const centers = checker.vizeMerkezleriListele();
```

#### `sehreGoreVizeMerkezleri(sehir: string): Array<...>`

Filter visa centers by city.

```typescript
const ankaraCenters = checker.sehreGoreVizeMerkezleri('ankara');
```

#### `getAllCountries(): CountryConfig[]`

Get all country configurations with detailed information.

```typescript
const countries = checker.getAllCountries();
// Returns array of all 17 countries with flags, providers, URLs
```

#### `getCountryById(countryId: string): CountryConfig | undefined`

Get country configuration by ISO code.

```typescript
const france = checker.getCountryById('fr');
// { id: 'fr', name: 'Fransa', flag: '🇫🇷', provider: 'TLScontact', ... }
```

#### `getCountryByName(countryName: string): CountryConfig | undefined`

Get country configuration by name.

```typescript
const spain = checker.getCountryByName('İspanya');
```

#### `getCountriesByProvider(provider: string): CountryConfig[]`

Filter countries by visa service provider.

```typescript
const vfsCountries = checker.getCountriesByProvider('VFS Global');
// Returns all countries using VFS Global
```

#### `listCountriesWithFlags(): Array<{ id, name, flag, provider }>`

Get a simplified list of countries with flags.

```typescript
const list = checker.listCountriesWithFlags();
// [{ id: 'fr', name: 'Fransa', flag: '🇫🇷', provider: 'TLScontact' }, ...]
```

### 🆕 New Methods (v2.1.0)

#### `getContactInfo(countryId: string, city?: string): ContactInfo[]`

Get embassy/consulate contact information.

```typescript
// Get all contacts for a country
const contacts = checker.getContactInfo('fr');

// Get contacts for specific city
const ankaraContact = checker.getContactInfo('de', 'ankara');
console.log(ankaraContact[0].phone); // +90 312 455 51 00
console.log(ankaraContact[0].address);
console.log(ankaraContact[0].workingHours);
```

#### `getVisaRequirements(countryId: string, visaType?: string): VisaRequirements`

Get detailed visa requirements.

```typescript
const requirements = checker.getVisaRequirements('fr', 'tourist');
console.log(requirements.processingTime); // "15 iş günü"
console.log(requirements.visaFee); // "80 EUR (yetişkin)"
console.log(requirements.requiredDocuments); // Array of required documents
console.log(requirements.additionalInfo); // Tips and notes
```

#### `getDocumentChecklist(countryId: string, visaType?: string): DocumentChecklist`

Get complete document checklist for visa application.

```typescript
const checklist = checker.getDocumentChecklist('de', 'tourist');
console.log(checklist.mandatory); // Required documents
console.log(checklist.optional); // Optional documents
console.log(checklist.tips); // Application tips

// Example output:
// {
//   name: 'Pasaport',
//   description: 'En az 3 ay geçerli, 2 boş sayfa',
//   format: 'Orijinal + fotokopi',
//   quantity: 1
// }
```

#### `getCountryFullInfo(countryId: string): FullCountryInfo`

Get all information about a country in one call.

```typescript
const fullInfo = checker.getCountryFullInfo('fr');
console.log(fullInfo.config); // Country configuration
console.log(fullInfo.contacts); // Contact information
console.log(fullInfo.requirements); // Visa requirements
console.log(fullInfo.checklist); // Document checklist
console.log(fullInfo.hasFullInfo); // true if all data available
```

### 🆕 Cache & Statistics Methods (v2.2.0)

#### `getCacheStats(): CacheStats`

Get cache statistics.

```typescript
const stats = checker.getCacheStats();
console.log(stats.size); // Current cache size
console.log(stats.hits); // Cache hits
console.log(stats.misses); // Cache misses
console.log(stats.hitRate); // Hit rate percentage
```

#### `clearCache(): void`

Clear all cached data.

```typescript
checker.clearCache();
```

#### `setCacheEnabled(enabled: boolean): void`

Enable or disable caching.

```typescript
checker.setCacheEnabled(false); // Disable cache
checker.setCacheEnabled(true);  // Enable cache
```

#### `setCacheTTL(ttl: number): void`

Set cache time-to-live in milliseconds.

```typescript
checker.setCacheTTL(10 * 60 * 1000); // 10 minutes
```

#### `getStatistics(): Statistics`

Get comprehensive statistics.

```typescript
const stats = checker.getStatistics();
console.log(stats.totalChecks);
console.log(stats.successfulChecks);
console.log(stats.averageResponseTime);
console.log(stats.mostCheckedCountries); // Top 10 countries
```

#### `getCountryStatistics(country: string): CountryStat`

Get statistics for a specific country.

```typescript
const franceStats = checker.getCountryStatistics('fransa');
console.log(franceStats.checkCount);
console.log(franceStats.successRate);
console.log(franceStats.averageResponseTime);
```

#### `getSuccessRate(): number`

Get overall success rate percentage.

```typescript
const rate = checker.getSuccessRate(); // e.g., 85.5
```

#### `getCacheHitRate(): number`

Get cache hit rate percentage.

```typescript
const hitRate = checker.getCacheHitRate(); // e.g., 75.0
```

#### `resetStatistics(): void`

Reset all statistics.

```typescript
checker.resetStatistics();
```

## 🔧 TypeScript Types

```typescript
interface RandevuKontrolSonuc {
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

interface VizeMerkezi {
  url: string;
  tip: 'vfs-global' | 'bls-international' | 'konsolosluk';
  sehirler: string[];
  telefonlar: Record<string, string>;
}

interface CountryConfig {
  id: string;              // ISO country code (e.g., 'fr', 'de')
  name: string;            // Country name in Turkish
  flag: string;            // Country flag emoji
  provider: string;        // Visa service provider
  bookingBaseUrl: string;  // Base URL for appointments
  notes?: string;          // Additional information
}
```

## ✨ Features

- ✅ **TypeScript First** - Full type safety and IntelliSense support
- ✅ **Rate Limiting** - Built-in delays to respect server resources
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Timeout Protection** - 10-second timeout for all requests
- ✅ **17+ Countries** - Support for major Schengen countries
- ✅ **Multiple Cities** - Ankara, Istanbul, Izmir support
- ✅ **Modern ES2020** - Clean, modern JavaScript

## 🛡️ Best Practices

```typescript
// ✅ Good: Use rate limiting
const checker = new SchengenChecker({ rateLimit: 2000 });

// ✅ Good: Handle errors
try {
  const result = await checker.musaitRandevuKontrol('fransa');
} catch (error) {
  console.error('Check failed:', error);
}

// ✅ Good: Use for educational purposes
const info = checker.vizeMerkeziBilgisi('fransa');
console.log('Contact:', info.telefonlar.ankara);

// ❌ Bad: Don't spam requests
// ❌ Bad: Don't use for automated booking
// ❌ Bad: Don't bypass official systems
```

## 📦 Package Info

- **Size:** ~50KB (minified)
- **Dependencies:** axios
- **Node.js:** >=18.0.0
- **TypeScript:** >=5.0.0

## 🔄 Migration from v1.x

```typescript
// v1.x (JavaScript)
const SchengenRandevu = require('schengen-randevu-checker');
const checker = new SchengenRandevu({ ulke: 'fransa' });

// v2.x (TypeScript)
import { SchengenChecker } from 'schengen-randevu-checker';
const checker = new SchengenChecker({ sehir: 'ankara' });
```

## 🔧 Troubleshooting

### Germany (Almanya) Timeout Issues

If you're experiencing timeout errors with Germany:

```typescript
// Result: { durum: 'timeout', mesaj: 'Site yanıt vermiyor (timeout)' }
```

**Possible Causes:**
1. **Bot Protection** - German embassy website uses anti-bot measures
2. **Network Environment** - WSL, Docker, or restrictive networks may block requests
3. **Slow Response** - Government sites can be slow (we use 30s timeout)

**Solutions:**

```typescript
// 1. Increase timeout (if needed)
const checker = new SchengenChecker({
  // Note: Timeout is already 30s by default
  cache: { 
    enabled: true,
    ttl: 10 * 60 * 1000 // Cache for 10 minutes
  }
});

// 2. Use cache to reduce requests
const result = await checker.musaitRandevuKontrol('almanya');
// Second call will be instant from cache

// 3. Check if site is accessible
const info = checker.vizeMerkeziBilgisi('almanya');
console.log('Try accessing:', info.url);
// Open in browser to verify
```

**Alternative Approaches:**
- Use the official [iDATA website](https://idata.com.tr) directly
- Check from a different network/VPN
- Use browser automation tools (Puppeteer/Playwright) for better bot evasion

### Other Common Issues

**403 Forbidden Errors:**
- Some sites block automated requests
- Try with different User-Agent or from browser

**Rate Limiting:**
- Use built-in rate limiting: `rateLimit: 3000` (3 seconds between requests)
- Enable caching to reduce API calls

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT © [İhsan Baki Doğan](https://github.com/ibidi)

## 🔗 Links

- **GitHub:** https://github.com/ibidi/schengen-visa
- **npm:** https://www.npmjs.com/package/schengen-randevu-checker
- **Issues:** https://github.com/ibidi/schengen-visa/issues

## � C hangelog

### [2.0.0] - 2025-11-13

**🎉 Major Release - TypeScript Rewrite**

#### Added
- ✅ Full TypeScript support with type definitions
- ✅ Modern ES2020 syntax
- ✅ Comprehensive type safety
- ✅ 17+ Schengen countries support
- ✅ Rate limiting built-in
- ✅ Timeout protection (10s)
- ✅ Better error handling
- ✅ Multiple city support (Ankara, Istanbul, Izmir)

#### Changed
- 🔄 Complete rewrite from JavaScript to TypeScript
- 🔄 Improved API design
- 🔄 Better naming conventions
- 🔄 Enhanced documentation

#### Breaking Changes
- ⚠️ Constructor options changed
- ⚠️ Method signatures updated
- ⚠️ Response types restructured

**Migration Guide:**
```typescript
// v1.x
const checker = new SchengenRandevu({ ulke: 'fransa' });

// v2.x
const checker = new SchengenChecker({ sehir: 'ankara' });
```

### [1.2.0] - 2025-11-13

#### Added
- Database support (MongoDB, Supabase)
- Export/Import functionality (JSON, CSV)
- Statistics and analytics
- Personal appointment tracking

### [1.0.0] - 2025-11-13

#### Initial Release
- Basic appointment checking
- JavaScript implementation
- 25+ Schengen countries support
- VFS Global, BLS International support

## 👨‍💻 Author

**İhsan Baki Doğan**
- Email: info@ihsanbakidogan.com
- GitHub: [@ibidi](https://github.com/ibidi)

---

⭐ If you find this library helpful, please give it a star on GitHub!
