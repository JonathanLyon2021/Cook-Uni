export default class User {
	getRegistration() {
		const viewData = { loggedIn };
		console.log(viewData);
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/users/signup.hbs", viewData).swap();
			// clearStates();
		});
	}

	postRegistration() {
		console.log("postRegistration");
		const { firstName, lastName, username, password, repeatPassword } =
			this.params;
		db.signup(this.params)
			.then((res) => {
				//create a success message
				msgs.push({
					msg: "User Registration Successful",
					class: "alert-success",
				});
				//then redirect the user
				this.redirect("#/Signin");
			})
			.catch((err) => {
				//create an error message
				msgs.push({
					msg: "Invalid Credentials",
					class: "alert-danger",
				});

				//redirect the user
				// this.redirect("#/Signup")
			});
	}
	getLogin() {
		const viewData = { loggedIn, msgs };
		console.log(viewData);
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/users/login.hbs", viewData).swap();
			// clearStates();
		});
	}

	postlogin() {
		console.log("postlogin");
		// const { username, password } = this.params;
		db.login(this.params)
			.then((res) => {
				console.log(res);
				loggedIn = true;
				sessionStorage.setItem("userId", res._id);
				sessionStorage.setItem("firstName", res.firstName);
				sessionStorage.setItem("lastName", res.lastName);
				sessionStorage.setItem("loggedIn", res._kmd.authtoken);

				const firstName = sessionStorage.getItem("firstName");
				const lastName = sessionStorage.getItem("lastName");

				sharedData.username = `${firstName} ${lastName}`;
				//create a successful login message
				msgs.push({
					msg: "Login Successful",
					class: "alert-success",
				});
				//then redirect the user
				this.redirect("#/");
			})
			.catch((err) => {
				//create an error message
				msgs.push({
					msg: "Invalid Credentials",
					class: "alert-danger",
				});

				//redirect the user
				this.redirect("#/Signin");
			});
	}

	getLogout() {
		const token = sessionStorage.getItem("loggedIn");
		console.log(token);
		db.logout(token)
			.then((res) => {
				msgs = [];
				msgs.push({
					msg: "Logout Successful",
					class: "alert-success",
				});
				sharedData = {};
				sessionStorage.removeItem("userId");
				sessionStorage.removeItem("firstName");
				sessionStorage.removeItem("lastName");
				sessionStorage.removeItem("loggedIn");
				loggedIn = false;
				this.redirect("#/Signin");
			})
			.catch((err) => {
				msgs.push({
					msg: err.statusText,
					class: "alert-danger",
				});
				this.redirect("#/");
			});
	}
}
