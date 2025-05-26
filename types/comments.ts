export interface Comment {
  id: number;
  text: string;
  user: {
    name: string;
    image: string;
    email:string
  };
  createdAt: string;
}