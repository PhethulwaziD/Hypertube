import '../App.css';
import {useState, useEffect, useContext} from 'react';
import Axios from 'axios';
import classNames from 'classnames';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

function Signup() {
  
  const [data, setData] = useState();
  const [err, setErr] = useState();
  const [firstname, setFirst] = useState()
  const [lastname, setLast] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirm, setConfirm] = useState();
  const [username,  setUsername] = useState()
  const {user} = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    if (user.user)
      history.push('/movies');
  },[user.user, history]);
  const submit = async (e) => {
    e.preventDefault();
    const newUser = {firstname, lastname, username, email, password, confirm};
    await Axios.post('http://localhost:5003/signup', newUser)
    .then( res =>  {
      console.log(res)
      if (res.data.error)
        setErr(res.data.error)
      else 
        setData(res.data)
    })

  }
  const formClasses = classNames({
    "form-container":true, 
    "signup-form-container": true
  });
  return (
    <div className="App">
    { data ? (
      <div className="success">
        <h2>Well Done</h2>
        <p>You have successfully signed up to zero</p>
        <p>Now for the last step</p>
        <p>please verify your account by clicking on the link we sent your email account</p>
        <h3>Thank You!</h3>
      </div>
      
      ) : (
      <div className="login-container">
      <div className={formClasses}>
        <div className="error">
					<p className="message">{err}</p>
				</div>
          <div className="form-name">
            <h2>Sign Up</h2>
          </div>
          <form onSubmit={submit}>
            <div className="field-wrapper">
              <div className="input-container">
                <input className="username" 
                  type="text" 
                  name="firstname" 
                  placeholder="Firstname"
                  onChange={ e => setFirst(e.target.value)}
                  required />
				    	</div>
              <div className="input-container">
                <input 
                  className="username" 
                  type="text" 
                  name="lastname" 
                  placeholder="Lastname" 
                  onChange={ e => setLast(e.target.value)} 
                  required />
				    	</div>
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
                  className="username" 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  onChange={ e => setEmail(e.target.value)}
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
              <div className="input-container">
                <input 
                  className="password" 
                  type="password" 
                  name="confirm" 
                  placeholder="Confirm Password"  
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
    ) }
    </div>
  );
}

export default Signup;