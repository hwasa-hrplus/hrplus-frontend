<<<<<<< HEAD
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HrInfoList from '../components/admin/HrInfoList';
import RegistHrInfo from '../components/admin/RegistHrInfo';
import ConfirmBizTrip from '../components/admin/ConfirmBizTrip';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Detail from '../components/admin/Detail';

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
      <Routes>
        <Route path='/' element={<HrInfoList/>} />
        <Route path='/detail/:id' element={<Detail/>} />
 
      </Routes>
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
=======
import { faIdCard, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import EmployeeList from '../components/EmployeeList';
import RegistEmployee from '../components/RegistEmployee';
import EmployeeDetail from '../components/EmployeeDetail'

const AdminRouter = () => {
    return (
        <div className='sideMenuContent'>            
           <div className="sideMenu">
            <Nav className="d-md-block side" defaultActiveKey="link-1">
                <Nav.Item>
                <Nav.Link className="sideItem" as={Link} to="list" eventKey="link-1"><FontAwesomeIcon icon={faIdCard}/>&nbsp;&nbsp;&nbsp;인사 정보 조회</Nav.Link>
                </Nav.Item>   
                <Nav.Item>
                    <Nav.Link className="sideItem" as={Link} to="regist" eventKey="link-2"><FontAwesomeIcon icon={faUserPlus}/>&nbsp;&nbsp;&nbsp;인사 정보 추가</Nav.Link>
                </Nav.Item>    
            </Nav>   
            </div>
            <div className="content">
           
                <Routes>
                    <Route path="/list" element={<EmployeeList />} />
                    <Route path='/detail/:id' element={<EmployeeDetail/>}  />

                </Routes>
                <Routes>
                    <Route path="regist" element={<RegistEmployee />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminRouter;
>>>>>>> origin/development
