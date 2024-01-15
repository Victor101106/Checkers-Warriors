import { HttpRequestHeaders } from "./http-headers"

export interface HttpRequest {
    headers: HttpRequestHeaders
    query: object
    body: any
}