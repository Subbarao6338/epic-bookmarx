import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import {Avatar } from '@material-ui/core'
import AccountCircle from '@mui/icons-material/AccountCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';


// const paperStyle={padding:50,height:"600px",width:545,margin:" 55px auto"}
// function Testattributes(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// Testattributes.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

// export default function BasicTabs() {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   return (
//     // <Paper elevation={24} style={paperStyle}>
//     <Box sx={{ width: '100%' }}>
      
//       <Testattributes value={value} index={0}>
//       <div>
//       <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         <Grid item xs={6}>
//            <Autocomplete style={{marginLeft:"-25px"}}
//       disablePortal
//       id="combo-box-demo"
//       options={Source}
//       sx={{ width:250 }}
//       renderInput={(params) => <TextField {...params} label="Source System"/>}
//     /> 
//         </Grid>
//         <Grid item xs={6}>
//         <Autocomplete
//       disablePortal
//       id="combo-box-demo"
//       options={Target}
//       style={{ width: 250 }}
//       renderInput={(params) => <TextField {...params} label="Target System" />}
//     /> 
//         </Grid>
//         <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "6px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Datasource}
//       renderInput={(params) => <TextField {...params} label="Datasource Type" />}
//       />
        
//         </Grid>
//         <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "6px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Datasource}
//       renderInput={(params) => <TextField {...params} label="Datasource Type" />}
//       />
//       </Grid>
        
//       <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={source}
//       renderInput={(params) => <TextField {...params} label="Select Source Table" />}
//       />
        
//         </Grid>
//         <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={target}
//       renderInput={(params) => <TextField {...params} label="Select Target Table" />}
//       />
//       </Grid>
        
//         <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Columns}
//       renderInput={(params) => <TextField {...params} label="Select columns to be excluded" />}
//       />
        
//         </Grid>
//          <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Columns}
//       renderInput={(params) => <TextField {...params} label="Select columns to be excluded" />}
//       />
//       </Grid>
//       <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-25px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Key}
//       renderInput={(params) => <TextField {...params} label="Select Source Key Column" />}
//       />
        
//         </Grid>
//          <Grid item xs={6}>
//         <Autocomplete style={{height: "40px",marginRight: "15px",marginLeft: "-2px",marginTop: "32px",width:250}}
//       disablePortal
//       id="combo-box-demo"
//       options={Key}
//       renderInput={(params) => <TextField {...params} label="Select Target Key Column" />}
//       />
//       </Grid>
//       <br></br>
//       <div>
//       <Button   type='Submit' color='primary' variant="contained"style={{width:"50px",marginTop:"50px"}}> 
//        Submit
//     </Button>
//     </div>
//     <div>
//     <Button  type='Submit' color='primary' variant="contained"style={{marginLeft:"10px",marginTop:"50px",backgroundColor:"black",width:"50px"}}>
//        <span> Cancel</span>
//        </Button>
//     </div>
//       </Grid>
//       </div>
//       </Testattributes>
//       </Box>
//     //   </Paper>
      

const Testattributes = () => {
  const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
  const headerStyle = { margin: 0 }
  const avatarStyle = { backgroundColor: '#1bbd7e' }
  const marginTop = { marginTop: 5 }
  return (
      <Grid>
          <Paper style={paperStyle}>
              <Grid align='center'>
                  <Avatar style={avatarStyle}>
                      <AccountCircle />
                  </Avatar>
                  <h2 style={headerStyle}>Sign Up</h2>
                  <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
              </Grid>
              <form>
                  <TextField fullWidth label='Name' placeholder="Enter your name" />
                  <TextField fullWidth label='Email' placeholder="Enter your email" />
                  <FormControl component="fieldset" style={marginTop}>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup aria-label="gender" name="gender" style={{ display: 'initial' }}>
                          <FormControlLabel value="female" control={<Radio />} label="Female" />
                          <FormControlLabel value="male" control={<Radio />} label="Male" />
                      </RadioGroup>
                  </FormControl>
                  <TextField fullWidth label='Phone Number' placeholder="Enter your phone number" />
                  <TextField fullWidth label='Password' placeholder="Enter your password"/>
                  <TextField fullWidth label='Confirm Password' placeholder="Confirm your password"/>
                  <FormControlLabel
                      control={<Checkbox name="checkedA" />}
                      label="I accept the terms and conditions."
                  />
                  <Button type='submit' variant='contained' color='primary'>Sign up</Button>
              </form>
          </Paper>
      </Grid>
  );
}
export default Testattributes;

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