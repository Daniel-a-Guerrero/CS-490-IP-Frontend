import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Customers from './pages/Customers';
import Films from './pages/Films';
function App() {
  return (
      <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to ='/'>Landing</Link>
            </li>
            <li>
              <Link to="/films">Films</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          {/* A Route component defines a mapping between a URL and a component */}
          <Route path="/" element={<Landing />} />
          <Route path="/films" element={<Films />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
