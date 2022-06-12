import { Pipe, PipeTransform } from '@angular/core';
import { FileManagerService } from '../core/services/file-manager/file-manager.service';
import { StringHelper } from '../core/helpers/string';

@Pipe({
    name: 'GetImageBase64ByName',
    pure: false
})
export class GetImageBase64ByName implements PipeTransform {
    private imageBase64: any = null;
    private cachedImageName = null;

    constructor(private fileManagerService: FileManagerService) { }

    transform(imageBase64: any, args?: any): any {

        if (StringHelper.isEmptyOrNull(imageBase64)) {
            return './assets/media/logos/no-image-available.png';
        }

        if (imageBase64 !== this.cachedImageName) {
            this.imageBase64 = null;
            this.cachedImageName = imageBase64;
            this.fileManagerService.Get(imageBase64).subscribe(response => {
                this.imageBase64 = response.value;
            });
        }

        return this.imageBase64 == null ? './assets/media/logos/no-image-available.png' : this.imageBase64;
    }

}
