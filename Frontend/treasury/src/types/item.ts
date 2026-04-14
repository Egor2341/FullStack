
export interface Item {
    name: string;
    value: string;
}

export interface ListItems{
    total: string;
    items: Item[];
}

export interface SearchItem{
    value: string;
}

export interface ItemRequest{
    name: string;
    value: number;
}

export interface ItemCategories{
    categories: string[];
}


