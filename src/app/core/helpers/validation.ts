import { FormControl, ValidationErrors } from '@angular/forms';
import { AppSettings } from 'app/app-settings/app-settings';

export class ValidationUtils {

    /**
     * this function check validation format
     * @param file information of file
     */
    static validationDocument(file) {
        const extension = file.name.split('.').pop().toString().toLowerCase();
        if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
            return true
        }
        return false
    }

    /**
     * validate if the given file has a valid extension
     * @param file the file path to be validated
     */
    static IsFileExtensionValid(file: string): boolean {
        if (file === null) {
            return false;
        }

        const extension = file.substring(file.lastIndexOf('.') + 1);

        if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * validate if the file value of the given control has a valid extension
     * should be applied on a input type file
     * @param formControl the form control to be validated
     */
    static validExtension(formControl: FormControl): ValidationErrors | null {
        const file = formControl.value;
        if (ValidationUtils.IsFileExtensionValid(file)) {
            return null
        } else {
            return {
                valideExtension: {
                    error: true
                }
            }
        }
    }

    /**
    * this function check validation format
    * @param file information of file
    */
    static validationPicture(file) {
        const extension = file.name.split('.').pop().toString().toLowerCase();
        if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
            return true
        }
        return false
    }

    /**
     * This function check size of file
     * @param file Information of file
     */
    static validationSize(file) {
        if (file.size > AppSettings.MAX_SIZE_FILE) {
            return false;
        }
        return true;
    }
}
