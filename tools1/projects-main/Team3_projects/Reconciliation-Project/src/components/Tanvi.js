import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';

import {Link,Divider} from '@material-ui/core';
const paperStyle={padding:50,height:"400px",width:545,margin:" 55px auto"}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={12} style={paperStyle}>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      {/* <Paper elevation={12} style={paperStyle}> */}
      <div>
        
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
           <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width:200 }}
      renderInput={(params) => <TextField {...params} label="Test Type"/>}
    /> 
        </Grid>
        <Grid item xs={6}>
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Processing}
      style={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Processing Engine" />}
    /> 
        </Grid>
        <Grid item xs={6}>
        <TextField style={{height: "40px",marginRight: "15px",marginLeft: "-42px",marginTop: "6px",width:200}}
        id="input-with-icon-textfield"
        label="Test Name"
        variant="outlined"
        />
        </Grid>
        <Grid item xs={6}>
        <TextField style={{height: "40px",marginRight: "15px",marginLeft: "-42px",marginTop: "4px",width:200}}
        id="input-with-icon-textfield"
        label="Description"
        variant="outlined"
        />
        <Grid item xs={6}>
           <Autocomplete  style={{marginTop: "27px",marginLeft: "2px", Width:"300px"}}
      disablePortal
      id="combo-box-demo"
      option={time}
      sx={{ width:200 }}
      renderInput={(params) => <TextField {...params} label="Time out(minutes)" />}
    /> 
    <Grid item xs={4}>
        <Autocomplete  style={{marginTop: "-55px",marginLeft: "-283px"}}
      disablePortal
      id="combo-box-demo"
      options={Test}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Test Group" />}
    /> 
    </Grid>
    <Grid item xs={6}>
        <Autocomplete  style={{marginTop: "12px",marginLeft: "-284px"}}
      disablePortal
      id="combo-box-demo"
      options={Priority}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Priority" />}
    /> 
    </Grid>
    <Grid item xs={6}>
        <Autocomplete  style={{marginTop: "-55px",marginLeft: "3px"}}
      disablePortal
      id="combo-box-demo"
      options={Execution}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Execution" />}
    /> 
    <br></br>
    <br></br>
    <br></br>
    <br></br> <br></br>
    <br></br> <br></br>
    <br></br> <br></br>
    <br></br>
    </Grid>
        </Grid>
        </Grid>
      </Grid>
      
      </div>
      {/* <Divider variant="middle"/>
        
            <Link to="Row" className="text-black-50">
            </Link> */}
      {/* </Paper> */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      
    </Box>
    </Paper>
  );
}


const top100Films = [
  { label: 'Null Check' },
  { label: 'Comparision'},
{ label: 'Duplicate Check'},];

const Test =
[
{label:'Joshna '},
{ label:'Testing'},
{label:'GateKeeper'},
];

const Processing =
[
{label:'MY SQL PROCESSING ENG '},
{ label:'MY SQL SERVER PE'},
{label:'DEMO_FLAT FILE PROCESSING'},
];

const Priority=
[
{label:'Low '},
{ label:'Medium'},
{label:'High'},
];

const Execution =
[
{label:'Manual'},
{ label:'Automatic'},
];

const time = [
{ label: 'Null Check' },
{ label: 'Comparision'},
{ label: 'Duplicate Check'},];
