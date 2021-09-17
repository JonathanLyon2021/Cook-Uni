export default class Recipe {
	getHome() {
		const viewData = { loggedIn, msgs, ...sharedData };
		if(allRecipes.length >0){
			viewData.allRecipes = allRecipes;
		}
		else {
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
}
