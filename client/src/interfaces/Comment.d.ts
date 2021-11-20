import IAuthor from "./Author";

export default interface IComment {
  id: number;
  user: IAuthor;
  content: string;
  reply_to: IAuthor;
  upvotes: number;
  downvotes: number;
  created_at: Date;
}
