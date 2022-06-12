import { Directive, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserHelper } from 'app/core/helpers/user';

@Directive({ selector: '[ktIsForAgence]' })
export class IsForAgenceDirective implements OnChanges {

    private isVisible = false;

    // the role the user must have
    @Input()
    ktIsForAgence: boolean;

    /**
     * @param viewContainerRef the location where we need to render the templateRef
     * @param templateRef the  to be potentially rendered
     */
    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const isAgence = UserHelper.isFollowAgence();

        // If the user has the role needed to
        // render this component we can add it
        if (isAgence && this.ktIsForAgence) {

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
