# 🔍 Schengen Randevu Checker

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
  rateLimit: 2000 
});

// Check single country
const result = await checker.musaitRandevuKontrol('fransa');
console.log(result);
// {
//   ulke: 'fransa',
//   durum: 'dolu',
//   mesaj: 'Şu an müsait randevu bulunmuyor',
//   url: 'https://france-visas.gouv.fr/...',
//   kontrolTarihi: 2025-11-13T19:00:00.000Z
// }

// Check multiple countries
const results = await checker.topluRandevuKontrol([
  'fransa', 
  'hollanda', 
  'almanya'
]);
```

### JavaScript (CommonJS)

```javascript
const { SchengenChecker } = require('schengen-randevu-checker');

const checker = new SchengenChecker({ sehir: 'ankara' });

checker.musaitRandevuKontrol('fransa').then(result => {
  console.log(result);
});
```

## 🌍 Supported Countries (17)

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

## 📚 API Reference

### Constructor

```typescript
new SchengenChecker(options?: SchengenCheckerOptions)
```

**Options:**
- `sehir?: string` - Default city (default: `'ankara'`)
- `rateLimit?: number` - Delay between requests in ms (default: `2000`)

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

- **GitHub:** https://github.com/ibidi/schengen-randevu-checker
- **npm:** https://www.npmjs.com/package/schengen-randevu-checker
- **Issues:** https://github.com/ibidi/schengen-randevu-checker/issues

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
