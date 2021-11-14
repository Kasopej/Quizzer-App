export default class RouterService {
    goToRoute(route) {
        location = location.origin + '/' + route;
    }
    routeToOrigin() {
        location = location.origin
    }
    redirect(route) {
        location.replace = location.origin + route;
    }
}