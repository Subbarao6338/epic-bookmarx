import React ,{useState} from 'react';
import Sidebar from './Sidebar';
import {AppBar,Link,Divider,Menu,MenuList} from '@material-ui/core';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MailIcon from '@mui/icons-material/Mail';
import {useNavigate} from 'react-router-dom';
import {FaChartBar} from 'react-icons/fa';
const Dashboard =()=>{
    const navigate =useNavigate();
  function handleClick(){
    navigate("/sidebar")
  }
    const [openDrawer,setOpenDrawer]=useState(true);
    const[anchorEl,setAnchorEl]=useState();
   
    const handleOpenMenu =e=>{
        setAnchorEl(e.currentTarget);
    };
    const handleMenuClose=()=>{
        setAnchorEl(null)
    }
    const SubmitHandler=e=>{
        e.preventDefault();
        console.log();
        
    }
    return(
        <form onSubmit={SubmitHandler}>
        <div>
            <AppBar sx={{ backgroundColor:"white"}}>
            <div ClassName="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span>
                        Gatekepper
                </span>&ensp;
                <i class="fa fa-bar-chart" aria-hidden="true"></i>
                <FaChartBar/>&ensp;
                <ion-icon name="server-outline"></ion-icon>&ensp;
                <i class="bi bi-file-earmark-arrow-down-fill" onClick={handleClick}></i>&ensp;
                <i className="bi bi-server"></i>&ensp;
                <i className="bi bi-list-check"></i>&ensp;
                <i className="bi bi-stack"></i>
                
               </div>
                <div className="topRight"><MailIcon/> <SettingsIcon/> <HelpOutlineOutlinedIcon/>
                Joshna
                <KeyboardArrowDownIcon
                aria-controls='menu'
                onClick={handleOpenMenu}
                    variant='contained'
                    color='grey'>
                    </KeyboardArrowDownIcon> 
                    </div>
                    </div>
                    </div>               
                </AppBar>

            <Menu 
            style={{marginTop:"50px"}}
            id='menu'onClose={handleMenuClose} anchorEl={anchorEl}open={Boolean(anchorEl)}>
                <MenuList onClick={handleMenuClose} size="Lager">Profile</MenuList>
                <MenuList onClick={handleMenuClose} size="Lager">Log Out</MenuList>
            </Menu>
            <Divider variant="middle"/>
        <p className="text-center">
            <Link to="Login1" className="text-black-50">
            </Link>
        </p>
        </div>
        </form>
    )
}

export default Dashboard