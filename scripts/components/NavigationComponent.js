var React = require('react');
var Backbone = require('backbone');
var RegisterComponent = require('./RegisterComponent');
var LoginComponent = require('./LoginComponent');
var _ = require('../../node_modules/backbone/node_modules/underscore/underscore-min.js');

module.exports = React.createClass({
	componentWillMount: function() {
		this.props.router.on('route', () => {
			this.forceUpdate();
		})
		this.dispatcher = {};
		_.extend(this.dispatcher, Backbone.Events);
		this.dispatcher.on('userRegistered', () => {
			this.onRegistered();
		})
		this.dispatcher.on('userLoggedIn', () => {
			this.onLoggedIn();
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
			links.push(<li key="register" onClick={this.onRegisterModal}><a href="#">Register</a></li>);
            links.push(<li key="logIn" onClick={this.onLogInModal}><a href="#">Log In</a></li>);
		}
		return(
			<section>
    			<nav className="navbar navbar-default">
            		<div className="container-fluid">
            			<div className="navbar-header">
                   	 		<button type="button" id="navCollapse" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        		<span className="sr-only">Toggle navigation</span>
                        		<span className="icon-bar"></span>
                        		<span className="icon-bar"></span>
                        		<span className="icon-bar"></span>
                    		</button>   
                            <a href="#" className="navbar-brand"><i>Track It!</i></a> 		
                		</div>
                	    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                   	 		<ul className="nav navbar-nav navbar-right">
                        		{links}
                    		</ul>
                		</div>
            		</div>
        		</nav>
    		    <div className="col-xs-6 col-sm-3 col-md-4">
                    <div ref="register" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <RegisterComponent dispatcher={this.dispatcher} router={this.props.router}/>
                            </div>
                        </div>
                    </div>     
		        </div>
	            <div className="col-xs-6 col-sm-3 col-md-4">
                    <div ref="login" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                        <div className="modal-dialog modal-sm">
                            <div className="modal-content">
                                <LoginComponent dispatcher={this.dispatcher} router={this.props.router}/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
		)
    },
    onRegisterModal: function() {
    	$(this.refs.register).modal('show'); 
    },
    onLogInModal: function() {
    	$(this.refs.login).modal('show');
    },
    onRegistered: function() {
    	$(this.refs.register).modal('hide');
    	this.props.router.navigate('home', {trigger: true}); 
    },
    onLoggedIn: function() {
    	$(this.refs.login).modal('hide');
    	this.props.router.navigate('home', {trigger: true});
    }
});