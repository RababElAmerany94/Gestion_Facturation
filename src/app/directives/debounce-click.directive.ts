import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
    selector: '[ktDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {

    @Input()
    debounceTime = 500;

    @Output()
    debounceClick = new EventEmitter();

    private clicks = new Subject();
    private subscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks
            .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
            .subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event: any) {
        this.clicks.next(event);
    }

}
