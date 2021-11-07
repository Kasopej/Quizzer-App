export default class API_CallerClass {
    async getAllCategories() {
        let categories = [];
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        return categories = data.trivia_categories;
    }

}