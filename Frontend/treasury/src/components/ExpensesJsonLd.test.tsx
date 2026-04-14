import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { ExpensesJsonLd } from "./ExpensesJsonLd"

describe("ExpensesJsonLd", () => {
  it("renders JSON-LD script with item data", () => {
    const { container } = render(<ExpensesJsonLd item={{ name: "Бензин", value: "100.50" }} />)
    const script = container.querySelector('script[type="application/ld+json"]')

    expect(script).toBeTruthy()
    const json = JSON.parse(script?.textContent ?? "{}") as Record<string, unknown>
    expect(json["@context"]).toBe("https://schema.org")
    expect(json["@type"]).toBe("Item")
    expect(json.headline).toBe("Бензин")
    expect(json.value).toBe("100.50")
  })
})

