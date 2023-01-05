import mongo from "./mongo"
import app from "./server"

mongo.connect()

// dotenv.config()
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
