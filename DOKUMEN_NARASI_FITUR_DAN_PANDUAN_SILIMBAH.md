# DOKUMEN NARASI FITUR & PANDUAN PENGGUNAAN RESMI APLIKASI SILIMBAH

**Sistem Informasi Media Pembelajaran Interaktif Bergamifikasi Pengelolaan Air Limbah Domestik**  
*(Berdasarkan Standar Permen LHK No. P.68/Menlhk/Setjen/Kum.1/8/2016 & SNI 2398:2017)*  
*Magister Informatika & Rekayasa Perangkat Lunak — Pradita University 2026*

---

## 1. PENDAHULUAN & ARSITEKTUR APLIKASI

### 1.1 Latar Belakang dan Tujuan
**SiLimbah** adalah platform simulasi berbasis web bergamifikasi yang dibangun untuk melatih operator instalasi pengolahan air limbah domestik (UPTD PALD, IPLT, dan IPAL Komunal) di Indonesia. Platform ini memadukan modul teori teknik sanitasi, diagram animasi potongan melintang (*cutaway technical diagram*), respons sistem terhadap alarm lapangan otomatis (AL-01 s/d AL-15), serta pengujian kompetensi berbasis baku mutu lingkungan nasional.

### 1.2 Pemisahan Jalur Aliran Limbah
Aplikasi secara ketat membedakan karakteristik air limbah domestik ke dalam dua jalur spesifik:
1. **Jalur Black Water (BW)**: Air limbah pekat yang berasal eksklusif dari kloset dan peturasan. Karakteristik utamanya adalah konsentrasi mikroorganisme patogen tinggi (*Total Coliform* > 1.000.000 CFU/100 mL), gas beracun ($H_2S, CH_4$), dan kandungan padatan tersuspensi tinggi yang membutuhkan pengolahan primer di tangki septik SNI serta pengurasan berkala ke IPLT.
2. **Jalur Grey Water (GW)**: Air limbah non-kloset yang bersumber dari dapur (air cucian berlemak), kamar mandi (*bath/shower*), dan mesin cuci. Karakteristik utamanya adalah konsentrasi minyak & lemak tinggi, deterjen surfaktan, dan senyawa fosfat yang berisiko menyebabkan eutrofikasi perairan jika tidak diproses melalui *grease trap*, biofilter, dan lahan basah buatan (*wetland*).
3. **Jalur Integrasi Terpadu (INT-1)**: Penataan sistem sanitasi kawasan terpadu dengan pemisahan perpipaan ganda dari sumber rumah tangga menuju reaktor ABR (*Anaerobic Baffled Reactor*) dan kolam bio-indikator ikan aktif.

### 1.3 16 Layar Antarmuka Lengkap
1. **Layar 1 (Login & Persona Switcher)**: Akses multi-role dengan sakelar instan 10 akun demo PRD.
2. **Layar 2 (Track Select)**: Pemilihan kurikulum spesialisasi (Black Water, Grey Water, atau Jalur Lengkap).
3. **Layar 3 (Peta Misi Gamifikasi)**: Visualisasi level progresif bercabang dengan indikator status terkunci/selesai.
4. **Layar 4 (Mission Briefing)**: Pengarahan skenario lapangan dan narasi instruktur virtual (Pak Joko).
5. **Layar 5 (Modul Teori & Standar Efluen)**: Rangkuman rumus, batas baku mutu Permen LHK 68/2016, dan studi kasus.
6. **Layar 6 (Simulasi Interaktif Instalasi)**: Kanvas animasi potongan melintang dengan telemetri aktif & panel kontrol.
7. **Layar 7 (Kuis & Ujian Evaluasi)**: Evaluasi formatif 5 soal per level, serta Pre-Test (10 soal) dan Post-Test (20 soal).
8. **Layar 8 (Debriefing Pasca Misi)**: Evaluasi performa, rincian skor, penganugerahan bintang, dan pembukaan lencana.
9. **Layar 9 (Dashboard Peserta)**: Riwayat misi, statistik XP, koleksi 14 lencana, dan tombol unduh piagam.
10. **Layar 10 (Piagam Kelulusan Resmi)**: Sertifikat berformat nasional siap cetak/PDF dengan nomor registrasi unik dan QR Code.
11. **Layar 11 (Evaluasi Kelas Instruktur)**: Pantauan statistik peserta, filter nilai < 70 (perlu bimbingan), dan ekspor data CSV.
12. **Layar 12 (Detail Evaluasi Siswa)**: Rekapitulasi mendalam performa per misi, waktu respons alert, dan riwayat kesalahan siswa.
13. **Layar 13 (Kelola Akun & Kelas Admin)**: Manajemen pengguna UPTD, penambahan angkatan (*cohort*), dan pemantauan kuota.
14. **Layar 14 (Konten & Bank Soal)**: Pengaturan bank soal kuis, kurikulum misi, dan parameter simulasi.
15. **Layar 15 (Data Lapangan IPAL/IPLT)**: Inventaris unit fasilitas pengolahan, armada truk vakum tinja, dan kepatuhan efluen.
16. **Layar 16 (Superadmin & Lisensi Multi-Tenant)**: Pengelolaan operator kabupaten/kota, lisensi masa aktif, dan kuota nasional.

