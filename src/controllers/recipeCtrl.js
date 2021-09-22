export default class Recipe {
	getHome() {
		const viewData = { loggedIn, msgs, ...sharedData };
		if (allRecipes.length > 0) {
			viewData.allRecipes = allRecipes;
		} else {
			viewData.allRecipes = [];
		}
		console.log(viewData);
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/app/home.hbs", viewData).swap();
			// clearStates();
		});
	}

	getShare() {
		const viewData = { loggedIn, msgs, ...sharedData };
		console.log(viewData);
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/app/share.hbs", viewData).swap();
			// clearStates();
		});
	}

	postHandleShare() {
		msgs = [];
		const {
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category,
		} = this.params;
		let isValid = true;

		if (!meal) {
			msgs.push({ msg: "Meal Required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isLength(meal, { min: 4 })) {
			msgs.push({
				msg: "Meal must be 4 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
		}

		let ingredientsArray = ingredients.split(", ");

		if (ingredientsArray.length < 2) {
			msgs.push({
				msg: "Minimun 2 ingredients required",
				class: "alert-danger",
			});
			isValid = false;
		}

		if (!prepMethod) {
			msgs.push({ msg: "Prep Method Required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isLength(prepMethod, { min: 10 })) {
			msgs.push({
				msg: "Prep method must be at least 10 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
		}

		if (!description) {
			msgs.push({ msg: "Description Required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isLength(description, { min: 10 })) {
			msgs.push({
				msg: "Description must be at least 10 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
		}

		if (!foodImageURL) {
			msgs.push({ msg: "URL Required", class: "alert-danger" });
			isValid = false;
		} else if (!validator.isURL(foodImageURL)) {
			msgs.push({
				msg: "Food URL should start with http:// or https://",
				class: "alert-danger",
			});
			isValid = false;
		}

		if (!isValid) {
			this.redirect("#/Share");

			return;
		}
		let serverData = { ...this.params };
		serverData.ingredients = ingredientsArray;

		// sharedData.isLoading = true;
		// this.redirect("#/");
		db.post("recipes", serverData, sessionStorage.getItem("loggedIn"))
			.then((res) => {
				msgs.push({
					msg: "Receipe created successful",
					class: "alert-success",
				});
				//then redirect the user
				this.redirect("#/");
			})
			.catch((err) => {
				//create an error message
				msgs.push({
					msg: "Database Error",
					class: "alert-danger",
				});

				//redirect the user
				this.redirect("#/Share");
			});
	}
}
