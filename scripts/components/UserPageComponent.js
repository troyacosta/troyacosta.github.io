// this component has several other components passed into it for rendering. It will also display most of the user's information.
var React = require('react');
var EventModel = require('../models/EventModel');
var CarModel = require('../models/CarModel');
var TireSetModel = require('../models/TireSetModel')
var AddCarComponent = require('./AddCarComponent');
var AddEventComponent = require('./AddEventComponent');
var EditCarComponent = require('./EditCarComponent');
var AddUpdateTireComponent = require('./AddUpdateTireComponent');
var Backbone = require('backbone');
var _ = require('../../node_modules/backbone/node_modules/underscore/underscore-min.js');

module.exports = React.createClass({
	getInitialState: function() {
	    return ({
	    	cars: [],
	        events: []
	    });
	},
	componentWillMount: function() {
		var query = new Parse.Query(CarModel);
		query.include('user');
		query.equalTo('user', new Parse.User({objectId: this.props.userId}));
		query.find().then( (cars) => {
			this.setState({cars: cars});
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
		var cars = this.state.cars.map( (car) => {
			return(
				<div className="col-xs-6 col-sm-3 col-md-4">
					<div><a href="#">{car.get('make')+' '+car.get('model')}</a></div>
				</div>)
		})
		return(
			<div>
				<div className="col-xs-6 col-sm-3 col-md-4">
					{cars}
				</div>
				<div className="col-xs-6 col-sm-3 col-md-4">
					<h3></h3>
	                <button type="button" className="btn btn-primary" onClick={this.onAddCarModal}>Add Car</button>
	                <div ref="addCarBox" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
	                    <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <AddCarComponent dispatcher={this.dispatcher}/>
                            </div>
	                    </div>
	                </div>      
		        </div>
		        <div className="col-xs-6 col-sm-3 col-md-4">
		            <h3></h3>
		            <button type="button" className="btn btn-primary" onClick={this.onAddEventModal}>Add Event</button>
                    <div ref="addEventBox" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <AddEventComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
                            </div>
                        </div>
                    </div>     
		        </div>
		        <div className="col-xs-6 col-sm-3 col-md-4">
		            <h3></h3>
		            <button type="button" className="btn btn-primary" onClick={this.onEditCarModal}>Edit Car Info</button>
                    <div ref="editCarBox" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <EditCarComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
                            </div>
                        </div>
                    </div>     
		        </div>
		          <div className="col-xs-6 col-sm-3 col-md-4">
		            <h3></h3>
		            <button type="button" className="btn btn-primary" onClick={this.onUpdateTiresModal}>Add/Update Tire Info</button>
                    <div ref="updateTiresBox" className="modal fade bs-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <AddUpdateTireComponent dispatcher={this.dispatcher} userId={this.props.userId}/>
                            </div>
                        </div>
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
    },
    onTiresUpdated: function() {
    	$(this.refs.updateTiresBox).modal('hide');
    }
})