---

## 2. JALUR PEMBELAJARAN & RINCIAN KURIKULUM MISI

### 2.1 Jalur Black Water (Tinja Manusia & IPLT)
- **Pre-Test (Level 0)**: Evaluasi diagnostik awal 10 soal untuk memetakan pemahaman awal peserta.
- **BW-1 (Level 1) — Karakteristik & Bahaya Black Water**: Membedakan air limbah tinja vs non-tinja, parameter bahaya ($BOD, COD, TSS$, Bakteri Koli), serta potensi kontaminasi air tanah.
- **BW-2 (Level 2) — Anatomi Tangki Septik SNI 2398:2017**: Merakit 8 komponen SNI pada posisi yang tepat: Pipa Inlet T, Ruang Lumpur, Ruang Pengendapan, Partisi Sekat Baffle, Pipa Outlet T, Resapan Kerikil Pasir, Pipa Ventilasi T, dan Manhole Kontrol.
- **BW-3 (Level 3) — Prosedur Penyedotan & Truk Tinja**: SOP pengukuran ketebalan lumpur dengan stik kain putih, alarm batas bahaya 2/3 kedalaman basah, pemakaian APD gas $H_2S$, dan operasional pompa hisap vakum truk tinja UPTD.
- **BW-4 (Level 4) — Operasional Harian Unit IPLT**: Mengoperasikan alur pengolahan lumpur tinja: *Dumping Station*, pembersihan sampah kasar pada *Bar Screen*, bak pemisah lumpur padat *Solid Separation Chamber* (SSC), kolam anaerobik dengan gas metana, kolam fakultatif, dan penjemuran lumpur padat pada *Sludge Drying Bed* (SDB).
- **BW-5 (Level 5) — Penanganan Krisis IPLT**: Menangani *shock loading* lumpur hitam pekat mendadak, pompa vakum panas berlebih (*overheat*), dan kebocoran air lindi dalam batasan waktu kritis.

### 2.2 Jalur Grey Water (Dapur, Kamar Mandi, Cucian)
- **GW-1 (Level 1) — Karakteristik Grey Water**: Mengidentifikasi bahaya minyak goreng bekas dapur, surfaktan deterjen berbusa, senyawa fosfat pemicu alga, dan dampak penyumbatan riul.
- **GW-2 (Level 2) — Perangkap Lemak (Grease Trap 3 Sekat)**: Merakit dan merawat unit perangkap minyak 3 sekat: Keranjang penyaring remah makanan, kompartemen pemisah minyak terapung (flotasi), dan sekat outlet. Pembersihan rutin wajib dilakukan sebelum ketebalan lapisan minyak melampaui 25% kedalaman cair.
- **GW-3 (Level 3) — Biofilter Anaerobik-Aerobik**: Memasang media sarang tawon (*honeycomb*) untuk perlekatan koloni mikroorganisme (*biofilm*), serta pengaturan aerasi *micro-bubble* dari blower diffuser.
- **GW-4 (Level 4) — Lahan Basah Buatan (Constructed Wetland)**: Mengoperasikan pengolahan alami aliran bawah permukaan (*subsurface flow*), media kerikil vulkanik bertingkat, dan tanaman fitoremediasi *Typha latifolia* (Rumput Ekor Kucing) sebagai penyerap polutan organik.
- **GW-5 (Level 5) — Daur Ulang & Desinfeksi Klorinasi**: Pengoperasian tangki air olahan jernih, pompa injeksi klorin pembasmi koli, dan penegakan regulasi jaringan distribusi khusus berpipa ungu (*purple pipe*) untuk kebutuhan penyiraman taman dan *flushing* toilet.

