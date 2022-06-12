import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'app/core/layout';
import { NumerationService } from '../../numerotation.service';
import { INumerationModel, INumeration } from '../../numerotation.model';
import { SubSink } from 'subsink';
import { ResultStatus } from 'app/core/enums/result-status';
import { ToastService } from 'app/core/layout/services/toast.service';

@Component({
  selector: 'kt-numerotation-shell',
  templateUrl: './numerotation-shell.component.html'
})
export class NumerotationShellComponent implements OnInit {

  subs = new SubSink();

  /**
   * list des numerations
   */
  numerations: INumeration[] = [];

  constructor(
    private translate: TranslateService,
    private translationService: TranslationService,
    private numerationService: NumerationService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.translationService.setLanguage(this.translate);
    this.getNumerotation();
  }

  //#region services

  /**
   * add numerotation
   * @param numerotation the numerotation
   */
  addNumeration(numerotation: INumerationModel) {
    this.subs.sink = this.numerationService.AddNumerotation(numerotation)
      .subscribe(res => {
        if (res.status === ResultStatus.Succeed) {
          this.toastService.success(this.translate.instant('SUCCESS.ADD'));
          this.numerations.push(res.value);
        }
      });
  }

  /**
   * update numerotation
   * @param numerotationId the id of numerotation
   * @param numerotation the numerotation
   */
  updateNumeration(numerotationId: string, numerotation: INumerationModel) {
    this.subs.sink = this.numerationService.UpdateNumerotation(numerotationId, numerotation)
      .subscribe(res => {
        if (res.status === ResultStatus.Succeed) {
          this.toastService.success(this.translate.instant('SUCCESS.EDIT'));
          this.changeNumerotation(numerotationId, res.value);
        }
      });
  }

  /**
   * get list of numerations
   */
  getNumerotation() {
    this.numerationService.GetAll().subscribe(result => {
      if (result.status === ResultStatus.Succeed) {
        this.numerations = result.value;
      }
    });
  }

  //#endregion

  //#region helpers

  /**
   * change numerotation
   * @param id the id of numerotation
   * @param numerotation the numerotation
   */
  changeNumerotation(id: string, numerotation: INumeration) {
    for (let index = 0; index < this.numerations.length; index++) {
      const element = this.numerations[index];
      if (element.id === id) {
        this.numerations[index] = numerotation;
      }
    }
  }

  //#endregion
}
