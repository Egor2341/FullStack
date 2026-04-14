import axiosInstance from './axiosInstance';
import type { ListBudgets, BudgetRequest, searchResult } from '../types/budget';

const path = "/budgets"

class BudgetService {
  
  async getBudgets(): Promise<ListBudgets> {
    const response = await axiosInstance.get<ListBudgets>(path);
    return response.data;
  }

  async editBudget(budget: BudgetRequest){
    
    await axiosInstance.patch(
      path,
      budget
    );
  }

  async getSearch(type: string, year: number): Promise<searchResult> {
    const response = await axiosInstance.get<searchResult>(path+"/search",
      {
        params: {
          type,
          year,
        }
      });
    return response.data;
  }
}

export default new BudgetService();