import type { ReactElement } from "react"
import { HelmetProvider } from "react-helmet-async"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: { route?: string } = {}
) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>
  )
}

