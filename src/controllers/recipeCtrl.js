export default class Recipe {
	getHome() {
		const viewData = { loggedIn, msgs, ...sharedData, ...navData };
		if (allRecipes.length > 0) {
			viewData.allRecipes = allRecipes;
		} else {
			viewData.allRecipes = [];
		}
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
		const viewData = { loggedIn, msgs, editMode: false, ...navData };
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
		let {
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category,
		} = this.params;
		let categoryImageURL = "";
		switch (category) {
			case "Vegetables and legumes/beans":
				categoryImageURL =
					"https://thumbs.dreamstime.com/z/various-assortment-legumes-beans-soy-chickpeas-lentils-green-peas-healthy-eating-concept-vegetable-proteins-dark-concrete-131501584.jpg";
				break;
			case "Fruits":
				categoryImageURL =
					"https://media.istockphoto.com/photos/fresh-mixed-fruits-picture-id467652436?b=1&k=20&m=467652436&s=170667a&w=0&h=SgDVjLV5rfJ-kJ80GYcQJ4CL1R0n4LoxTYXixnSZuWs=";
				break;
			case "Grain Food":
				categoryImageURL =
					"https://media-cldnry.s-nbcnews.com/image/upload/t_fit-2000w,f_auto,q_auto:best/newscms/2020_22/1574082/whole-grain-bread-te-main2-200528.jpg";
				break;
			case "Milk, cheese, eggs and alternatives":
				categoryImageURL =
					"https://media.wsimag.com/attachments/e93e9eb9c2850d7ffe69d0383ed27baf224eafd3/store/fill/690/388/35defd11ef8de6b2a0af60645188fd44f1fdcc1e7ed397421e56f58cd7c7/Eggs-milk-and-cheese.jpg";
				break;
			case "Lean meats and poultry, fish and alternatives":
				categoryImageURL =
					"https://www.eatforhealth.gov.au/sites/default/files/images/the_guidelines/lean_meats_food_group_75650673_8_web.jpg";
				break;
			default:
				categoryImageURL = "Select category...";
				break;
		}

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
				msg: "Minimum of 2 ingredients required",
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

		if (category == "Select category...") {
			msgs.push({ msg: "Category Required", class: "alert-danger" });
			isValid = false;
		}

		if (!isValid) {
			this.redirect("#/Share");

			return;
		}
		let serverData = { ...this.params };//all the users data they just filled in
		serverData.ingredients = ingredientsArray;
		serverData.likesCounter = 0;
		serverData.categoryImageURL = categoryImageURL;

		db.post("recipes", serverData, sessionStorage.getItem("loggedIn"))
			.then((res) => {
				msgs.push({
					msg: "Receipe created successful",
					class: "alert-success",
				});
				//update all recipes array
				allRecipes.push({ ...serverData, _id: res._id });
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
	getDetails() {
		let viewRecipe = allRecipes.find(
			(item) => item._id.toString() === this.params.id
		);
		const viewData = { loggedIn, msgs, ...navData, ...viewRecipe };
		sharedData = {};
		sharedData.foodImageURL;
		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/app/details.hbs", viewData).swap();
			// clearStates();
		});
	}
	getArchive() {
		const id = this.params.id;
		db.delete("recipes", id, sessionStorage.getItem("loggedIn")).then(
			() => {
				// remove the recipe from the allRecipes array
				allRecipes = allRecipes.filter((recipe) => recipe._id !== id);
				this.redirect("#/");
				msgs.push({
					msg: "Your recipe was archived",
					class: "alert-success",
				});
			}
		);
	}

	getLikes() {
		const id = this.params.id;
		const findRecipe = allRecipes.find((recipe) => recipe._id == id);
		findRecipe.likesCounter = findRecipe.likesCounter += 1;
		db.edit("recipes", id, findRecipe, sessionStorage.getItem("loggedIn"))
			.then((res) => {
				msgs.push({
					msg: "You liked that recipe.",
					class: "alert-success",
				});
				let index = allRecipes.findIndex((recipe) => recipe._id == id);
				allRecipes[index] = { ...findRecipe, _id: id };
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
				this.redirect("#/");
			});
	}
	getEditShare() {
		let id = this.params.id;
		const findRecipe = allRecipes.find((recipe) => recipe._id == id);
		const viewData = {
			loggedIn,
			msgs,
			editMode: true,
			id: findRecipe._id,
			...navData,
		};
		if (msgCounter > 0) {
			viewData.meal = sharedData.meal;
			viewData.prepMethod = sharedData.prepMethod;
			viewData.description = sharedData.description;
			viewData.foodImageURL = sharedData.foodImageURL;
			viewData.category = sharedData.category;
			viewData.ingredients = sharedData.ingredients;
		} else {
			viewData.meal = findRecipe.meal;
			viewData.prepMethod = findRecipe.prepMethod;
			viewData.description = findRecipe.description;
			viewData.foodImageURL = findRecipe.foodImageURL;
			viewData.category = findRecipe.category;
			viewData.ingredients = findRecipe.ingredients;
		}

		this.loadPartials({
			navbar: "../views/partials/navbar.hbs",
			notifications: "../views/partials/notifications.hbs",
			footer: "../views/partials/footer.hbs",
		}).then(function () {
			this.render("../views/app/share.hbs", viewData).swap();
			// clearStates();
		});
	}
	postEditShare() {
		msgs = [];
		let {
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category,
			id,
		} = this.params;
		sharedData = {
			meal,
			ingredients,
			prepMethod,
			description,
			foodImageURL,
			category,
			id,
		};
		msgCounter = 0;
		let categoryImageURL = "";
		switch (category) {
			case "Vegetables and legumes/beans":
				categoryImageURL =
					"https://thumbs.dreamstime.com/z/various-assortment-legumes-beans-soy-chickpeas-lentils-green-peas-healthy-eating-concept-vegetable-proteins-dark-concrete-131501584.jpg";
				break;
			case "Fruits":
				categoryImageURL =
					"https://media.istockphoto.com/photos/fresh-mixed-fruits-picture-id467652436?b=1&k=20&m=467652436&s=170667a&w=0&h=SgDVjLV5rfJ-kJ80GYcQJ4CL1R0n4LoxTYXixnSZuWs=";
				break;
			case "Grain Food":
				categoryImageURL =
					"https://media-cldnry.s-nbcnews.com/image/upload/t_fit-2000w,f_auto,q_auto:best/newscms/2020_22/1574082/whole-grain-bread-te-main2-200528.jpg";
				break;
			case "Milk, cheese, eggs and alternatives":
				categoryImageURL =
					"https://media.wsimag.com/attachments/e93e9eb9c2850d7ffe69d0383ed27baf224eafd3/store/fill/690/388/35defd11ef8de6b2a0af60645188fd44f1fdcc1e7ed397421e56f58cd7c7/Eggs-milk-and-cheese.jpg";
				break;
			case "Lean meats and poultry, fish and alternatives":
				categoryImageURL =
					"https://www.eatforhealth.gov.au/sites/default/files/images/the_guidelines/lean_meats_food_group_75650673_8_web.jpg";
				break;
			default:
				categoryImageURL = "Select category...";
				break;
		}

		let isValid = true;

		if (!meal) {
			msgs.push({ msg: "Meal Required", class: "alert-danger" });
			isValid = false;
			msgCounter++;
		} else if (!validator.isLength(meal, { min: 4 })) {
			msgs.push({
				msg: "Meal must be 4 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
			msgCounter++;
		}

		let ingredientsArray = ingredients.split(",");

		if (ingredientsArray.length < 2) {
			msgs.push({
				msg: "Minimum of 2 ingredients required",
				class: "alert-danger",
			});
			isValid = false;
			msgCounter++;
		}

		if (!prepMethod) {
			msgs.push({ msg: "Prep Method Required", class: "alert-danger" });
			isValid = false;
			msgCounter++;
		} else if (!validator.isLength(prepMethod, { min: 10 })) {
			msgs.push({
				msg: "Prep method must be at least 10 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
			msgCounter++;
		}

		if (!description) {
			msgs.push({ msg: "Description Required", class: "alert-danger" });
			isValid = false;
			msgCounter++;
		} else if (!validator.isLength(description, { min: 10 })) {
			msgs.push({
				msg: "Description must be at least 10 characters minimum",
				class: "alert-danger",
			});
			isValid = false;
			msgCounter++;
		}

		if (!foodImageURL) {
			msgs.push({ msg: "URL Required", class: "alert-danger" });
			isValid = false;
			msgCounter++;
		} else if (!validator.isURL(foodImageURL)) {
			msgs.push({
				msg: "Food URL should start with http:// or https://",
				class: "alert-danger",
			});
			isValid = false;
			msgCounter++;
		}

		if (category == "Select category...") {
			msgs.push({ msg: "Category Required", class: "alert-danger" });
			isValid = false;
			msgCounter++;
		}
		if (!isValid) {
			this.redirect(`#/edit/${id}`);

			return;
		}
		let serverData = { ...this.params };//grabbing all the input parameters
		serverData.ingredients = ingredientsArray;
		serverData.likesCounter = 0;
		serverData.categoryImageURL = categoryImageURL;

		db.edit("recipes", id, serverData, sessionStorage.getItem("loggedIn"))

			.then((res) => {
				msgs.push({
					msg: "Recipe updated successfully",
					class: "alert-success",
				});

				//update all recipes array
				// const findRecipe = allRecipes.find((recipe) => recipe._id == id);

				let index = allRecipes.findIndex((recipe) => recipe._id == id);
				allRecipes[index] = { ...res, _id: id };
				
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
				this.redirect(`#/edit/${id}`);
			});
	}
}
