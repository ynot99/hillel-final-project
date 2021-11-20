export default interface IAuthor {
  id: number;
  user: { username: string };
  avatar?: string;
  slug: string;
}
