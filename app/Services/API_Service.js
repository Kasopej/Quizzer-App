export default class API_ServiceClass {
    async fetchData(url) {
        const response = await fetch(url)
        const resolvedData = await response.json();
        return resolvedData.trivia_categories
    }
    post() { }
    update() { }
    delete() { }
}