### 2.3 Misi Integrasi Terpadu (INT-1)
- **INT-1 (Level 6) — Pengelolaan Terpadu Kawasan Permukiman**: Menata jaringan sanitasi skala kawasan: Pemisahan pipa hitam dan abu-abu dari rumah warga, penyaluran terpisah ke reaktor ABR (*Anaerobic Baffled Reactor*), desinfeksi, dan pemantauan kolam bio-indikator ikan hidup sebelum air dibuang ke sungai.
- **Post-Test (Level 7) — Ujian Kelulusan Nasional**: Ujian akhir komprehensif 20 soal berbobot 60% dalam penentuan nilai piagam kelulusan.

---

## 3. SIMULASI INSTALASI & DIAGRAM ANIMASI INTERAKTIF

Kanvas simulasi pada Layar 6 menyajikan visualisasi potongan melintang teknik dengan animasi fluida dinamis:
1. **Anatomi Tangki Septik SNI (BW-2)**: 8 slot perakitan komponen berstandar SNI 2398:2017. Saat komponen terpasang di posisi yang benar, animasi aliran air limbah otomatis aktif menghubungkan kloset ke bidang resapan.
2. **Penyedotan Lumpur Septik (BW-3)**: Visualisasi level lumpur endapan hitam dengan garis peringatan merah di ketinggian 2/3. Tombol "Kuras Tangki" memicu animasi selang hisap vakum truk tinja yang menyedot lumpur turun ke batas aman.
3. **Rangkaian IPLT (BW-4 & BW-5)**: Visualisasi gerak fluida melintasi dumping station, kisi *bar screen*, bak sedimentasi SSC, buih terapung (*scum*) dan gelembung gas metana di kolam anaerobik, serta pemadatan lumpur pada *Sludge Drying Bed* (SDB).
4. **Grease Trap 3 Sekat (GW-2)**: Diagram potongan melintang perangkap lemak dapur. Menampilkan akumulasi lapisan minyak terapung berwarna kuning pada sekat kedua dengan garis batas ambang 25%.
5. **Biofilter Aerobik (GW-3)**: Aliran air melewati sarang tawon berbiofilm dengan semburan gelembung udara mikro (*micro-bubble*) aktif dari pipa aerasi blower.
6. **Constructed Wetland (GW-4)**: Potongan media kerikil bawah tanah (*subsurface flow*), akar penyerap polutan, dan tanaman *Typha latifolia* yang bergoyang tertiup angin.
7. **Daur Ulang Pipa Ungu (GW-5)**: Injeksi klorin, sensor kualitas bakteri koli, dan distribusi pipa ungu menuju instalasi taman.
8. **Sistem Terpadu ABR & Kolam Ikan (INT-1)**: Visualisasi rumah warga dengan pipa hitam dan abu-abu terpisah, reaktor kompartemen ABR, dan kolam bioindikator ikan yang berenang aktif sebagai bukti air aman.

---

## 4. SISTEM ALERT LAPANGAN (KATALOG AL-01 S/D AL-15)

Sistem simulasi memicu malfungsi lapangan yang harus diselesaikan oleh peserta menggunakan SOP yang tepat:

| Kode | Tingkat | Kondisi Malfungsi Lapangan | SOP Tindakan Perbaikan Operator |
|---|---|---|---|
| **AL-01** | *Warning* | Lumpur Septik Meluap (>2/3 Kedalaman Basah) | Jadwalkan penyedotan truk tinja UPTD, ukur ketebalan lumpur |
| **AL-02** | *Info* | Pipa Ventilasi T Septik Tersumbat | Bersihkan kasa kawat penutup pipa ven dari kotoran |
| **AL-03** | *Critical* | Bar Screen IPLT Tersumbat Sampah Padat | Gunakan sarung tangan & garpu, angkat sampah dari kisi screen |
| **AL-04** | *Warning* | Pompa Vakum Truk Tinja Overheat | Istirahatkan pompa PTO dan periksa volume oli pelumas |
| **AL-05** | *Info* | Lumpur SDB Belum Kering (<7 Hari) | Tahan pengangkatan cake, cek saluran drainase pasir bawah |
| **AL-06** | *Warning* | Lapisan Minyak Grease Trap Melampaui 25% | Serok lapisan minyak terapung ke wadah penampung khusus |
| **AL-07** | *Critical* | Blower Biofilter Mati / Oksigen DO Drop | Nyalakan unit blower cadangan dan periksa saklar pemutus MCB |
| **AL-08** | *Warning* | Tanaman Wetland Typha Menguning / Layu | Ganti bibit Typha baru, periksa debit dan salinitas air limbah |
| **AL-09** | *Critical* | Dosis Klorin Rendah (Bakteri Koli Tinggi) | Naikkan setelan stroke pompa injeksi larutan kaporit desinfeksi |
| **AL-10** | *Critical* | Pipa Daur Ulang Tertukar (Bukan Pipa Ungu) | Hentikan pasokan, pasang pipa ungu berlabel Daur Ulang SNI |
| **AL-11** | *Warning* | Shock Loading Debit IPAL Meluap | Alihkan aliran air sementara menuju bak ekualisasi penyangga |
| **AL-12** | *Warning* | Nilai BOD Efluen Melebihi 30 mg/L | Tingkatkan laju aerasi dan perpanjang waktu retensi hidrolis (HRT) |
| **AL-13** | *Info* | Bau Amonia & H2S Menyengat di Luar Batas | Semprotkan larutan bio-deodorizer berbasis mikroba hayati |
| **AL-14** | *Critical* | Kebocoran / Retakan Dinding Tangki Reaktor | Lakukan kuras darurat dan tambal dengan resin epoxy waterproof |
| **AL-15** | *Warning* | pH Efluen Asam di Luar Rentang 6.0 - 9.0 | Injeksikan larutan netralisasi soda ash (Natrium Karbonat) |

