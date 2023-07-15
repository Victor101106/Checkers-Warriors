import instance from "./configs/instance"
import './configs/dotenv'

const PORT = Number(process.env.PORT)

instance.listen({ port: PORT }, (error, address) => {
    
    if (error) {
        console.error(error)
        process.exit(1)
    }
    
    console.log(`⚡ Listening at PORT ${PORT} (${address})`)

})