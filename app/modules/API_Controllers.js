export default class API_CallerClass {
    async getAllCategories(url) {
        let categories = [];
        const response = await fetch(url);
        const data = await response.json();
        return categories = data.trivia_categories;
    }
    async numberOfQuestionsInCategory(url, categoryID) {
        const response = await fetch(`${url}${categoryID}`);
        const data = await response.json();
        const numberOfQuestions = await data.category_question_count;
        return numberOfQuestions;
    }

}