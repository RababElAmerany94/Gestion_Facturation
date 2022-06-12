import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ResultStatus } from 'app/core/enums/result-status';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslationService } from 'app/core/layout/services/translation.service';
import { DocumentParameterService } from '../../document-parameter.service';
import { IDocumentParameters, IDocumentParametersModel } from '../../document-parameter.model';

@Component({
    selector: 'kt-document-parameter-shell',
    templateUrl: './document-parameter-shell.component.html'
})
export class DocumentParameterShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /**
     * the current document parametrage
     */
    documentParametrage: IDocumentParameters;

    constructor(
        private translationService: TranslationService,
        private documentParameterService: DocumentParameterService,
        protected translate: TranslateService,
        protected toastService: ToastService,
        protected router: Router) {
        super(translate, toastService, router);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.setModule(this.modules.Parameters);
        this.getDocumentParameters();
    }

    /**
     * get the document params by id
     */
    getDocumentParameters() {
        this.subs.sink = this.documentParameterService.Get().subscribe(result => {
            this.documentParametrage = result.value;
        });
    }

    /**
     * add new DocumentParameter
     */
    addDocumentParameter(documentParameter: IDocumentParametersModel) {
        this.documentParameterService.Add(documentParameter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getDocumentParameters();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * edit DocumentParameter
     */
    editDocumentParameter(documentParameter: IDocumentParametersModel) {
        this.documentParameterService.Update(this.documentParametrage.id, documentParameter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.documentParametrage = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

}
