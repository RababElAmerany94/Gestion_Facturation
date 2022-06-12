import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[ktAcceptIntInput]' })
export class AcceptIntInputDirective {

    private specialKeys: Array<string> = ['.', ',', 'e', '-', '+'];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            event.preventDefault();
        }
    }

}
