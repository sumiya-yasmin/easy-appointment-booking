import { Box, Container, Paper, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useState } from "react";


export function BookSlotPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  return (
    <Container sx={{padding: 6, display: "flex", flexDirection: "column", gap:2}}>
      <Typography variant="h5">Book An Appointment</Typography>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4}}>
      <Paper elevation={2} sx={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, px: 4,py:2, borderRadius: 3 }}>
        <Typography variant="h6">Select a date</Typography>
        <DatePicker
          value={moment(selectedDate)}
          onChange={(value)=> setSelectedDate(value? value.toDate():null)}
        />
      </Paper>
      <Paper  elevation={3} sx={{display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1, px: 4,py:2, borderRadius: 3 }}>
        <Typography variant="h6">Available Slots</Typography>
        <TimePicker views={['hours', 'minutes']} />
      </Paper>
      </Box>
    </Container>
  )
}

