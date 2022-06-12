import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'kt-preview-base64',
    templateUrl: './preview-base64.component.html',
    styleUrls: ['./preview-base64.component.scss']
})
export class PreviewBase64Component implements OnInit {

    urlSafe: SafeResourceUrl;
    height = '150px';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { base64: string },
        public dialogRef: MatDialogRef<PreviewBase64Component>,
        public sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.base64);
    }

    loadEvent(event) {
        this.height = `${event.currentTarget.offsetHeight * 0.75}px`;
    }
}
