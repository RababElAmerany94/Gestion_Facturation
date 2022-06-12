import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPrixParQuantite } from 'app/core/models/general/prix-par-quantite.model';
import { AddPrixParQuantiteComponent } from './add-prix-par-quantite/add-prix-par-quantite.component';

@Component({
  selector: 'kt-prix-par-quantite',
  templateUrl: './prix-par-quantite.component.html'
})
export class PrixParQuantiteComponent implements OnInit {

  /**
   * list des prix par quantite
   */
  @Input() prices: IPrixParQuantite[] = [];

  /**
   * component mode
   */
  @Input() mode = ModeEnum.Add;

  /**
   * emitter change the current component
   */
  @Output() prixParQuantiteChange = new EventEmitter<IPrixParQuantite[]>();

  /**
   * the title
   */
  title = 'PRIX_PAR_QUANTITE.TITLE';

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() { }

  /**
   * add prix par quantite
   */
  addPrixParQuantite() {
    DialogHelper.openDialog(this.dialog, AddPrixParQuantiteComponent, DialogHelper.SIZE_SMALL, { list: this.prices })
      .subscribe((result: IPrixParQuantite) => {
        if (result) {
          this.prices.push(result);
          this.emitChange();
        }
      });
  }

  /**
   * edit prix par quantite
   */
  editPrixParQuantite(editIndex: number) {
    DialogHelper
      .openDialog(this.dialog, AddPrixParQuantiteComponent, DialogHelper.SIZE_SMALL, { list: this.prices, indexEditElement: editIndex })
      .subscribe((result: IPrixParQuantite) => {
        if (result) {
          this.prices.push(result);
          this.emitChange();
        }
      });
  }

  /**
   * delete prix par quantite
   */
  deletePrixParQuantite(index: number) {
    DialogHelper.openConfirmDialog(this.dialog, {
      header: this.translate.instant('PRIX_PAR_QUANTITE.DELETE.HEADER'),
      message: this.translate.instant('PRIX_PAR_QUANTITE.DELETE.MESSAGE'),
      cancel: this.translate.instant('LABELS.CANCEL'),
      confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
    }, () => {
      this.prices.splice(index, 1);
      this.emitChange();
    });
  }

  /**
   * emit changes
   */
  emitChange() {
    this.prixParQuantiteChange.emit(this.prices);
  }

  /**
   * is show mode
   */
  isShowMode = () => this.mode === ModeEnum.Show;

}
