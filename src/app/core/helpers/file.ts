import { StringHelper } from './string';
import { FileManagerService } from '../services/file-manager/file-manager.service';
import { PieceJoin, Memo } from '../models/general/memo.model';
import { ToastService } from '../layout/services/toast.service';
import { ResultStatus } from '../enums/result-status';
import { TranslateService } from '@ngx-translate/core';
import { FileManagerModel } from '../models/general/file-manager.model';
import { MemoHelper } from './memo';
import { MemoDossier } from '../models/general/memo-dossier.model';
import { MemoDossierHelper } from './memo-dossier';

export class FileHelper {

    /**
     * Download file from base64
     * @param data base64
     * @param fileName name of file
     * @param fileType type of file
     * @param extension extension of file
     */
    static downloadBase64(data: any, fileName: string, fileType: string, extension: string) {

        if (fileType.includes('application/octet-stream')) {
            fileType = 'application/' + extension;
        }

        const binaryString = window.atob(data.split(',')[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const buffer = bytes.buffer;

        const blob = new Blob([buffer], { type: fileType });

        // Set view.
        if (blob) {
            // Read blob.
            const url = window.URL.createObjectURL(blob);

            // Create link.
            const a = Object.assign(document.createElement('a'));

            // Set link on DOM.
            document.body.appendChild(a);

            // Set link's visibility.
            a.style = 'display: none';

            // Set href on link.
            a.href = url;

            // Set file name on link.
            a.download = fileName;

            // Trigger click of link.
            a.click();

            // Clear.
            window.URL.revokeObjectURL(url);
        }
    }

    /**
     * transfer base64 to array buffer
     * @param base64 the base64
     */
    static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * transfer array buffer to file url
     * @param data array buffer
     * @param fileName the filename
     * @param fileType the file type
     * @param extension the extension of file
     */
    public static arrayBufferToFileUrl(data: ArrayBuffer, fileName: string, fileType: string, extension: string) {
        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        // Set MIME type and encoding.
        fileType = (fileType || 'application/pdf');

        // Set file name.
        fileName = (fileName || stamp + '.' + extension);

        // Set data on blob.
        const blob = new Blob([data], { type: fileType });

        // Set view.
        return window.URL.createObjectURL(blob);
    }

    /**
     * download memo
     * @param fileManagerService the file manager service
     * @param pieceJoint the piece joint that we want to download
     * @param toastService the toast service
     * @param translateService the translate service
     */
    static downloadMemo(
        fileManagerService: FileManagerService, pieceJoint: PieceJoin, toastService: ToastService, translateService: TranslateService) {
        fileManagerService.Get(pieceJoint.name).subscribe(
            result => {
                if (result.status === ResultStatus.Succeed) {
                    FileHelper.downloadBase64(
                        result.value,
                        pieceJoint.orignalName,
                        pieceJoint.file.substring('data:'.length, pieceJoint.file.indexOf(';base64')),
                        pieceJoint.type
                    );
                } else {
                    toastService.error(translateService.instant('ERRORS.SERVER'));
                }
            }
        );
    }

    /**
     * upload memos
     * @param fileManagerService the file manger service
     * @param memo the memo that we want to add
     * @param memos the list memos that object have
     * @param callback the success callback
     * @param callbackError the error callback
     */
    static UploadMemo(fileManagerService: FileManagerService, memo: Memo, callback: (arg0: Memo) => void, callbackError: () => void) {
        const files: FileManagerModel[] = MemoHelper.getFilesFromMemo(memo);
        memo = MemoHelper.cleanBase64(memo);
        fileManagerService.Add(files).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                callback(memo);
            } else {
                callbackError();
            }
        });
    }

    /**
     * upload memo dossier
     */
    static UploadMemoDossier(fileManagerService: FileManagerService, memo: MemoDossier, memos: string, callback, callbackError) {
        const files: FileManagerModel[] = MemoDossierHelper.getFilesFromMemo(memo);
        memo = MemoDossierHelper.cleanBase64(memo);
        fileManagerService.Add(files).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                const memosRes = MemoDossierHelper.addMemoToMemos(memos, memo);
                callback(memosRes);
            } else {
                callbackError();
            }
        });
    }

    /**
     * get list file from piece jointes
     * @param pieceJointes the list piece joint
     */
    static getFilesFromPieceJoin(pieceJointes: PieceJoin[]): FileManagerModel[] {
        const files: FileManagerModel[] = [];

        pieceJointes.forEach((pj, _) => {
            if (!StringHelper.isEmptyOrNull(pj.file)) {
                const file = {
                    base64: pj.file,
                    name: pj.name
                };
                files.push(file);
            }
        });

        return files;
    }

    static UploadFiles(fileManagerService: FileManagerService, files: FileManagerModel[], callback, callbackError) {
        if (files.length > 0) {
            fileManagerService.Add(files).subscribe(res => {
                if (res.status === ResultStatus.Succeed) {
                    callback();
                } else {
                    callbackError();
                }
            });
        } else {
            callback();
        }
    }

    /**
     * download excel
     */
    static downloadEXCEL(base64: string, name: string) {

        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        const fileType = 'application/vnd.ms-excel';

        // file extension
        const extension = 'xlsx';

        FileHelper.downloadBase64(',' + base64, `${name}_${stamp}.${extension}`, fileType, extension);
    }

    /**
     * download pdf
     */
    static DownloadPDF(base64: string, name: string) {
        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        // file type
        const fileType = 'application/pdf';

        // file extension
        const extension = 'pdf';

        FileHelper.downloadBase64(',' + base64, `${name}_${stamp}.${extension}`, fileType, extension);
    }

    /** print pdf */
    static printPDF(base64: string, name: string) {
        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        // file type
        const fileType = 'application/pdf';

        // file extension
        const extension = 'pdf';

        const arrayBuffer = this.base64ToArrayBuffer(base64);

        const pdfSrc = FileHelper.arrayBufferToFileUrl(arrayBuffer, `${name}_${stamp}.${extension}`, fileType, extension);

        const objFra = document.createElement('iframe');   // Create an IFrame.
        objFra.style.visibility = 'hidden';    // Hide the frame.
        objFra.src = pdfSrc;                  // Set source.
        document.body.appendChild(objFra);  // Add the frame to the web page.
        objFra.contentWindow.focus();       // Set focus.
        objFra.contentWindow.print();      // Print it.
    }

    /**
     * download blob data
     * @param data the data format blob
     */
    static downloadBlob(data: Blob, filename: string) {
        const downloadedFile = new Blob([data], { type: data.type });
        const a = document.createElement('a');
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        a.download = filename;
        a.href = URL.createObjectURL(downloadedFile);
        a.target = '_blank';
        a.click();
        document.body.removeChild(a);
    }

    /** view pdf example in document parameter */
    static viewPdfExample(base64: string, name: string) {
        // Get time stamp for fileName.
        const stamp = new Date().getTime();

        // file type
        const fileType = 'application/pdf';

        // file data
        const fileData = FileHelper.base64ToArrayBuffer(base64);

        // file extension
        const extension = 'pdf';

        return FileHelper.arrayBufferToFileUrl(fileData, `${name}${stamp}.${extension}`, fileType, extension);
    }
}
