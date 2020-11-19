import '../App.css';
import {useContext, useEffect, useState} from 'react';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';

import Axios from 'axios';


function Stream({match}) {
  const title = match.params.movie;
  const history = useHistory();
  const {user} = useContext(UserContext);
  const [video, setVideo] = useState();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [views, setViews] = useState([]);
  const [comment, setComment] = useState();
  const [err, setErr] = useState()
  const [synopsis, setSynopsis] = useState()
  const [year, setYear] = useState();

  useEffect(() => {
    setTimeout( () => {
      if (!user.user)
        history.push('/');
      if ( !title)
        history.push('/movies')
    }, 3000)
    
  }, [history, user.user, title]); 

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (user.user) {
  //       const viewData = {title: match.params.movie, email: user.user.email}
  //       const resp = await Axios.post('http://localhost:5003/movie/views', viewData)
  //       set
  //     }
  //   }
  //   fetchData();
  // })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5003/stream?movie=${title}`);
        const data =  res.json()
        if (!data.file) {
          setErr(`Unfortunately ${title} is not available`)
        }
        setVideo(data)  
      } catch (error) {
       setErr("Error retrieving data") 
      }
    }
    fetchData();
  })



  useEffect(() => {
    const fetchAbout = async () => {
      const res = await Axios.post('http://localhost:5003/movie/about', {title: title})
      if (res.data.error) {
        setErr(res.data.error)
      } else {
        setLikes(res.data.likes)
        setComments(res.data.comments)
        setViews(res.data.views)
        const movie = res.data.movie;
        setSynopsis(movie.summary);
        setYear(movie.year);
      }
    }
    fetchAbout()
  }, [title])


  const likeMovie = async() => {
    const likeData = {title: match.params.movie, email: user.user.email}
    console.log(likeData)
    const res = await Axios.post('http://localhost:5003/movie/likes', likeData)
    console.log(res.data);
    setLikes(res.data.likes);
  }

  const submit = async (e) => {
    e.preventDefault();
    const commentData = {title:match.params.movie, name: user.user.firstname, comment: comment}
    console.log(commentData);
    Axios.post('http://localhost:5003/movie/comments', commentData)
    .then( res => {
      setComments(res.data.comments);
      e.target.value = "";
    })
    .catch(err => {
      if (err.response)
        setErr(err.response.data.error)
    });
  }

  const renderComments = () => {
  
    return (
      comments.map(comment => (
        
          <div className="comments-conatiner">
            <div className="comment-details">
              <h5 className="comment-name">{comment.name}</h5>
              <p className="comment-date">{comment.date}</p>
            </div>
            <p className="comment-comment">{comment.comment}</p>
          </div>

        
    )))
  } 

  return (
    <div className="App">
      <div className="player-container">
        <h2>{title} [{year}]</h2>
        <video controls autoPlay>
          <source src={`http://localhost:5003/stream?movie=${match.params.movie}`} type="video/mp4"></source>
        </video>
        <div className="movie-info">
        <div className="movie-details">
          <div className="like-btn">
            <span className="logout-btn" onClick={() => likeMovie()}>likes {likes.length}</span>
          </div>
          <div>
            <span> views {views.length}</span>
          </div>
          <div>
            <span> comments {comments.length}</span>
          </div>
        </div>
        <div>
          <h3>About {title}</h3>
          {synopsis}
        </div>
              <div className="error">
					      <p className="message">{err}</p>
				      </div>
              <form onSubmit={submit}>
                <div className="comment-wrapper">
                  <div className="text-area-wrapper">
                    <div>
                      <textarea
                        className="username" 
                        type="text" 
                        name="comment" 
                        placeholder="Comment..." 
                        onChange={ e => setComment(e.target.value)}
                        required />
                    </div>
                    </div>
                    <div className="btn-container">		
                      <button className="comment-btn"> 
                        submit
                      </button>
                    </div>
                  </div>
              </form>
			
        </div>
        {renderComments()}
      </div>
    </div> 
  );
}

export default Stream;