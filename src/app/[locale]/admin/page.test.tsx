import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Admin from './page'

test('renders Admin page', () => {
    render(<Admin />)
    const heading = screen.getByRole('heading', { name: /Admin page/i })
    expect(heading).toBeDefined()
})