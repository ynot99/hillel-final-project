import IAuthor from "./Author";

export default interface IPost {
  id: number;
  header: string;
  author?: IAuthor;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: Date;
  is_bookmarked: boolean;
  bookmark_count: number;
  comment_count: number;
}
