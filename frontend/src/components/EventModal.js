import * as React from 'react';
import { useState } from "react"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from "styled-components";
import { TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 600,
  bgcolor: "rgba(255, 255, 255, 1)",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const BoxField = styled(Box)({
    mt: 2,
    mb: 2,
})

export default function BasicModal({open, handleClose}) {
  const [time, setTime] = useState()

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
      >
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
        <Box
          component="form"
          onSubmit={null}
          noValidate
          sx={{ mt: 1, width: 300 }}
        >
          <BoxField
            sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{mr: 1,}}>Activity Name</Typography>
            <TextField
              required
              fullWidth
              autoFocus
              size="small"
              variant="standard"
            />
          </BoxField>
          <BoxField
            sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{mr: 1,}}>Activity Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date&Time picker"
                    value={time}
                    onChange={handleTimeChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
          </BoxField>
          <BoxField>
            <TextField
              type="password"
              label="Confirm Password"
              required
              fullWidth
              size="small"
              // variant="filled"
              // placeholder="Username"
            />
          </BoxField>
          {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
            }}
            onClick={null}
          >
            Submit
          </Button>
        </Box>
        </Box>
      </Modal>
    </div>
  );
}