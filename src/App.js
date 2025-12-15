import { useState } from 'react';
import './App.css';
import Login from './Login';
import WarehouseInventory from './warehouse-inventory';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <WarehouseInventory onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
