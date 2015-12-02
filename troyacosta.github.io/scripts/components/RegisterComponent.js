var React = require('react');
var Backbone = require('backbone');

module.exports = React.createClass({
	getInitialState: function() {
		return {error: null};
	},
	render: function() {
		var errorElement = null;
		if(this.state.error) {
			errorElement = (
				<p className="red">{this.state.error}</p>
			);
		}
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
					<div className="formButton">
						<button type="submit" className="btn btn-default">Register!</button>
					</div>
				</form>
			)
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
				this.props.dispatcher.trigger('userRegistered');
			},
			error: (u, error) => {
				console.log(error);
				this.setState({
					error: error.message
				});
			}
		}).then(() => {
			//resets the input fields to be empty after a user has registered
			this.refs.firstName.value = '',
			this.refs.lastName.value = '',
			this.refs.email.value = '',
			this.refs.password.value = ''
		});
	}
});