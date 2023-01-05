import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Calendar from "../components/Calendar"
import EventList from "../components/EventList"
import { useRent } from "./hooks/useRent"
import { EVENT_JOINED_SUBSCRIPTION, EVENT_CANCELED_SUBSCRIPTION } from "../graphql"

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  margin-top: 100px;
  height: 90%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  overflow: auto;
`

const CalendarWrapper = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
`

const EventWrapper = styled.div`
  height: 100%;
  width: 30%;
  margin-left: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow: auto;
`

const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const Participant = () => {
  const { userEvents } = useRent()
  const [userInfo, setUserInfo] = useState([])

  useEffect(() => {
    let newUserInfo = []
    console.log(userEvents)
    userEvents.map((e) => {
      let datefrom = toDateString(e.eventdatefrom)
      let dateto = toDateString(e.eventdateto)
      const date = `${datefrom} ~ ${dateto}`
      newUserInfo.push({
        id: e.id,
        name: e.eventname,
        date: date,
        property: e.tags,
      })
    })
    setUserInfo(newUserInfo)
  }, [userEvents])

  const toDateString = (date) => {
    const newDate = new Date(parseInt(date))
    return (
      weekDay[newDate.getDay()] +
      " " +
      newDate.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "numeric",
        day: "numeric",
      })
    )
  }

  return (
    <Wrapper>
      <BodyWrapper>
        <CalendarWrapper>
          <Calendar />
        </CalendarWrapper>
        <EventWrapper>
          <EventList info={userInfo}></EventList>
        </EventWrapper>
      </BodyWrapper>
    </Wrapper>
  )
}

export default Participant
