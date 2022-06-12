import { Directive, Input, ViewContainerRef, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { UserProfile } from '../core/enums/user-role.enums';
import { UserHelper } from '../core/helpers/user';

@Directive({
    selector: '[ktHasRole]'
})
export class HasRoleDirective implements OnChanges {

    private isVisible = false;

    // the role the user must have
    @Input() ktHasRole: UserProfile[];

    /**
     * @param {ViewContainerRef} viewContainerRef
     * 	-- the location where we need to render the templateRef
     * @param {TemplateRef<any>} templateRef
     *   -- the  to be potentially rendered
     * @param {RolesService} rolesService
     *   -- will give us access to the roles a user has
     */
    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const role = UserHelper.getRole();

        // If the user has the role needed to
        // render this component we can add it
        if (this.ktHasRole.includes(role)) {

            // If it is already visible (which can happen if
            // his roles changed) we do not need to add it a second time
            if (!this.isVisible) {
                this.isVisible = true;
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        } else {
            // If the user does not have the role,
            // we update the `isVisible` property and clear
            // the contents of the viewContainerRef
            this.isVisible = false;
            this.viewContainerRef.clear();
        }
    }
}
