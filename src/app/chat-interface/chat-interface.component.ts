import { Component, Input, NgZone, ChangeDetectorRef, OnInit, ViewChild, ElementRef,  } from '@angular/core';
import { AccountService } from '../account.service';
import { MatrixService } from '../matrix.service';
import { Subscription, timer } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'hack-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})
export class ChatInterfaceComponent implements OnInit {
  @ViewChild('messageArea', {static: true}) messageArea;
  @Input('roomID') roomID;

  room = null;
  enteredLoadedSubscription: Subscription;
  messageAreaHeight = 'calc(100% - 34px)';
  messageText = null;
  messageHistory = [];
  
  constructor(public accountService: AccountService, public matrixService: MatrixService, private changeRef: ChangeDetectorRef) {
    this.matrixService.roomTimelineEvent.subscribe(incoming => {
      // console.log('incoming message event', incoming);
      if(incoming && incoming.roomID == this.roomID) {
        let event = incoming.event;
        this.messageHistory.push({
          displayName: this.room.getMember(event.sender).rawDisplayName,
          message: event.content.body,
          timestamp: timer(0, 1000).pipe(
            map(() => moment(event.origin_server_ts).fromNow()),
            distinctUntilChanged()
          )
        });
        this.changeRef.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  ngOnInit() {
    // console.log("ON INIT", this.roomID);
    if(this.roomID) {
      this.room = this.matrixService.getRoom(this.roomID);
        if(this.room) {
          // console.log('THIS ROOM IS LOADED NOW');
          this.processRoomEvents();
          this.changeRef.detectChanges();
          this.scrollToBottom();
        }
    }
  }

  processRoomEvents() {
    let roomTimeline = this.room.timeline.map(t => t.event);
    // console.log('roomtimeline', roomTimeline);
    roomTimeline.forEach(event => {
      switch(event.type) {
        case 'm.room.message':
          this.matrixService.roomTimelineEvent.emit({
            roomID: this.roomID,
            event: event
          });
          break;
      }
    });
    // console.log('messageHistory', this.messageHistory);
    
  }

  onResized(event) {
    // console.log('onResize', event);
    if(event > 34) {
      this.messageAreaHeight = 'calc(100% - ' + event + 'px)';
    } else {
      this.messageAreaHeight = 'calc(100% - 34px)';
    }
  }

  scrollToBottom() {
    try {
      this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
    } catch (error) {
      // console.log('err', error);
    }
  }

  sendMessage(event) {
    event.preventDefault();
    if(this.messageText) {
      // console.log('sending message', this.messageText);
      this.matrixService.sendMessage(this.roomID, this.messageText);
      this.messageText = null;
    }
  }

}
