var React = require('react');
var Backbone = require('backbone');

module.exports = React.createClass({
	componentWillMount: function() {
		this.props.router.on('route', () => {
			this.forceUpdate();
		})
	},
	render: function() {
		var currentUser = Parse.User.current();
		var links = [];         
		if(currentUser) {
			links.push(<li key="home"><a href="#home">Home</a></li>);
			links.push(<li key="logOut"><a href="#logOut">Log Out</a></li>);
			links.push(<li key="userName"><a href={'#user/'+currentUser.id}>{currentUser.get('firstName')} {currentUser.get('lastName')}</a></li>);
		}
		else {
			links.push(<li key="register"><a href="#register">Register</a></li>);
            links.push(<li key="logIn"><a href="#login">Log In</a></li>);
		}
		return(
			<nav className="navbar navbar-default navbar-custom navbar-fixed-top">
        		<div className="container-fluid">
        			<div className="navbar-header page-scroll">
               	 		<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    		<span className="sr-only">Toggle navigation</span>
                    		<span className="icon-bar"></span>
                    		<span className="icon-bar"></span>
                    		<span className="icon-bar"></span>
                		</button>
                		<a className="navbar-brand" href="#home">HOME</a>
            		</div>
            		<div className="collapse navbar-collapse">
               	 		<ul className="nav navbar-nav navbar-right">
                    		{links}
                		</ul>
            		</div>
        		</div>
    		</nav>
		)
    }

});