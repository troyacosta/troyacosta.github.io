// this component has several other components passed into it for rendering. It will also display most of the user's information.
var React = require('react');
var EventModel = require('../models/EventModel');
var TireSetModel = require('../models/TireSetModel');
var AddCarComponent = require('./AddCarComponent');
var AddEventComponent = require('./AddEventComponent');
var EditCarComponent = require('./EditCarComponent');
var AddUpdateTireComponent = require('./AddUpdateTireComponent');
var Backbone = require('backbone');
var _ = require('../../node_modules/backbone/node_modules/underscore/underscore-min.js');

module.exports = React.createClass({
	getInitialState: function() {
	    return ({
	        events: [],
	        tires: []
	    });
	},
	//query event information. Also add the dispatcher calls that will launch the modals.
	componentWillMount: function() {
		var eventQuery = new Parse.Query(EventModel);
		var tireSetQuery = new Parse.Query(TireSetModel);
		tireSetQuery.equalTo('user', new Parse.User({objectId: this.props.userId}));
		eventQuery.limit(10);
		eventQuery.include('tires');
		eventQuery.include('car');
		eventQuery.equalTo('user', new Parse.User({objectId: this.props.userId}));
		eventQuery.find().then( (events) => {
			this.setState({events: events});
		})
		tireSetQuery.find().then((tires) => {
			this.setState({tires: tires});
		})
		this.dispatcher = {};
		_.extend(this.dispatcher, Backbone.Events);
		this.dispatcher.on('carAdded', () => {
			this.onCarAdded();
		})
		this.dispatcher.on('eventAdded', () => {
			this.onEventAdded();
		})
		this.dispatcher.on('carEdited', () => {
			this.onCarEdited();
		})
		this.dispatcher.on('tiresUpdated', () => {
			this.onTiresUpdated();
		})
	},
	render: function() {
		//function to display each retired tire set
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
		//function to display each active tire set
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
		var events = this.state.events.map((Event) => {
			var car = Event.get('car');
			var tires = Event.get('tires');
			//adds an embedded video and a link if a video was saved with the event, otherwise it displays nothing
			var video = Event.get('videoLink') !== '' ? <a href={Event.get('videoLink')}>Video Link</a>: <br />;
			var videoCode = Event.get('videoLink').split('=');
			var embeddedVideo = Event.get('videoLink') !== '' ? <iframe src={"http://www.youtube.com/embed/"+videoCode[1]} frameBorder="0" 
				width="640" height="360" allowFullScreen></iframe>: <br />;
			var date = Event.get('createdAt').toString().slice(0, 15);
			return(
				<div key={Event.id} className="eventBox">
					<h5><strong><i>Added on: {date}</i></strong></h5>
					<h4>Event Location: {Event.get('location')}</h4>
					<h5>{car.get('carClass')+' - '+car.get('make')+' '+car.get('model')}</h5>
					<a href={'#tireInfo/'+tires.id}>Tires:  {tires.get('brand')+' '+tires.get('model')}</a>
					<p>{Event.get('eventComments')}</p>
					{video}
					{embeddedVideo}
				</div>
			)
		}).reverse();
		return(
			<div className="container-fluid userContainer">
				<div className="row buttonContainer">
					<div className="col-sm-3">
		                <button type="button" className="btn btn-primary userButton" onClick={this.onAddCarModal}>Add Car</button>
		                <div ref="addCarBox" className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog">
		                    <div className="modal-dialog modal-sm">
		                        <div className="modal-content">
		                            <AddCarComponent dispatcher={this.dispatcher}/>
		                        </div>
		                    </div>
		                </div>
		            </div>   
		            <div className="col-sm-3">
			            <button type="button" className="btn btn-primary userButton" onClick={this.onAddEventModal}>Add Event</button>
		                <div ref="addEventBox" className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog">
		                    <div className="modal-dialog modal-sm">
		                        <div className="modal-content">
		                            <AddEventComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
		                        </div>
		                    </div> 
		                </div> 
	                </div> 
	                <div className="col-sm-3">
			            <button type="button" className="btn btn-primary userButton" onClick={this.onEditCarModal}>Edit Car Info</button>
		                <div ref="editCarBox" className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog">
		                    <div className="modal-dialog modal-sm">
		                        <div className="modal-content">
		                            <EditCarComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
		                        </div>
		                    </div>
		                </div>
	                </div> 
	                <div className="col-sm-3">
			            <button type="button" className="btn btn-primary userButton" onClick={this.onUpdateTiresModal}>Add Tire Info</button>
		                <div ref="updateTiresBox" className="modal fade bs-example-modal-sm" tabIndex="-1" role="dialog">
		                    <div className="modal-dialog modal-sm">
		                        <div className="modal-content">
		                            <AddUpdateTireComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
		                        </div>
		                    </div>
		                </div>
	                </div>
	            </div>
	            <div className="row userPage">
		            <div className="col-md-2">
						<h2 className="activeTires">Active Tires</h2>
						{activeTires}				
						<h2>Retired Tires</h2>						
						{retiredTires}						
			        </div> 
			        <div className="col-md-10">
			        	<h2>Your Recent Events</h2>
						{events}
					</div>
				</div>
			</div>
		)
	},
	onAddCarModal: function() {
        $(this.refs.addCarBox).modal('show');       
    },
    onAddEventModal: function() {
        $(this.refs.addEventBox).modal('show');       
    },
    onEditCarModal: function() {
        $(this.refs.editCarBox).modal('show');       
    },
    onUpdateTiresModal: function() {
    	$(this.refs.updateTiresBox).modal('show'); 
    },
    onCarAdded: function() {
    	$(this.refs.addCarBox).modal('hide');
    },
    onEventAdded: function() {
    	$(this.refs.addEventBox).modal('hide');
    },
    onCarEdited: function() {
    	$(this.refs.editCarBox).modal('hide');
    	this.updateState;
    },
    onTiresUpdated: function() {
    	$(this.refs.updateTiresBox).modal('hide');
    }
})