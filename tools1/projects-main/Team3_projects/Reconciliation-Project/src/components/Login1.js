import React, {useState} from 'react';
import {Grid,Paper,TextField,Typography,Link} from '@material-ui/core';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import {useNavigate} from 'react-router-dom';
const Login1=()=>{
  const navigate =useNavigate();
  function handleClick(){
    navigate("/dashboard")
  }
  const[state,setState]=useState({
    Username:'',
    Password:'',
})
const {Username,Password}=state;
const changeHandler=e=>{
    setState({...state,[e.target.name]:[e.target.value]})
}
const SubmitHandler=e=>{
  
    e.preventDefault();
    console.log(state);
  
}
    const paperStyle={padding:"9px",height:'70vh',width:481,margin:"50px auto"}
    return(
      
      <form onSubmit={SubmitHandler}>
       <Grid>
        <Paper elevation={10} style={paperStyle}>
            <Grid align='center'>
              <h1> Login</h1>
            </Grid>
            <br></br>
            <br></br>
            <TextField 
        id="input-with-icon-textfield"
        label="Username"
        placeholder="Username"
        name="Username" 
        onChange={changeHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <br></br>
            <br></br>
            <TextField
        id="input-with-icon-textfield"
        label="Password"
        placeholder="Password"
        type="password" name="Password"
        onChange={changeHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon/>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
            <br></br>
            <Typography>
                <Link href="#" style={{marginLeft: "230px"}}>
                    Forgot password?
                    </Link>
                </Typography>
            <br></br>
            <Button type='Submit' color='primary' variant="contained"  style={{borderRadius:"20px",width:"200px"}} onClick={handleClick}>Log In</Button>
        </Paper>
       </Grid>
       </form>
    )

}

export default Login1