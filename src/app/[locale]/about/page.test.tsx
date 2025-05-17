import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from './page'

test('renders About page', () => {
    render(<About />)
    const heading = screen.getByRole('heading', { name: /About page/i })
    expect(heading).toBeDefined()
})