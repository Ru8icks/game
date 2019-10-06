import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  rooms = new Array();
  private availableRooms: any[];
  clicked = false;
  private myRoom: any;
  private player: string;
  private board: any;
  private currentPlayer: string;
  private winner: boolean;
  private winningPlayer: string;


  constructor(private gameService: GameService,
             ) { }

  ngOnInit() {
    this.getRoom();
    this.joinedRoom();
    this.updateRoom();
    this.newBoard();
    this.getCurrentPlayer();
    this.getWinner();
    this.getRematch();
  }

  rematch() {
    this.gameService.changeBoard(Array(9).fill(' '), this.myRoom, 'o');
    // make a rematch function in the service summy

    this.gameService.rematch(this.myRoom);
  }
  getRematch() {
    this.gameService.rematch$()
      .subscribe(() => {
        this.winningPlayer = null;
        this.winner = false;
      });
  }


  clickedMe(index) {
    // check if your turn
    if (this.currentPlayer === this.player) {
      return;
    }
    // check if space is taken
    if (this.board[index] !== ' ') {
      return;
    }
    this.board[index] = this.player;
    if (this.checkWinner(this.board)) {
      this.gameService.winner(this.player, this.myRoom);
    } else if (this.board.filter(board => board === ' ').length === 0) {
      this.gameService.winner('you are both losers! No one', this.myRoom);
    } else {
      this.gameService.changeBoard(this.board, this.myRoom, this.player);
    }
  }
  getWinner() {
    this.gameService.winner$()
      .subscribe((winner) => {
        this.gameService.changeBoard(Array(9).fill(' '), this.myRoom, 'o');
        this.winningPlayer = winner;
        this.winner = true;
      });
  }


  getBoard() {
    this.gameService.currentBoard.subscribe( board => {
        this.board = board;
    });
  }

  getCurrentPlayer() {
    this.gameService.currentPlayer.subscribe( player => {
      this.currentPlayer = player;
    });
  }

  newBoard() {
    this.gameService.newBoard$()
      .subscribe((board) => {
        this.board = board;
      });
  }

  // rooms and setup

  newRoom() {
    this.clicked = true;
    const room = {
      name: this.gameService.getSocketID(),
      users: [],
    };
    room.users.push(this.gameService.getSocketID());
    this.gameService.newRoom(room);
    this.player = 'x';
  }

  getRoom() {
    this.gameService.getRoom$()
      .subscribe((room) => {
        this.rooms.push( room);
        this.availableRooms = this.rooms.filter(x => x.users.length < 2 );
      });
  }

  joinRoom(room) {
    room.users.push(this.gameService.getSocketID())
    this.gameService.joinRoom(room);
    this.player = 'o';
  }
  joinedRoom() {
    this.gameService.joinedRoom$()
      .subscribe((room) => {
        this.myRoom = room;
        this.clicked = true;
        this.getBoard();
      });
  }

  private updateRoom() {
    this.gameService.roomUpdate$()
      .subscribe((room) => {
        this.availableRooms = this.availableRooms.filter( aRoom => aRoom.name !== room.name);
      });

  }

  private checkWinner(board: any) {
    const victoryConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];
    for (const condition of victoryConditions) {
      if (board[condition[0]]
        && board[condition[0]] === board[condition[1]]
        && board[condition[1]] === board[condition[2]] && board[condition[0]] !== ' ') {
        return true;
      }
    }
    return false;

  }
}
