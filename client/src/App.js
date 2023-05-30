import logo from './logo.svg';
import './App.css';
import SearchComponent from './components/SearchComponent';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SearchComponent />
      </header>
    </div>
  );
}

export default App;
