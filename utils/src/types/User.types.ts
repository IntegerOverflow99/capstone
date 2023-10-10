export type IUserDBModel = {
  id: number;
  username: string;
  password_hash: string;
  allowed_video_content_rating: string;
  admin: boolean;
};
