import logo from './logo.svg';
import './App.css';

import Interface from './Interface';
import Logout from './Logout';
import { BrowserRouter, BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Interface />} />
      <Route exact path="/logout" element={<Logout />} />
      
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
