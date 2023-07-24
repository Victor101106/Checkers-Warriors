import { HttpResponse } from "./http-response"
import { HttpRequest } from "./http-request"

export interface HttpController {
    handle(request: HttpRequest): Promise<HttpResponse>
}