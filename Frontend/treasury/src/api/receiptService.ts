import type { Init, DownloadUrl, ListReceipts } from "../types/receipt"
import axiosInstance from "./axiosInstance"

const url = "/receipts"

class ReceiptService {
  async getInit(): Promise<Init> {
    const response = await axiosInstance.get<Init>(url + "/init")
    return response.data
  }

  async getReceipts(page: number): Promise<ListReceipts> {
    const response = await axiosInstance.get<ListReceipts>(url, {
      params: {
        page,
      },
    })
    return response.data
  }

  async addReceipt(file: FormData) {
    try {
      await axiosInstance.post(url, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getDownloadUrl(uuid: string): Promise<string> {
    const response = await axiosInstance.get<DownloadUrl>(url + "/download", {
      params: {
        uuid,
      },
    })
    return response.data.url
  }

  async deleteReceipt(uuid: string) {
    await axiosInstance.delete(url, {
      params: {
        uuid,
      },
    })
  }
}

export default new ReceiptService()
