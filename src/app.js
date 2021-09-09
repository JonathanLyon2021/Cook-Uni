import Recipe from "./controllers/recipeCtrl";
import User from "./controllers/userCtrl";
import Kinvey from "./helpers/kinvey";

//determine wether or not the user is logged in
window.loggedIn = false;
window.db = new Kinvey("kid_HygXSUrft", "018f8ac64fd04124820f30424c08d9e6");
window.msgs = [];


const app = Sammy("#rooter", function () {
	this.use("Handlebars", "hbs");
	const recipeCtrl = new Recipe();
	const userCtrl = new User();
    
	// @route    GET  /
	// @desc     render Home Page for a logged-In user
	// @access   Public
	this.get("#/", recipeCtrl.getHome);

	// @route    GET  /
	// @desc     render the registration page for user
	// @access   Public
	this.get("#/Registration", userCtrl.getRegistration);

	// @route    POST  /
	// @desc     allows user to sign up, sends data to database
	// @access   Public
	this.post("#/Signup", userCtrl.postRegistration);
});

app.run("#/");
