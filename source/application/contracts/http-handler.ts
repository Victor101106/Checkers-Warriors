import { HttpResponse } from "./http-response"
import { HttpRequest } from "./http-request"

export interface HttpHandler {
    handle(request: HttpRequest): Promise<HttpResponse>
}