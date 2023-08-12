import instance from "./configs/instance"

import './adapters/factories/socket-match-adapter-factory'
import './configs/socket'
import './configs/dotenv'

const PORT = Number(process.env.PORT)

instance.ready((error) => {

    if (error) {
        console.error(error)
        process.exit(1)
    }
    
    instance.server.listen(PORT, () => {
        console.log(`⚡ Listening at PORT ${PORT}!`)
    })

})