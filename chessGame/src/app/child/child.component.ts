import { Component
  ,ViewChild,
  OnChanges,
  Input,
  OnInit } from '@angular/core';
  import { NgxChessBoardService, NgxChessBoardView, PieceIconInput } from 'ngx-chess-board';
  import { environment } from 'src/enviroment/enviroment';
  import { PieceMoveEvent } from 'src/models/moveModel';
import { Message } from '../messege/messeges';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent {
  boardSize: number = 400;
  @Input() fen: string = '';
  @Input() boardHistory: any[] = [];
  @Input() public isBlackFacing = false;
  @Input() public isParentTurn = true;

  constructor(private ngxChessBoardService: NgxChessBoardService) {}
  @ViewChild('board', { static: false }) board: NgxChessBoardView | undefined;
   sendMessage() {
    if (
      this.boardHistory != null &&
      this.board?.getMoveHistory()[this.board?.getMoveHistory().length - 1]
        .mate &&
      this.board?.getMoveHistory()[this.board?.getMoveHistory().length - 1]
        .check
    ) {
      if (confirm('Do you want play another game')) {
        this.reset();
        parent.postMessage('reset', environment.mainPageURL);
      }
    } else {
      let message: Message = {
        fen: this.board?.getFEN(),
        boardHistory: this.board?.getMoveHistory(),
      };
      parent.postMessage(message, environment.mainPageURL);
    }
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
}
