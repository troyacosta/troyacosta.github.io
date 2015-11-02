//this component is used to allow the user to create a new event. It takes in several data fields and stores that data
//in the appropriate models. It is passed into the UserPageComponent for rendering.
var React = require('react');
var EventModel = require('../models/EventModel');
var CarModel = require('../models/CarModel');
var ImageModel = require('../models/ImageModel');
var TireSetModel = require('../models/TireSetModel');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			cars: [],
			tires: null
		}
	},
	//query to get all the cars that belong to the current user.
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
	render: function() {
		var carOptions = this.state.cars.map(function(car) {
			return(
				<option value={car.id} key={car.id}>{car.get('make')+ ' - '+car.get('model')}</option>
			)
		})
		return(
			<form className="loginForm" onSubmit={this.addEvent}>
				<div className="form-group">
					<label>Select Your Car</label>
					<select className="form-control" onChange={this.getTires} ref="carPick">
						{carOptions}
					</select>
				</div>
				<div className="form-group">					
					<label>Event Location</label>
					<input type="text" className="form-control" ref="location" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Weather Conditions</label>
					<input type="text" className="form-control" ref="weather" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Surface Type</label>
					<input type="text" className="form-control" ref="surface" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Course Length</label>
					<input type="text" className="form-control" ref="courseLength" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Number Of Runs</label>
					<input type="number" className="form-control" ref="numberOfRuns" placeholder="Required" />
				</div>
				<div className="form-group">
					<label>Event Notes</label>
					<textarea type="text" className="form-control" ref="eventComments" placeholder="Optional"></textarea>
				</div>
				<div className="form-group">
					<label>Video Link</label>
					<input type="url" className="form-control" ref="videoLink" placeholder="Optional" />
				</div>
				<div className="form-group">
					<label>Upload Tire Photo</label>
					<input type="file" className="form-control" ref="tirePic"/>
				</div>
					<button type="submit" className="btn btn-default">Add Event!</button>
			</form>			
		)
	},
	//function that gets the tires that are tied to the car that was selected, then sets the state to the 
	//correct set of tires.
	getTires: function() {
		var car = (this.refs.carPick.value);
		var query = new Parse.Query(TireSetModel);
		query.include('car');
		query.equalTo('car', new CarModel({objectId: car}))
		query.find().then( (tires) => {
			this.setState({tires: tires});
		})
	},
	//function that collects all the information that was added from the event form and stores it in the 
	//appropriate models. This includes the event model, tire model, and image model
	addEvent: function(e) {
		e.preventDefault();
		var NumberOfRuns = parseInt(this.refs.numberOfRuns.value);
		var CourseLength = parseInt(this.refs.courseLength.value);
		var tires = this.state.tires;
		var car = tires[0].get('car');
		var image = this.refs.tirePic.files[0];
		var file = new Parse.File('photo.jpg', image);
		var imageModel = new ImageModel({
			image: file,
			tires: tires[0]
		})
		var Event = new EventModel({
			location: this.refs.location.value,
			weather: this.refs.weather.value,
			surface: this.refs.surface.value,
			eventComments: this.refs.eventComments.value,
			courseLength: CourseLength,
			numberOfRuns: NumberOfRuns,
			videoLink: this.refs.videoLink.value,
			car: car,
			tires: tires[0]
		})
		imageModel.save();
		Event.save();
		tires[0].increment('runs', NumberOfRuns);
		tires[0].save().then( () => this.props.dispatcher.trigger('eventAdded'));
	}
})










