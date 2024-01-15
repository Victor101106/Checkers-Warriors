import { HttpResponseHeader } from "../ports/http-headers"
import { HttpResponse } from "../ports/http-response"
import { serializeCookie } from "./cookie-helper"

export const unauthorized = (error: Error, headers: Array<HttpResponseHeader> = new Array<HttpResponseHeader>()): HttpResponse => ({
    headers: [...headers, { name: 'Set-Cookie', value: serializeCookie('access-token', '', { sameSite: true, expires: new Date('Thu, 01 Jan 1970 00:00:00 GMT') }) } ],
    code: 401,
    body: { 
        message: error.message, 
        name: error.name 
    }
})

export const badRequest = (error: Error, headers?: Array<HttpResponseHeader>): HttpResponse => ({
    headers: headers,
    code: 400,
    body: { 
        message: error.message, 
        name: error.name 
    }
})

export const created = (body: any, headers?: Array<HttpResponseHeader>): HttpResponse => ({
    headers: headers,
    body: body,
    code: 201,
})

export const ok = (body: any, headers?: Array<HttpResponseHeader>): HttpResponse => ({
    headers: headers,
    body: body,
    code: 200,
})