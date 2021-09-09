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
        const {firstName, lastName, username, password, repeatPassword} = this.params;
        db.signup(this.params) 
        .then(res => {
            //create a success message 
            msgs.push({msg: "User Registration Successful", class: "alert-success"});
            //then redirect the user
            this.redirect("#/")
        }) 
        .catch(err => {
            //create an error message
            msgs.push({msg: "Invalid Credentials", class: "alert-danger"});

            //redirect the user
            // this.redirect("#/Signup")

        })
}
}