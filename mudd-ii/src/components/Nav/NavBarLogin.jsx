  
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = props => {
	console.log(props);

	const handleClick = e => {
        e.preventDefault();
        props.history.push('/signup')	
	};

	return (
		<div className="navbar-logout">
			<div className="nav-content">
				<div className="nav-logo"><img src={require("../../assets/sorlosheet.png")}></img></div>
				<div className="mud-name"><h1>Mud</h1></div>
				<div className="nav-links">
					<NavLink onClick={handleClick} to="/signup" className="nav-link" activeClassName="nav-link-active">
						Signup
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default NavBar;