import IPost from "./Post";
import IUser from "./User";

export default interface IComment {
  id: number;
  user: IUser;
  post: IPost;
  content: string;
  reply_to?: IUser;
  is_upvote: boolean;
  rating: number;
  created_at: Date;
  reply_count?: number;
}
