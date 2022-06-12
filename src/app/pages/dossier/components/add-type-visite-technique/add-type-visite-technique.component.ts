import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VisteTechniqueType } from 'app/core/enums/viste-technique-type.enum';

@Component({
    selector: 'kt-add-type-visite-technique',
    templateUrl: './add-type-visite-technique.component.html'
})
export class AddTypeVisiteTechniqueComponent {

    /** the type of visite technique enumeration */
    visteTechniqueType = VisteTechniqueType;
    selectedType: VisteTechniqueType;

    constructor(
        private matDialogRef: MatDialogRef<AddTypeVisiteTechniqueComponent>
    ) {
    }

    /** select type */
    add() {
        this.matDialogRef.close(this.selectedType);
    }

}
