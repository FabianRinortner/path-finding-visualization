import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messages = new Subject();
  messages$ = this.messages.asObservable();

  isMouseClicked = false;

  constructor() {
  }

  notify(message) {
    this.messages.next(message);
  }

  MouseClicked() {
    this.isMouseClicked = true;
  }

  MouseRelease() {
    this.isMouseClicked = false;
  }

  GetMouseClicked() {
    return this.isMouseClicked;
  }
}
