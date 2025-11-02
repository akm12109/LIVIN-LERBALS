
'use server';
import { Timestamp } from 'firebase/firestore';

export type Reply = {
  id: string;
  author: string;
  avatarUrl: string;
  timestamp: string;
  text: string;
  likes: number;
  createdAt: Timestamp;
};

export type Thread = {
  id: string;
  author: string;
  avatarUrl: string;
  timestamp: string;
  question: string;
  details: string;
  tags: string[];
  replies?: Reply[];
  likes: number;
  views: number;
  createdAt: Timestamp;
};
