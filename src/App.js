import UploadImage from './UploadImage';
import './App.css';
import Sketch from './Sketch';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <>
  <Router>
    <Routes>
      <Route path="/" element={<UploadImage />} />
      <Route path="/sketch" element={<Sketch />} />
    </Routes>
  </Router>
  
  </>
  );
}

export default App;
