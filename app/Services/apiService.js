export default class API_ServiceClass {
    async fetchData(url) {
        let resolvedData;
        const response = await fetch(url).catch((() => alert('Please check your connection and retry')))
        if (response.ok) { resolvedData = await response.json() }
        else { console.log(`Response status is ${response.ok}`); }
        return resolvedData;
    }
    post() { }
    update() { }
    delete() { }
}