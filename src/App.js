import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/Home/HomePage';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

export default App;
