import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IUser } from 'app/pages/users/user.model';

@Component({
    selector: 'kt-access-app',
    templateUrl: './access-app.component.html',
})
export class AccessAppComponent {

    @Output() addEvent = new EventEmitter();
    @Output() editEvent = new EventEmitter();

    @Input() form: FormGroup;
    @Input() set User(val: IUser) {
        if (val != null) {
            this.setUserInForm(val);
            this.isEdit = true;
        }
    }

    title = 'ACCESS_APP.TITLE';
    isEdit = false;

    constructor() { }

    /**
     * save form
     */
    save() {
        if (this.form.valid) {
            if (this.isEdit) {
                this.editEvent.emit(this.form.value);
            } else {
                this.addEvent.emit(this.form.value);
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    /**
     * set user in form
     */
    setUserInForm(user: IUser) {
        this.form.setValue({
            userName: user.userName,
            password: '',
            isActive: user.isActive
        });
    }

}
