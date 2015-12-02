//this component will be the home page for users once they're logged in. It will display the latest 
//events that have been added, regardless of who added them.
var React = require('react');
var EventModel = require('../models/EventModel');
var TireSetModel = require('../models/TireSetModel')

module.exports = React.createClass({
	getInitialState: function() {
	    return ({
	        events: [],
	        tires:[]
	    });
	},
	//queries all the events that have been saved and includes the cars and tires that were part of each event.
	componentWillMount: function() {
		var eventQuery = new Parse.Query(EventModel);
		var tireSetQuery = new Parse.Query(TireSetModel);
		tireSetQuery.include('user');
		eventQuery.include('car');
		eventQuery.include('tires');
		eventQuery.include('user');
		eventQuery.limit(10);
		eventQuery.find().then((events) => {
			this.setState({events: events});
		})
		tireSetQuery.find().then((tires) => {
			this.setState({tires: tires});
		})
	},
	render: function() {
		//grabs the tires sets that are still in use
		var activeTires = this.state.tires.map((tireSet) => {
			if(tireSet.get('retired') === false) {
				return(
					<div key={tireSet.id}>
						<a href={'#tireInfo/'+tireSet.id} className="list-group-item">
							{tireSet.get('brand')+' - '+tireSet.get('model')}<br />
							Owner: {tireSet.get('user').get('firstName')+' '+tireSet.get('user').get('lastName')}
						</a>
					</div>
				)
			}
		}).reverse();
		//grabs all the tires that have been marked as retired
		var retiredTires = this.state.tires.map((tireSet) => {
			if(tireSet.get('retired') === true) {
				return(
					<div key={tireSet.id}>
						<a href={'#tireInfo/'+tireSet.id} className="list-group-item">
							{tireSet.get('brand')+' - '+tireSet.get('model')}<br />
							Owner: {tireSet.get('user').get('firstName')+' '+tireSet.get('user').get('lastName')}
						</a>
					</div>
				)
			}
		}).reverse();
		//this function grabs all the event info for all the tires. It is then mapped over and then rendered
		var eventInfo = this.state.events.map((Event) => {
			var car = Event.get('car');
			var tires = Event.get('tires');
			var poster = Event.get('user');
			//adds a video link if one has been stored in the model, otherwise it displays nothing
			var video = Event.get('videoLink') !== '' ? <a href={Event.get('videoLink')}>Video Link</a>: <br />;
			var date = Event.get('createdAt').toString().slice(0, 15);
			return(
						<div key={Event.id} className="eventBox">
							<h5><strong><i>Added by: {poster.get('firstName')+' '+poster.get('lastName')} on {date}</i></strong></h5>
							<h4>Event Location: {Event.get('location')}</h4>
							<h5>Car - {car.get('carClass')+' - '+car.get('make')+' '+car.get('model')}</h5>
							<a href={'#tireInfo/'+tires.id}>Tires:  {tires.get('brand')+' '+tires.get('model')}</a>
							<p>{Event.get('eventComments')}</p>
							{video}						
						</div>
			)
		}).reverse();
		return(
			<div className="container-fluid homePage">
				<div className="row">
					<div className="col-md-2 list-group">
						<h2 className="activeTires">Active Tires</h2>
						{activeTires}
						<h2>Retired Tires</h2>
						{retiredTires}
					</div>
					<div className="col-md-10">
						<h2>Recents Events</h2>
						{eventInfo}
					</div>
				</div>
			</div>
		)
	}
})