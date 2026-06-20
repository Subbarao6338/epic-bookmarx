import React,{Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export class FormLogindetails extends Component {
    continue =e=>{
        e.preventDefault();
        this.props.nextStep();
    };

    back =e=>{
        e.preventDefault();
        this.props.prevStep();
    };
    render() {
        const {values, handleChange}=this.props;
        return(
        <MuiThemeProvider>
        <React.Fragment>
            <AppBar title="Gate Kepper"/>
            <TextField
            hintText="Username"
            floatingLabelText="Username"
            onChange={handleChange('Username')}
            defaultValue={values.Username}
            />
            <br/>
            <TextField
            hintText="Password"
            floatingLabelText="Password"
            onChange={handleChange('Password')}
            defaultValue={values.Password}
            />
            <br/>
            <RaisedButton
            label="Login"
            primary={true}
            style={styles.button}
            onClick={this.Login}
            />
        </React.Fragment>
        </MuiThemeProvider>
        );
    }
}

const styles ={
    button:{
        margin:15
    }
}

export default FormLogindetails;