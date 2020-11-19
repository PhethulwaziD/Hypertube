import '../App.css';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {useState, useContext, useEffect} from 'react';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

function Verify({match}) {
  const history = useHistory();
  const {user} = useContext(UserContext);
  console.log(match.params.key);
  console.log("hello")
  useEffect(() => {
    if (user.user)
      history.push('/movies');
    if (!match.params.key && !user.user)
      history.push('/')
  },[user.user, history, match]);

    const [valid, setValid] = useState(false);
    const confirm = async () => {
        await Axios.post('http://localhost:5003/verify', {key: match.params.key})
        .then(res => {
            if (res.data.error) setValid(false)
            else if (res) setValid(true);
        })
    }
    confirm();
    return (
      <div className="App">
        <div className="success">
          <h1>Verify Account</h1>
          {
            valid ? (
              <>
              <p>You have successfully verified your account</p>
              <p>and you may now <Link to="/">Login</Link>.</p>
              <h3>Happy Torrenting</h3>
              </>
            ) : (
               <>
                <p>Unfortunately your verfication link is invalid.</p>
                <p>No user has be allocated to it</p>
                <h3>Sorry!</h3>
                </>
            )
          }
          </div>
      </div>
  );
}
export default Verify;