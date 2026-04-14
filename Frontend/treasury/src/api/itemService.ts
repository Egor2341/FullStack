import axiosInstance from './axiosInstance';
import type { Item, ItemCategories, ItemRequest, ListItems, SearchItem } from '../types/item';

type dataType =  "/expenses" | "/incomes"

class ItemService {
  
  async getItems(type: dataType, page: number, order: boolean): Promise<ListItems> {
    const response = await axiosInstance.get<ListItems>(type, {
      params: {
        page,
        order
      }
    });
    return response.data;
  }

  async getCategories(type: dataType): Promise<ItemCategories> {
    const response = await axiosInstance.get<ItemCategories>(type + "/categories");
    return response.data
  }

  async addItem(type: dataType, item: Item){ 
    const itemRequest: ItemRequest = {name: item.name, value: parseFloat(item.value)} 
    await axiosInstance.post<ItemRequest>(
      type,
      itemRequest
    )
  }

  async deleteItem(type: dataType, title: string){
    await axiosInstance.delete(
      type,
      {
        params: {
          title
        }
      }
    );
  }

  async editItem(type: dataType, item: Item){
    await axiosInstance.patch(
      type,
      item
    );
  }

  async getSearch(type: dataType, title: string, year: number, month: string): Promise<SearchItem> {
    const response = await axiosInstance.get<SearchItem>(type+"/search",
      {
        params: {
          title,
          year,
          month
        }
      });
    return response.data;
  }
}

export default new ItemService();