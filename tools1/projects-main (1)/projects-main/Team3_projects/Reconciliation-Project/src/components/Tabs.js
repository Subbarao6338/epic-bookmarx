import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import {useNavigate} from 'react-router-dom';
import {Link} from '@material-ui/core';

const paperStyle={padding:50,height:"400px",width:545,margin:" 55px auto"}
export default function Tabs() {
  

    return (
      <Paper elevation={12} style={paperStyle}>
      <div>
        <Box sx={{ width: '100%'}}>
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
        <TextField style={{height: "40px",marginRight: "15px",marginLeft: "-45px",marginTop: "6px",width:200}}
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
    
    {/* <TextField style={{marginLeft:"-300px",marginTop:70}}
          id="outlined-number"
          type="number"
          variant="contained"
        >
          </TextField> */}
    </Grid>
        </Grid>
        </Grid>
      </Grid>
      
    </Box>
      </div>
      
            <Link to="Table1" className="text-black-50">
            </Link>
       </Paper>
    )
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







import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 300}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}