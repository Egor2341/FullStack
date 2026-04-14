import axiosInstance from './axiosInstance';
import type { Stat, UserInfo, User } from '../types/stat';

type dataType =  "e" | "i"
const url = "/admin"

class StatService {
  
  async getUsers(): Promise<UserInfo[]> {
    const response = await axiosInstance.get<UserInfo[]>(url + "/users");
    return response.data;
  }

  async addAdmin(email: string){ 
    const user: User = {email: email}
    await axiosInstance.post<null>(
      url + "/add",
      user
    )
  }

  async deleteAdmin(email: string){
    const user: User = {email: email}
    await axiosInstance.post(
      url + "/delete",
      user
    );
  }

  async getStat(type_data: dataType, type_value: string, year: number, month: string): Promise<Stat> {
    const response = await axiosInstance.get<Stat>(url + "/stat",
      {
        params: {
          type_data,
          type_value,
          year,
          month
        }
      });
    return response.data;
  }
}

export default new StatService();