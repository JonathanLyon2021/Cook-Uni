import Recipe from "./controllers/recipeCtrl";
import User from "./controllers/userCtrl";
import Kinvey from "./helpers/kinvey";

//determine wether or not the user is logged in
window.loggedIn = false;
window.db = new Kinvey("kid_HygXSUrft", "018f8ac64fd04124820f30424c08d9e6");
window.msgs = [];
window.sharedData = {};
window.allRecipes = [];
window.isLoading = false;


const app = Sammy("#rooter", function () {
	this.use("Handlebars", "hbs");
	const recipeCtrl = new Recipe();
	const userCtrl = new User();

	db.get("recipes", null, { username: "guest", password: "guest" }).then(
		(data) => {
			allRecipes = data;
		}
	);
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

	// @route    GET  /
	// @desc     render to the login page
	// @access   Public
	this.get("#/Signin", userCtrl.getLogin);

	// @route    POST  /
	// @desc     allows user to sign in
	// @access   Private
	this.post("#/Postlogin", userCtrl.postlogin);

	// @route    GET  /
	// @desc     logout
	// @access   Private
	this.get("#/Logout", userCtrl.getLogout);

	// @route    GET  /
	// @desc    share recipe
	// @access   Private
	this.get("#/Share", recipeCtrl.getShare);

	// @route    POST  /
	// @desc     allows user to post/share recipe
	// @access   Private
	this.post("#/handleShare", recipeCtrl.postHandleShare);

	// @route    GET  /
	// @desc    getting the details of the recipe
	// @access   Private
	this.get("#/details/:id", recipeCtrl.getDetails);
	
	// @route    GET  /
	// @desc    delete recipe
	// @access   Private
	this.get("#/archive/:id", recipeCtrl.getArchive);

	// @route    POST  /
	// @desc     likes counter
	// @access   Private
	this.get("#/likes/:id", recipeCtrl.getLikes);
});

app.run("#/");
