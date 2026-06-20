import *  as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

import {useNavigate} from 'react-router-dom';


function Table1(){
  const navigate =useNavigate();
  function handleClick(){
    navigate("/practice")
  }
    const columns = [
        { id: 'name', label: 'Name', minWidth: 50},
        { id: 'description', label: 'Description', minWidth: 50 },
        {
          id: 'parent',
          label: 'Parent',
          minWidth: 50,
        },<CancelIcon/>
      ];
      function createData(name, description, parent) {
        return { name,description, parent};
      }
      const rows = [
        createData('Gatekepper', 'Gatekeeper'),
        createData('Joshna','joshna','abcdf'),
        createData('Raju','raju','ghfd'),
        createData('Gatekepper', 'Gatekeeper'),
        createData('Joshna','joshna','abcdf'),
        createData('Raju','raju','ghfd'),
        createData('Gatekepper', 'Gatekeeper'),
        createData('Joshna','joshna','abcdf'),
        createData('Raju','raju','ghfd'),
        
      ];
        const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const paperStyle={padding:50,height:500,width:1000,margin:"0px 10px 0px 1px"}

  
return(
  <Paper elevation={10} style={paperStyle}>
  <div className='container'>
        <Button  color='primary' variant="contained" style={{marginLeft: "-69px",width: "1098px"}}>
Home > Suites
</Button>
<br></br>

<br></br>

      <Button variant='contained' style={{marginLeft: 'auto',width: "224px"}} onClick={handleClick} >
        <AddCircleIcon/> 
        Add New Test Suites
        </Button>
        <br></br>
    <Paper sx={{ marginLeft: "-59px",width: "1043px", overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" font-size="bold">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10,15,20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        
      />
    </Paper>
    
  </div>
  
    </Paper>
)
}
export default Table1;