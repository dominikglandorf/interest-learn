import logo from './logo.svg';
import './App.css';
import Generator from './components/Generator';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Generator />
    </div>
  );
}

export default App;
