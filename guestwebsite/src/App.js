import logo from './logo.svg';
import './App.css';

import Interface from './Interface';
import Logout from './Logout';
import { BrowserRouter, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Guest from './Guest';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Interface />} />
      <Route exact path="/logout" element={<Logout />} />
      <Route exact path="/guest" element={<Guest/>} />
      
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
