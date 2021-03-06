let addToy = false;

const toysUrl = "http://localhost:3000/toys"
const listOfToys = document.getElementById("toy-collection")

function fetchToys(){
  fetch(toysUrl)
  .then(response => response.json())
  .then(toyData => toyData.forEach(toy => renderToy(toy)))
}

function renderToy(toyObject) {
  const toyCard = document.createElement("div")
    toyCard.classList.add("card")
    toyCard.dataset.id = toyObject.id
  const toyName = document.createElement("h2")
    toyName.textContent = toyObject.name
  const toyImage = document.createElement("img")
    toyImage.classList.add("toy-avatar")
    toyImage.setAttribute("src", toyObject.image)
    toyImage.setAttribute("alt", toyObject.name)
  const toyLikes = document.createElement("p")
    toyLikes.textContent = `${toyObject.likes} Likes`
  const toyLikeButton = document.createElement("button")
    toyLikeButton.classList.add("like-btn")
    toyLikeButton.textContent = "Like ❤️"

    toyCard.append(toyName, toyImage, toyLikes, toyLikeButton)
    listOfToys.append(toyCard)
}

function createToy(addFormSubmission){
  addFormSubmission.preventDefault()
  const toyForm = addFormSubmission.target
  const newlyCreatedToy = { 
    name: addFormSubmission.target.elements.name.value,
    image: addFormSubmission.target.elements.image.value,
    likes: 0
  }
  fetch(toysUrl, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newlyCreatedToy)})
  .then(response => response.json())
  .then(createdToy => renderToy(createdToy))
}

function handleToyClick(toyClick){
  if (toyClick.target.className === "like-btn"){
    const toyId = parseInt(toyClick.target.closest("div").dataset.id)
    const currentLikes = parseInt(toyClick.target.previousSibling.textContent.replace(" Likes", ""))
    const updatedToy = {
      // name: toyClick.target.closest("div").querySelector("h2").textContent,
      // image: toyClick.target.closest("div").querySelector("img").src,
      likes: currentLikes + 1
    }
    fetch(`${toysUrl}/${toyId}`, {method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify(updatedToy)})
    .then(response => response.json())
    .then(updatedToy => toyClick.target.previousSibling.textContent = `${updatedToy.likes} Likes`)
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  fetchToys()
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  toyFormContainer.querySelector("form").addEventListener("submit", createToy)
  listOfToys.addEventListener("click", handleToyClick)
    
});

