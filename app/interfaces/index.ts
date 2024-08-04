export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider?: string;
}

export interface Post {
  slug: string;
  content: string;
  excerpt: string;
  frontmatter: {
    title: string;
    date: string;
    author: string;
  };
}

export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  name: string;
  content: string;
  date: Date;
  imageUrl?: string;
}

export interface Session {
  user: User;
  token: Token;
  expires: string;
  [key: string]: any;
}

export interface Token {
  name: string;
  email: string;
  picture: string;
  sub: string;
  id: string;
  provider: string;
  iat: number;
  exp: number;
  jti: string;
}
