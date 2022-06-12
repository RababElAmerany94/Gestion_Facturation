import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetNameOfUserById } from './get-name-of-user-by-id.pipe';
import { TruncatePipe } from './truncate.pipe';
import { RoundingNumberPipe } from './rounding-number.pipe';
import { GetImageBase64ByName } from './get-image-base64-by-name.pipe';
import { OrderListArticle } from './order-list-article.pipe';
import { RoundingNumberInputPipe } from './rounding-number-input.pipe';
import { CurrencyPipe } from './currency.pipe';
import { FirstLetterPipe } from './first-letter.pipe';
import { GetObjectPipe } from './get-object.pipe';
import { JoinPipe } from './join.pipe';
import { SafePipe } from './safe.pipe';
import { TimeElapsedPipe } from './time-elapsed.pipe';
import { OrderListFacturePaymentPipe } from './order-list-facture-payment.pipe';
import { RestPayerFacturePipe } from './rest-payer-facture.pipe';

@NgModule({
    declarations: [
        GetNameOfUserById,
        CurrencyPipe,
        TruncatePipe,
        RoundingNumberPipe,
        GetImageBase64ByName,
        OrderListArticle,
        RoundingNumberInputPipe,
        TimeElapsedPipe,
        JoinPipe,
        GetObjectPipe,
        SafePipe,
        FirstLetterPipe,
        OrderListFacturePaymentPipe,
        RestPayerFacturePipe,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        GetNameOfUserById,
        CurrencyPipe,
        TruncatePipe,
        RoundingNumberPipe,
        GetImageBase64ByName,
        OrderListArticle,
        RoundingNumberInputPipe,
        TimeElapsedPipe,
        JoinPipe,
        GetObjectPipe,
        SafePipe,
        FirstLetterPipe,
        OrderListFacturePaymentPipe,
        RestPayerFacturePipe,
    ],
    providers: [],
})
export class PipesModule { }
