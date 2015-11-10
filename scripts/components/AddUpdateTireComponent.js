//this component passes into the UserPageComponent and is used to add new tires to a new car or replace old tires
//from an existing car
var React = require('react');
var CarModel = require('../models/CarModel');
var TireSetModel = require('../models/TireSetModel');

module.exports = React.createClass({
	getInitialState: function() {
		return{
			cars: [],
			tires: null
		}
	},
	//query to get set the state to all the cars the current user has in their garage
	componentWillMount: function() {
		var query = new Parse.Query(CarModel);
		query.equalTo('user', new Parse.User({objectId: this.props.userId}));
		query.find().then( (cars) => {
			this.setState({cars: cars});
			},
			(err) => {
				console.log(err);
		})
	},
	//displays the form that allows the user to enter their information
	render: function() {
		var carOptions = this.state.cars.map(function(car) {
			return(
				<option value={car.id} key={car.id}>{car.get('make')+ ' - '+car.get('model')}</option>
			)
		})
		return(
			<form className="addTireForm" onSubmit={this.saveTireInfo}>
				<div className="form-group">
					<label>Select Your Car</label>
					<select defaultValue="cars" className="form-control" onChange={this.getCarTireInfo} ref="carPick">
						<option>Cars</option>
						{carOptions}
					</select>
				</div>
				<div className="form-group">
					<label>Tire Type</label>
					<select className="form-control" ref="tireType">
						<option>Choose Tire Type</option>
						<option value="streetTire">Street Tires</option>
						<option value="raceTire">Race Tires</option>
					</select>
				</div>
				<div className="form-group">					
					<label>Tire Brand</label>
					<input type="text" className="form-control" ref="brand" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Tire Model</label>
					<input type="text" className="form-control" ref="model" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Front Tire Size</label>
					<input type="text" className="form-control" ref="frontTireSize" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Rear Tire Size</label>
					<input type="text" className="form-control" ref="rearTireSize" placeholder="Required" />
				</div>
				<div className="form-group">					
					<label>Current Runs On Tires</label>
					<input type="number" className="form-control" ref="runs" placeholder="Optional" />
				</div>
				<div className="formButton">
					<button type="submit" className="btn btn-default">Add Tire Info!</button>
				</div>
			</form>
		)
	},
	//function that runs when the user picks the car that they would like to add/change the tire info
	//for that car. This will populate the fields with the current tire info for the car if the car
	//already has tire info, otherwise the fields will be blank.
	getCarTireInfo: function(e) {
		e.preventDefault();
		var car = this.refs.carPick.value;
		var query = new Parse.Query(TireSetModel);
		query.include('car');
		query.equalTo('car', new CarModel({objectId: car}))
		query.find().then( (tires) => {
			this.setState({tires: tires});
		}).then( () => {
			var tires = (this.state.tires[0]) ? this.state.tires[0] : null;
			this.refs.brand.value = (tires !== null) ? tires.get('brand'): '';
			this.refs.model.value = (tires !== null) ? tires.get('model'): '';
			this.refs.frontTireSize.value = (tires !== null) ? tires.get('frontTireSize'): '';
			this.refs.rearTireSize.value = (tires !== null) ? tires.get('rearTireSize'): '';
			this.refs.runs.value = (tires !== null) ? tires.get('runs'): '';
		})		
	},
	//function that saves the tire information that was entered. This function will also set the "retired" property 
	//to true on the old set of tires if the car is not new.
	saveTireInfo: function(e) {
		e.preventDefault();
		var tireType = (this.refs.tireType.value === 'raceTire') ? true: false;
		var runs = parseInt(this.refs.runs.value);
		var oldTires = (this.state.tires[0]) ? this.state.tires[0] : null;
		var carId = this.refs.carPick.value;
		var car = null;
		this.state.cars.map(function(Car) {
			if(carId === Car.id) {
				car = Car;
			}
		})
		var Tires = new TireSetModel({
			brand: this.refs.brand.value,
			model: this.refs.model.value,
			frontTireSize: this.refs.frontTireSize.value,
			rearTireSize: this.refs.rearTireSize.value,
			runs: runs,
			retired: false,
			car: car,
			raceTires: tireType,
			user: Parse.User.current()
		})
		Tires.save(null, {
			success: function() {
				if(oldTires !== null) {
					oldTires.set('retired', true);
					oldTires.save();
				}
			}
		}).then(() => this.props.dispatcher.trigger('tiresUpdated'));
	}	
})