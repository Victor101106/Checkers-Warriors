import { parseCookies } from "../../adapters/controllers/helpers/cookie-helper"
import { FastifyInstance } from "fastify"

module.exports = (instance: FastifyInstance) => instance.get('/create-match', (request, reply) => {

    const cookies = parseCookies(request.headers.cookie || '')
    const hasAccessToken = !!cookies['access-token']

    if (!hasAccessToken)
        return reply.redirect('/')

    reply.view('create-match-page.html')

})