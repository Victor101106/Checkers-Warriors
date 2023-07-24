import { HttpResponseHeader } from "./http-headers"

export interface HttpResponse {
    headers?: Array<HttpResponseHeader>
    code: number
    body: any
}