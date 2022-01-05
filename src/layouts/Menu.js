import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HrMasterRouter from '../routers/HrMasterRouter';
import BizTripRouter from '../routers/BizTripRouter';
import AdminRouter from '../routers/AdminRouter';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography >{children}</Typography>
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

export default function Menu() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    
    <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="인사 정보" />          
          <Tab label="출장" />
          <Tab label="Admin" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <HrMasterRouter/>        
      </TabPanel>
      <TabPanel value={value} index={1}>
      <BizTripRouter />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AdminRouter />
      </TabPanel>
    </Box>
  );
}