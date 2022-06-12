import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/core/helpers/dialog';
import { Address } from 'app/core/models/general/address.model';
import { AddAddressComponent } from '../addresses/add-address/add-address.component';
import { ModeEnum } from 'app/core/enums/mode.enum';

@Component({
  selector: 'kt-one-address',
  templateUrl: './one-address.component.html'
})
export class OneAddressComponent {

  @Input() address: Address[] = [];
  @Output() changeAddress = new EventEmitter();
  @Input() title = 'ADDRESS.TITLE';
  @Input() mode = ModeEnum.Add;

  constructor(
    public dialog: MatDialog,
  ) { }

  /**
   * open add address dialog
   */
  addAddressDialog(): void {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: DialogHelper.SIZE_MEDIUM,
      data: { title: 'ADDRESS.ADD_ADDRESS', showIsDefault: false }
    });

    dialogRef.afterClosed().subscribe((result: Address) => {
      if (result) {
        this.address[0] = result;
        this.emitChange();
      }
    });
  }

  /**
   * open edit address dialog
   */
  editAddressDialog() {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: DialogHelper.SIZE_MEDIUM,
      data: {
        address: this.address[0],
        showIsDefault: false,
        title: 'ADDRESS.EDIT_ADDRESS',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address[0] = result;
        this.emitChange();
      }
    });
  }

  /**
   * emit changes
   */
  emitChange() {
    this.changeAddress.emit(this.address);
  }

  /**
   * test show mode
   */
  isShowMode = () => this.mode === ModeEnum.Show;

}