---

## 5. GAMIFIKASI & FORMULA PENILAIAN RESMI

### 5.1 Formula Skor Misi Individu
$$\text{Skor Misi} = (0.4 \times \text{Aksi Tepat}) + (0.3 \times \text{Kecepatan}) + (0.3 \times \text{Kualitas Efluen}) - \text{Penalti}$$
- **Aksi Tepat (40%)**: Ketepatan merakit komponen atau menjalankan SOP operasional instalasi.
- **Kecepatan (30%)**: Menyelesaikan misi sebelum waktu target habis.
- **Kualitas Efluen (30%)**: Memastikan seluruh parameter baku mutu (BOD, COD, TSS, Minyak, Coliform, pH) berada di bawah ambang batas Permen LHK 68/2016.
- **Penalti**: Penggunaan tombol petunjuk hint (-5 poin per hint) dan kesalahan langkah operasional (-10 poin per kesalahan).

### 5.2 Formula Nilai Akhir Kelulusan
$$\text{Nilai Akhir} = (40\% \times \text{Rata-rata Skor Misi}) + (60\% \times \text{Nilai Post-Test})$$

### 5.3 Kriteria Predikat Kelulusan
- **Nilai Akhir ≥ 85.0**: Lulus, Dengan Pujian (*Cum Laude*)
- **75.0 ≤ Nilai Akhir < 85.0**: Lulus, Sangat Baik
- **70.0 ≤ Nilai Akhir < 75.0**: Lulus
- **Nilai Akhir < 70.0**: Belum Lulus (Wajib Remedial Misi & Ujian Ulang)

### 5.4 Jenjang Level Keahlian Operator
- **Level 1 (0 – 499 XP)**: Calon Operator
- **Level 2 (500 – 1.199 XP)**: Operator Pratama
- **Level 3 (1.200 – 2.499 XP)**: Operator Muda
- **Level 4 (2.500 – 3.999 XP)**: Operator Madya
- **Level 5 (4.000+ XP)**: Operator Utama

### 5.5 14 Lencana Keahlian (Badges)
1. Ahli SNI Tangki Septik (BW-2 sempurna)
2. Penguras Tangguh (BW-3 tuntas tanpa insiden gas)
3. Penyelamat IPLT (BW-5 sukses krisis)
4. Ahli Grease Trap (GW-2 terawat rapi)
5. Maestro Biofilter (GW-3 oksigen stabil)
6. Teknisi Fitoremediasi (GW-4 tanaman subur)
7. Jawara Daur Ulang Pipa Ungu (GW-5 klorin presisi)
8. Operator Terpadu Paripurna (INT-1 sukses)
9. Penakluk Pre-Test (Skor Pre-Test ≥ 80)
10. Sempurna Tanpa Hint (Selesai tanpa petunjuk)
11. Cepat Tepat (Selesai 50% lebih cepat dari target)
12. Post-Test Cumlaude (Skor Post-Test ≥ 90)
13. Penjaga Baku Mutu Efluen (Efluen hijau konsisten)
14. Operator Bersertifikat Resmi (Meraih piagam kelulusan sah)

---

## 6. MULTI-ROLE & 10 AKUN DEMO RESMI PRD

Aplikasi dilengkapi 10 akun resmi siap uji (PRD Hal 20) dengan password default: `SiLimbah#2026`:

