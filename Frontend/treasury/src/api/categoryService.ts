import axiosInstance from './axiosInstance';
import type { Category, EditCategory, ListCategories, ListOneTypeCategories } from '../types/category';

class CategoryService {
  
  async getCategories(): Promise<ListCategories> {
    const response = await axiosInstance.get<ListCategories>('/categories');
    return response.data;
  }

  async getOneTypeCategories(type: "e" | "i", page: number, order: boolean): Promise<ListOneTypeCategories> {
    const response = await axiosInstance.get<ListOneTypeCategories>('/categories/one_type',
      {
        params: {
          type: type,
          page: page,
          order: order
        }
      }
    );
    return response.data;
  }

  async addCategory(category: Category){
    await axiosInstance.post<Category>(
      '/categories',
      category
    )
  }

  async deleteCategory(uuid: string){
    await axiosInstance.delete(
      '/categories',
      {
        params: {
          uuid: uuid
        }
      }
    );
  }

  async editCategory(category: EditCategory){
    await axiosInstance.patch(
      '/categories',
      category
    );
  }
}

export default new CategoryService();