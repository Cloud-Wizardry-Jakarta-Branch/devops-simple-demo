# DevOps Simple Demo

Aplikasi React kecil untuk mendemokan alur CI/CD di GitHub Actions, dipakai di sesi Chapter 1 pelatihan LKS Cloud Computing. Aplikasi yang tampil bukan kalkulator atau daftar tugas, melainkan papan enam tahap pipeline yang sama dengan slide 17 di deck. Jadi saat demo berjalan, peserta melihat objek yang sedang dijelaskan.

Halaman dibangun oleh pipeline. Setiap kali workflow selesai, artefak `dist` diunggah dan bisa diunduh dari halaman run, sehingga kalimat "artefak ini yang nanti dikirim ke Lambda atau Amplify" punya bukti di layar.

## Isi repo

```
.
├── .github/workflows/ci.yml   # pipeline: quality, build, deploy opsional
├── src/
│   ├── App.jsx                # komponen papan pipeline
│   ├── stages.js              # data enam tahap
│   ├── App.test.jsx           # empat pengujian Vitest
│   ├── App.css, index.css
│   ├── main.jsx
│   └── setupTests.js
├── scripts/demo-branch.sh     # menyiapkan pull request untuk demo
├── Makefile                   # perintah pendek untuk kelas
├── vite.config.js             # konfigurasi Vite dan Vitest
├── eslint.config.js           # konfigurasi ESLint flat
└── package.json
```

## Prasyarat

Node 20.19 atau lebih baru. Repo menyertakan `.nvmrc` berisi 22, jadi kalau memakai nvm cukup `nvm use`. npm sudah ikut terpasang bersama Node.

## Menjalankan di laptop

```bash
npm ci          # pasang dependensi dari lockfile, sama seperti di CI
npm run dev     # http://localhost:5173
```

Perintah lain yang sering dipakai saat mengajar:

```bash
make check      # lint + test + build, tiga langkah yang sama dengan pipeline
make test       # Vitest mode watch, enak dipakai saat memperbaiki tes
make preview    # sajikan hasil build di http://localhost:4173
make demo       # buat branch + commit demo, lalu tampilkan langkah push dan PR
```

## Alur CI di GitHub Actions

Workflow `.github/workflows/ci.yml` punya tiga job.

| Job | Jalan saat | Yang dikerjakan | Yang bisa ditunjukkan |
| --- | --- | --- | --- |
| `quality` | pull request dan push ke main | `npm ci`, `npm run lint`, `npm run test:ci` | Lint dan empat tes hijau, log per langkah |
| `build` | setelah `quality` hijau | `npm run build`, cek `dist/index.html`, unggah artefak | Tabel ringkasan, artefak `dist-<sha>` yang bisa diunduh |
| `deploy` | push ke main, hanya kalau variabel `ENABLE_PAGES` bernilai `true` | unduh artefak, unggah ke GitHub Pages, deploy | URL environment di halaman run |

Satu jebakan yang sudah ditangani dan layak diceritakan ke peserta. GitHub Pages menyajikan project site di `/<nama-repo>/`, bukan di akar domain. Kalau `base` Vite dibiarkan `/`, `index.html` akan meminta `/assets/index-xxx.js` dan browser menerima 404 untuk semua berkas, walau isi `dist` lengkap. Karena itu `base` dihitung dari `GITHUB_REPOSITORY` saat build di Actions, dan job build menolak artefak yang base-nya salah.

Tiga hal yang sengaja dipasang supaya enak dijelaskan:

1. `pull_request` dan `push` dipisah, jadi CI dan CD kelihatan bedanya di satu file.
2. `needs: quality` pada job `build` menunjukkan job tidak berjalan paralel sembarangan, melainkan menunggu gerbang mutu.
3. `concurrency` membatalkan run lama di branch yang sama, contoh nyata dari hemat waktu dan biaya runner.

## Demo 8 menit di kelas

Urutan demo

