type CategoryType = "expenses" | "incomes"

export interface Category {
    name: string;
    type: CategoryType;
}

export interface EditCategory{
    uuid: string;
    name: string;
}

export interface ListCategories {
    expenses: string[];
    e_uuids: string[];
    e_count: number;
    incomes: string[];
    i_uuids: string[];
    i_count: number;
}

export interface ListOneTypeCategories {
    categories: string[];
    uuids: string[];
}

