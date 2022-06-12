import { Component, Input } from '@angular/core';
import { ImageAnomalie, IPhotoDocument } from 'app/core/models/dossierPVModel';

@Component({
  selector: 'kt-pictures-view',
  templateUrl: './pictures-view.component.html'
})
export class PicturesViewComponent {

    @Input()
    set data(value: IPhotoDocument[]) {
        if (value != null) {
            this.anomalies = value;
        }
    }
    /** anomalie */
    anomalies: IPhotoDocument[] = [];

    constructor() { }

    /** parseImage */
    parseImage(images: string): ImageAnomalie {
        return JSON.parse(images);
    }

}
