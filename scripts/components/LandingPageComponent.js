var React = require('react');

module.exports = React.createClass({
	render: function() {
		return(
			<section>
				<main>
					  <div className="hero">
					    <h1><i>Track It!</i></h1>
					    <p>Keep track of your autocross events, right here, right now!</p>
					    <img src="../images/race-track.jpg"/>
					     <div className="bar"></div>
					  </div> 
				</main>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-4 icons">
							<a href="http://www.spokes.org/">
								<img src="../images/helmet.png" height="100px" width="100px" />
								<h3>Texas Spokes Sports Car Club</h3>
								<h4>The Texas Spokes Sports Car Club is based in Autin, Texas and is the premire autocross
									club in Central Texas.</h4>
							</a>
						</div>
						<div className="col-md-4 icons">
							<a href="http://www.scca.com/">
								<img src="../images/race-car.png" height="100px" width="100px" />
								<h3>The Sports Car Club of America</h3>
								<h4>The SportsCAr Club of America is your one stop shop for all things road racing, time trails and autocross.</h4>
							</a>
						</div>
						<div className="col-md-4 icons">
							<a href="http://www.tirerack.com/">
								<img src="../images/tire.png" height="100px" width="100px" />
								<h3>The Tire Rack</h3>
								<h4>The Tire Rack has been a long time sponsor of the SCCA Solo Program. Shop here for all your
									tire needs.</h4>
							</a>
						</div>
					</div>
				</div>
			</section>
		)
	}
})