export type ChatLine = {
  id: string;
  timestamp: number;
  message: string;
  from?: {
    identity: string;
    name?: string;
    metadata?: string;
  };
};
