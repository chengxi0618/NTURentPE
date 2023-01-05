import { createPubSub, createSchema, createYoga } from "graphql-yoga"
import { createServer } from "node:http"
import { useServer } from "graphql-ws/lib/use/ws"
import { WebSocketServer } from "ws"
import * as fs from "fs"
import UserModel from "./models/user"
import EventModel from "./models/event"
import CounterModel from "./models/counter"
import User from "./resolvers/User"
import Event from "./resolvers/Event"
import Query from "./resolvers/Query"
import Mutation from "./resolvers/Mutation"
import Subscription from "./resolvers/Subscription"
import http from "http";
import express from 'express'

import path from "path";

const app = express()
const httpServer = http.createServer(app)

const pubsub = createPubSub()

const yoga = createYoga({
  schema: createSchema({
    typeDefs: fs.readFileSync("./src/schema.graphql", "utf-8"),
    resolvers: {
      Query,
      Mutation,
      Subscription,
      User,
      Event,
    },
  }),
  context: {
    UserModel,
    EventModel,
    CounterModel,
    pubsub,
  },
  // graphqlEndpoint: "/", // uncomment this to send the app to: 4000/
  graphiql: {
    subscriptionsProtocol: "WS",
  },
})

//const httpServer = createServer(yoga)

app.use('/graphql', yoga)

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend", "build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
  });
}

const wsServer = new WebSocketServer({
  server: httpServer,   // httpServer
  path: yoga.graphqlEndpoint,
})
if (process.env.NODE_ENV !== "production") {
useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra.request,
          socket: ctx.extra.socket,
          params: msg.payload,
        })

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe,
        },
      }

      const errors = validate(args.schema, args.document)
      if (errors.length) return errors
      return args
    },
  },
  wsServer
)
}
// const port = process.env.PORT || 4000
// server.listen({ port }, () => {
//   console.log(`The server is up on port ${port}!`)
// })
export {httpServer, app}    // httpServer
