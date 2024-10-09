export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  brand: string;
  description: string;
  sensor: string;
  resolution: string;
  isoRange: string;
  shutterSpeed: string;
  feedbacks: Feedback[];
};

export type Feedback = {
  rating: number;
  comment: string;
  author: string;
  time: string;
};

export type ArtSupply = {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
  feedbacks: Feedback[];
};
