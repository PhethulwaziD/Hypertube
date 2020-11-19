import '../App.css';
import {useContext, useEffect, useState} from 'react';
import UserContext from "../context/UserContext";
import {useHistory} from 'react-router-dom';
import Axios from 'axios';

function Search({match}) {
  const history = useHistory();
  const {user} = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);

  useEffect(() => {
    if (!user.user)
      history.push('/');
  }); 

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:5003/movie/update`);
      const update =  res.json();
      console.log(update);
    }
    fetchData();
  },[])
  


  useEffect(() => {
    let isCancelled = false;
    let anime;
    const fetchMovies = async () => {
      const query = `https://yts.mx/api/v2/list_movies.json?name=${match.params.search}&limit=50`
        anime = await Axios(query);
    };

    fetchMovies().then(() => {
      if (!isCancelled) {
        setMovies(anime.data.data.movies);
      }
    });

    return () => {
      isCancelled = true;
    };
}, [match.params.search]);
  
  const lastMovie = currentPage * moviesPerPage;
  const firstMovie = lastMovie - moviesPerPage;
  const currentMovies = movies.slice(firstMovie, lastMovie);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  ///send movie data
  const requestMovie = async (movie) => {
    await Axios.post('http://localhost:5003/download', movie)
    .then(res => {
      if (res)
        history.push(`/downloading/${movie.title}`);
    }).catch(err => {
      if (err.response)
        console.log(err.response.data.error);
    })
  }

  const renderMovies = () => {
    return (
        currentMovies.map(movie => (
            <div key={movie.id} className="event-container">
              <div key={movie.id}>
                <div key={movie.id} onClick={() => requestMovie(movie)} className="img-wrapper" style={{backgroundImage:`url(${movie.medium_cover_image})`}}>
                  <div className="description" key={movie.imdb_code}>
                    <div className="desc-content" key={movie.id}>
                      <div className="more-info"  key={movie.imdb_code}>
                        <div className="info date-info" key={movie.rating}>
                          <div className="value" key={movie.rating}>{movie.rating}</div>
                          <div className="type" key={movie.rating+1}>Rating</div>
                        </div>
                        <div className="info reg-info" key={movie.year}>
                          <div className="value" key={movie.year}>{movie.year}</div>
                          <div className="type" key={movie.year+1}>Year</div>
                        </div>
                      </div>
                    </div>
                  </div>  
                </div>
                <div className="name" key={movie.title}>{movie.title}</div>
              </div>

          </div>

        ))
    );
  }
  
  return (
      <div className="App">
       <div key={1} className="main-content">
          <div key={2} className="dashboard-container">
            <div key={3}className="upcoming-container">
              <div key={4} className="upcoming-images">
                {renderMovies()}
              </div>
            </div>
          </div>
        </div>
        <Pagination moviesPerPage={moviesPerPage} totalMovies={movies.length} paginate={paginate}/>
      </div>
  );
}

const Pagination = ({moviesPerPage, totalMovies, paginate}) => {
  const pageNumbers = [];
  
  for (let i = 1; i <= Math.ceil(totalMovies/moviesPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <footer className='page-numbers'>
      More
      <ul className="pagination">
        {
          pageNumbers.map(page => (
              <li key={page}>
                <button key={page} className="pages" onClick={() => paginate(page)}>
                    {page}
                </button>
              </li>
          ))
        }
      </ul>
    </footer>
  )
}
export default Search;
