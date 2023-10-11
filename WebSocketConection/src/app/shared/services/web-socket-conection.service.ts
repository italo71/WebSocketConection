import { Injectable } from '@angular/core';
import { Observable, Observer, map } from 'rxjs';
import { AnonymousSubject, Subject } from 'rxjs/internal/Subject';
export interface Message {
  source: string;
  content: any;
}
@Injectable({
  providedIn: 'root'
})
export class WebSocketConectionService {

  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<any>;
  isReconecting: boolean = false;
  isConnected: boolean = false;
  public connectionStats: Subject<boolean>;
  constructor(
  ) {
    this.connectionStats = new Subject();
  }

  webSocketReconnect(url) {
    this.isReconecting = true;
    this.subject = null;
    this.webSocketConnect(url);
  }

  webSocketConnect(url) {
    url = String(url).replace('ws:', 'wss:')
    try {
      this.messages = <Subject<Message>>this.connect(url).pipe(
        map(
          (response: MessageEvent): Message => {
            try {
              let data = JSON.parse(response.data);
              return data;
            } catch { return null }
          }
        )
      );
      this.connectionStats.next(true);
      this.isConnected = true;
    } catch (e) { this.connectionStats.next(false); this.isConnected = false; }
  }

  public connect(url): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = (event) => {
        this.connectionStats.next(false);
        this.isConnected = false;
      };
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        //console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

  disconect() {
    this.subject.complete();
  }
}