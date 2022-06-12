import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AcceptIntInputDirective } from './accept-int-input.directive';
import { ContentAnimateDirective } from './content-animate.directive';
import { DebounceClickDirective } from './debounce-click.directive';
import { HasRoleDirective } from './has-role.directive';
import { HeaderDirective } from './header.directive';
import { IsForAgenceDirective } from './is-for-agence.directive';
import { MenuDirective } from './menu.directive';
import { OffcanvasDirective } from './offcanvas.directive';
import { ScrollTopDirective } from './scroll-top.directive';
import { StickyDirective } from './sticky.directive';
import { TabClickEventDirective } from './tab-click-event.directive';
import { ToggleDirective } from './toggle.directive';
import { TwoDigitDecimalNumberDirective } from './two-digit-decimal-number.directive';

@NgModule({
    declarations: [
        HasRoleDirective,
        TwoDigitDecimalNumberDirective,
        TabClickEventDirective,
        ScrollTopDirective,
        HeaderDirective,
        OffcanvasDirective,
        ToggleDirective,
        MenuDirective,
        ContentAnimateDirective,
        StickyDirective,
        AcceptIntInputDirective,
        IsForAgenceDirective,
        DebounceClickDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        HasRoleDirective,
        TwoDigitDecimalNumberDirective,
        TabClickEventDirective,
        ScrollTopDirective,
        HeaderDirective,
        OffcanvasDirective,
        ToggleDirective,
        MenuDirective,
        ContentAnimateDirective,
        StickyDirective,
        AcceptIntInputDirective,
        IsForAgenceDirective,
        DebounceClickDirective
    ],
    providers: [],
})
export class DirectivesModule { }
