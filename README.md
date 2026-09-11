# Coordinate Converter Map

Aplikasi web pemetaan interaktif berbasis **React + TypeScript + OpenLayers** untuk konversi koordinat geografis antara format **DMS (Degree, Minutes, Seconds)** dan **DD (Decimal Degrees)**.

---

## Fitur

- 🗺️ Peta OSM interaktif menggunakan OpenLayers
- 📍 Tambah marker dengan klik pada peta atau melalui form
- 🔄 Konversi koordinat DMS ↔ DD
- ✏️ Update koordinat marker yang sudah ada
- 🧪 Unit testing dengan Jest

---

## Teknologi

| Teknologi | Versi |
|---|---|
| React | ^18.2 |
| TypeScript | ^5.0 |
| OpenLayers | ^9.0 |
| Tailwind CSS | ^3.3 |
| Vite | ^5.0 |
| Jest | ^29.7 |

---

## Instalasi

### Prasyarat

- **Node.js** versi 18 atau lebih baru
- **npm** versi 9 atau lebih baru

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone <repository-url>
cd map-coordinate-converter

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## Script

```bash
# Development server
npm run dev

# Jalankan unit test
npm test
```

---

## Cara Penggunaan

### Tambah Koordinat via Form
1. Klik tombol **+** (floating button) di pojok kanan bawah
2. Pilih mode konversi: **DMS to DD** atau **DD to DMS**
3. Masukkan nilai koordinat
4. Klik **Convert** untuk melihat hasil konversi
5. Klik **Add To Maps** untuk menambahkan marker ke peta

### Tambah Koordinat via Klik Peta
1. Klik lokasi mana saja pada peta
2. Form akan terbuka otomatis dengan koordinat terisi
3. Lakukan konversi jika diperlukan
4. Klik **Add To Maps**

### Update Koordinat Existing
1. Klik marker yang sudah ada di peta
2. Form terbuka dalam mode **Update**
3. Ubah nilai koordinat dan konversi
4. Klik **Update**

---

## Struktur Folder

```
src/
├── components/
│   ├── map/
│   │   ├── map.tsx              # Komponen peta OpenLayers
│   │   └── floatingButton.tsx   # Tombol aksi mengambang
│   ├── coordinateForm/
│   │   ├── coordinateForm.tsx   # Form popup utama
│   │   ├── dmsToDdForm.tsx      # Form konversi DMS → DD
│   │   └── ddToDmsForm.tsx      # Form konversi DD → DMS
│   └── ui/
│       ├── button.tsx           # Komponen button reusable
│       ├── input.tsx            # Komponen input reusable
│       └── tabs.tsx             # Komponen tabs reusable
├── utils/
│   └── coordinateConverter.ts   # Logic konversi koordinat
├── types/
│   └── coordinate.ts            # TypeScript interfaces
├── __tests__/
│   └── coordinateConverter.test.ts  # Unit tests
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
└── index.css                    # Global styles + Tailwind
```

---

## Unit Test

```bash
npm test
```

Test mencakup:
- `dmsToDd()` — konversi DMS tunggal ke DD
- `ddToDms()` — konversi DD ke DMS tunggal
- `convertDmsToDD()` — konversi koordinat penuh DMS → DD
- `convertDDToDms()` — konversi koordinat penuh DD → DMS
- `formatDMS()` — format output DMS ke string
