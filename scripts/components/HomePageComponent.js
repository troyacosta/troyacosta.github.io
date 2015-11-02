//this component will be the home page for users once they're logged in. It will display the latest 
//events that have been added, regardless of who added them.
var React = require('react');
var EventModel = require('../models/EventModel');

module.exports = React.createClass({
	getInitialState: function() {
	    return ({
	    	cars: [],
	        events: [],
	        tires: []
	    });
	},
	//queries all the events that have been saved and includes the cars and tires that were part of each event.
	componentWillMount: function() {
		var query = new Parse.Query(EventModel);
		query.include('car');
		query.include('tires');
		query.find().then( (events) => {
			this.setState({events: events});
		})
	},
	render: function() {
		var eventInfo = this.state.events.map( (Event) => {
			var car = Event.get('car');
			var tires = Event.get('tires');
			return(
				<div>
					<div>{Event.get('location')+' '+car.get('make')+' '+tires.get('model')}</div>
				</div>
			)
		})
		return(
			<div>{eventInfo}</div>
		)
	}
})