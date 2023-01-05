import * as React from "react"
import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import styled from "styled-components"
import { TextField } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import Autocomplete from "@mui/material/Autocomplete"
import { useNavigate } from "react-router"
import { useRent } from "../containers/hooks/useRent"
import defaultIMG from "../eventPictures/2023_NEW-YORK.jpg"
import "dayjs"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 675,
  height: 600,
  bgcolor: "rgba(255, 255, 255, 1)",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}

const BoxField = styled(Box)({
  mt: 2,
  mb: 2,
})

const properties = ["Entertainment", "Academic", "Arts and Cultural", "Sports", "Service", "Social"]

export default function BasicModal({ open, handleClose, username }) {
  const [activityname, setActivityname] = useState("")
  const [hostname, setHostname] = useState(username)
  const [picktimefrom, setPickTimefrom] = useState()
  const [picktimeto, setPickTimeto] = useState()
  const [timefrom, setTimefrom] = useState()
  const [timeto, setTimeto] = useState()
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState("")
  const [imageURL, setImageURL] = useState("")
  const { eventcreate } = useRent()

  const navigate = useNavigate()

  const resetTime = () => {
    const date = new Date()
    const M = {
      $D: date.getDate(),
      $H: date.getHours(),
      $L: "en",
      $M: date.getMonth(),
      $W: date.getDay(),
      $d: date,
      $m: date.getMinutes(),
      $ms: date.getMilliseconds(),
      $s: date.getSeconds(),
      $y: date.getFullYear(),
    }
    // console.log(M)
    setTimefrom(M)
    setTimeto(M)
  }

  useEffect(() => {
    resetTime()
  }, [open])

  const handleSubmit = async () => {
    // console.log(timefrom, timeto)
    if (!activityname) {
      window.alert("ActivityName cannot be empty!")
      return
    }
    if (!timefrom) {
      window.alert("Please choose the time that activity starts!")
      return
    }
    if (!timeto) {
      window.alert("Please choose the time that activity ends!")
      return
    }
    if (timeto.$d.getTime() < timefrom.$d.getTime()) {
      window.alert("Start time should be earlier than End time")
      return
    }
    if (!tags.length) {
      window.alert("Please choose some properties for the activity!")
      return
    }
    if (!description) {
      window.alert("Please describe the activity!")
      return
    }

    try {
      // console.log(timefrom.$d.getTime())
      const { data } = await eventcreate({
        variables: {
          eventname: activityname,
          hostname: hostname,
          eventdatefrom: timefrom.$d.getTime().toString(),
          eventdateto: timeto.$d.getTime().toString(),
          imageURL: imageURL || defaultIMG,
          tags: tags,
          description: description,
        },
      })
      setActivityname("")
      setTags([])
      setDescription("")
      setImageURL("")

      handleClose()
    } catch (e) {
      console.log(e)
    }
  }

  // useEffect(() => {
  //   if (timefrom) {
  //     const time = timefrom.$d.getTime().toString()
  //     const timeInt = parseInt(time)
  //     // dayjs(time).format("YYYY MMM DD")
  //     console.log(new Date(timeInt))
  //   }
  // }, [timefrom])

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mt: 1,
              mb: 1,
            }}
          >
            Create an Event
          </Typography>
          <Box onSubmit={null} noValidate sx={{ mt: 1, width: 625 }}>
            <BoxField
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ width: 200, mr: 1 }}>
                Activity Name
              </Typography>
              <TextField
                required
                fullWidth
                autoFocus
                variant="standard"
                value={activityname}
                onChange={(e) => setActivityname(e.target.value)}
              />
            </BoxField>
            <BoxField
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ width: 200, mr: 1 }}>
                Activity Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="from"
                  value={picktimefrom}
                  onChange={(newTime) => {
                    setPickTimefrom(newTime)
                    setTimefrom(newTime)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                  label="to"
                  value={picktimeto}
                  onChange={(newTime) => {
                    setPickTimeto(newTime)
                    setTimeto(newTime)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </BoxField>
            <BoxField
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ width: 200, mr: 1 }}>
                imageURL
              </Typography>
              <TextField
                required
                fullWidth
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
            </BoxField>
            <BoxField
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ width: 200, mr: 1 }}>
                Tag
              </Typography>
              <Autocomplete
                multiple
                id="tags-standard"
                options={properties}
                onChange={(event, value) => setTags(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    sx={{ width: 450, height: 31 }}
                    value={tags}
                  />
                )}
              />
            </BoxField>
            <BoxField>
              <Typography variant="subtitle1" sx={{ width: 500, mr: 1, mb: 2 }}>
                Activity Description
              </Typography>
              <TextField
                id="outlined-multiline-static"
                required
                fullWidth
                multiline
                rows={6}
                placeholder="About Activity..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </BoxField>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
