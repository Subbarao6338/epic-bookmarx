import React from 'react';
import './App.css';
// // import Login from './components/Login';c
// // //  import Tabs from './components/Tabs';
 import Login1 from './components/Login1';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Table1 from "./components/Table1";
// import Create from './components/create';
import {Routes,Route} from 'react-router-dom';
import Practice from './components/Practice';
// // import Testdefinition from "./components/Testdefinition";
// // import Testattributes from "./components/Testattributes";
// import Test from './components/Test';
// import SimplePaper from './components/paper';



function App () {
  return(
    <div className="App">

   <Routes>
      <Route path="/" element={<Login1/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/sidebar" element={<Sidebar/>}/>
      <Route path="/table1" element={<Table1/>}/>
      <Route path="/practice" element={<Practice/>}/>
   </Routes>
   {/* <Table1/> */}
   {/* <Routes>
      <Route path="/" element={<SimplePaper/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/sidebar" element={<Sidebar/>}/>
      <Route path="/table1" element={<Table1/>}/>
      <Route path="/practice" element={<Practice/>}/>
      </Routes> */}
      {/* <Login1/> */}
  </div>
  );
}
export default App;
