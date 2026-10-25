export interface Receipt {
  uuid: string;
  name: string;
}

export interface ListReceipts {
  receipts: Receipt[];
}

export interface DownloadUrl {
    url: string;
}

export interface Init {
  receipts: Receipt[];
  count: number;
}