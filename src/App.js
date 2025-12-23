import { useState } from 'react';
import './App.css';
import Login from './Login';
import WarehouseInventory from './warehouse-inventory';
import FileUpload from './FileUpload';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : userType === 'omer' ? (
        <FileUpload onLogout={handleLogout} />
      ) : (
        <WarehouseInventory onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
