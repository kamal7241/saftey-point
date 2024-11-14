export interface ApiResult<T> {
    code: number;
    status: boolean;
    innerData: T;
    message: string;
    authToken: string;
}


export interface GenericResponse {
    status: boolean;
    message: string;
    authToken: string;
}
