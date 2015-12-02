//this component allows the user to add a new car to their garage
var React = require('react');
var CarModel = require('../models/CarModel');
var TireSetModel = require('../models/TireSetModel');

module.exports = React.createClass({
	getInitialState: function() {
		return {error: null};
	},
	//displays the form that takes in all the data that will be associated with the user's car.
	//this component is being passed to the UserPageComponent and is then displayed as a model.
	render: function() {
		return(
			<form className="addCarForm" onSubmit={this.addCar}>
				<div className="form-group">					
					<label>Make</label>
					<input type="text" className="form-control" ref="make" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Model</label>
					<input type="text" className="form-control" ref="model" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Year</label>
					<input type="number" className="form-control" ref="year" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Car Class</label>
					<input type="text" className="form-control" ref="carClass" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Weight</label>
					<input type="number" className="form-control" ref="weight" placeholder="Optional" />
				</div>
				<div className="form-group">					
					<label>Front Wheel Size</label>
					<input type="text" className="form-control" ref="frontWheelSize" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Rear Wheel Size</label>
					<input type="text" className="form-control" ref="rearWheelSize" placeholder="Required" />
				</div>
				<div className="formButton">
					<button type="submit" className="btn btn-default">Add Car!</button>
				</div>
			</form>
		)
	},
	//function that takes all the data that was entered into the form and then saves it to the 
	//server and associates it with the user that created it.
	addCar: function(e) {
		e.preventDefault();
		var carYear = parseInt(this.refs.year.value);
		var carWeight = parseInt(this.refs.weight.value);
		var Car = new CarModel({
			make: this.refs.make.value,
			model: this.refs.model.value,
			year: carYear,
			carClass: this.refs.carClass.value,
			weight: carWeight,
			frontWheelSize: this.refs.frontWheelSize.value,
			rearWheelSize: this.refs.rearWheelSize.value,
			user: Parse.User.current()
		});
		//saves the new car and then clears out the form fields
		Car.save().then(() => {
			this.refs.make.value = '',
			this.refs.model.value = '',
			this.refs.year.value = '',
			this.refs.carClass.value = '',
			this.refs.weight.value = '',
			this.refs.frontWheelSize.value = '',
			this.refs.rearWheelSize.value = ''
		}).then(() => this.props.dispatcher.trigger('carAdded'));
	}
})