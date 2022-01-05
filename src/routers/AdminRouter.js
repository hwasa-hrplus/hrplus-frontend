import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HrInfoList from '../components/admin/HrInfoList';
import RegistHrInfo from '../components/admin/RegistHrInfo';
import ConfirmBizTrip from '../components/admin/ConfirmBizTrip';

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
        <Box sx={{ p: 3}}>
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

export default function AdminRouter() {
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
        <Tab label="인사정보 조회" {...a11yProps(0)} />
        <Tab label="인사정보 추가" {...a11yProps(1)} />     
        <Tab label="출장 결재" {...a11yProps(2)} />   
      </Tabs>
      <TabPanel value={value} index={0}>
        <HrInfoList/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RegistHrInfo/>
      </TabPanel>      
      <TabPanel value={value} index={2}>
        <ConfirmBizTrip/>
      </TabPanel>      
    </Box>
   
  );
}