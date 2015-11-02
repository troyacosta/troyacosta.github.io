var React = require('react');
var CarModel = require('../models/CarModel');
var TireSetModel = require('../models/TireSetModel');

module.exports = React.createClass({
	getInitialState: function() {
		return {error: null};
	},
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
					<label>Color</label>
					<input type="text" className="form-control" ref="color" placeholder="Optional" />
				</div>
				<div className="form-group">					
					<label>Front Wheel Size</label>
					<input type="text" className="form-control" ref="frontWheelSize" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Rear Wheel Size</label>
					<input type="text" className="form-control" ref="rearWheelSize" placeholder="Required" />
				</div>
				<button type="submit" className="btn btn-default">Add Car!</button>
			</form>
		)
	},
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
			color: this.refs.color.value,
			frontWheelSize: this.refs.frontWheelSize.value,
			rearWheelSize: this.refs.rearWheelSize.value,
			user: Parse.User.current()
		});
		Car.save().then(() => this.props.dispatcher.trigger('carAdded'));
	}
})