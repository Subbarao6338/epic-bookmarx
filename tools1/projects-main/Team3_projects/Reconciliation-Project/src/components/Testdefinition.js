import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Link} from '@material-ui/core';


const paperStyle={padding:50,height:"600px",width:545,margin:" 55px auto"}
function Testdefinition(props) {
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

Testdefinition.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper elevation={24} style={paperStyle}>
    <Box sx={{ width: '100%' }}>
      
      <Testdefinition value={value} index={0}>
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
    <Link href="#" onClick={()=>handleChange("event",1)} >
       <span> Next</span>
       </Link>
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
      </Testdefinition>
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
