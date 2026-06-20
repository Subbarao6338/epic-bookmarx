import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import {Link} from '@material-ui/core';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dashboard from './Dashboard';
// import Create from './create';

const paperStyle={padding:50,height:"600px",width:545,margin:" 55px auto"}
function Practice(props) {
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

Practice.propTypes = {
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
    <Paper elevation={24} style={paperStyle}>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Test Definition" {...a11yProps(0)} />
          <Tab label="Test Attributes" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Practice value={value} index={0}>
      <div>
        <Box sx={{ width: '100%'}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
           <Autocomplete style={{marginLeft:"-25px"}}
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width:250 }}
      renderInput={(params) => <TextField {...params} label="Test Type"/>}
    /> 
        </Grid>
        <Grid item xs={6}>
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Processing}
      style={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Processing Engine" />}
    /> 
        </Grid>
        <Grid item xs={6}>
        <TextField style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "6px",width:250}}
        id="input-with-icon-textfield"
        label="Test Name"
        variant="outlined"
        />
        </Grid>
        <Grid item xs={6}>
        <TextField style={{height: "40px",marginRight: "15px",marginTop: "4px",width:250}}
        id="input-with-icon-textfield"
        label="Description"
        variant="outlined"
        />
        <Grid item xs={6}>
        <TextField  label="Time out(minutes)" style={{width: "245px",marginTop: "27px",marginLeft: "2px"}} inputProps={{ inputMode: 'numeric',type:"number"}}  />
           
    <Grid item xs={4}>
        <Autocomplete  style={{marginTop: "-55px",marginLeft: "-283px"}}
      disablePortal
      id="combo-box-demo"
      options={Test}
      sx={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Test Group" />}
    /> 
    </Grid>
    <Grid item xs={6}>
        <Autocomplete  style={{marginTop: "12px",marginLeft: "-284px"}}
      disablePortal
      id="combo-box-demo"
      options={Priority}
      sx={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Priority" />}
    /> 
    </Grid>
    <Grid item xs={6}>
        <Autocomplete  style={{marginTop: "-55px",marginLeft: "3px"}}
      disablePortal
      id="combo-box-demo"
      options={Execution}
      sx={{ width: 245 }}
      renderInput={(params) => <TextField {...params} label="Execution" />}

      
    /> 
    <p style={{marginLeft:"-551px"}}>Threshold</p>
    <Stack direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}>
    <TextField   style={{width: "700px",marginLeft:"-221px",backgroundColor:"lightgreen"}} inputProps={{ inputMode: 'numeric',type:"number"}}  />
    <TextField  style={{width: "700px",backgroundColor:"orange"}} inputProps={{ inputMode: 'numeric',type:"number"}}  />
    <TextField  style={{width: "700px",backgroundColor:"pink"}} inputProps={{ inputMode: 'numeric',type:"number"}}  />
    </Stack>
    <br></br>
    <div className="Button">
    <Button   type='Submit' color='primary' variant="contained" style={{marginLeft:"-500px",backgroundColor:"green",textdecorationColor: "white"}}>
       <span> Next</span>
    </Button>
    </div>
    <div>
    <Button   type='Submit' color='primary' variant="contained" style={{marginLeft:"-310px",marginTop:"-63px",backgroundColor:"black"}}>
       <span> Cancel</span>
    </Button>
    </div>
    </Grid>
        </Grid>
        </Grid>
      </Grid>
      
    </Box>
      </div>
      </Practice>
      <Practice value={value} index={1}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
           <Autocomplete style={{marginLeft:"-25px"}}
      disablePortal
      id="combo-box-demo"
      options={Source}
      sx={{ width:250 }}
      renderInput={(params) => <TextField {...params} label="Source System"/>}
    /> 
        </Grid>
        <Grid item xs={6}>
        <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Target}
      style={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Target System" />}
    /> 
        </Grid>
        <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "6px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Datasource}
      renderInput={(params) => <TextField {...params} label="Datasource Type" />}
      />
        
        </Grid>
        <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "6px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Datasource}
      renderInput={(params) => <TextField {...params} label="Datasource Type" />}
      />
      </Grid>
        
      <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={source}
      renderInput={(params) => <TextField {...params} label="Select Source Table" />}
      />
        
        </Grid>
        <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={target}
      renderInput={(params) => <TextField {...params} label="Select Target Table" />}
      />
      </Grid>
        
        <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Columns}
      renderInput={(params) => <TextField {...params} label="Select columns to be excluded" />}
      />
        
        </Grid>
         <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Columns}
      renderInput={(params) => <TextField {...params} label="Select columns to be excluded" />}
      />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Key}
      renderInput={(params) => <TextField {...params} label="Select Source Key Column" />}
      />
        
        </Grid>
         <Grid item xs={6}>
        <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
      disablePortal
      id="combo-box-demo"
      options={Key}
      renderInput={(params) => <TextField {...params} label="Select Target Key Column" />}
      />
      </Grid>
      <br></br>
      <div>
      <Button   type='Submit' color='primary' variant="contained"style={{width:"50px",marginTop:"50px"}}> 
       Submit
    </Button>
    </div>
    <div>
    <Button  type='Submit' color='primary' variant="contained"style={{marginLeft:"10px",marginTop:"50px",backgroundColor:"black",width:"50px"}}>
       <span> Cancel</span>
    </Button>
    </div>
      </Grid>
      </Practice>
      <Link to="Table1" className="text-black-50">
            </Link>
            
    </Box>
    <Dashboard/>
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
{label:'My Sql Proceesing '},
{ label:'My Sql Server Pre'},
{label:'Demo_Flat File Processing'},
];

