import cookie from 'cookie'

export interface CookieOptions {
    priority?: 'low' | 'medium' | 'high'
    sameSite?: boolean
    httpOnly?: boolean
    secure?: boolean
    maxAge?: number
    domain?: string
    expires?: Date
    path?: string
}

export const serializeCookie = (name: string, value: string, options?: CookieOptions) => {
    return cookie.serialize(name, value, { ...(options || {}) })
}

export const parseCookies = (cookies: string) => {
    return cookie.parse(cookies)
}