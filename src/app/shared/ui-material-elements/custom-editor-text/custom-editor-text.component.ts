import { Component, Input } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BaseCustomUiComponent } from '../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-custom-editor-text',
    templateUrl: './custom-editor-text.component.html'
})
export class CustomEditorTextComponent extends BaseCustomUiComponent {

    @Input() set disable(value: boolean) {
        if (value != null) {
            this.editorConfig.editable = !value;
            this.editorConfig.showToolbar = !value;
        }
    }

    @Input()
    icon: string;

    @Input()
    height = '10rem';

    editorConfig: AngularEditorConfig;

    constructor() {
        super();
        this.editorConfig = {
            editable: true,
            spellcheck: false,
            height: this.height,
            showToolbar: true,
            toolbarHiddenButtons: [
                [],
                [
                    'insertImage',
                    'insertVideo',
                ]
            ]
        }
    }

}
