import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Customers from './pages/Customers';
import Films from './pages/Films';
function App() {
  return (
    <div className='principalDiv'>
    <BrowserRouter>
      <div className='headdio'>
        <nav>
          <ul className='rhdio'>
            <li className='paggie'>
              <Link to='/'>Landing</Link>
            </li>
            <li className='paggie'>
              <Link to="/films">Films</Link>
            </li>
            <li className='paggie'>
              <Link to="/customers">Customers</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/films" element={<Films />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
      <style>
        {`
        .principalDiv{
        background-color:gold;}
        .rhdio {
          border: 1px dotted grey;
          margin: 5px;
          padding: 10px;
          list-style-type: none;
          display: flex;
          gap: 10px;
        }
        .paggie {
          color: black;
          background-color: gold;
          padding: 5px 15px;
          border-radius: 4px;
          transition: color 0.3s ease, background-color 0.3s ease;
          width: auto;
          display: inline-block;
        }
        .paggie:hover {
          color: white;
          background-color: darkblue;
        }
        li {
          color: blue;
        }
        `}
      </style>
    </BrowserRouter></div>
  );
}

export default App;
