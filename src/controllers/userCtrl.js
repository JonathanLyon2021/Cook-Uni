// import { loginValidation } from "../validation.js";

export default class User {
	getRegistration() {
		const viewData = { loggedIn, msgs };
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
		const { firstName, lastName, username, password, repeatPassword } =
			this.params;

		if (!firstName) {
			msgs.push({ msg: "Firstname Required", class: "alert-danger" });
		}
		if (!lastName) {
			msgs.push({ msg: "Lastname Required", class: "alert-danger" });
		}
		if (!username) {
			msgs.push({ msg: "Username Required", class: "alert-danger" });
		}
		if (!password) {
			msgs.push({ msg: "Password Required", class: "alert-danger" });
		}
		if (!repeatPassword) {
			msgs.push({
				msg: "Repeat Password Required",
				class: "alert-danger",
			});
		}
		if (!validator.equals(password, repeatPassword)) {
			msgs.push({ msg: "Passwords do not match", class: "alert-danger" });
		}
		if (msgs.length !== 0) {
			this.redirect("#/Registration");

			return;
		}

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
				this.redirect("#/Signup");
			});
	}
	getLogin() {
		const viewData = { loggedIn, msgs };
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/users/login.hbs", viewData).swap();
			msgs = [];
		});
	}

	postlogin() {
		msgs = [];
		const { username, password } = this.params;
		let isValid = true;

		if (!username) {
			msgs.push({ msg: "Username Required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isLength(username, { min: 3 })) {
			msgs.push({
				msg: "Username must be 3 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
		}
		if (!password) {
			msgs.push({ msg: "Password required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isLength(password, { min: 6, max: 15 })) {
			msgs.push({
				msg: "Password must be 6 - 15 characters",
				class: "alert-danger",
			});
			isValid = false;
		}
		if (!isValid) {
			this.redirect("#/Signin");

			return;
		}
		sharedData.isLoading = true;
		this.redirect("#/");
		db.login(this.params)
			.then((res) => {
				loggedIn = true;
				sharedData.isLoading = false;

				sessionStorage.setItem("userId", res._id);
				sessionStorage.setItem("firstName", res.firstName);
				sessionStorage.setItem("lastName", res.lastName);
				sessionStorage.setItem("loggedIn", res._kmd.authtoken);

				const firstName = sessionStorage.getItem("firstName");
				const lastName = sessionStorage.getItem("lastName");

				navData.username = `${firstName} ${lastName}`;
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
