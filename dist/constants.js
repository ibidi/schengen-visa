"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIZE_MERKEZLERI = exports.SCHENGEN_ULKELERI = void 0;
exports.SCHENGEN_ULKELERI = [
    'almanya', 'avusturya', 'belcika', 'cekyarepublik', 'danimarka',
    'estonya', 'finlandiya', 'fransa', 'hollanda', 'isvec', 'isvicre',
    'ispanya', 'italya', 'izlanda', 'letonya', 'litvanya', 'luksemburg',
    'macaristan', 'malta', 'norvec', 'polonya', 'portekiz', 'slovakya',
    'slovenya', 'yunanistan'
];
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
        url: 'https://service2.diplo.de/rktermin/extern/choose_categoryList.do?locationCode=anka&request_locale=tr',
        tip: 'konsolosluk',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 455 5100', istanbul: '+90 212 334 6100' }
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
