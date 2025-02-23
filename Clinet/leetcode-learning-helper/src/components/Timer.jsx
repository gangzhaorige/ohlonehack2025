// components/Timer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

export const Timer = ({ time }) => (
  <Box sx={{ 
    position: 'fixed', 
    top: 20, 
    right: 20,
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: 1,
    boxShadow: 1
  }}>
    <Typography variant="h6">
      Time: {time}
    </Typography>
  </Box>
);
