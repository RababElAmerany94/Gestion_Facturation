import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'kt-custom-error-display',
  templateUrl: './custom-error-display.component.html',
  styleUrls: ['./custom-error-display.component.scss']
})
export class CustomErrorDisplayComponent implements OnInit {

  @Input()
  control: AbstractControl;

  constructor() { }

  ngOnInit() { }

}
