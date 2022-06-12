import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { FileManagerModel } from 'app/core/models/general/file-manager.model';
import { IResult, IResultBase } from 'app/core/models/general/result-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  static endPoint = AppSettings.API_ENDPOINT + 'FileManager/';

  constructor(private http: HttpClient) { }

  /**
   * Get file by name
   * @param name name of file
   */
  Get(name: string): Observable<IResult<string>> {
    return this.http.get<IResult<string>>(`${FileManagerService.endPoint}${name}`);
  }

  /**
   * Add files
   * @param body list of file
   */
  Add(body: FileManagerModel[]): Observable<IResultBase> {
    return this.http.post<IResultBase>(`${FileManagerService.endPoint}Create`, body);
  }

  /**
   * Delete file by name
   * @param name name of file
   */
  Delete(name: string): Observable<IResultBase> {
    return this.http.delete<IResultBase>(`${FileManagerService.endPoint}${name}`);
  }

  /**
   * Delete file by name
   * @param name name of file
   */
  DeleteList(names: string[]): Observable<IResultBase> {
    return this.http.post<IResultBase>(`${FileManagerService.endPoint}DeleteList`, names);
  }
}
