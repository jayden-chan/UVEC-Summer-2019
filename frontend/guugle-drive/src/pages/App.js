import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Login from '../pages/Login';
import Upload from '../pages/Upload';
import Header from '../components/Header';
import Home from '../pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/upload" component={Upload} />
      </Router>
    </div>
  );
}

export default App;
