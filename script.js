const main_screen = document.getElementById("main");
const body = document.getElementById("body");
const rand_main = document.getElementById("randmain");
const favPanel = document.getElementById("fav_meals");
// localStorage.setItem("fav","[]");
async function random() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const randomData = await res.json();
    addMeal(randomData)
}
const getDatabyID = async (id) => {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const data = await res.json();
    return data;
}
const getDataBySearch = async () => {
    const searchValue = document.getElementById("search_area").value;
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchValue);
    const data = await res.json();
    main_screen.innerHTML = "";
    data.meals.forEach(meals => {
        addMealonsearch(meals);
    });
}
const addMeal = (randomData) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="randommeal">
        <p>Random Meal</p>
        <img src="${randomData.meals[0].strMealThumb}" alt="${randomData.meals[0].strMeal}" id="mid${randomData.meals[0].idMeal}">
        <div class="meal__container_title">
            <h3>${randomData.meals[0].strMeal}</h3>
            <button id="favbtn"><i class="fa-solid fa-heart"></i></button>
        </div>
    </div>`;
    rand_main.innerHTML = "";
    rand_main.appendChild(div);
    const favbtn = document.getElementById("favbtn");
    favbtn.addEventListener("click", () => {
        if (favbtn.classList.contains("active")) {
            removefav(randomData.meals[0].idMeal)
            favbtn.classList.remove("active");
        }
        else {
            addfav(randomData.meals[0].idMeal)
            favbtn.classList.add("active");
        }
    })
    const selected_div = document.getElementById("mid" + randomData.meals[0].idMeal);
    selected_div.addEventListener("click", () => {
        showRecipe(randomData.meals[0].idMeal)
    });
}
const addMealonsearch = (Data) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="randommeal">
    <img src="${Data.strMealThumb}" alt="${Data.strMeal}" id= 'mid${Data.idMeal}'>
        <div class="meal__container_title">
            <h3>${Data.strMeal}</h3>
            <button id="h${Data.idMeal}"><i class="fa-solid fa-heart"></i></button>
        </div>
    </div>`;
    main_screen.appendChild(div);
    const favbtn = document.getElementById("h" + Data.idMeal);
    favbtn.addEventListener("click", () => {
        if (favbtn.classList.contains("active")) {
            removefav(Data.idMeal)
            favbtn.classList.remove("active");
        }
        else {
            addfav(Data.idMeal)
            favbtn.classList.add("active");
        }
    })
    const selected_div = document.getElementById('mid' + Data.idMeal);
    selected_div.addEventListener("click", () => {
        showRecipe(Data.idMeal);
        scrollToTop();
    });
}
const addfav = (id) => {
    const mealIds = getMealsLS();
    localStorage.setItem("fav", JSON.stringify([...mealIds,id]));
    printFav()
}
function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("fav"));
    return mealIds === null ? [] : mealIds;
}
const removefav = (id) => {
    let fav_array = JSON.parse(localStorage.getItem("fav"));
    fav_array = fav_array.filter((a) => a !== id);
    localStorage.setItem("fav", JSON.stringify(fav_array))
    printFav()
}
const printFav = () => {
    favPanel.innerHTML = "";
    const fav_array = JSON.parse(localStorage.getItem("fav"));
    fav_array.forEach(async (id) => {
        const data = await getDatabyID(id);
        const div = document.createElement("div")
        div.innerHTML = `
        <div class="favmeal" id="${data.meals[0].idMeal}">
            <img src="${data.meals[0].strMealThumb}" alt="${data.meals[0].strMeal}" id="fid${id}">
            <span>${data.meals[0].strMeal}</span>
            <button class="xmark" id="x${id}"><i class="fa-solid fa-xmark"></i></button>
        </div>`;
        favPanel.appendChild(div);
        const selected_div = document.getElementById("fid" + id);
        selected_div.addEventListener("click", () => {
            showRecipe(id)
        });
        const xmark = document.getElementById("x" + id);
        xmark.addEventListener("click", () => {
            removefav(id);
        })
    });
}
const showRecipe = async (id) => {
    const res = await getDatabyID(id);
    const recipeData = await res.meals[0];

    const div = document.createElement("div");
    div.classList.add("infoPop")

    div.innerHTML =
        `   <button id="closeBtn"><i class="fa-solid fa-xmark"></i></button>
        <img src="${recipeData.strMealThumb}" alt="${recipeData.strMeal}">
        <div class="infoPop_name">${recipeData.strMeal}</div>
        <div class="infoPop_recipe">${recipeData.strInstructions}</div>
        <div class="infoPop_ingre" id="ingredients">
            <ul id="ingre_li">Ingredients</ul>
        </div>`;
    body.appendChild(div);
    const ul = document.getElementById('ingre_li')
    for (i = 1; i < 21; i++) {
        if (recipeData["strIngredient" + i] === "")
            break;
        const li = document.createElement("li");
        li.innerHTML = recipeData["strIngredient" + i] + " - " + recipeData["strMeasure" + i];
        ul.appendChild(li);
    }
    const close = document.getElementById("closeBtn");
    close.addEventListener("click", () => { body.removeChild(body.lastChild)});
}
console.log(body);
random();
setInterval(random, 60000)
printFav();
function scrollToTop(){
    var timerHandle = setInterval(function() {
      if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0)
      window.scrollBy(0,-50); else clearInterval(timerHandle); },1);
    }