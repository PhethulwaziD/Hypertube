import '../App.css';
import React, {useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import UserContext from "../context/UserContext";
import { useHistory } from 'react-router-dom';

function Navbar() {
	const {user, setUser} = useContext(UserContext);
	const [toggle, setToggle] = useState(false);
	const [menu, setMenu] = useState(false);
	const [search, setSearch] = useState();
	const history = useHistory();
	const toggler = () => {
		setToggle(!toggle);
		setMenu(!menu);
	}
	var ulClasses = classNames ({
		"nav-links": true,
		"show" : toggle
	});

	var menuClasses = classNames ({
		"menu-icon": true,
		"icon-active" : toggle
	});

	const signOut = () => {
		setUser({
			token: undefined,
			user: undefined
		});
		history.push('/');
		localStorage.setItem("auth-token", "");
	}
  return (
	  <nav className="header">
		<h1>bioskop</h1>
		{			
			user.user ? ( 
				<>
					<ul className={ulClasses}>
						<div className="search-container">
							<input onChange={e => setSearch(e.target.value)} type="text" name="search" placeholder="Search"/>
							<Link onClick={toggler} to={`/search/${search}`}><li>Search</li></Link>
						</div>
						<Link to="/movies" onClick={toggler} replace>
							<li>Movies</li>
						</Link>
						<Link to="/profile" onClick={toggler}>
							<li>Profile</li>
						</Link>
						<button className="logout-btn" onClick={signOut}>Sign Out</button>
					</ul>		
				</>
			):( 
				<>
					<ul className={ulClasses}>
						<Link to="/" onClick={toggler}>
							<li>Sign In</li>
						</Link>
						<Link to="/signup" onClick={toggler}>
							<li>Sign Up</li>
						</Link>
						<Link to="/reset" onClick={toggler}>
							<li>Forgot Password</li>
						</Link>
					</ul>
				</> 
			)
		}
			<div className={menuClasses} onClick={toggler}>
				+
			</div>
	</nav>
  );
}

export default Navbar;
