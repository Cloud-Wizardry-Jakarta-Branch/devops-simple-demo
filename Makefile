# Perintah yang dipakai saat demo dan saat latihan.
# Semuanya cerminan dari langkah yang dijalankan GitHub Actions.

.PHONY: install dev lint test test-ci build preview check demo clean

install: ## Pasang dependensi persis seperti lockfile (sama dengan npm ci di CI)
	npm ci

dev: ## Server pengembangan dengan hot reload
	npm run dev

lint: ## Pemeriksaan gaya penulisan
	npm run lint

test: ## Vitest mode watch
	npm run test

test-ci: ## Vitest sekali jalan, seperti di CI
	npm run test:ci

build: ## Build produksi ke dist/
	npm run build

preview: ## Sajikan hasil build di http://localhost:4173
	npm run preview

check: lint test-ci build ## Tiga langkah yang sama dengan pipeline
	@echo "Semua langkah CI lulus di lokal."

demo: ## Buat branch demo, ubah satu baris, lalu tampilkan langkah push dan pull request
	bash scripts/demo-branch.sh

clean: ## Buang artefak dan dependensi
	rm -rf dist node_modules coverage
