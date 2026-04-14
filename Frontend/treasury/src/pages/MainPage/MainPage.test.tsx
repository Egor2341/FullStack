import { describe, expect, it } from "vitest"
import { Route, Routes, MemoryRouter } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MainPage } from "./index"

describe("MainPage navigation", () => {
  it("navigates to /expences from the expenses card", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/main"]}>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/expences" element={<div>EXPENCES_PAGE</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getAllByRole("button", { name: /Посмотреть/i })[0])

    expect(await screen.findByText("EXPENCES_PAGE")).toBeInTheDocument()
  })
})

