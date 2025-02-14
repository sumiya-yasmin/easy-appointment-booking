import { Box, Button, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router'
import { LocalizationProvider } from '../providers';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
      <LocalizationProvider>
      <Box sx={{width:'100%', textAlign:'center'}}>
       <Typography variant="h1">Welcome!</Typography>
       <Button variant='contained' color='primary' onClick={()=> navigate('/book-slot')}>Book  a  Slot</Button>
 
       <Outlet/>
      </Box>
      </LocalizationProvider>
    )
}
