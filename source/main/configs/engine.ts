import { FastifyInstance } from 'fastify'
import FastifyView from '@fastify/view'

export default (instance: FastifyInstance) => {
    instance.register(FastifyView, { 
        engine: { ejs: require('ejs') },
        root: './source/adapters/presenters/web/views/'
    })
}