1. **Tunjukkan aplikasinya lebih dulu** (`make preview`). Klik dua tahap, tunjukkan panel detailnya berubah.
2. **Buka repo di GitHub**, tunjukkan `.github/workflows/ci.yml` dan tiga nama job-nya.
3. **Jalankan `make demo`.** Skrip membuat branch, mengubah satu subjudul, dan commit.
4. **Push dan buka pull request.** Di tab Checks, tunjukkan `quality` berjalan sambil membaca log langkah per langkah.
5. **Tunjukkan `build` menunggu `quality`**, lalu artefak `dist-<sha>` muncul setelah selesai.
6. **Merge pull request.** Karena `ENABLE_PAGES` belum diisi, job deploy dilewati, dan itu justru bahan penjelasan yang bagus tentang job bersyarat.
7. **Isi variabel `ENABLE_PAGES` dengan `true`**, merge satu perubahan kecil lagi, lalu tunjukkan job deploy berjalan dan URL Pages muncul.

## Menyiapkan repo di GitHub

```bash
git init -b main
git add .
git commit -m "demo: pipeline board dengan GitHub Actions"
gh repo create devops-simple-demo --public --source=. --remote=origin --push
```

Lalu di halaman repo:

1. **Settings, Branches.** Tambahkan branch protection untuk `main`, aktifkan `Require a pull request before merging` dan `Require status checks to pass`, pilih `Lint dan test` sebagai check wajib. Ini yang membuat pull request di demo tidak bisa di-merge sebelum CI hijau.
2. **Settings, Variables.** Tambahkan repository variable `ENABLE_PAGES` bernilai `true` hanya kalau ingin mencoba job deploy.
3. **Settings, Pages.** Pilih source `GitHub Actions` kalau langkah 2 dikerjakan.

## Latihan membuat CI merah lalu hijau

```bash
# 1. rusak satu tes
sed -i "s/toHaveLength(STAGES.length)/toHaveLength(99)/" src/App.test.jsx
git switch -c latihan/tes-gagal && git commit -am "latihan: tes sengaja gagal" && git push -u origin latihan/tes-gagal
# 2. buka pull request, lihat job quality merah di langkah Test
# 3. perbaiki, push lagi, lihat job hijau tanpa mengubah workflow
git checkout src/App.test.jsx && git commit -am "latihan: perbaiki tes" && git push
```

Yang perlu disebut setelah latihan ini. Pipeline tidak pernah "salah sendiri". Yang gagal selalu kode, konfigurasi, atau dependensi.

## Peta ke istilah di modul LKS

| Di demo ini | Di modul LKS | Bedanya |
| --- | --- | --- |
| `pull_request` memicu `quality` | CI pada pull request | Sama, hanya beda runner |
| `actions/setup-node` dengan cache npm | self-hosted runner EC2 | Demo memakai runner GitHub, modul memakai EC2 di private subnet |
| `npm run build` menghasilkan `dist` | build image container | Demo menghasilkan berkas statis, modul menghasilkan image untuk Lambda |
| `upload-artifact` | dorong image ke Amazon ECR | Artefak workflow, bukan registry container |
| job `deploy` | Lambda dan Amplify | Demo memakai GitHub Pages, modul memakai layanan AWS |
| `needs` dan branch protection | urutan task dan gerbang mutu | Konsepnya sama |

## Kalau ada yang gagal

| Gejala | Penyebab umum | Perbaikan |
| --- | --- | --- |
| `npm ci` gagal di CI | `package-lock.json` tidak ikut di-commit | `git add package-lock.json` lalu commit |
| Error `Cannot find module jsdom` | Dependensi dev tidak terpasang | jalankan `npm ci`, bukan `npm install --omit=dev` |
| Tes lulus lokal, gagal di CI | Versi Node berbeda | samakan dengan `.nvmrc`, atau cek `NODE_VERSION` di workflow |
| Halaman kosong setelah build | Berkas dibuka lewat `file://` | pakai `make preview`, bukan membuka `dist/index.html` langsung |
| Semua JS dan CSS 404 di GitHub Pages | `base` Vite tidak mengikuti nama repo, jadi aset diminta dari `/assets/` padahal situs disajikan di `/<nama-repo>/` | `vite.config.js` menghitung `base` dari `GITHUB_REPOSITORY`; job build juga memeriksa ini sebelum deploy |
| Job deploy dilewati | Variabel `ENABLE_PAGES` belum diisi | isi variabel, lalu jalankan ulang workflow |
