import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { RentProvider } from "./containers/hooks/useRent"
import Event from "./containers/EventPage"
import AllEvent from "./containers/AllEventPage"

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === "production" ? "/graphql": "http://localhost:4000/graphql",
  //"http://localhost:4000/graphql",
})
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NODE_ENV === "production" ? window.location.origin.replace(/^http/, "ws") : "ws://localhost:4000/graphql", 
    // "ws://localhost:4000/graphql",
    // options: {
    //   lazy: true,
    // },
  })
)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RentProvider>
        <App />
      </RentProvider>
    </ApolloProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
