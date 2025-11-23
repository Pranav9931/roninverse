export interface Game {
  id: string;
  name: string;
  displayName: string;
  coverImage: string;
  price: number;
  url: string;
  mobileOnly: boolean;
  description?: string;
}
