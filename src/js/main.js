const headerMenuBtn = document.querySelector("#header-menu-btn");
const sidebarOverlay = document.querySelector("#sidebar-overlay");
const sidebar = document.querySelector("#sidebar");
const sidebarCloseBtn = document.querySelector("#sidebar-close-btn");

headerMenuBtn.addEventListener("click", function () {
  sidebarOverlay.classList.add("active");
  sidebar.classList.add("open");
});

function closeSidebar() {
  sidebarOverlay.classList.remove("active");
  sidebar.classList.remove("open");
}

sidebarCloseBtn.addEventListener("click", closeSidebar);
sidebarOverlay.addEventListener("click", closeSidebar);

const sections = document.querySelectorAll("section");
const searchFiltersSection = document.querySelector("#search-filters-section");
const mealCategoriesSection = document.querySelector(
  "#meal-categories-section",
);
const allRecipesSection = document.querySelector("#all-recipes-section");
const recipeDetailModal = document.querySelector("#recipe-detail-modal");
const productsSection = document.querySelector("#products-section");
const foodlogSection = document.querySelector("#foodlog-section");

function hideAllSections() {
  sections.forEach(function (sec) {
    sec.style.display = "none";
  });
}

hideAllSections();
searchFiltersSection.style.display = "block";
mealCategoriesSection.style.display = "block";
allRecipesSection.style.display = "block";

const sectionBtns = document.querySelectorAll("nav ul li a");

function showSection(hash) {
  hideAllSections();

  if (hash === "/meals" || hash === "") {
    searchFiltersSection.style.display = "block";
    mealCategoriesSection.style.display = "block";
    allRecipesSection.style.display = "block";
  } else if (hash === "/products") {
    productsSection.style.display = "block";
  } else if (hash === "/foodlog") {
    foodlogSection.style.display = "block";
    renderFoodLog();
  }
}

const mainTitle = document.querySelector("#main-title");
const mainDescription = document.querySelector("#main-description");

function updateActiveButton(hash) {
  sectionBtns.forEach((btn) => {
    btn.classList.add("text-gray-600", "hover:bg-gray-50");
    btn.classList.remove("bg-emerald-50", "text-emerald-700");
  });

  sectionBtns.forEach((btn) => {
    const btnText = btn.querySelector("span")?.textContent;

    if (hash === "/meals" && btnText?.includes("Meals & Recipes")) {
      btn.classList.add("bg-emerald-50", "text-emerald-700");
      btn.classList.remove("text-gray-600", "hover:bg-gray-50");
      mainTitle.textContent = `Meals & Recipes`;
      mainDescription.textContent = `Discover delicious and nutritious recipes tailored for you`;
    } else if (hash === "/products" && btnText?.includes("Product Scanner")) {
      btn.classList.add("bg-emerald-50", "text-emerald-700");
      btn.classList.remove("text-gray-600", "hover:bg-gray-50");
      mainTitle.textContent = `Product Scanner`;
      mainDescription.textContent = `Search packaged foods by name or barcode`;
    } else if (hash === "/foodlog" && btnText?.includes("Food Log")) {
      btn.classList.add("bg-emerald-50", "text-emerald-700");
      btn.classList.remove("text-gray-600", "hover:bg-gray-50");
      mainTitle.textContent = `Food Log`;
      mainDescription.textContent = `Track your daily nutrition and food intake`;
    }
  });
}

sectionBtns.forEach(function (elem) {
  elem.addEventListener("click", function (e) {
    e.preventDefault();

    const sectionText = e.currentTarget.querySelector("span")?.textContent;
    let newHash = "/meals";

    if (sectionText?.includes("Product Scanner")) {
      newHash = "/products";
    } else if (sectionText?.includes("Food Log")) {
      newHash = "/foodlog";
    }

    window.history.pushState(null, null, "#" + newHash);
    showSection(newHash);
    updateActiveButton(newHash);
  });
});

window.addEventListener("popstate", function () {
  const hash = window.location.hash.slice(1);
  showSection(hash);
  updateActiveButton(hash);
});

document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash.slice(1) || "/meals";
  showSection(hash);
  updateActiveButton(hash);
});

const gridViewBtn = document.querySelector("#grid-view-btn");
const listviewBtn = document.querySelector("#list-view-btn");
const gridViewBtnI = gridViewBtn.querySelector("i");
const listviewBtnI = listviewBtn.querySelector("i");
const recipesGrid = document.querySelector("#recipes-grid");

const appLoadingOverlay = document.querySelector("#app-loading-overlay");

let mealsList = [];
let NutritionList = [];
let ProductsList = [];

async function gitMealsAPI(searchNameAndArea = "") {
  try {
    let url = `https://nutriplan-api.vercel.app/api/meals/search?q=${searchNameAndArea}&page=1&limit=25`;
    let res = await fetch(url);
    let data = await res.json();
    mealsList = data.results;

    // console.log("mealsList", mealsList);
  } catch (error) {
    console.log("gitFirstSectionAPI مشكلة في", error);
  }
}

async function gitNutritionAPI(recipeName, ingredients) {
  try {
    const API_KEY = "jQOV5Pgec5QRxvypMSxINASeh4N7FFngHkgGe9WC";

    let res = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          recipeName: recipeName,
          ingredients: ingredients,
        }),
      },
    );
    let data = await res.json();
    NutritionList = data;
    // console.log("NutritionList", NutritionList);
  } catch (error) {
    console.log("gitSecondSectionAPI مشكلة في", error);
  }
}

const recipescount = document.querySelector("#recipes-count");

