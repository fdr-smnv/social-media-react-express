export interface IUser {
  id: string;
  username: string;
  imageId?: string;
}

export interface IPost {
  _id: string;
  author: IUser;
  user: PostUserDataT;
  counter: PostCounterT;
  text?: string;
  imageId?: string;
  contentType: "text" | "image" | 'mixed';
  createdAt: Date;
}

export type PostUserDataT = {
  hasLiked: boolean;
  hasReposted: boolean;
}

export type PostCounterT = {
  likeCount: number;
  repostCount: number;
  replyCount: number;
}

export type PostContentT = {type: 'text', text: string} | {type: 'image', imageID: string} | {type: 'mixed', text: string; imageID: string;};

// export type LoginDataT = {'email': string; password: string;}
export type UserLoginDataT = {
  password: string;
  login: {type: 'email', email: string} | {type: 'username', username: string}
}


// type PostContentT<T extends PostContentTypes> = {
//   type: T
//   data: PostContentMap[T]
// }
//
// type PostContentMap = {
//   'text': {text: string};
//   'image': {imageID: string};
//   'mixed': {text: string; imageID: string;}
// };
//
// type PostContentTypes = keyof PostContentMap;


export interface SessionUserT {
  id: string,
  username: string
}