export type LiveGiftReportParams = {
  page: number;
  pageSize: number;
};

export interface GiftReport {
  id: number;
  stream: {
    id: number;
    title: string;
  };
  gift: {
    id: number;
    name: string;
    giftCost: number;
  };
  percentage: number;
  receiveAmount: number;
  createdAt: string;
  sender: {
    id: number;
    name: string;
  };
}

export interface GiftReportResponse {
  status: boolean;
  data: GiftReport[];
  total: number;
  totalPage: number;
}
