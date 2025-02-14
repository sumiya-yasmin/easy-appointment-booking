import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import moment from "moment"
import { useSlots } from "../api/queries/useSlots"

export const TimeSlotSelect = () => {
      const { slots} = useSlots()
  return (
    <FormControl fullWidth>
    <InputLabel id="time-slot-label">Select a time</InputLabel>
    <Select
      labelId="time-slot-label"
      id="time-slot-select"
      // value={selectedTime}
      label="Select a time"
      // onChange={(event) => setSelectedTime(event.target.value)}
    >
      {slots.length? (slots.map((slot) => (
        <MenuItem key={slot._id} value={slot.startTime}>
         <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {slot.name}
              </Typography>
              <Typography variant="body2">
                {moment(slot.startTime, "HH:mm").format("h:mm A")} • {slot.duration} mins
              </Typography>
            </Box>
        </MenuItem>
      ))): (
        <MenuItem  sx={{fontWeight: 'bold', color: 'text.primary'}}>No slots available</MenuItem>
      )}
      </Select>
      </FormControl>
  )
}
