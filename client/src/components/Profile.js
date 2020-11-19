import '../App.css';
import {useState, useEffect, useContext} from 'react';
import Axios from 'axios';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

function Profile() {
  const history = useHistory();
  const {user} = useContext(UserContext);
  const [err, setErr] = useState();
  const [firstname, setFirst] = useState()
  const [lastname, setLast] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirm, setConfirm] = useState();
  const [username, setUsername] = useState();
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState("Choose Profile Pic")
  const [pic, setPic] = useState("me.jpeg");

  useEffect(() => {
    if (!user.user)
      history.push('/');
    else if (user.user)
      setPic(user.user.pic)
  },[user.user, history]);

  const sendUpdate = async (data) => {
    await Axios.post('http://localhost:5003/user/update', data)
    .then( res =>  {
      if (res.data.error)
        setErr(res.data.error)
      else {
        setErr("");
        if (res.data.firstname) setFirst(res.data.firstname)
        else if (res.data.lastname) setLast(res.data.lastname)
        else if (res.data.email) setEmail(res.data.email)
        
      }
    })

  } 
  const uploadImage = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', user.user.email)
    await Axios.post('http://localhost:5003/user/upload', formData, {
      'Content-Type': 'multipart/form-data'
    })
    .then( res =>  {
      if (res.data.error) {
        setErr(res.data.error)
      } else if (res.data.pic){ 
        setPic(res.data.pic)
        setErr("");
        setFilename("Choose Profile Pic")
      }
    })

  }

  const submitFirstname = async (e) => {
    e.preventDefault();
    const data = {firstname, email: user.user.email};
    sendUpdate(data);
  }

  const submitLastname = async (e) => {
    e.preventDefault();
    const data = {lastname, email: user.user.email};
    sendUpdate(data);
  }

  const submitUsername = async (e) => {
    e.preventDefault();
    const data = {username, email: user.user.email};
    sendUpdate(data);
  }

  const submitEmail = async (e) => {
    e.preventDefault();
    const data = {email, oldemail: user.user.email};
    sendUpdate(data);
  }
  const submitPassword = async (e) => {
    e.preventDefault();
    const data = {password, confirm, email: user.user.email};
    sendUpdate(data);
  }
  const renderProfile = () => {
    return (
      <div className="profile-container">
         <div className="profile-img-wrapper">
            <img className="profile-pic" src={`http://localhost:5003/${pic}`} alt="http://localhost:5003/me.jpeg"/>
         </div>
      </div>
    )
  }

  const renderUploadImage = () => {
    return (
      <form onSubmit={uploadImage}>
        <div className="search-container">
            <div className="w150 upload">
              <label className="custom-file-upload">
                {filename}
                <input onChange={e => {setFile(e.target.files[0]); setFilename(e.target.files[0].name) }} type="file" name="file" required />
              </label>
            </div>
 
          <div className="btn-container">		
            <button className="submit-btn"> 
              UPLOAD
            </button>
          </div>
				</div>
      </form>
    )
  }

  const renderFirstname = () => {
    return (
      <>
      <form onSubmit={submitFirstname}>
        <div className="search-container">
          <input onChange={e => setFirst(e.target.value)} type="text" name="firstname" 
            placeholder={user.user ? user.user.firstname : ("Firstname")} required/>
						<div className="btn-container">		
              <button className="submit-btn"> 
                change
              </button>
            </div>
				</div>
      </form>
      </>
    )
  }

  const renderLastname = () => {
    return (
      <>
      <form onSubmit={submitLastname}>
        <div className="search-container">
          <input onChange={e => setLast(e.target.value)} type="text" name="lastname" 
            placeholder={user.user ? user.user.lastname : ("Lastname")} required/>
						<div className="btn-container">		
              <button className="submit-btn"> 
                change
              </button>
            </div>
				</div>
      </form>
      </>
    )
  }

  const renderUsername = () => {
    return (
      <>
      <form onSubmit={submitUsername}>
        <div className="search-container">
          <input onChange={e => setUsername(e.target.value)} type="text" name="username" 
            placeholder={user.user ? user.user.username : ("Username")} required/>
						<div className="btn-container">		
              <button className="submit-btn"> 
                change
              </button>
            </div>
				</div>
      </form>
      </>
    )
  }

  const renderEmail = () => {
    return (
      <>
      <form onSubmit={submitEmail}>
        <div className="search-container">
          <input onChange={e => setEmail(e.target.value)} type="text" name="email" 
            placeholder={user.user ? user.user.email : ("Email")} required/>
						<div className="btn-container">		
              <button className="submit-btn"> 
                change
              </button>
            </div>
				</div>
      </form>
      </>
    )
  }
  const renderPassword = () => {
    return (
      <>
      <form onSubmit={submitPassword}>
        <div className="search-container">
          <input className="password" 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={ e => setPassword(e.target.value)}
            required />
          </div>
          <div className="search-container">
          <input 
            className="password" 
            type="password" 
            name="confirm" 
            placeholder="Confirm Password"  
            onChange={ e => setConfirm(e.target.value)}
            required />
						<div className="btn-container">		
              <button className="submit-btn"> 
                change
              </button>
            </div>
          
				</div>
      </form>
      </>
    )
  }
  return (
    <>
    <div className="App">
    <div className="main-content">
      <div className="name-wrapper">
      { renderProfile() }
        <h2 className="profile-name">{user.user ? user.user.username : ("Username")}</h2>
      </div>
       <div className="dashboard-container">
         <div className="upcoming-container">
           <div className="field-container">
              <div className="error">
					      <p className="message">{err}</p>
				      </div>
              { renderUploadImage()}
              { renderFirstname() }
              { renderLastname() }
              { renderUsername() }
              { renderEmail() }
              {  renderPassword() }
           </div>
          
         </div>
       </div>
     </div>
     
   </div>
   </>
  );
}




export default Profile;