function displayMeals() {
  let container = ``;
  for (let i = 0; i < mealsList.length; i++) {
    container += `<div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex-row" data-meal-id="${mealsList[i].id}">
                <div class="relative overflow-hidden h-48">
                  <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${mealsList[i].thumbnail}" alt="${mealsList[i].name}" loading="lazy">
                  <div class="card-data absolute bottom-3 left-3 flex gap-2">
                    <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700" >
                    <path fill="currentColor" d="M32.5 96l0 149.5c0 17 6.7 33.3 18.7 45.3l192 192c25 25 65.5 25 90.5 0L483.2 333.3c25-25 25-65.5 0-90.5l-192-192C279.2 38.7 263 32 246 32L96.5 32c-35.3 0-64 28.7-64 64zm112 16a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>
                      ${mealsList[i].category}
                      
                    </span>
                    <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                    <svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg>
                    ${mealsList[i].area}
                    </span>
                  </div>
                </div>
                <div class="p-4 w-full">
                  <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                  ${mealsList[i].name}
                  </h3>
                  <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    ${mealsList[i].instructions[0]}
                  </p>
                  <div class="card-data-2 flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                      <i class="mr-1 text-emerald-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                    ${mealsList[i].category}
                    </span>
                    <span class="font-semibold text-gray-500">
                      <i class="mr-1 text-blue-500" data-fa-i2svg=""><svg class="svg-inline--fa fa-globe" data-prefix="fas" data-icon="globe" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"></path></svg></i>
                    ${mealsList[i].area}
                    </span>
                  </div>
                </div>
              </div>`;
  }
  recipescount.innerHTML = `Showing ${mealsList.length} recipes`;

  recipesGrid.innerHTML = container;
  if (mealsList.length == 0) {
    recipesGrid.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; margin-top: 40px;">
    <div style="display: flex; justify-content: center; align-items: center; background-color: #F3F4F6; width: 48px; height: 48px; border-radius: 50%; margin: auto; padding: 30px;">
      <i class="text-gray-400" style="font-size: 32px;" data-fa-i2svg=""><svg class="svg-inline--fa fa-magnifying-glass" data-prefix="fas" data-icon="magnifying-glass" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg></i>
    </div>
    <p style="color: #9ca3af; font-size: 16px; margin: 0; margin-top: 12px;">No recipes found. Try a different<br> search term.</p>
  </div>`;
  }
}

function gridBtns() {
  gridViewBtn.addEventListener("click", function () {
    const cardData = document.querySelectorAll(".card-data");
    const cardData2 = document.querySelectorAll(".card-data-2");
    const recipeCard = document.querySelectorAll(".recipe-card");
    const recipeCardImg = document.querySelectorAll(".recipe-card img");

    gridViewBtn.classList.add("bg-white", "shadow-sm");
    gridViewBtnI.classList.add("text-gray-700");
    listviewBtnI.classList.add("text-gray-500");

    listviewBtn.classList.remove("bg-white", "shadow-sm");
    listviewBtnI.classList.remove("text-gray-700");
    gridViewBtnI.classList.remove("text-gray-500");

    recipeCard.forEach(function (card) {
      card.classList.remove("flex");
    });

    recipesGrid.classList.add("grid-cols-4", "gap-5");
    recipesGrid.classList.remove("grid-cols-2", "gap-4");

    cardData2.forEach(function (elem) {
      elem.style.display = "none";
    });

    cardData.forEach(function (elem) {
      elem.style.display = "flex";
    });

    recipeCardImg.forEach(function (img) {
      img.parentElement.classList.add("h-48");
      img.parentElement.classList.remove("w-48", "h-full");
    });
  });

  listviewBtn.addEventListener("click", function () {
    const cardData = document.querySelectorAll(".card-data");
    const cardData2 = document.querySelectorAll(".card-data-2");
    const recipeCard = document.querySelectorAll(".recipe-card");
    const recipeCardImg = document.querySelectorAll(".recipe-card img");

    gridViewBtn.classList.remove("bg-white", "shadow-sm");
    listviewBtn.classList.add("bg-white", "shadow-sm");
    gridViewBtnI.classList.add("text-gray-500");
    gridViewBtnI.classList.remove("text-gray-700");
    listviewBtnI.classList.add("text-gray-700");
    listviewBtnI.classList.remove("text-gray-500");

    recipeCard.forEach(function (card) {
      card.classList.add("flex");
      card.classList.add("flex-row");
    });

    recipesGrid.classList.add("grid-cols-2", "gap-4");
    recipesGrid.classList.remove("grid-cols-4", "gap-5");

    cardData.forEach(function (elem) {
      elem.style.display = "none";
    });

    cardData2.forEach(function (elem) {
      elem.style.display = "flex";
    });

    recipeCardImg.forEach(function (img) {
      img.parentElement.classList.remove("h-48");
      img.parentElement.classList.add("w-48", "h-full");
    });
  });
}

async function callingAPIs() {
  try {
    appLoadingOverlay.style.display = "flex";
    await gitMealsAPI();
    displayMeals();
    gridBtns();
    recipesGrid.addEventListener("click", async function (e) {
      let targetCard = e.target.closest(".recipe-card");
      let mealCardId = targetCard.dataset.mealId;
      // console.log(mealCardId);
      showMealDetailSection();
      await mealDetailsDisplay(mealCardId);
    });

    const cardData2 = document.querySelectorAll(".card-data-2");
    cardData2.forEach(function (elem) {
      elem.style.display = "none";
    });

    appLoadingOverlay.style.opacity = "0";
    appLoadingOverlay.style.transition = "0.8s";
    setTimeout(function () {
      appLoadingOverlay.style.opacity = "1";
      appLoadingOverlay.style.display = "none";
    }, 800);
  } catch (error) {
    console.log("callingAPIs مشكلة في", error);
  }
}

const mealDetails = document.querySelector("#meal-details");
function showMealDetailSection() {
  sections.forEach(function (sec) {
    sec.style.display = "none";
  });
  mealDetails.style.display = "block";
}
function formatIngredientsForNutrition(ingredients) {
  return ingredients.map(function (ing) {
    return `${ing.measure || ""} ${ing.ingredient || ""}`.trim();
  });
}
async function mealDetailsDisplay(mealId) {
  let container = ``;
  let selectedMeal = null;

  for (let i = 0; i < mealsList.length; i++) {
    if (mealId == mealsList[i].id) {
      const meal = mealsList[i];
      selectedMeal = meal;

      let ingredientsHTML = ``;
      meal.ingredients.forEach(function (ing) {
        ingredientsHTML += `
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
              <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300">
              <span class="text-gray-700">
                <span class="font-medium text-gray-900">${ing.measure || ""}</span>
                ${ing.ingredient || ""}
              </span>
            </div>`;
      });

      let instructionsHTML = ``;
      meal.instructions.forEach(function (step, index) {
        instructionsHTML += `
            <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                ${index + 1}
              </div>
              <p class="text-gray-700 leading-relaxed pt-2">
                ${step}
              </p>
            </div>`;
      });

      const videoId = meal.youtube.split("v=")[1];
      let videoHTML = `
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="fa-solid fa-video text-red-500"></i>
              Video Tutorial
            </h2>
            <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <iframe src="https://www.youtube.com/embed/${videoId}" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>`;

      let nutritionHTML = `<div class="text-center py-8">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                      <i class="animate-pulse text-emerald-600 text-xl" data-fa-i2svg=""><svg class="svg-inline--fa fa-calculator" data-prefix="fas" data-icon="calculator" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm16 168a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zM88 352a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm128-24a24 24 0 1 1 -48 0 24 24 0 1 1 48 0zm80 24a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM64 424c0-13.3 10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L88 448c-13.3 0-24-10.7-24-24zm232-24c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24z"></path></svg></i>
                  </div>
                  <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                  <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                  <div class="mt-4 flex justify-center">
                      <div class="flex space-x-1">
                          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                      </div>
                  </div>
              </div>`;

      container = `<div class="max-w-7xl mx-auto">
          <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Recipes</span>
          </button>

          <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div class="relative h-80 md:h-96">
              <img src="${meal.thumbnail}" alt="${meal.name}" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category || ""}</span>
                  <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area || "Unknown"}</span>
                </div>
                <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${meal.name}</h1>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 mb-8">
            <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" data-meal-id="${meal.id}">
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Log This Meal</span>
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-list-check text-emerald-600"></i>
                  Ingredients
                  <span class="text-sm font-normal text-gray-500 ml-auto">${meal.ingredients.length} items</span>
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${ingredientsHTML}
                </div>
              </div>

              <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                  Instructions
                </h2>
                <div class="space-y-4">
                  ${instructionsHTML}
                </div>
              </div>

              ${videoHTML}
            </div>

            <div class="space-y-6">
              <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                  Nutrition Facts
                </h2>
                <div id="nutrition-facts-container">
                  ${nutritionHTML}
                </div>
              </div>
            </div>
          </div>
        </div>`;

      break;
    }
  }

  document.querySelector("#meal-details").innerHTML = container;

  const backToMealsBtn = document.querySelector("#back-to-meals-btn");
  backToMealsBtn.addEventListener("click", function () {
    mealDetails.style.display = "none";
    searchFiltersSection.style.display = "block";
    mealCategoriesSection.style.display = "block";
    allRecipesSection.style.display = "block";
  });

  nutritionFactsDisplay(selectedMeal);
  const logMealBtn = document.querySelector("#log-meal-btn");
  logMealBtnF(logMealBtn);
}
async function nutritionFactsDisplay(meal) {
  const formattedIngredients = formatIngredientsForNutrition(meal.ingredients);
  await gitNutritionAPI(meal.name, formattedIngredients);
  const nutritionData = NutritionList;
  // server error placeholder
  let nutritionHTML = `<div id="products-empty" style=" text-align: center;">
      <div class="text-center">
        <div class="w-14 h-14  rounded-full flex items-center justify-center mx-auto mb-4" style="background-color:#F3F4F6;">
          <i class="text-3xl"><i class="fa-solid fa-triangle-exclamation" style="color:#99A1AF;"></i></i>
        </div>
        <p class="text-gray-600 text-lg font-semibold mb-2">Server Issue</p>
        <p class="text-gray-500 text-sm mb-4">We're having trouble connecting to our nutrition service</p>
        <p class="text-gray-400 text-xs">Please try again in a few moments</p>
      </div>
    </div>`;

  if (nutritionData && nutritionData.success && nutritionData.data) {
    const perServing = nutritionData.data.perServing;
    const totals = nutritionData.data.totals;

    const proteinPct = Math.min(
      Math.round((perServing.protein / 50) * 100),
      100,
    );
    const carbsPct = Math.min(Math.round((perServing.carbs / 275) * 100), 100);
    const fatPct = Math.min(Math.round((perServing.fat / 78) * 100), 100);
    const fiberPct = Math.min(Math.round((perServing.fiber / 28) * 100), 100);
    const sugarPct = Math.min(Math.round((perServing.sugar / 50) * 100), 100);
    const SaturatedFat = Math.min(
      Math.round((perServing.saturatedFat / 50) * 100),
      100,
    );

    nutritionHTML = `
        <p class="text-sm text-gray-500 mb-4">Per serving</p>

        <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
          <p class="text-sm text-gray-600">Calories per serving</p>
          <p class="text-4xl font-bold text-emerald-600">${perServing.calories ?? "N/A"}</p>
          <p class="text-xs text-gray-500 mt-1">Total: ${totals.calories ?? "N/A"} cal</p>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-gray-700">Protein</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.protein ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPct}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-blue-500"></div>
              <span class="text-gray-700">Carbs</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.carbs ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPct}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-purple-500"></div>
              <span class="text-gray-700">Fat</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.fat ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPct}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-orange-500"></div>
              <span class="text-gray-700">Fiber</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.fiber ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-orange-500 h-2 rounded-full" style="width: ${fiberPct}%"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-pink-500"></div>
              <span class="text-gray-700">Sugar</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.sugar ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-pink-500 h-2 rounded-full" style="width: ${sugarPct}%"></div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-pink-500"></div>
              <span class="text-gray-700">Sugar</span>
            </div>
            <span class="font-bold text-gray-900">${perServing.saturatedFat ?? "N/A"}g</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div class="bg-pink-500 h-2 rounded-full" style="width: ${SaturatedFat}%"></div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Additional Info</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Sodium</span>
              <span class="font-medium">${perServing.sodium ?? "N/A"}mg</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Cholesterol</span>
              <span class="font-medium">${perServing.cholesterol ?? "N/A"}mg</span>
            </div>
            
            
          </div>
        </div>`;
  }

  const nutritionContainer = document.querySelector(
    "#nutrition-facts-container",
  );
  if (nutritionContainer) {
    nutritionContainer.innerHTML = nutritionHTML;
  }
}
callingAPIs();

// search part
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("input", async function () {
  let inputValue = searchInput.value;

  if (inputValue.length < 2) {
    return;
  }
  recipesGrid.innerHTML = `<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 3rem 0;">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;

  await gitMealsAPI(inputValue);
  displayMeals();

  recipescount.innerHTML += " " + inputValue;
});

