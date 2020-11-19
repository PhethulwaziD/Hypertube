import '../App.css';
import Axios from 'axios';
import classNames from 'classnames';
import {useState, useContext, useEffect} from 'react';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

function Reset() {
  const history = useHistory();
  const {user} = useContext(UserContext);
  useEffect(() => {
    if (user.user)
      history.push('/movies');
  },[user.user, history]);
  const [email, setEmail] = useState();
  const [err, setErr] = useState();
  const [valid, setValid] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const newUser = {email};
    await Axios.post('http://localhost:5003/user/reset', newUser)
    .then( res => {
      if (res.data.error)
        setErr(res.data.error)
      else
        setValid(res.data);
    })
  }

  const formClasses = classNames({
    "form-container":true, 
    "password-form-container": true
  });
  return (
    <div className="App">
    {
      valid ? (
        <div className="success">
          <h2>Done</h2>
          <p>You have successfully requested to reset your password</p>
          <p>Please use the link we have sent to your email account</p>
          <h3>Happy Torrenting!</h3>
        </div>
      ) : (
        <> 
        <div className="login-container">
          <div className={formClasses}>
            <div className="error">
              <p className="message">{err}</p>
            </div>
              <div className="email-form-name">
                <h2>Reset Password</h2>
              </div>
              <form onSubmit={submit}>
                <div className="field-wrapper">
                  <div className="input-container">
                    <input 
                      className="username" 
                      type="email" 
                      name="email" 
                      placeholder="Email" 
                      onChange={ e => setEmail(e.target.value)}
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
        </>
      )
    }
    </div>
  );
}

export default Reset;