import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyTab = ({name}) => {
    const navigate = useNavigate();
    return (
        <Box  sx={{width: '100%', display: 'inline-flex', bgcolor: 'primary.main', height: 40}}>
                <ArrowBackIosIcon sx={{transform: 'translateY(6px)', cursor: 'pointer', color: "white"}}  onClick={() => navigate(`/`)}/> 
                <Typography variant="h5" sx={{transform: 'translateY(2px)',cursor: 'pointer', color: "white"}}  onClick={() => navigate(`/`)}> {name} </Typography>
        </Box>
    )
}

export default MyTab;