// Area Filter Btns
const areaFilterBtn = document.querySelectorAll(".area-filter-btn");
areaFilterBtn.forEach(function (btn) {
  btn.addEventListener("click", async function () {
    areaFilterBtn.forEach(function (btns) {
      btns.style.backgroundColor = "#E5E7EB";
      btns.style.color = "#364153";
    });
    btn.style.backgroundColor = "#009966";
    btn.style.color = "#fff";
    let areaName = btn.dataset.area;
    await gitMealsAPI(areaName);
    displayMeals();
  });
});

// Meal Type Btns
const categoryCard = document.querySelectorAll(".category-card");
categoryCard.forEach(function (btn) {
  let dataCategory;
  btn.addEventListener("click", async function (e) {
    dataCategory = btn.dataset.category;
    e.target.closest(".category-card");
    recipesGrid.innerHTML = `<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 3rem 0;">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;
    await gitMealsAPI(dataCategory);
    displayMeals();
  });
});

// Product Scanner section
const productSearchInput = document.querySelector("#product-search-input");
const searchProductBtn = document.querySelector("#search-product-btn");
const productsGrid = document.querySelector("#products-grid");
const barcodeInput = document.querySelector("#barcode-input");
const lookupBarcodeBtn = document.querySelector("#lookup-barcode-btn");

async function gitProductsAPI(category, barcode) {
  try {
    let apiEndPoint;
    if (category) {
      apiEndPoint = `category/${category}`;
    } else if (barcode) {
      apiEndPoint = `barcode/${barcode}`;
    }
    let res = await fetch(
      `https://nutriplan-api.vercel.app/api/products/${apiEndPoint}`,
    );
    let data = await res.json();
    ProductsList = data.results || [data];

    console.log("ProductsList", ProductsList);
  } catch (error) {
    console.log("gitTherdSectionAPI مشكلة في", error);
  }
}

searchProductBtn.addEventListener("click", async function () {
  let categoryName = productSearchInput.value;
  productsGrid.innerHTML = `<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 3rem 0;">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;
  await gitProductsAPI(categoryName);
  if (ProductsList.length == 0) {
    productsGrid.innerHTML = `<div id="products-empty" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center; margin-top:150px" class="py-12">
    <div class="text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
      </div>
      <p class="text-gray-500 text-lg mb-2">No products to display</p>
      <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
    </div>
  </div>`;

    return;
  }
  ProductScannerDisplay();
  productModal();
});

lookupBarcodeBtn.addEventListener("click", async function () {
  let barcodeValue = barcodeInput.value;
  productsGrid.innerHTML = `<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 3rem 0;">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;
  await gitProductsAPI(null, barcodeValue);
  if (ProductsList[0].error) {
    const toastDiv = document.createElement("div");
    toastDiv.id = "Product-not-found";
    toastDiv.className =
      "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification";
    toastDiv.textContent = "Product not found in database";
    document.body.appendChild(toastDiv);
    setTimeout(function () {
      const ProductNotFound = document.querySelector("#Product-not-found");
      ProductNotFound.remove();
    }, 4000);

    productsGrid.innerHTML = `<div id="products-empty" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center; margin-top:150px" class="py-12">
    <div class="text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
      </div>
      <p class="text-gray-500 text-lg mb-2">No products to display</p>
      <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
    </div>
  </div>`;
    return;
  }
  ProductScannerDisplay();
  productModal();

  barcodeInput.value = "";
});
function ProductScannerDisplay() {
  const gradeColors = {
    a: { bg: "#038141", text: "Excellent" },
    b: { bg: "#85bb2f", text: "Good" },
    c: { bg: "#fecb02", text: "Average" },
    d: { bg: "#ee8100", text: "Poor" },
    e: { bg: "#e63e11", text: "Bad" },
  };

  const novaColors = {
    1: { bg: "#038141" },
    2: { bg: "#85bb2f" },
    3: { bg: "#ee8100" },
    4: { bg: "#e63e11" },
  };

  if (ProductsList.length == 0) {
    productsGrid.innerHTML = `<div id="products-empty" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center; margin-top:150px" class="py-12">
    <div class="text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
      </div>
      <p class="text-gray-500 text-lg mb-2">No products to display</p>
      <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
    </div>
  </div>`;
    return;
  }

  let container = ``;
  for (let i = 0; i < ProductsList.length; i++) {
    const product = ProductsList[i].result || ProductsList[i];
    const nutrients = product.nutrients;
    const calories = nutrients?.calories || "0";
    const protein = nutrients?.protein || "0";
    const carbs = nutrients?.carbs || "0";
    const fat = nutrients?.fat || "0";
    const sugar = nutrients?.sugar || "0";

    if (!product || !product.barcode || !product.name) {
      continue;
    }

    const gradeData = gradeColors[product.nutritionGrade];
    const novaData = novaColors[product.novaGroup];

    container += `<div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
                  <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${product.image || "placeholder.jpg"}" alt="Product Name" loading="lazy">

                    ${
                      gradeData
                        ? `<div class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded uppercase" style="background-color: ${gradeData.bg}">
                      Nutri-Score ${product.nutritionGrade.toUpperCase()}
                    </div>`
                        : ""
                    }

                    ${
                      novaData
                        ? `<div class="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${product.novaGroup}" style="background-color: ${novaData.bg}">
                      ${product.novaGroup}
                    </div>`
                        : ""
                    }
                  </div>

                  <div class="p-4">
                    <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                      ${product.brand || "Unknown Brand"}
                    </p>
                    <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      ${product.name || "Product Name"}
                    </h3>

                    <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-fire" data-prefix="fas" data-icon="fire" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg></i>
                      ${calories} kcal/100g
                      </span>
                    </div>

                    <div class="grid grid-cols-4 gap-1 text-center">
                      <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${protein}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                      </div>
                      <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${carbs}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                      </div>
                      <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${fat}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                      </div>
                      <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${sugar}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                      </div>
                    </div>
                  </div>
                </div>`;
  }
  productsGrid.innerHTML = container;
}
// Filter by Nutri-Score

const nutriScoreFilter = document.querySelectorAll(".nutri-score-filter");
const gradeColors = {
  a: { bg: "#038141", text: "Excellent" },
  b: { bg: "#85bb2f", text: "Good" },
  c: { bg: "#fecb02", text: "Average" },
  d: { bg: "#ee8100", text: "Poor" },
  e: { bg: "#e63e11", text: "Bad" },
};
const novaColors = {
  1: { bg: "#038141" },
  2: { bg: "#85bb2f" },
  3: { bg: "#ee8100" },
  4: { bg: "#e63e11" },
};
nutriScoreFilter.forEach(function (btn) {
  btn.style.outline = "solid 2px  #00000000";
  btn.style.transition = "0.2s";
  btn.addEventListener("click", function (e) {
    nutriScoreFilter.forEach(function (item) {
      item.style.outline = "#00000000";
    });
    e.target.closest(".nutri-score-filter").style.outline = "solid 2px #000";

    let dataGrade = e.target.closest(".nutri-score-filter").dataset.grade;
    let container = ``;
    let hasProducts = false;
    for (let i = 0; i < ProductsList.length; i++) {
      if (ProductsList[i].nutritionGrade == dataGrade || dataGrade == "") {
        hasProducts = true;

        const product = ProductsList[i].result || ProductsList[i];
        const nutrients = product.nutrients;
        const calories = nutrients?.calories || "0";
        const protein = nutrients?.protein || "0";
        const carbs = nutrients?.carbs || "0";
        const fat = nutrients?.fat || "0";
        const sugar = nutrients?.sugar || "0";

        if (!product || !product.barcode || !product.name) {
          continue;
        }

        const gradeData = gradeColors[product.nutritionGrade];
        const novaData = novaColors[product.novaGroup];

        container += `<div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
                  <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${product.image || "placeholder.jpg"}" alt="Product Name" loading="lazy">

                    ${
                      gradeData
                        ? `<div class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded uppercase" style="background-color: ${gradeData.bg}">
                      Nutri-Score ${product.nutritionGrade.toUpperCase()}
                    </div>`
                        : ""
                    }

                    ${
                      novaData
                        ? `<div class="absolute top-2 right-2 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${product.novaGroup}" style="background-color: ${novaData.bg}">
                      ${product.novaGroup}
                    </div>`
                        : ""
                    }
                  </div>

                  <div class="p-4">
                    <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                      ${product.brand || "Unknown Brand"}
                    </p>
                    <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      ${product.name || "Product Name"}
                    </h3>

                    <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span><i class="mr-1" data-fa-i2svg=""><svg class="svg-inline--fa fa-fire" data-prefix="fas" data-icon="fire" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M160.5-26.4c9.3-7.8 23-7.5 31.9 .9 12.3 11.6 23.3 24.4 33.9 37.4 13.5 16.5 29.7 38.3 45.3 64.2 5.2-6.8 10-12.8 14.2-17.9 1.1-1.3 2.2-2.7 3.3-4.1 7.9-9.8 17.7-22.1 30.8-22.1 13.4 0 22.8 11.9 30.8 22.1 1.3 1.7 2.6 3.3 3.9 4.8 10.3 12.4 24 30.3 37.7 52.4 27.2 43.9 55.6 106.4 55.6 176.6 0 123.7-100.3 224-224 224S0 411.7 0 288c0-91.1 41.1-170 80.5-225 19.9-27.7 39.7-49.9 54.6-65.1 8.2-8.4 16.5-16.7 25.5-24.2zM225.7 416c25.3 0 47.7-7 68.8-21 42.1-29.4 53.4-88.2 28.1-134.4-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5-17.3-22.1-49.1-62.4-65.3-83-5.4-6.9-15.2-8-21.5-1.9-18.3 17.8-51.5 56.8-51.5 104.3 0 68.6 50.6 109.2 113.7 109.2z"></path></svg></i>
                      ${calories} kcal/100g
                      </span>
                    </div>

                    <div class="grid grid-cols-4 gap-1 text-center">
                      <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${protein}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                      </div>
                      <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${carbs}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                      </div>
                      <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${fat}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                      </div>
                      <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${sugar}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                      </div>
                    </div>
                  </div>
                </div>`;
        productsGrid.innerHTML = container;
      }
    }
    if (hasProducts == false) {
      productsGrid.innerHTML = `<div id="products-empty" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center; margin-top:150px" class="py-12">
    <div class="text-center">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="text-3xl text-gray-400" data-fa-i2svg=""><svg class="svg-inline--fa fa-box-open" data-prefix="fas" data-icon="box-open" role="img" viewBox="0 0 640 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M560.3 237.2c10.4 11.8 28.3 14.4 41.8 5.5 14.7-9.8 18.7-29.7 8.9-44.4l-48-72c-2.8-4.2-6.6-7.7-11.1-10.2L351.4 4.7c-19.3-10.7-42.8-10.7-62.2 0L88.8 116c-5.4 3-9.7 7.4-12.6 12.8L27.7 218.7c-12.6 23.4-3.8 52.5 19.6 65.1l33 17.7 0 53.3c0 23 12.4 44.3 32.4 55.7l176 99.7c19.6 11.1 43.5 11.1 63.1 0l176-99.7c20.1-11.4 32.4-32.6 32.4-55.7l0-117.5zm-240-9.8L170.2 144 320.3 60.6 470.4 144 320.3 227.4zm-41.5 50.2l-21.3 46.2-165.8-88.8 25.4-47.2 161.7 89.8z"></path></svg></i>
      </div>
      <p class="text-gray-500 text-lg mb-2">No products to display</p>
      <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
    </div>
  </div>`;
    }
    productModal();
  });
});
function productModal() {
  const productCardBgWhite = document.querySelectorAll(".product-card");
  productCardBgWhite.forEach(function (card) {
    card.addEventListener("click", function (e) {
      let productBarcode = e.target.closest(".product-card").dataset.barcode;
      const body = document.body;
      for (let i = 0; i < ProductsList.length; i++) {
        const product = ProductsList[i].result || ProductsList[i];

        let barcode = product.barcode;
        let brand = product.brand;
        let image = product.image;
        let name = product.name;
        let novaGroup = product.novaGroup;
        let calories = product.nutrients.calories;
        let carbs = product.nutrients.carbs;
        let fat = product.nutrients.fat;
        let fiber = product.nutrients.fiber;
        let protein = product.nutrients.protein;
        let sodium = product.nutrients.sodium;
        let sugar = product.nutrients.sugar;
        let nutritionGrade = product.nutritionGrade;
        let nutriScoreContainerBgColor;
        let nutriScoreBgColor;
        let nutriScoregrade;
        let novaGroupContainerBg;
        let novaGroupNumBg;

        if (productBarcode == product.barcode) {
          if (nutritionGrade == "a") {
            nutriScoreBgColor = "#038141";
            nutriScoreContainerBgColor = "#03814120";
            nutriScoregrade = "Excellent";
          } else if (nutritionGrade == "b") {
            nutriScoreBgColor = "#85bb2f";
            nutriScoreContainerBgColor = "#85bb2f20";
            nutriScoregrade = "Good";
          } else if (nutritionGrade == "c") {
            nutriScoreBgColor = "#fecb02";
            nutriScoreContainerBgColor = "#fecb0220";
            nutriScoregrade = "Average";
          } else if (nutritionGrade == "d") {
            nutriScoreBgColor = "#ee8100";
            nutriScoreContainerBgColor = "#ee810020";
            nutriScoregrade = "Poor";
          } else if (nutritionGrade == "e") {
            nutriScoreBgColor = "#e63e11";
            nutriScoreContainerBgColor = "#e63e1120";
            nutriScoregrade = "Bad";
          }

          if (novaGroup == "0") {
            document.querySelector(".nova").style.display = "none";
          } else if (novaGroup == "1") {
            novaGroupContainerBg = "#03814120";
            novaGroupNumBg = "#038141";
          } else if (novaGroup == "2") {
            novaGroupContainerBg = "#85bb2f20";
            novaGroupNumBg = "#85bb2f";
          } else if (novaGroup == "3") {
            novaGroupContainerBg = "#ee810020";
            novaGroupNumBg = "#ee8100";
          } else if (novaGroup == "4") {
            novaGroupContainerBg = "#e63e1120";
            novaGroupNumBg = "#e63e11";
          }

          const dailyValues = {
            protein: 50,
            carbs: 275,
            fat: 78,
            sugar: 50,
          };

          const proteinPercentage = Math.min(
            (protein / dailyValues.protein) * 100,
            100,
          );
          const carbsPercentage = Math.min(
            (carbs / dailyValues.carbs) * 100,
            100,
          );
          const fatPercentage = Math.min((fat / dailyValues.fat) * 100, 100);
          const sugarPercentage = Math.min(
            (sugar / dailyValues.sugar) * 100,
            100,
          );

          const modal = document.createElement("div");
          modal.className =
            "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
          modal.id = "product-detail-modal";
          modal.innerHTML = `<div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  
          <div class="p-6">
              <!-- Header -->
              <div class="flex items-start gap-6 mb-6">
                  <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src="${image}" alt="=${name}" class="w-full h-full object-contain">
                  </div>
                  <div class="flex-1">
                      <p class="text-sm text-emerald-600 font-semibold mb-1">${brand}</p>
                      <h2 class="text-2xl font-bold text-gray-900 mb-2">${name}</h2>
                      <p class="text-sm text-gray-500 mb-3">100 g</p>
                      
                      <div class="flex items-center gap-3">
                              ${
                                nutritionGrade !== "unknown"
                                  ? `<div class="nutrition-Grade flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${nutriScoreContainerBgColor}">
                                  <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${nutriScoreBgColor}">
                                      ${nutritionGrade.toUpperCase()}
                                  </span>
                                  <div>
                                      <p class="text-xs font-bold" style="color: ${nutritionGrade}">Nutri-Score</p>
                                      <p class="text-[10px] text-gray-600">${nutriScoregrade}</p>
                                  </div>
                              </div>`
                                  : ""
                              }
                              <div class="nova flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${novaGroupContainerBg}">
                                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${novaGroupNumBg}">
                                      ${novaGroup}
                                  </span>
                                  <div>
                                      <p class="text-xs font-bold" style="color: ${novaGroupNumBg}">NOVA</p>
                                      <p class="text-[10px] text-gray-600">Processed</p>
                                  </div>
                              </div>
                      </div>
                  </div>
                  <button class="close-product-modal text-gray-400 hover:text-gray-600">
                      <i class="text-2xl fa-solid fa-xmark"></i>
                  </button>
              </div>
              
              <!-- Nutrition Facts -->
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                  <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                      Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                  </h3>
                  
                  <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                      <p class="text-4xl font-bold text-gray-900">${calories}</p>
                      <p class="text-sm text-gray-500">Calories</p>
                  </div>
                  
                  <div class="grid grid-cols-4 gap-4">
                      <div class="text-center">
                          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercentage}%"></div>
                          </div>
                          <p class="text-lg font-bold text-emerald-600">${protein}g</p>
                          <p class="text-xs text-gray-500">Protein</p>
                      </div>
                      <div class="text-center">
                          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercentage}%"></div>
                          </div>
                          <p class="text-lg font-bold text-blue-600">${carbs}g</p>
                          <p class="text-xs text-gray-500">Carbs</p>
                      </div>
                      <div class="text-center">
                          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercentage}%"></div>
                          </div>
                          <p class="text-lg font-bold text-purple-600">${fat}g</p>
                          <p class="text-xs text-gray-500">Fat</p>
                      </div>
                      <div class="text-center">
                          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div class="bg-orange-500 h-2 rounded-full" style="width: ${sugarPercentage}%"></div>
                          </div>
                          <p class="text-lg font-bold text-orange-600">${sugar}g</p>
                          <p class="text-xs text-gray-500">Sugar</p>
                      </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
                      <div class="text-center">
                          <p class="text-sm font-semibold text-gray-900">${fiber ?? "N/A"}g</p>
                          <p class="text-xs text-gray-500">Fiber</p>
                      </div>
                      <div class="text-center">
                          <p class="text-sm font-semibold text-gray-900">${sodium ?? "N/A"}g</p>
                          <p class="text-xs text-gray-500">Sodium</p>
                      </div>
                  </div>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-3">
                  <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${barcode}">
                      <i class="mr-2 fa-solid fa-plus"></i>Log This Food
                  </button>
                  <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                      Close
                  </button>
              </div>
          </div>
      
              </div>`;
          body.appendChild(modal);
          productModalCloseBtn();
          addProductLogBtnF();
        }
      }
    });
  });
}

function productModalCloseBtn() {
  const modal = document.querySelector("#product-detail-modal");
  const closeProductModal = document.querySelectorAll(".close-product-modal");
  closeProductModal.forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      modal.remove();
    });
  });
}

