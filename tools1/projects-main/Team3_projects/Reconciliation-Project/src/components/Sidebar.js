import React,{useState} from 'react';
import {Link,Menu,MenuList,AppBar} from '@material-ui/core';
import {useNavigate} from 'react-router-dom';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MailIcon from '@mui/icons-material/Mail';
import {FaChartBar,FaThList,FaBookReader,FaFolderOpen} from 'react-icons/fa';
import Table1 from "./Table1";
export default function Sidebar(){
    const navigate =useNavigate();
  function handleClick(){
    navigate("/dashboard")
  }
    const[anchorEl,setAnchorEl]=useState();
   
    const handleOpenMenu =e=>{
        setAnchorEl(e.currentTarget);
    };
    const handleMenuClose=()=>{
        setAnchorEl(null)
    }
    return(
        <div>
            <AppBar sx={{ backgroundColor:"white"}}>
            <div ClassName="topbar">
            <div className="topbarWrapper">
                <div className="topLeft">
                    <span>
                        Gatekepper
                </span>&ensp;
                <FaChartBar/>&ensp;
                <i class="bi bi-file-earmark-arrow-down-fill" onClick={handleClick} ></i>&ensp;
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
        <div className="main">
            <div className="sidebar">
            <i className="bi bi-diagram-3"></i>&ensp;
            Systems
            <div className="folder">
            <FaFolderOpen
                aria-controls='menu'
                onClick={handleOpenMenu}
                    variant='contained'
                    color='Orange'
                />&ensp;
                Test Suites
            </div>
                <div className='test'>
                <FaThList color="red"/>&ensp;
                    Test Execution
                </div>
                
                <FaBookReader color='cornflowerblue'/>&ensp;&ensp;
                Jobs
            <div className='reports'>
            <FaChartBar color='green'/>&ensp;
                Reports
            </div>
                
            </div>
            <Menu 
            style={{marginTop:"50px",width:"300px"}}
            id='menu'onClose={handleMenuClose} anchorEl={anchorEl}open={Boolean(anchorEl)}>
                <MenuList onClick={handleMenuClose} size="Lager"><FaFolderOpen color='Orange'style={{width:"20px"}}/>Test Group</MenuList>
                <MenuList onClick={handleMenuClose} size="Lager">Tests </MenuList>
            </Menu>
            

            <Link to="Dashboard" className="text-black-50">
            </Link>
            <Table1/>
            </div>
            </div>
            
    )
}


