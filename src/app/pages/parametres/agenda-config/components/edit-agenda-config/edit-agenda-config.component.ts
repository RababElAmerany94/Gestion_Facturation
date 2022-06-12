import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAgendaConfig } from './../../agenda-config.model';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

@Component({
    selector: 'kt-edit-agenda-config',
    templateUrl: './edit-agenda-config.component.html'
})
export class EditAgendaConfigComponent implements OnInit {

    /**
     * the form group
     */
    form: FormGroup;

    /**
     * mode of dialog
     */
    mode = ModeEnum.Add;

    /**
     * modes of dialog
     */
    modes = ModeEnum;

    /**
     * mode show of dialog
     */
    modeShow: boolean;

    /**
     * title of dialog
     */
    title: string;

    /**
     * type of agenda config
     */
    typesAgendaConfig: IDropDownItem<number, string>[] = [];

    constructor(
        public dialogRef: MatDialogRef<EditAgendaConfigComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            agendaConfig?: IAgendaConfig,
            typeTabs: AgendaType,
        }
    ) { }

    ngOnInit(): void {
        this.initComponent();
    }

    /**
     * initialize component
     */
    initComponent() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        this.title = this.getTitle(this.getNameType(this.data.typeTabs));
        this.initForm();
    }

    /**
     * init form
     */
    initForm() {
        if (this.data.agendaConfig != null) {
            this.setDataInForm(this.data.agendaConfig);
        }
        if (this.data.mode === ModeEnum.Show) {
            this.modeShow = true;
            this.form.disable();
        } else {
            this.modeShow = false;
            this.form.enable();
        }
    }

    /**
     * set data in form
     */
    setDataInForm(type: IAgendaConfig) {
        this.form.setValue({
            name: type.name,
        });
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.getRawValue());
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * get titles translated
     */
    getTitle(name: string) {
        switch (this.mode) {
            case ModeEnum.Add:
                return `${name}.ADD_TITLE`;

            case ModeEnum.Edit:
                return `${name}.EDIT_TITLE`;

            case ModeEnum.Show:
                return `${name}.SHOW_TITLE`;
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: AgendaType) {
        switch (type) {
            case AgendaType.TacheType:
                return 'TYPE_TACHE';

            case AgendaType.RdvType:
                return 'TYPE_RDV';

            case AgendaType.EvenementCategorie:
                return 'CATEGORIE_EVENEMENT';

            case AgendaType.AppelType:
                return 'TYPE_APPEL';

            case AgendaType.SourceRDV:
                return 'SOURCE_RDV';
        }
    }
}
