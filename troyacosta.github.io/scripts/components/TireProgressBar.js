//this component will track and display the life span of a tire set
var React = require('react');
var TireSetModel = require('../models/TireSetModel');

module.exports = React.createClass({
	getInitialState: function() {
	    return ({
	      	percentage: null,
	      	message: null  	
	    })
	},
	componentWillMount: function() {
		var query = new Parse.Query(TireSetModel);
		query.get(this.props.tiresId).then((tires) => {
			var wearPercentage = null;
			//calculation will be based on whether the tires are street or race tires
			if(tires.get('raceTires') === true) {
				wearPercentage = Math.floor((tires.get('runs')/75)*100);
				this.setState({percentage: wearPercentage});
				if(this.state.percentage < 20) {
					this.setState({message: 'These are awesome!'});
				}
				else if(this.state.percentage > 20 && this.state.percentage < 40) {
					this.setState({message: 'They\'re decent, but you\'re not winning a championship with them'});
				}
				else if(this.state.percentage > 41 && this.state.percentage < 65) {
					this.setState({message: 'Closer to being dead than being alive'});
				}
				else {
					this.setState({message: 'You should be sending Tire Rack an order right now.'});
				}
			}
			if(tires.get('raceTires') === false) {
				wearPercentage = Math.round((tires.get('runs')/130)*100);
				this.setState({percentage: wearPercentage});
				if(this.state.percentage < 50) {
					this.setState({message: 'These are awesome!'});
				}
				else if(this.state.percentage > 50 && this.state.percentage < 75) {
					this.setState({message: 'They\'re decent, but you\'re not winning a championship with them'});
				}
				else if(this.state.percentage > 76 && this.state.percentage < 110) {
					this.setState({message: 'Closer to being dead than being alive'});
				}
				else {
					this.setState({message: 'You should be sending Tire Rack an order right now.'});
				}
			}
		})
	},
	render: function() {
		var wearPercentage = this.state.percentage;
		return(
			<div className="container-flluid">
				<div className='progress'>
					<div className='progress-bar'
						role='progressbar'
						aria-valuemin='0'
						aria-valuemax='100'
						style={{width: wearPercentage+'%'}}>
						{wearPercentage}%
					</div>
				</div>
				<h4>{this.state.message}</h4>
			</div>
		)
	}
})