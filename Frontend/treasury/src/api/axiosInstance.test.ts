import { describe, expect, it, vi, beforeEach } from "vitest"

function makeAxiosMock() {
  let responseRejected: ((e: any) => any) | undefined
  const instance: any = {
    interceptors: {
      request: { use: vi.fn() },
      response: {
        use: vi.fn((_onFulfilled: any, onRejected: any) => {
          responseRejected = onRejected
        }),
      },
    },
  }

  const axios = {
    create: vi.fn(() => instance),
    post: vi.fn(),
  }

  return { axios, instance, getResponseRejected: () => responseRejected }
}

describe("axiosInstance (session expiry)", () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.href = "http://localhost/main"
  })

  it("clears tokens and redirects to /welcome when refresh fails after 401", async () => {
    vi.resetModules()
    const mock = makeAxiosMock()

    vi.doMock("axios", () => ({ default: mock.axios }))

    localStorage.setItem("accessToken", "old")
    localStorage.setItem("refreshToken", "bad-refresh")

    mock.axios.post.mockRejectedValueOnce(new Error("refresh failed"))

    await import("./axiosInstance")

    const rejected = mock.getResponseRejected()
    expect(rejected).toBeTypeOf("function")

    await expect(
      rejected?.({
        response: { status: 401 },
        config: { headers: {} },
      })
    ).rejects.toThrow("refresh failed")

    expect(localStorage.getItem("accessToken")).toBeNull()
    expect(localStorage.getItem("refreshToken")).toBeNull()
    expect(window.location.href).toContain("/welcome")
  })

  it("clears tokens and redirects to /welcome when refresh fails after 403", async () => {
    vi.resetModules()
    const mock = makeAxiosMock()
    vi.doMock("axios", () => ({ default: mock.axios }))

    localStorage.setItem("accessToken", "old")
    localStorage.setItem("refreshToken", "bad-refresh")

    mock.axios.post.mockRejectedValueOnce(new Error("refresh failed"))

    await import("./axiosInstance")

    const rejected = mock.getResponseRejected()
    await expect(
      rejected?.({
        response: { status: 403 },
        config: { headers: {} },
      })
    ).rejects.toThrow("refresh failed")

    expect(localStorage.getItem("accessToken")).toBeNull()
    expect(localStorage.getItem("refreshToken")).toBeNull()
    expect(window.location.href).toContain("/welcome")
  })
})

