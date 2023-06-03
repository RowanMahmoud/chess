import { ElementRef, SimpleChanges } from '@angular/core';
import { Component
,ViewChild,
OnChanges,
Input,
OnInit } from '@angular/core';
import { NgxChessBoardService, NgxChessBoardView, PieceIconInput } from 'ngx-chess-board';
import { environment } from 'src/enviroment/enviroment';
import { Message } from './messege/messeges';
import { PieceMoveEvent } from 'src/models/moveModel';
import { Chess } from 'chess.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
  boardSize: number = 400;
  public boardIsBlackFacing = true;
  public isParentTurn = true;
  public gameState: any;

  @Input() fen: string = '';
  @Input() boardHistory: any[] = [];
  constructor(private ngxChessBoardService: NgxChessBoardService) {}

  @ViewChild('board', { static: false }) board: NgxChessBoardView | undefined;
  public chess = new Chess();

  public endParentTurn() {
    this.isParentTurn = false;
  }
  handleMessage(event: Event) {
    const message = event as MessageEvent;
    if (message.data == 'reset') {
      this.reset();
    } else if (
      message.data.fen != null &&
      message.data.fen.length > 0 &&
      message.data.boardHistory != null &&
      message.data.boardHistory.length > 0
    ) {
      this.fen = message.data.fen;
      this.boardHistory = message.data.boardHistory;
      console.log(this.boardHistory);
      this.paintTheBoard(this.fen);
      console.log('message from board:', message.data);
    }
  }
  paintTheBoard(FEN: string) {
    this.board?.setFEN(FEN);
  }
  reset(): void {
    this.board?.reset();
  }
ngOnInit() {
  window.addEventListener('message', this.handleMessage.bind(this));
}
public checkForCheckmate() {
  if (this.chess.isCheckmate()) {
    alert('Checkmate! Game over.');
    this.clearGameState();

  }
}
public makeMove(from: string, to: string) {
  this.chess.move({ from, to });
  this.checkForCheckmate();
  this.gameState = {
    fen: this.chess.fen(),
  };
  localStorage.setItem('gameState', JSON.stringify(this.gameState));
}
public resetGame() {
  this.chess.reset();
}
public clearGameState() {
  localStorage.removeItem('gameState');
}
   }

