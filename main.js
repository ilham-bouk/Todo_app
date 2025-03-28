let imgMode = document.querySelector(".img-mode");
let mainEl = document.querySelector("main");
let input = document.querySelector("input");
let listCont = document.querySelector(".list");
let leftItem = document.querySelector(".left-item span");
let filterSpans = document.querySelectorAll(".filter span");
let clearBtn = document.querySelector(".clear");

imgMode.onclick = function () {
  mainEl.parentElement.classList.toggle("dark");
};


let tasksArray = [];

if (localStorage.getItem("tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("tasks"));
}

getLocalStorage();

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const task = input.value.trim();
    if (task !== "") {
      addToArray(task);
      input.value = "";
      updateLeftItems();
    }
  }
});

listCont.addEventListener("click", (e) => {
  if (e.target.alt === "delete") {
    deleteTask(e.target.parentElement.getAttribute("data-id"))
    e.target.parentElement.remove();
    updateLeftItems();
  } else if (e.target.parentElement.classList.contains("item")) {
    checkedTask(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.classList.toggle("checked");
    updateLeftItems();
  }
})

filterSpans.forEach(span => {
  span.addEventListener("click", () => {    
    filterSpans.forEach(s => s.classList.remove("active"));
    span.classList.add("active");

    const filterType = span.textContent.toLowerCase();
    let filteredTasks = tasksArray;
    if (filterType == 'completed') {
      filteredTasks = tasksArray.filter(task => task.completed);
    } else if (filterType == 'active') {
      filteredTasks = tasksArray.filter(task => !task.completed);
    }
    addToPage(filteredTasks);
  });
});

clearBtn.addEventListener("click", () => {
  tasksArray = tasksArray.filter(task => !task.completed);
  addToPage(tasksArray);
  addToLocalStorage(tasksArray);
  updateLeftItems();
});

function deleteTask(taskId) {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addToLocalStorage(tasksArray);
}

function checkedTask(taskId) {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskId) {
      tasksArray[i].completed = !tasksArray[i].completed;
    }
  }
  addToLocalStorage(tasksArray);
}

function addToArray(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  }
  tasksArray.push(task);
  addToPage(tasksArray);
  addToLocalStorage(tasksArray);
}

function addToPage(tasksArray) {
  listCont.innerHTML = "";
  tasksArray.forEach((task) => {    
    let div = document.createElement("div");
    div.className = "item";
    if (task.completed) {
      div.className = "item checked";
    }
    div.setAttribute("data-id", task.id);
    
    let span = document.createElement("span");

    let parag = document.createElement("p");
    parag.innerHTML = task.title;

    let img = document.createElement("img");
    img.src = "./images/icon-cross.svg";
    img.alt = "delete";

    div.appendChild(span);
    div.appendChild(parag);
    div.appendChild(img);
    listCont.appendChild(div);
  });
}

function addToLocalStorage(tasksArray) {
  window.localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function getLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addToPage(tasks);
    updateLeftItems();
  }
}

function updateLeftItems() {
  const remaining = tasksArray.filter(task => !task.completed).length;
  leftItem.innerHTML = remaining;
}
