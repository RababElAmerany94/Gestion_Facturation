import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { INumeration } from '../../numerotation.model';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DateFormat } from 'app/core/enums/date-format.enum';
import { SharedNumerotation } from '../../shared/numerotation-shared';
import { SubSink } from 'subsink';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NumerationType } from 'app/core/enums/numerotation.enum';

@Component({
  selector: 'kt-edit-numerotation',
  templateUrl: './edit-numerotation.component.html'
})
export class EditNumerotationComponent implements OnInit, OnDestroy {

  subs = new SubSink();

  /**
   * form group
   */
  form: FormGroup;

  /**
   * the form preview of reference
   */
  formPreview: FormGroup;

  /**
   * list des date formate
   */
  dateFormats: IDropDownItem<number, string>[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditNumerotationComponent>,
    private toastService: ToastService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { numeration: INumeration, type: NumerationType }
  ) {
    this.form = this.fb.group({
      root: [null],
      dateFormat: [null, [Validators.required]],
      counter: [null, [Validators.required]],
      counterLength: [],
      type: [null, [Validators.required]],
    });

    this.formPreview = this.fb.group({
      preview: []
    });
    this.formPreview.get('preview').disable();
  }

  ngOnInit() {
    this.fillDateFormats();
    this.subscribeFormChanges();
    this.form.get('type').setValue(this.data.type);
    if (this.data.numeration != null) {
      this.setDataInForm(this.data.numeration);
    }
  }

  /**
   * fill list of date format
   */
  fillDateFormats() {
    this.dateFormats = ConversionHelper.convertEnumToListKeysValues<number, string>(DateFormat, 'number');
    this.dateFormats.forEach(item => item.text = `DATE_FORMAT.${item.text}`);
  }

  /**
   * set data in form
   */
  setDataInForm(numeration: INumeration) {
    this.form.setValue({
      root: numeration.root,
      dateFormat: numeration.dateFormat,
      counter: numeration.counter,
      counterLength: numeration.counterLength,
      type: numeration.type
    });
    this.formPreview.setValue({
      preview: this.previewReference(numeration)
    });
  }

  /**
   * save changes
   */
  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
    }
  }

  subscribeFormChanges() {
    this.subs.sink = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(_ => {
      const previewReference = this.previewReference(this.form.value);
      this.formPreview.get('preview').setValue(previewReference);
    });
  }

  /**
   * preview reference
   */
  previewReference(numeration: INumeration) {
    return SharedNumerotation.generateExampleCode(numeration);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
