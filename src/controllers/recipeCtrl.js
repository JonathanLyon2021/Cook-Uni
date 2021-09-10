export default class Recipe {
	getHome() {
		const viewData = { loggedIn, msgs, ...sharedData };
		
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
