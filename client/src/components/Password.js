import '../App.css';
import {useState, useContext, useEffect} from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';


function Signin ({match}) {
  const [password, setPassword] = useState()
  const [confirm, setConfirm] = useState(); 
  const [err, setErr] = useState();
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState();
  const {user} = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (user.user)
      history.push('/movies');
    if (!match.params.key && !user.user)
      history.push('/');
  });
  console.log("valid "+ valid)
  const reset = match.params.key;
  useEffect(() => {
    const confirmation = async () => {
      await Axios.post('http://localhost:5003/valid', {reset: reset})
      .then(res => {
        if (res.data.error) setErr(res.data.error)
        else if (res) setValid(res.data);
      })

    }
    confirmation();
  })
  

  const submit = async (e) => {
    e.preventDefault();
    const resetPasswordUser = {reset, password, confirm};
    await Axios.post('http://localhost:5003/password', resetPasswordUser)
    .then( res => {
      if (res.data.error)
        setErr(res.data.error)
      else 
        setDone(res);
    })
  }
  console.log("valid "+ valid)
  const formClasses = classNames({
    "form-container":true, 
    "reset-form-container": true
  });
  const displayOptions = () => {
    if (done) {
      return (
        <div className="success">
          <h2>Done!</h2>
          <p>You have successfully reseted your password</p>
          <p>You can now <Link to="/">Login</Link> using your new password</p>
          <h3>Happy Torrenting</h3>
        </div>
      )
    } else if (valid) {
      return (
        <>
        <div className="login-container">
          <div className={formClasses}>
              <div className="error">
                <p className="message">{err}</p>
              </div>
              <div className="form-name">
                <h2>Reset Password</h2>
              </div>
                <form onSubmit={submit}>
                    <div className="field-wrapper">
                    <div className="input-container">
                      <input 
                        className="password" 
                        type="password" 
                        name="password" 
                        placeholder="New password" 
                        onChange={ e => setPassword(e.target.value)}
                        required />
                    </div>
                    <div className="input-container">
                      <input 
                        className="password" 
                        type="password" 
                        name="confirm" 
                        placeholder="Confirm new password"  
                        onChange={ e => setConfirm(e.target.value)}
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
    } else {
      return (
        <>
        <div className="success">
            <h2>Invalid!</h2>
            <p>This password reset key is incorrect</p>
            <p>and has be denied</p>
            <p>If you want to change your password</p>
            <p>plase make your request <Link to="/reset">here</Link></p>
        </div>
        </>
      )
    }
  }
  return (
    <div className="App">
      { 
        displayOptions()
      }
    </div>
  );
}

export default Signin;