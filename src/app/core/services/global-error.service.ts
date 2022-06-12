import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorService {

    private messages = new Subject<string>();

    messagesState = this.messages.asObservable();

    add(message: string = null) {
        this.messages.next(message);
    }

}
