import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {BehaviorSubject, Observable} from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket = io('http://localhost:3000');

  private boardSource = new BehaviorSubject(new Array(9).fill(' '));
  currentBoard = this.boardSource.asObservable();
  private playerSource = new BehaviorSubject('o');
  public currentPlayer = this.playerSource.asObservable()


  constructor() { }

  changeBoard(board: any[], room, player) {
    this.boardSource.next(board);
    this.socket.emit('new-board', board, room, player);
  }
  changePlayer(player) {
    console.log(player)
    this.playerSource.next(player);
  }
  winner(winner, room) {
    this.socket.emit('winner', winner , room);
  }
  winner$ = () => {
    return Observable.create((observer) => {
      this.socket.on('winner', (winner) => {
        console.log(winner, ' winner has arrived')
        observer.next(winner);
      });
    });
  }

  getSocketID() {
    return this.socket.id;
  }

  newRoom(room) {
    this.socket.emit('new-room', room);
  }
  public getRoom$ = () => {
    return Observable.create((observer) => {
      this.socket.on('new-room', (room) => {
        observer.next(room);
      });
    });
  }

  joinRoom(room: any) {
    this.socket.emit('join-room', room);
  }
  roomUpdate$ = () => {
    return Observable.create((observer) => {
      this.socket.on('room-update', (room) => {
        observer.next(room);
      });
    });
  }
  joinedRoom$ = () => {
    return Observable.create((observer) => {
      this.socket.on('joined-room', (room) => {
        observer.next(room);
      });
    });
  }
  newBoard$ = () => {
    return Observable.create((observer) => {
      this.socket.on('new-board', (board, player) => {
        observer.next(board);
        console.log('playa yay y a', player)
        this.changePlayer(player);
        // console.log(player);
      });
    });
  }
  rematch(room: any) {
    this.socket.emit('rematch', room);
  }
  rematch$ = () => {
    return Observable.create((observer) => {
      this.socket.on('rematch', () => {
        observer.next();
      });
    });
  }

}
