import mongo from "./mongo"
import httpServer from "./server"

mongo.connect()

// dotenv.config()
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
