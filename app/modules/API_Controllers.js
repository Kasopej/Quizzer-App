export default class API_CallerClass {
    async getAllCategories() {
        let categories = [];
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        return categories = data.trivia_categories;
    }
    async numberOfQuestionsInCategory(categoryID) {
        const response = await fetch(`https://opentdb.com/api_count.php?category=${categoryID}`);
        const data = await response.json();
        const numberOfQuestions = await data.category_question_count;
        return numberOfQuestions;
    }

}