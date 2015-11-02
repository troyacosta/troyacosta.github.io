var React = require('react');
var Backbone = require('backbone');

module.exports = React.createClass({
	getInitialState: function() {
		return {error: null};
	},
	render: function() {
		var errorElement = null;
		var url = Backbone.history.getFragment();
		if(this.state.error) {
			errorElement = (
				<p className="red">{this.state.error}</p>
			);
		}
		if(url == 'login') {
			return(
				<form className="loginForm" onSubmit={this.onLogin}>
					<div className="form-group">					
						<label>Email address</label>
						<input type="email" className="form-control" ref="email" placeholder="Email" />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" ref="password" placeholder="Password" />
					</div>
					{errorElement}
					<button type="submit" className="btn btn-default">Log On!</button>
				</form>
			)
		}
		else {
			return(
				<form className="registerForm" onSubmit={this.onRegister}>
					<div className="form-group">
						<label>First Name</label>
						<input type="text" className="form-control" ref="firstName" placeholder="First Name" />
					</div>
					<div className="form-group">
						<label>Last Name</label>
						<input type="text" className="form-control" ref="lastName" placeholder="Last Name" />
					</div>
					<div className="form-group">
						<label>Email</label>
						<input type="email" className="form-control" ref="email" placeholder="yourEmail@you.com" />
					</div>
					<div className="form-group">
						<label>Password</label>
						<input type="password" className="form-control" ref="password" placeholder="Password" />
					</div>
					{errorElement}
					<button type="submit" className="btn btn-default">Register!</button>
				</form>
			)
		}
	},
	onLogin: function(e) {
		e.preventDefault();
		Parse.User.logIn(
			this.refs.email.value,
			this.refs.password.value,
			{
				success: (u) => {
					this.props.router.navigate('home', {trigger: true});
				},
				error: (u, error) => {
					this.setState({
						error: error.message
				});
			}
		});
	},
	onRegister: function(e) {
		e.preventDefault();
		var user = new Parse.User();
		user.signUp({
			firstName: this.refs.firstName.value,
			lastName: this.refs.lastName.value,
			username: this.refs.email.value,
			password: this.refs.password.value
		},
		{
			success: (u) => {
				this.props.router.navigate('home', {trigger: true});
			},
			error: (u, error) => {
				console.log(error);
				this.setState({
					error: error.message
				});
			}
		});
	}
});