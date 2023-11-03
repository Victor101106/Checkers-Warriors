import { parseCookies } from "../../adapters/controllers/helpers/cookie-helper"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/', (request, reply) => {

    const cookies = parseCookies(request.headers.cookie || '')
    const hasAccessToken = !!cookies['access-token']

    reply.view('presentation/views/landing-page.html', { logged: hasAccessToken })

})