const Priority=
[
{label:'Low '},
{ label:'Medium'},
{label:'High'},
];

const Execution =
[
{label:'Manual '},
{ label:'Automatic'},

];
const Target = [
  { label:'linuxtestconn'},
  { label:'My sql test'},
  { label:'Oracle Hr'},
  { label:'OVH_ORQI_Oracle'},
  { label:'GateKeeper-test'},
  { label:'Demo_conn'},
  { label:'Demo_Ora_conn'},
  { label:'hivetest connection'},
  { label:'hiveconnection test123'},
];
 
const  Source =[
  { label:'linuxtestconn'},
  { label:'My sql test'},
  { label:'Oracle Hr'},
  { label:'OVH_ORQI_Oracle'},
  { label:'GateKeeper-test'},
  { label:'Demo_conn'},
  { label:'Demo_Ora_conn'},
  { label:'hivetest connection'},
  { label:'hiveconnection test123'},
];

const Datasource =
[
{label:'Table'},
{ label:'Query'},

];

const  source =[
  { label:'Regions'},
  { label:'Countries'},
  { label:'Locations'},
  { label:'Departments'},
  { label:'Jobs'},
  { label:'Employees'},
  { label:'Job History'},
  { label:'Demo_Target'},
  { label:'Demo_Source'},
  { label:'Location_SRC'},
  { label:'Location_TGT'},
  { label:'Child_Test_TGT'},
  { label:'Taxid_MLS'},
  { label:'Taxid_MLS1'},
  { label:'Parcels_MLS'},
  { label:'Parent_Test'},
  { label:'Child_Test'},
  { label:'Z_ORQL_Pass_TGT'},
  { label:'Z_ORQL_Pass_SRC'},
];

const  target =[
  { label:'Regions'},
  { label:'Countries'},
  { label:'Locations'},
  { label:'Departments'},
  { label:'Jobs'},
  { label:'Employees'},
  { label:'Job History'},
  { label:'Demo_Target'},
  { label:'Demo_Source'},
];

const  Columns =[
  { label:'Nothing Selected'},
];
  
const  Key =[
  { label:'Department_Id'},
];