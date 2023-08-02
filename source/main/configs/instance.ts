import setRoutest from './routest'
import setEngine from './engine'
import setStatic from './static'
import Fastify from 'fastify'

const instance = Fastify()

setRoutest(instance)
setEngine(instance)
setStatic(instance)

export default instance