import type { Exchange } from "../types/info"
import axiosInstance from "./axiosInstance"

const url = "/info"

class InfoService {
  async getExchange(): Promise<Exchange> {
    const response = await axiosInstance.get<Exchange>(url)
    return response.data
  }
}

export default new InfoService()
