import '../App.css';
import {useState, useContext, useEffect} from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

function Signin() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState();
  const history = useHistory();
  const {user, setUser} = useContext(UserContext);
  useEffect(() => {
    if (user.user)
      history.push('/profile');
  },[user.user, history]);
  const submit = async (e) => {
    e.preventDefault();
    const loginUser = {username, password};
    console.log(loginUser);
    await Axios.post('http://localhost:5003/signin', loginUser)
    .then( res => {
      console.log(res.data);
      if (res.data.error) {
        setErr(res.data.error)
      } else {
        setUser({
          token: res.data.token,
          user: res.data.user
        });
        localStorage.setItem("auth-token", res.data.token);
        history.push('/profile');
      }
      
    })
        
  }

  const formClasses = classNames({
    "form-container":true, 
    "signin-form-container": true
  });
  return (
    <div className="login-container">
      <div className={formClasses}>
        <div className="error">
					<p className="message">{err}</p>
				</div>
          <div className="form-name">
            <h2>Sign In</h2>
          </div>
          <form onSubmit={submit}>
            <div className="field-wrapper">
              <div className="input-container">
                <input 
                  className="username" 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  onChange={ e => setUsername(e.target.value)}
                  required />
				    	</div>
              <div className="input-container">
                <input 
                  className="password" 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  onChange={ e => setPassword(e.target.value)}
                  required />
				    	</div>

            </div>
            <div className="btn-container">		
              <button className="submit-btn"> 
                submit
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}

export default Signin;