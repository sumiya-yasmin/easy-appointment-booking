import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"

export const TimeSlotSelect = () => {
  return (
    <FormControl fullWidth>
  <InputLabel id="time-slot-label">Time Slot</InputLabel>
  <Select
    labelId="time-slot-label"
    id="time-slot-select"
    // value={age}
    label="Time"
    // onChange={handleChange}
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
</FormControl>
  )
}
