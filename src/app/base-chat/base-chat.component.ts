import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '../account.service';
import { MatrixService } from '../matrix.service';

@Component({
  selector: 'hack-base-chat',
  templateUrl: './base-chat.component.html',
  styleUrls: ['./base-chat.component.scss']
})
export class BaseChatComponent implements OnInit {
  @Input('headerText') headerText = '';
  @Input('chatType') chatType = '';
  @Input('roomID') roomID = '';
  isCollapsed = false;
  

  constructor(public accountService: AccountService, public matrixService: MatrixService) { }

  ngOnInit() {
  }

  leaveRoom() {
    this.matrixService.leaveRoom(this.roomID);
  }

}
