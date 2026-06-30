// src/types/index.ts

export interface UserRef {
  _id: string;
  nickName: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  _id: string;
  nickName: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  age?: number;
  email: string;
  followers: (string | UserRef)[];
  following: (string | UserRef)[];
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Comment {
  _id: string;
  text: string;
  author: User | string; 
  visible: boolean; 
  createdAt: string;
}

export interface PostImage {
  _id: string;
  imageUrl: string;
}

export interface Post {
  _id: string;
  description: string;
  author: User; 
  tags: Tag[]; 
  images: PostImage[];
  comments: Comment[];
  createdAt: string;
  votes:number;
}
