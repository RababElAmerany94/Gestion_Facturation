import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AppSettings } from 'app/app-settings/app-settings';
import { IMessaging, IMessagingModel } from '../../messaging.model';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kt-messaging-index',
  templateUrl: './index.component.html'
})
export class IndexMessagingComponent {

  @Input() set Messaging(value: IMessaging) {
    if (value != null) {
      this.setDataInForm(value);
    }
  }

  /**
   * save emitter
   */
  @Output() saveEvent = new EventEmitter<IMessagingModel>();

  /**
   * the form group
   */
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      server: [null, [Validators.required, Validators.pattern(AppSettings.regexURL)]],
      port: [null, [Validators.required]],
      ssl: [false, [Validators.required]],
    });
  }

  /**
   * set data in form
   */
  setDataInForm(messaging: IMessaging) {
    this.form.setValue({
      username: messaging.username,
      password: messaging.password,
      server: messaging.server,
      port: messaging.port,
      ssl: messaging.ssl
    });
  }

  /**
   * save form
   */
  save() {
    if (this.form.valid) {
      this.saveEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
    }
  }
}
