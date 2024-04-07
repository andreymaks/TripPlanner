import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import TripDetail from './Pages/TripDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="trips/:tripId" element={<TripDetail/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
