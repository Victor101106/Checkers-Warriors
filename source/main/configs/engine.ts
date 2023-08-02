import { FastifyInstance } from 'fastify'
import FastifyView from '@fastify/view'
import path from 'path'

export default (instance: FastifyInstance) => {
    instance.register(FastifyView, { 
        engine: { ejs: require('ejs') },
        root: path.join(__dirname, '../../adapters/presenters/web/views/')
    })
}