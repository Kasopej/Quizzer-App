class RouterError extends Error {
    constructor(message) {
        super(message);
        this.name = "Router Error"
    }
}

export default class RouterService {
    goToRoute(route) {
        try {
            if (route == undefined) throw new RouterError('specified path is undefined')
            location = location.origin + '/' + route;
        } catch (error) {
            if (error instanceof RouterError) console.log(error);
        }

    }
    routeToOrigin() {
        location = location.origin
    }
    redirect(route = '') {
        location.replace(location.origin + '/' + route);
    }
}