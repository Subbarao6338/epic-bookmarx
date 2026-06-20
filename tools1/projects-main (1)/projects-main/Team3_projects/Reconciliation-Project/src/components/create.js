import  React ,{useState} from 'react';
import {Menu,MenuList} from '@material-ui/core';
// import {useNavigate} from 'react-router-dom';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import {FaChartBar} from 'react-icons/fa'
import {LocalLibrary} from '@material-ui/icons';
import Practice from './Practice';

 export default  function Create(){
    const[anchorEl,setAnchorEl]=useState();
   
    const handleOpenMenu =e=>{
        setAnchorEl(e.currentTarget);
    };
    const handleMenuClose=()=>{
        setAnchorEl(null)
    }
    return(
        <div className="main">
            <div className="sidebar" >
            <i className="bi bi-diagram-3"></i>
            Systems
            <div className="folder" >
            <i class="bi bi-folder2-open"
                aria-controls='menu'
                onClick={handleOpenMenu}
                    variant='contained'
                    color='yellow'
                >
                </i>
                Test Suites
                </div>
                
                <LocalLibrary/>
                Jobs
                <div className='test'>
                <i className="bi bi-list-check">
                </i>
                Test Execution
                </div>
                <div className='reports'>
            <FaChartBar color='green'/>
                Reports
            </div>
            
            <Menu 
            style={{marginTop:"20px",width:"1000px"}}
            id='menu'onClose={handleMenuClose} anchorEl={anchorEl}open={Boolean(anchorEl)}>
                <MenuList onClick={handleMenuClose}  fullWidth size="Lager"><FolderOpenOutlinedIcon color='yellow'/>Test Group</MenuList>
                <MenuList onClick={handleMenuClose} fullWidth size="Lager">Tests </MenuList>
            </Menu>
            </div>
            <Practice/>
            </div>
            
            )
}


