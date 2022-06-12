import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'kt-searchbar',
    templateUrl: './searchbar.component.html',
    styles: []
})
export class SearchbarComponent {

    @Input()
    searchControl: FormControl;

    constructor() { }

}
