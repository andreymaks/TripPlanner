import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';


const ListData = ({data, name}) => {
    const [listVisible, setListVisible] = useState(false);

    return (
            <div>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setListVisible(!listVisible)}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {name}
                    </Typography>
                    <Box sx={{ transform: 'translateY(4px)' }}> {/* Adjust translateY value as needed */}
                        {listVisible ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                </Box>
                
                {listVisible && (
                    <List>
                        {data.map((d) => (
                            <React.Fragment key={d.id}>
                                <ListItem>
                                    <ListItemText primary={d.name}/>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </div>
                
    );
};

export default ListData;