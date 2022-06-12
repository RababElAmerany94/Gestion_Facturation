import { Directive, Input, OnChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Access } from 'app/core/enums/access.enum';
import { Modules } from 'app/core/enums/modules.enum';
import { UserHelper } from 'app/core/helpers/user';

@Directive({
    selector: '[ktHasPermission]'
})
export class HasPermissionDirective implements OnChanges {

    isVisible = false;

    // the permissions should current user to have it
    @Input()
    appHasPermission: { module: Modules, access: Access };

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>
    ) { }

    ngOnChanges() {
        // match required permissions with which has current user
        const matchPermission = UserHelper
            .hasPermission(this.appHasPermission.module, this.appHasPermission.access);

        // if permissions matched
        if (matchPermission) {

            if (!this.isVisible) {
                this.isVisible = true;
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }

        } else {

            // if the required permissions don't match
            // with the current user has clear view
            this.viewContainerRef.clear();
        }
    }

}
