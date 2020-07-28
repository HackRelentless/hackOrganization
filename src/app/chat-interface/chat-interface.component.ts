import { Component, Input, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { MatrixService } from '../matrix.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hack-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit {
  @Input('roomID') roomID;

  room = null;
  enteredLoadedSubscription: Subscription;
  
  constructor(public accountService: AccountService, public matrixService: MatrixService, private changeRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ON INIT", this.roomID);
    if(this.roomID) {
      this.room = this.matrixService.getRoom(this.roomID);
        if(this.room) {
          console.log('THIS ROOM IS LOADED NOW', this.room);
          this.changeRef.detectChanges();
        }
    }
  }

}
