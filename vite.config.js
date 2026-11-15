import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// GitHub Pages menyajikan project site di /<nama-repo>/, bukan di akar domain.
// Saat build berjalan di Actions, env GITHUB_REPOSITORY sudah berisi "owner/repo",
// jadi base dihitung otomatis. Di laptop env itu kosong dan base tetap "/",
// sehingga npm run dev dan npm run preview berperilaku sama seperti sebelumnya.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repoName && !repoName.endsWith('.github.io') ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
    include: ['src/**/*.test.{js,jsx}'],
  },
})