// Browse by Category

const productCategoryBtn = document.querySelectorAll(".product-category-btn");
productCategoryBtn.forEach(function (btn) {
  // const
  btn.addEventListener("click", async function (e) {
    let dataValue = e.target.closest("button").dataset.category;
    console.log(dataValue);
    productsGrid.innerHTML = `<div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); padding: 3rem 0;">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;
    await gitProductsAPI(dataValue);
    ProductScannerDisplay();
    productModal();
  });
});

const logAMealBtn = document.querySelector("#log-a-meal");
logAMealBtn.addEventListener("click", function () {
  showSection("/meals");
  updateActiveButton("/meals");
  window.history.pushState(null, null, "#/meals");
});

const quickLogBtn = document.querySelector(".quick-log-btn");
quickLogBtn.addEventListener("click", function () {
  showSection("/products");
  updateActiveButton("/products");
  window.history.pushState(null, null, "#/products");
});

function getTodayKey() {
  const today = new Date();
  return `foodlog-${today.toISOString().split("T")[0]}`;
}

function saveMealToLog(logEntry) {
  const key = getTodayKey();
  const existing = JSON.parse(localStorage.getItem(key)) || [];
  existing.push(logEntry);
  localStorage.setItem(key, JSON.stringify(existing));
}

function deleteLogItem(index) {
  const key = getTodayKey();
  const logs = JSON.parse(localStorage.getItem(key)) || [];
  logs.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(logs));
}

const clearFoodlogBtn = document.querySelector("#clear-foodlog");
clearFoodlogBtn.addEventListener("click", function () {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, clear it!",
    confirmButtonColor: "#ef4444",
    cancelButtonText: "Cancel",
  }).then(function (result) {
    if (result.isConfirmed) {
      const key = getTodayKey();
      localStorage.removeItem(key);
      renderFoodLog();
    }
  });
});
const removeButtons = document.querySelectorAll(".remove-foodlog-item");
removeButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const index = Number(btn.dataset.index);
    deleteLogItem(index);
    renderFoodLog();
  });
});

renderWeeklyChart();

function renderFoodLog() {
  const key = getTodayKey();
  const logs = JSON.parse(localStorage.getItem(key)) || [];

  const foodlogDate = document.querySelector("#foodlog-date");
  foodlogDate.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const totals = logs.reduce(
    function (acc, item) {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const goals = { calories: 2000, protein: 50, carbs: 250, fat: 65 };

  const progressCards = document.querySelectorAll(
    "#foodlog-today-section .grid > div",
  );
  const keys = ["calories", "protein", "carbs", "fat"];
  const units = ["kcal", "g", "g", "g"];

  progressCards.forEach(function (card, i) {
    const key = keys[i];
    const valueSpan = card.querySelector("span.text-gray-500");
    const bar = card.querySelector("div.rounded-full > div");
    const percent = Math.min(Math.round((totals[key] / goals[key]) * 100), 100);

    valueSpan.textContent = `${totals[key]} / ${goals[key]} ${units[i]}`;
    bar.style.width = `${percent}%`;
  });

  const itemsCountTitle = document.querySelector("#foodlog-today-section h4");
  itemsCountTitle.textContent = `Logged Items (${logs.length})`;

  const loggedItemsList = document.querySelector("#logged-items-list");
  const clearBtn = document.querySelector("#clear-foodlog");

  if (logs.length === 0) {
    loggedItemsList.innerHTML = `<div class="text-center py-8 text-gray-500">
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page or scan products</p>
      </div>`;
    clearBtn.style.display = "none";
    return;
  }

  clearBtn.style.display = "block";

  let itemsHTML = ``;
  logs.forEach(function (item, index) {
    itemsHTML += `<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
      <div class="flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover">
        <div>
          <p class="font-semibold text-gray-900">${item.name}</p>
          <p class="text-sm text-gray-500">
            ${item.servings} serving
            <span class="mx-1">•</span>
            <span class="text-emerald-600">${item.type}</span>
          </p>
          <p class="text-xs text-gray-400 mt-1">${item.time}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-lg font-bold text-emerald-600">${item.calories}</p>
          <p class="text-xs text-gray-500">kcal</p>
        </div>
        <div class="hidden md:flex gap-2 text-xs text-gray-500">
          <span class="px-2 py-1 bg-blue-50 rounded">${item.protein}g P</span>
          <span class="px-2 py-1 bg-amber-50 rounded">${item.carbs}g C</span>
          <span class="px-2 py-1 bg-purple-50 rounded">${item.fat}g F</span>
        </div>
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>`;
  });
  loggedItemsList.innerHTML = itemsHTML;

  const removeButtons = document.querySelectorAll(".remove-foodlog-item");
  removeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = Number(btn.dataset.index);
      deleteLogItem(index);
      renderFoodLog();
      renderWeeklyChart();
    });
  });
}

function logMealBtnF(btn) {
  btn.addEventListener("click", function () {
    const mealId = btn.dataset.mealId;
    let meal = null;

    for (let i = 0; i < mealsList.length; i++) {
      if (mealsList[i].id == mealId) {
        meal = mealsList[i];
        break;
      }
    }

    if (!meal) {
      console.log("meal not found");
      return;
    }

    let logMealModal = document.createElement("div");
    logMealModal.className =
      "fixed inset-0 bg-black/50 flex items-center justify-center z-50";
    logMealModal.id = "log-meal-modal";
    logMealModal.innerHTML = `<div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                  <div class="flex items-center gap-4 mb-6">
                      <img src="${meal.thumbnail}" alt="${meal.name}" class="w-16 h-16 rounded-xl object-cover">
                      <div>
                          <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                          <p class="text-gray-500 text-sm">${meal.name}</p>
                      </div>
                  </div>
                  
                  <div class="mb-6">
                      <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                      <div class="flex items-center gap-3">
                          <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                              <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-minus" data-prefix="fas" data-icon="minus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"></path></svg></i>
                          </button>
                          <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
                          <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                              <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                          </button>
                      </div>
                  </div>
                  
                  
                  <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                      <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                      <div class="grid grid-cols-4 gap-2 text-center">
                          <div>
                              <p class="text-lg font-bold text-emerald-600" id="modal-calories">175</p>
                              <p class="text-xs text-gray-500">Calories</p>
                          </div>
                          <div>
                              <p class="text-lg font-bold text-blue-600" id="modal-protein">0g</p>
                              <p class="text-xs text-gray-500">Protein</p>
                          </div>
                          <div>
                              <p class="text-lg font-bold text-amber-600" id="modal-carbs">0g</p>
                              <p class="text-xs text-gray-500">Carbs</p>
                          </div>
                          <div>
                              <p class="text-lg font-bold text-purple-600" id="modal-fat">0g</p>
                              <p class="text-xs text-gray-500">Fat</p>
                          </div>
                      </div>
                  </div>
                  
                  
                  <div class="flex gap-3">
                      <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                          Cancel
                      </button>
                      <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                          <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                          Log Meal
                      </button>
                  </div>
              </div>`;
    document.body.appendChild(logMealModal);

    const cancelLogMeal = document.querySelector("#cancel-log-meal");
    cancelLogMeal.addEventListener("click", function () {
      logMealModal.remove();
    });

    const increaseServings = document.querySelector("#increase-servings");
    const decreaseServings = document.querySelector("#decrease-servings");
    const mealServings = document.querySelector("#meal-servings");
    let mealServingsValue = Number(mealServings.value);
    increaseServings.addEventListener("click", function () {
      mealServingsValue += 0.5;
      mealServings.value = mealServingsValue;
    });
    decreaseServings.addEventListener("click", function () {
      if (mealServingsValue == 0.5) {
        return;
      }
      mealServingsValue -= 0.5;
      mealServings.value = mealServingsValue;
    });

    const confirmLogMeal = document.querySelector("#confirm-log-meal");
    confirmLogMeal.addEventListener("click", function () {
      const perServing = NutritionList?.data?.perServing || {};

      const logEntry = {
        id: meal.id,
        name: meal.name,
        image: meal.thumbnail,
        servings: mealServingsValue,
        calories: Math.round((perServing.calories || 0) * mealServingsValue),
        protein: Math.round((perServing.protein || 0) * mealServingsValue),
        carbs: Math.round((perServing.carbs || 0) * mealServingsValue),
        fat: Math.round((perServing.fat || 0) * mealServingsValue),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "Recipe",
      };

      saveMealToLog(logEntry);
      renderFoodLog();
      logMealModal.remove();

      Swal.fire({
        title: "Meal Logged!",
        html: `${meal.name} (${mealServingsValue} serving) has been added to your daily log.<br><span style="color:#059669; font-weight:bold;">+${logEntry.calories} calories</span>`,
        icon: "success",
        timer: 1500,
      });
    });
  });
}

function renderWeeklyChart() {
  const weeklyChart = document.querySelector("#weekly-chart");

  let daysHTML = ``;

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = `foodlog-${date.toISOString().split("T")[0]}`;
    const logs = JSON.parse(localStorage.getItem(key)) || [];

    const totalCalories = logs.reduce(function (sum, item) {
      return sum + item.calories;
    }, 0);

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = date.getDate();
    const isToday = i === 0;

    daysHTML += `<div class="text-center ${isToday ? "bg-indigo-100 rounded-xl" : ""}">
        <p class="text-xs text-gray-500 mb-1">${dayName}</p>
        <p class="text-sm font-medium text-gray-900">${dayNumber}</p>
        <div class="mt-2 ${totalCalories > 0 ? "text-emerald-600" : "text-gray-300"}">
          <p class="text-lg font-bold">${totalCalories}</p>
          <p class="text-xs">kcal</p>
        </div>
        ${logs.length > 0 ? `<p class="text-xs text-gray-400 mt-1">${logs.length} items</p>` : ""}
      </div>`;
  }

  weeklyChart.innerHTML = `<div class="grid grid-cols-7 gap-2">${daysHTML}</div>`;
}

function addProductLogBtnF() {
  const addProductBtns = document.querySelectorAll(".add-product-to-log");
  addProductBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const barcode = btn.dataset.barcode;
      let product = null;

      for (let i = 0; i < ProductsList.length; i++) {
        const p = ProductsList[i].result || ProductsList[i];
        if (p.barcode == barcode) {
          product = p;
          break;
        }
      }

      if (!product) {
        console.log("product not found");
        return;
      }

      const logEntry = {
        id: product.barcode,
        name: product.name,
        image: product.image,
        servings: 1,
        calories: Math.round(product.nutrients.calories || 0),
        protein: Math.round(product.nutrients.protein || 0),
        carbs: Math.round(product.nutrients.carbs || 0),
        fat: Math.round(product.nutrients.fat || 0),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: "Product",
      };

      saveMealToLog(logEntry);
      renderFoodLog();

      document.querySelector("#product-detail-modal").remove();

      Swal.fire({
        title: "Product Logged!",
        html: `${product.name} has been added to your daily log.<br><span style="color:#059669; font-weight:bold;">+${logEntry.calories} calories</span>`,
        icon: "success",
        timer: 1500,
      });
    });
  });
}
