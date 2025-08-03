import React from 'react';
import MainPage from './components/MainPage';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <div>
      <LanguageSwitcher />
      <MainPage />
    </div>
  );
}

export default App;