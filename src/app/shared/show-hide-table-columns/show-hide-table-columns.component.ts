import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'kt-show-hide-table-columns',
    templateUrl: './show-hide-table-columns.component.html',
    styleUrls: ['./show-hide-table-columns.component.scss']
})
export class ShowHideTableColumnsComponent {

    @Output()
    selectColumn = new EventEmitter();

    @Input()
    columns: never[];

    @Input()
    tableName: string;

    @Input()
    set checkedColumns(value: boolean[]) {
        this._checkedColumns = value;
        setTimeout(() => {
            if (this._checkedColumns && this._checkedColumns.length === this.columns.length) {
                for (let index = 0; index < this.columns.length; index++) {
                    this.columnSelected(index, this._checkedColumns[index] == null ? false : this._checkedColumns[index]);
                }
            }
        }, 600);
    }

    _checkedColumns: boolean[] = [];

    columnSelected(itemIndex: number, show: boolean) {
        // extract the same length of number column
        // from checked column stored in local storage
        this._checkedColumns = this._checkedColumns.slice(0, this.columns.length);

        // get table by id
        const table = document.getElementById(this.tableName);

        if (table == null) {
            return;
        }

        // get th of current column
        const th = table.getElementsByTagName('th')[itemIndex];

        if (th == null) {
            return;
        }

        // display or hidden header
        this._checkedColumns[itemIndex] = show;
        th.style.display = show ? '' : 'none';

        // get rows of table
        const rows = table.getElementsByTagName('tr');

        for (let index = 1; index < rows.length; index++) {

            const rowItem = table.getElementsByTagName('tr')[index];
            if (rowItem === undefined) { return; }

            const cells = rowItem.getElementsByTagName('td')[itemIndex];
            if (cells !== undefined) {
                cells.hidden = !show;
            }
        }

        this.emitCheckedColumn();
    }

    emitCheckedColumn() {
        this.selectColumn.emit(this._checkedColumns.slice(0, this.columns.length));
    }

    setCheckedColumn() {
        this.selectColumn.emit(this._checkedColumns.slice(0, this.columns.length));
    }


}
