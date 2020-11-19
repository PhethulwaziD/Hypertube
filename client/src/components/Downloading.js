import '../App.css';
import {useContext, useEffect, useState} from 'react';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

//import socketIOClient from "socket.io-client";

function Downloading({match}) {
  //const socket = socketIOClient('http://localhost:5003', {transports: ['websocket']})
  const history = useHistory();
  const {user} = useContext(UserContext);
  const [err, setErr] = useState();
 // const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!user.user)
      history.push('/');
  }); 
  
  // useEffect(() => {
  //   socket.on('loading', data => {
  //     setProgress(data.percent)
  //   })

  //   socket.on('error', err => {
  //     console.log("Error"+ err);
  //   })
  // })
  
  useEffect(() => {
    const requestMovie = async () => {
        let res = await fetch(`http://localhost:5003/downloading?movie=${match.params.movie}`);
        const data = await res.json();
        if (data.error) setErr(data.error)
        else if (data.status === 'done') history.push(`/stream/${match.params.movie}`);
      }
    requestMovie()
  }); 

  return (
      <div className="App">
        <div className="success">
          <p>{err}</p>
          <h2>We are Currently Downloading {match.params.movie} For You</h2>
          <h2 className="progress">Please wait</h2>
        </div>
      </div>
  );
}

export default Downloading;