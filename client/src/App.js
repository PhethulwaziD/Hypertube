import React, {useState, useEffect} from 'react'
import './App.css';
import Navbar from './components/Navbar';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Reset from './components/Reset';
import Profile from './components/Profile';
import Movies from './components/Movies';
import Stream from './components/Stream';
import Verify from './components/Verify';
import Search from './components/Search';
import Password from './components/Password';
import Downloading from './components/Downloading'
import Error from './components/Error';
import UserContext from './context/UserContext';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from  'react-router-dom';


function App() {
  const [user, setUser] = useState({
    token: undefined,
    user: undefined
  });
  const [err, setErr] = useState();

  useEffect(() => {
    const checkLoogedIn = async () => {
      let authToken = localStorage.getItem("auth-token");
      if (authToken === null) {
        localStorage.setItem("auth-token", "");
        authToken = "";
      }
      const tokenRes = await Axios.post('http://localhost:5003/valid', null, {headers: {"x-auth-token": authToken}});
      if (tokenRes.data.error) setErr(tokenRes.data.error)
      if (tokenRes.data) {
        const userRes = await Axios.post('http://localhost:5003/user', null, {headers: {"x-auth-token": authToken }});

        setUser({
          token: authToken,
          user: userRes.data
        });
      }
    };
    checkLoogedIn();
  }, [])
  return (
    <Router >
      <UserContext.Provider value={{user, setUser}}>
        <div className="App">
            <Navbar />
            <Switch>
              <Route path="/" err={err} exact component={Signin} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/reset" exact component={Reset} />
              <Route path="/profile" exact component={Profile} />
              <Route path="/movies"  component={Movies} />
              <Route path="/search/:search" exact component={Search} />
              <Route path="/stream/:movie" exact component={Stream} />
              <Route path="/verify/:key" component={Verify} />
              <Route path="/password/:key" component={Password} />
              <Route path="/downloading/:movie" component={Downloading} />
              <Route component={Error}/>
            </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
