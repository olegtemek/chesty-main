import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Card, Game, SocketWithAuth, Suit, Value } from '@entyties/entities';
import { LoggerService } from '@logger/logger';
import { RoomService } from 'src/room/room.service';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly logger: LoggerService,
    private readonly roomService: RoomService,
  ) {}
  private server: Server;
  private deck: Card[] = [];

  async setServer(server: Server) {
    this.server = server;
    const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values: Value[] = [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'Jack',
      'Queen',
      'King',
      'Ace',
    ];
    suits.forEach((suit) => {
      values.forEach((value) => {
        this.deck.push({ suit, value });
      });
    });
  }

  async shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  async game(client: SocketWithAuth) {
    const room = await this.roomService.getOne({
      status: 'ACTIVE',
      users: { some: { id: client.user.id } },
    });

    const data: Game = JSON.parse(`${room.game.data}`);
    let stack: Card[];

    let playerOneCards: Card[] = [];
    let playerTwoCards: Card[] = [];
    let playerOneCompleteCards: Card[] = [];
    let playerTwoCompleteCards: Card[] = [];

    if (!data?.stack) {
      this.shuffle();
      stack = this.deck;
      playerOneCards = stack.splice(0, 6);
      playerTwoCards = stack.splice(0, 6);
    } else {
      console.log('Without create');
      stack = data.stack;
      playerOneCards = data[room.users[0].id];
      playerTwoCards = data[room.users[1].id];
      playerOneCompleteCards = data[`${room.users[0].id}-complete`];
      playerTwoCompleteCards = data[`${room.users[1].id}-complete`];
    }

    const newData = {
      stack: stack,
      [room.users[0].id]: playerOneCards,
      [room.users[1].id]: playerTwoCards,
      [`${room.users[0].id}-complete`]: playerOneCompleteCards,
      [`${room.users[1].id}-complete`]: playerTwoCompleteCards,
    };

    console.log(newData);

    await this.roomService.update(
      { id: room.id },
      { game: { update: { data: JSON.stringify(newData) } } },
    );
  }
}
