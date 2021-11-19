let categoryselect = document.getElementById('categorySelect');
let questnoEl = document.getElementById('quesno');
let difficultySelect = document.getElementById('difficultySelect');
let typeSelectEl = document.getElementById('typeSelect');
let difficulty;
let category;
let categoryText;
let type;
let newurlEl = document.getElementById('newurl');
let username = document.getElementById('username');
let submitBtnEl = document.getElementById('submitBtn');
let candidateInfo = {};
let defaultOption = document.createElement('option');
let amountofquestionEl = document.getElementById('amountofquestion');
let usersemail = document.getElementById('usersemail');
defaultOption.text = 'Choose Prefered category';
categoryselect.add(defaultOption);
async function setCaterogies(){
    let url = 'https://opentdb.com/api_category.php';
    try{
       let res = await fetch(url);
       return await res.json();
    }catch (error){
        console.log(error);
    }
}
async function getCaterogies(){
    let response = await setCaterogies();
    let option;
    for(let i = 0; i < response.trivia_categories.length; i++){
        option = document.createElement('option');
        option.text = response.trivia_categories[i].name;
        option.value = response.trivia_categories[i].id;
        categoryselect.add(option); 
    }  
    localStorage.setItem('categoryId', category);
   return category;      
}

submitBtnEl.addEventListener('click', function (){
    let amount = amountofquestionEl.value;
    let user = usersemail.value;
    categoryText = categoryselect.options[categoryselect.selectedIndex].text;
    candidateInfo.categorySelection = categoryText;
    category = categoryselect.options[categoryselect.selectedIndex].value;
    candidateInfo.categoryid=category;
    candidateInfo.NumberofQuestion= amount;
    difficulty = difficultySelect.options[difficultySelect.selectedIndex].value;
    type = typeSelectEl.options[typeSelectEl.selectedIndex].value;
    candidateInfo.choiceSelection = type;
    candidateInfo.difficultSelect = difficulty;
    localStorage.setItem('CANDIDATEINFO', JSON.stringify(candidateInfo));
    let hreflocal = location.href;
    let newhref =  hreflocal.replace('config.html?', 'quiz.html?');
    console.log(categoryText);
    console.log(candidateInfo); 
    let individualuser = user.split(',')
    console.log(user) 
    for(let i =0; i < individualuser.length; i++){
       let dualuser =individualuser[i];
       let createUrl = new URL (location.origin + '/quiz.html');
        createUrl.searchParams.append('dualuser', dualuser);
        createUrl.searchParams.append('amount',amount);
        createUrl.searchParams.append('category', category);
        createUrl.searchParams.append('difficulty', difficulty);
        createUrl.searchParams.append('type', type);
        console.log(individualuser);
        alert(createUrl.href);
        console.log(createUrl.href);
    }
})

getCaterogies();
