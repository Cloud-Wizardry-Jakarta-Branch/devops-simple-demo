#!/usr/bin/env bash
# Menyiapkan demo pull request: branch baru, satu perubahan kecil, satu commit.
# Skrip ini tidak mengubah kode aplikasi, hanya teks subjudul satu tahap.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Ada perubahan yang belum di-commit. Rapikan dulu supaya demo bersih."
  git status --short
  exit 1
fi

BRANCH="demo/subjudul-deploy-$(date +%H%M)"
git switch -c "$BRANCH"

BEFORE="ke tujuan akhir"
AFTER="ke tujuan akhir (demo pull request)"

python3 - "$BEFORE" "$AFTER" <<'PY'
import sys
path = "src/stages.js"
old, new = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()
if old not in text:
    sys.exit("Teks yang mau diubah tidak ditemukan di src/stages.js")
open(path, "w", encoding="utf-8").write(text.replace(old, new, 1))
print(f"src/stages.js: '{old}' -> '{new}'")
PY

git add src/stages.js
git commit -m "demo: perjelas subjudul tahap deploy"

cat <<EOF

Branch dibuat: $BRANCH
Commit dibuat: $(git log -1 --pretty=%s)

Langkah berikutnya, jalankan sendiri di depan kelas:

  git push -u origin $BRANCH

lalu buka pull request. Kalau GitHub CLI sudah login:

  gh pr create --fill --web

Yang ditunjukkan ke peserta setelah pull request terbuka:
  1. Tab Checks, workflow CI mulai berjalan
  2. Job "Lint dan test" hijau lebih dulu
  3. Job "Build" berjalan setelahnya, artefak dist-<sha> muncul di halaman run
  4. Setelah merge ke main, job "Deploy ke GitHub Pages" hanya jalan kalau variabel ENABLE_PAGES bernilai true

Kembali ke main kalau demo dibatalkan:

  git switch main && git branch -D $BRANCH

EOF
