import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

export default function Login (){
    return(
        <div className='container'>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Test Type" />}
    /> 
    <br></br>
    <div className='container2'>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Test}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Test Group" />}
    /> 
    <br></br>
    <div className="container1" style={{marginTop:-153,marginLeft:313}}>
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Processing}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Processing Engine" />}
    /> 
    <div className="container3" 
    style={{marginLeft:-765,marginTop:30}}
    >
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={TimeOut}
      sx={{ width:300 }}
      renderInput={(params) => <TextField {...params} label="Time Out" />}
    /> 
    <br></br>
    <div>
      <TextField id="outlined-basic" label="Test Group" variant="outlined" />
      <TextField id="outlined-basic" label="Test" variant="outlined" />
      </div>
    </div>
    </div>
    </div>
    </div>)}
const top100Films = [
  { label: 'Null Check' },
  { label: 'Comparision'},
{ label: 'Duplicate Check'},];
const Processing =
[
    {label:'MY SQL PROCESSING ENG '},
    { label:'MY SQL SERVER PE'},
    {label:'DEMO_FLAT FILE PROCESSING'},
];
const Test =
[
    {label:'Joshna '},
    { label:'Testing'},
    {label:'GateKeeper'},
];
const TimeOut=[

]