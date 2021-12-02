import IUser from "./User";

export default interface IPost {
  id: number;
  header: string;
  author?: IUser;
  content: string;
  is_upvote: boolean;
  rating: number;
  created_at: Date;
  is_bookmarked: boolean;
  bookmark_count: number;
  comment_count: number;
}
