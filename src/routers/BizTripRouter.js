import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import BizTripList from '../components/bizTrip/BizTripList';
import RegistBizTrip from '../components/bizTrip/RegistBizTrip';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function BizTripRouter() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
   
    <Box
      sx={{flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 1024 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ width: 180, borderRight: 2, borderColor: 'divider' }}
      >
        <Tab label="출장 조회" {...a11yProps(0)} />
        <Tab label="출장 신청" {...a11yProps(1)} />        
      </Tabs>
      <TabPanel value={value} index={0}>
        <BizTripList />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RegistBizTrip/>
      </TabPanel>      
    </Box>
   
  );
}