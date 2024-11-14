import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ApiResult } from '@core/types/api-result';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';


export abstract class ApiService {
    protected token: string;

    protected _errorMessage: string;

    public get errorMessage(): string {
        return this._errorMessage;
    }

    constructor(
        private http: HttpClient,
        private _snackBar: ToastrService,
    ) { }

    private buildResponse<T>(res: any): ApiResult<T> {
        const output = res.body as unknown as ApiResult<T>;
        const resToken = res.headers.get('X-Auth-Token');
        if (resToken && output.authToken !== resToken) {
            output.authToken = resToken;
        }
        return output;
    }

    private buildHeaders(requireAuth = true, isMultiPart = false): any {
        this._errorMessage = '';
        let headers = new HttpHeaders({
            'Referrer-Policy': 'strict-origin-when-cross-origin'
            // Other headers...
        });

        if (requireAuth) {
            headers = headers.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        }

        if (!isMultiPart) {
            headers = headers.append('Content-Type', "application/json");

        }
        headers = headers.append('accept-language', 'ar')


        return { headers, observe: 'response' };
    }

    private errorResponse<T>(err): ApiResult<T> {
        return {
            code: err.status,
            message: err.message,
            data: err
        } as unknown as ApiResult<T>;
    }

    private async parseResponse<T>(res: Observable<HttpEvent<T>>): Promise<ApiResult<T>> {
        const data = await res.pipe(
            map((r) => this.buildResponse<T>(r)),
            catchError((err) => observableOf(this.errorResponse<T>(err))),
            take(1)).toPromise();

        if (data.authToken) {
            localStorage.setItem('authToken', data.authToken);
            console.log("=====authToken=");
            console.log(localStorage.getItem('authToken'));
        }
        if (!data.status) {
            this._errorMessage = data.message;
            this._snackBar.error(data.message + ' ❌');
        }
        return data;
    }

    protected async getResponse<T>(route: string, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.get<T>(uri, this.buildHeaders(requireAuth)));
    }

    protected async postResponse<T>(route: string, data?: unknown, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.post<T>(uri, JSON.stringify(data), this.buildHeaders(requireAuth)));
    }

    protected async postMultiDataResponse<T>(route: string, data: any, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.post<T>(uri, data, this.buildHeaders(requireAuth, true)));
    }

    protected async putResponse<T>(route: string, data?: unknown, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.put<T>(uri, JSON.stringify(data), this.buildHeaders(requireAuth)));
    }

    protected async deleteResponse<T>(route: string, requireAuth = true): Promise<ApiResult<T>> {
        const uri = `${environment.apiUrl}/${route}`;
        return this.parseResponse<T>(this.http.delete<T>(uri, this.buildHeaders(requireAuth)));
    }


    protected async postVimeoDataResponse<T>(file: any): Promise<ApiResult<T>> {
        const uri = "https://api.vimeo.com/me/videos";
        let headers = new HttpHeaders({
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Authorization': 'Bearer ab6b1ba3822dd1f716d715f1da79f5e4',
            "Accept": "application/vnd.vimeo.*+json;version=3.4",
            'Access-Control-Allow-Origin': '*',
        });
        return this.parseResponse<T>(this.http.post<T>(uri, file, { headers, observe: 'response' }));
    }
}