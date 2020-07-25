import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { MatrixService } from '../matrix.service';

@Component({
  selector: 'hack-chat-console',
  templateUrl: './chat-console.component.html',
  styleUrls: ['./chat-console.component.scss']
})
export class ChatConsoleComponent implements OnInit {

  constructor(public accountService: AccountService, public matrixService: MatrixService) { }

  ngOnInit() {
  }

}
