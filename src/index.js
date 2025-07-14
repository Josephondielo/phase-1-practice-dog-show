 document.addEventListener("DOMContentLoaded", () => {
  //gets refence to the dog form elements
  const form = document.getElementById("dog-form");
  //this line ensures tableBody exist
  let currentDogId = null;
  const tableBody = document.getElementById("table-body");
  
  fetchDogs();
  
  function fetchDogs() {
    fetch("http://localhost:3000/dogs")
     //fetching the Dog data from the server
      .then((res) => res.json())
      .then((dogs) => {
        tableBody.innerHTML = ""; // clear table
        dogs.forEach(renderDog);
      });
  }
  
  function renderDog(dog) {
    const tr = document.createElement("tr");//creates new table raws
    //fill the row with dog's name,breed,sex,edit button
    tr.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td>
        <button data-id="${dog.id}">Edit</button>
      </td>
    `;
    //get reference to the button
    const editBtn = tr.querySelector("button");

    //add click eventlistener to the edit button
    editBtn.addEventListener("click", () => {
      //prefills the form with dog's current data
      form.name.value = dog.name;
      form.breed.value = dog.breed;
      form.sex.value = dog.sex;
      //save the dog's id so we can know which one to update later
      currentDogId = dog.id;
    });
    
    tableBody.appendChild(tr);
  }
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();//stops reloading
    if (!currentDogId) return;
    
    const updateDog = {
      name: form.name.value,
      breed: form.breed.value,
      sex: form.sex.value,
    };
    
    fetch(`http://localhost:3000/dogs/${currentDogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateDog),//converts JS object to Json string
    })
      .then((res) => res.json())
      .then(() => {
        currentDogId = null;//clears the current dog Id
        form.reset();
        fetchDogs();
      });
  });
});

