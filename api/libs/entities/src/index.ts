import { User } from '@prisma/client';
import { Socket } from 'socket.io';

export type SocketWithAuth = {
  user: User;
} & Socket;

export type Value =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'Jack'
  | 'Queen'
  | 'King'
  | 'Ace';

export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';

export type Card = {
  suit: Suit;
  value: Value;
};

export type Game = {
  stack?: Card[];
  [key: number]: Card[];
  [key: string]: Card[];
};
