
export interface Link {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  createdAt: number; // timestamp
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