1. **`peserta.lengkap`** (Peserta, Jalur Lengkap, UPTD PALD Bekasi): Sedang aktif di Misi BW-4 dengan alert lapangan aktif. Cocok untuk menguji simulasi instalasi dan penanganan alert.
2. **`peserta.lulus`** (Peserta, Jalur Lengkap, UPTD PALD Bekasi): Lulus 100% dengan Nilai Akhir 91.2. Siap langsung membuka dan mencetak Piagam Kelulusan Resmi.
3. **`peserta.bw`** (Peserta, Jalur Black Water): Baru menyelesaikan BW-1, siap menguji perakitan tangki septik SNI (BW-2).
4. **`peserta.gw`** (Peserta, Jalur Grey Water): Sedang di Misi GW-3, siap menguji biofilter aerobik dan aerasi micro-bubble.
5. **`instruktur.uptd`** (Instruktur, UPTD PALD Bekasi): Pengampu 24 peserta Angkatan I, dapat memantau siswa remedial (<70) dan mengekspor CSV.
6. **`instruktur.iplt`** (Instruktur, IPLT Tirta Mandiri): Pengampu 18 peserta, dapat mengelola bank soal kuis dan materi evaluasi.
7. **`admin.uptd`** (Admin Operator, UPTD PALD Bekasi): Mengelola akun operator, membuat kelas/angkatan baru, dan monitoring kuota peserta.
8. **`admin.ipal`** (Admin Operator, IPAL Tirta Kencana): Memantau armada truk tinja dan data lapangan IPAL komunal.
9. **`pimpinan.uptd`** (Pimpinan Operator, UPTD PALD Bekasi): Melihat laporan kepatuhan baku mutu lingkungan dan rekapitulasi kelulusan.
10. **`superadmin`** (Superadmin Pusat): Mengelola seluruh institusi UPTD/IPLT multi-tenant se-Indonesia, masa aktif lisensi, dan master konten.

---

## 7. PANDUAN PENGGUNAAN LANGKAH DEMI LANGKAH

### 7.1 Panduan untuk Peserta Pelatihan
1. **Login ke Sistem**: Gunakan username yang terdaftar (atau klik sakelar 10 Akun Demo pada bar atas).
2. **Pilih Jalur Belajar**: Tentukan fokus pelatihan (Black Water, Grey Water, atau Lengkap).
3. **Kerjakan Pre-Test**: Buka modul Pre-Test untuk mengukur pemahaman awal Anda.
4. **Pelajari Briefing & Teori**: Baca skenario instruktur virtual dan pahami rumus teknis serta batas baku mutu.
5. **Jalankan Simulasi Instalasi**:
   - Amati diagram potongan melintang instalasi.
   - Pasang komponen yang tepat pada slotnya (drag & drop atau tombol perakitan).
   - Saat alarm alert berbunyi (misal: *Bar Screen tersumbat* atau *Lumpur meluap*), segera klik tombol SOP perbaikan sebelum batas waktu toleransi habis.
6. **Selesaikan Kuis Level**: Jawab 5 soal evaluasi untuk mengumpulkan XP dan bintang.
7. **Tuntaskan Post-Test**: Selesaikan ujian komprehensif 20 soal dengan target nilai minimal 70.0.
8. **Unduh Piagam Kelulusan**: Masuk ke menu *Piagam* untuk mencetak sertifikat resmi berformat PDF/cetak dengan QR Code aktif.

### 7.2 Panduan untuk Instruktur & Penguji
1. **Evaluasi Perkembangan Kelas**: Masuk ke menu *Evaluasi Kelas* untuk melihat kurva rata-rata nilai, persentase kelulusan, dan tingkat kepatuhan baku mutu.
2. **Bimbingan Khusus Peserta Remedial**: Gunakan filter status *Perlu Bimbingan (< 70)* untuk mengidentifikasi peserta yang belum menguasai SOP.
3. **Ekspor Data Nilai**: Klik tombol *Ekspor Rekap CSV* untuk mengunduh rekap nilai lengkap ke spreadsheet.
4. **Penyesuaian Bank Soal**: Masuk ke menu *Konten & Bank Soal* untuk memperbarui soal dan kunci jawaban.

### 7.3 Panduan untuk Verifikasi Publik
1. Kunjungi menu *Cek Piagam / Verifikasi Publik*.
2. Masukkan nomor sertifikat peserta (misal: `SLB-2026-BWGW-001`).
3. Sistem secara seketika memverifikasi keabsahan data, identitas pemegang piagam, predikat kelulusan, tanggal terbit, dan UPTD penerbit.
4. Scan kamera smartphone pada QR Code di lembar fisik piagam akan langsung membuka halaman verifikasi ini.
