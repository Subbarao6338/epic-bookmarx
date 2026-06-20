import {useState} from 'react';
import {Divider,TextField,Button,Checkbox} from '@material-ui/core';
import {Link} from 'react-router-dom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/icons/Checkbox';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {useNavigate} from 'react-router-dom';
const Signup=()=>{
    const navigate =useNavigate();
  function handleClick(){
    navigate("/dashboard")
  }
    const[state,setState]=useState({
        firstname:'',
        lastname:'',
        Email:'',
        Password:'',
    })
    const {firstname,lastname,Email,Password}=state;
    const changeHandler=e=>{
        setState({...state,[e.target.name]:[e.target.value]})
    }
    const SubmitHandler=e=>{
        e.preventDefault();
        console.log(state);
        
    }
    return(
        <form onSubmit={SubmitHandler}>
        <div>
            <div className="icon">
                <div className="icon_class">
                <PersonAddIcon fontSize='large'/>
                </div>
                <div className="text">Sign Up</div>
            </div>

            <div className='row m-2'>
                <div className="col-6 p-2">
                <TextField id="firstname" type="text" variant="outlined" label=" Enter First Name" name="firstname" onChange={changeHandler}/>
                </div>
                <div className="col-6 p-2">
                <TextField id="lastname" type="text" variant="outlined" label=" Enter Last Name" name="lastname"  onChange={changeHandler} />
                </div>
            </div>

            <div className="row m-2">
            <TextField id="Email" type="text" variant="outlined" label=" Enter Email" name="Email" onChange={changeHandler}/>
            <TextField id="Password" type="text" variant="outlined" label=" Enter password" name="Password"onChange={changeHandler} />
            <FormControlLabel
            control={
                <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                name="checkedI"
                />
            }
            label="I agree to all terms and conditions"
            />
            <Button type="Submit" color="primary" onClick={handleClick}> create Account</Button>
            </div>
        <Divider variant="middle"/>
        <p className="text-center">
            <Link to="Login" className="text-black-50">
                <h5>Already have an account?</h5>
            </Link>
        </p>
        </div>
        </form>

    )
}
export default Signup