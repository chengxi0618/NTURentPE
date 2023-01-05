import mongo from "./mongo"
import {httpServer, app} from "./server"

mongo.connect()

// dotenv.config()
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})