export type budgetType = "real" | "theory"

export interface Budget {
    type: budgetType;
    month: string;
    year: number;
    value: string;
}

export interface ListBudgets{
    real: Budget[]; 
    theory: Budget[]; 
}

export interface searchResult{
    budgets: Budget[];
}

export interface BudgetRequest {
    type: budgetType;
    month: string;
    year: number;
    value: number;
}


