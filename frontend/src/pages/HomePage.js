import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import BasicTabs from '../components/Tab';

const HomePage = () => {
  return (
    <Box className="min-h-screen" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Left container with tabs */}
        <Grid item xs={12} md={4} lg={4}>
          <Box
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              height: '100vh', // Adjust according to your needs
              overflow: 'auto', // For scrolling if the content exceeds the screen height
            }}
          >
            <BasicTabs />
          </Box>
        </Grid>

        {/* Right container */}
        <Grid item xs={12} md={8} lg={8} sx={{ p: 2 }}>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 2,
              minHeight: '100vh', // Adjust according to your needs
              boxShadow: 1, // Adjust the shadow effect according to your needs
            }}
          >
            {/* Temporary placeholder content */}
            Content associated with the selected tab will be displayed here.
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
