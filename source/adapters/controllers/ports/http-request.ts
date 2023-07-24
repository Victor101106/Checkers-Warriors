import { HttpRequestHeaders } from "./http-headers"

export interface HttpRequest {
    headers: HttpRequestHeaders
    params: object
    query: object
    body: any
}