import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'
import { STAGES } from './stages.js'

describe('Pipeline Board', () => {
  it('menampilkan semua tahap pipeline', () => {
    render(<App />)
    expect(screen.getAllByRole('button')).toHaveLength(STAGES.length)
    expect(screen.getByRole('button', { name: /commit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument()
  })

  it('menampilkan detail tahap pertama secara default', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('commit')
    expect(screen.getByText(/pull request/i)).toBeInTheDocument()
  })

  it('mengganti detail saat tahap lain diklik', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /CI/i }))

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('CI')
    expect(screen.getByText(/ESLint/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /CI/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('badge menghitung jumlah tahap dari data', () => {
    render(<App />)
    expect(screen.getByText(String(STAGES.length))).toBeInTheDocument()
  })
})
