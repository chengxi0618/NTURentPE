import * as bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import dotenv from "dotenv-defaults"

dotenv.config()
const generateToken = (data) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY || "JwtSecretKey"
  try {
    let token = jwt.sign(data, jwtSecretKey)
    // console.log(jwtSecretKey)
    return token
  } catch (e) {
    return "GENERATE_JWTSECRETKEY_ERROR"
  }
}

const Mutation = {
  login: async (parent, { username, passwd }, { UserModel }) => {
    const user = await UserModel.findOne({ username })
    if (!user) throw new GraphQLError(`USER_NOTFOUND_ERROR`)

    // console.log(passwd, user.passwd)
    const validPasswd = await bcrypt.compare(passwd, user.passwd)
    // const validPasswd = passwd === user.passwd
    if (!validPasswd) throw new GraphQLError(`PASSWORD_INCORRECT_ERROR`)

    const date = new Date().getTime()

    const data = {
      id: user.id,
      username: user.username,
      loggedInAt: date,
    }
    // console.log(data)
    const token = generateToken(data)
    user.isLoggedIn = true
    user.loggedInAt = date
    await user.save()
    // console.log(date, user)
    // console.log(token)
    // const verify = jwt.verify("", process.env.JWT_SECRET_KEY)
    // console.log(verify)
    return token
  },
  register: async (
    parent,
    { username, passwd, identity },
    { UserModel, CounterModel }
  ) => {
    let user = await UserModel.findOne({ username })
    if (user) throw new GraphQLError(`USER_EXISTING_ERROR`)

    let counter = await CounterModel.findOne({})
    if (!counter) {
      counter = await new CounterModel({
        userId: 1,
        eventId: 1,
      })
    }

    const hashedPassword = await bcrypt.hash(passwd, 10)
    user = await new UserModel({
      id: counter.userId,
      username,
      passwd: hashedPassword,
      // passwd,
      identity,
      isLoggedIn: false,
      loggedInAt: new Date().getTime(),
    }).save()
    counter.userId += 1
    await counter.save()
    console.log(user)
    // return user
    return user.populate("events")
  },
  logout: async (parent, { username }, { UserModel }) => {
    let user = await UserModel.findOne({ username })
    user.isLoggedIn = false
    user.loggedInAt = new Date().getTime()
    await user.save()
    return user
  },

  event: async (
    parent,
    {
      eventname,
      hostname,
      eventdatefrom,
      eventdateto,
      tags,
      imageURL,
      description,
    },
    { UserModel, EventModel, CounterModel, pubsub }
  ) => {
    let counter = await CounterModel.findOne({})
    if (!counter) {
      counter = await new CounterModel({
        userId: 1,
        eventId: 1,
      })
    }

    let event = await new EventModel({
      id: counter.eventId,
      eventname,
      hostname,
      eventdatefrom,
      eventdateto,
      imageURL: imageURL,
      description,
    })
    // console.log(event.imageURL)
    tags.map((e) => event.tags.push(e))
    await event.save()
    let user = await UserModel.findOne({ username: hostname })
    user.events.push(event)
    await user.save()
    await user.populate(["events"])

    counter.eventId += 1
    await counter.save()
    console.log(event)
    pubsub.publish("EVENT_CREATED", {
      eventCreated: event,
    })
    return "EVENT_CREATED"
  },
  addtoEventlist: async (
    parent,
    { username, eventId },
    { UserModel, EventModel, pubsub }
  ) => {
    let status = ""
    let event = await EventModel.findOne({ id: eventId })
    let user = await UserModel.findOne({ username })
    // console.log(event)
    if (
      event.participants &&
      event.participants.some((user) => user === username)
    ) {
      event.participants.splice(
        event.participants.findIndex((user) => user === username),
        1
      )
      user.events.splice(
        user.events.findIndex((event) => event.id === eventId),
        1
      )
      pubsub.publish("EVENT_CANCELED", {
        eventCanceled: event,
      })
      status = "EVENT_CANCELED"
    } else {
      event.participants.push(username)
      user.events.push(event)
      pubsub.publish("EVENT_JOINED", {
        eventJoined: event,
      })
      status = "EVENT_JOINED"
    }
    await event.save()
    await user.save()
    console.log(user.event)
    return status
  },
}
export default Mutation
