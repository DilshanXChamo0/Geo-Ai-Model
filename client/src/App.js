import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './app/main.js'
import Splash from './app/Splash.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/c/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;