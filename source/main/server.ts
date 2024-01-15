import instance from "./configs/instance"

import { env } from './configs/env'

import './configs/socket'

instance.ready((error) => {

    if (error) {
        console.error(error)
        process.exit(1)
    }
    
    instance.server.listen(env.port, () => {
        console.log(`⚡ Listening at PORT ${env.port}!`)
    })

})