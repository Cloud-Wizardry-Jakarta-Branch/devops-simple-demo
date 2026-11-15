import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest berjalan tanpa globals, jadi cleanup Testing Library harus didaftarkan manual.
afterEach(() => {
  cleanup()
})
