// app.js
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#login-form");
  const greetingText = document.querySelector("#greeting-text");
  const greeting = document.querySelector("#greeting");
  const loginInput = document.querySelector("#login_input");
  const submitButton = document.querySelector(".login_submit");
  const todoList = document.querySelector("#todo-list-ul");
  const todoInput = document.querySelector("#todo-input");
  const addTodoButton = document.querySelector("#add-todo");
  const weatherInfo = document.querySelector("#weather");

  const HIDDEN_CLASSNAME = "hidden";
  const USERNAME_KEY = "username";
  const TODOS_KEY = "todos";

  const OPENWEATHERMAP_API_KEY = "b72977f80f3c7e0c4820bc268b729de9"; // OpenWeatherMap API Key

  function onLoginSubmit(event) {
    event.preventDefault();
    const username = loginInput.value;
    localStorage.setItem(USERNAME_KEY, username);
    paintGreetings(username);
    handleLogin();
  }

  function onGreetingClick() {
    greetingText.classList.add(HIDDEN_CLASSNAME);
    greeting.classList.add(HIDDEN_CLASSNAME);
    loginInput.classList.remove(HIDDEN_CLASSNAME);
    submitButton.classList.remove(HIDDEN_CLASSNAME);
    loginInput.value = greeting.innerText;
    loginInput.focus();
  }

  loginForm.addEventListener("submit", onLoginSubmit);
  greeting.addEventListener("click", onGreetingClick);
  loginInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      onLoginSubmit(event);
    }
  });

  function paintGreetings(username) {
    greeting.innerText = `Hello ${username}`;
    greeting.classList.remove(HIDDEN_CLASSNAME);
  }

  function handleLogin() {
    const savedUsername = localStorage.getItem(USERNAME_KEY);

    if (savedUsername === null) {
      loginForm.classList.remove(HIDDEN_CLASSNAME);
      greetingText.classList.remove(HIDDEN_CLASSNAME);
      greeting.classList.add(HIDDEN_CLASSNAME);
      loginInput.classList.add(HIDDEN_CLASSNAME);
      submitButton.classList.add(HIDDEN_CLASSNAME);
    } else {
      paintGreetings(savedUsername);
      loginForm.classList.add(HIDDEN_CLASSNAME);
      greetingText.classList.add(HIDDEN_CLASSNAME);
      greeting.classList.remove(HIDDEN_CLASSNAME);
      loginInput.classList.add(HIDDEN_CLASSNAME);
      submitButton.classList.add(HIDDEN_CLASSNAME);
      initTodoList();
      getWeatherAndLocation();
    }
  }

  function initTodoList() {
    const savedTodos = localStorage.getItem(TODOS_KEY);
    if (savedTodos !== null) {
      const parsedTodos = JSON.parse(savedTodos);
      parsedTodos.forEach((todo, index) => paintTodoList(todo, index));
    }
  }

  function paintTodoList(todo, index) {
    const li = document.createElement("li");
    li.innerText = todo;
    todoList.appendChild(li);

    // 삭제 버튼 추가
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "삭제";
    deleteButton.addEventListener("click", () => {
      removeTodo(index);
    });

    li.appendChild(deleteButton);
  }

  function addTodo(newTodo) {
    const savedTodos = localStorage.getItem(TODOS_KEY);
    let todos = [];
    if (savedTodos !== null) {
      todos = JSON.parse(savedTodos);
    }
    todos.push(newTodo);
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    paintTodoList(newTodo, todos.length - 1);
  }

  function removeTodo(index) {
    const savedTodos = localStorage.getItem(TODOS_KEY);
    let todos = [];
    if (savedTodos !== null) {
      todos = JSON.parse(savedTodos);
    }

    todos.splice(index, 1);
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    todoList.innerHTML = "";
    initTodoList();
  }

  addTodoButton.addEventListener("click", () => {
    const newTodo = todoInput.value;
    todoInput.value = "";
    addTodo(newTodo);
  });

  // 엔터 키로 투두리스트 추가
  todoInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const newTodo = todoInput.value;
      todoInput.value = "";
      addTodo(newTodo);
    }
  });

  function getWeatherAndLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const location = data.name;
            const weatherText = `Weather: ${weatherDescription}, Temperature: ${temperature}°C, Location: ${location}`;
            weatherInfo.innerText = weatherText;
            weatherInfo.classList.remove(HIDDEN_CLASSNAME);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
          });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const clockElement = document.getElementById("clock");
    clockElement.innerText = `${hours}:${minutes}:${seconds}`;
  }

  function init() {
    updateClock();
    handleLogin();
    updateBackgroundColor();

    // 실시간 시계 갱신 (1초마다)
    setInterval(updateClock, 1000);
  }

  const blueprint = ["#ff5733", "#33ff57", "#5733ff", "#ff3357", "#57ff33"];

  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * blueprint.length);
    return blueprint[randomIndex];
  }

  function giveMeColor() {
    let color1 = getRandomColor();
    let color2 = getRandomColor();

    while (color2 === color1) {
      color2 = getRandomColor();
    }

    document.body.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
  }

  function updateBackgroundColor() {
    giveMeColor();
  }

  // 페이지 로드 시 초기화 함수 호출
  window.onload = init;
});
