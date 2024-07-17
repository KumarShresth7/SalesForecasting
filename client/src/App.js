import React from 'react';
import SalesChart from './components/SalesChart';
import './App.css';

const App = () => {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>Sales Forecasting Dashboard</h1>
      </header> */}
      <main>
        <SalesChart/>
      </main>
    </div>
  );
};

export default App;
