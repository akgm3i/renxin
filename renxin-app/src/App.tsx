import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <main className="container">
      {/* Shared layout elements like a header can go here */}
      <Outlet /> {/* This will render the matched child route */}
    </main>
  );
}

export default App;
