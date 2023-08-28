// SELEÇÃO DE ELEMENTOS *************************

const localStorageKay = 'ToDoList';

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#--cancel-edit-btn");
const filterSelectElement = document.getElementById('filter-select');
const searchInput = document.querySelector("#search-input");
const todoDivs = document.querySelectorAll('#todo-list div');

let oldInputValue;

// FUNÇÕES *************************

const saveToLocalStorage = (tasks) => {
    localStorage.setItem(localStorageKay, JSON.stringify(tasks));
};

const loadFromLocalStorage = () => {
    const storedTasks = localStorage.getItem(localStorageKay);
    return storedTasks ? JSON.parse(storedTasks) : [];
};

const saveTodo = (text) => {

    // Montando toda a estrutura HTML aqui no JS
    // Criamos uma div com a class='todo' para receber os elementos filhos.

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = "<i class=\"fa-solid fa-check\"></i>"
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = "<i class=\"fa-solid fa-pen\"></i>"
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>"
    todo.appendChild(removeBtn);

    todoList.appendChild(todo); // Elemento HTML DOM (anexar filho)

    todoInput.value = ""; // limpa o campo contido no input
    
    todoInput.focus(); // O objeto focusEvent 
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    });
}

// EVENTOS *************************

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();  //Impedir que um link abra o URL

    const inputValue = todoInput.value;

    if (!inputValue) {
        alert('Campo vazio, por favor digite uma tarefa!')

    } else {
        const existingTasks = Array.from(todoList.querySelectorAll(".todo h3")).map(todoTitle => todoTitle.innerText);

        if (existingTasks.includes(inputValue)) {
            alert('Essa tarefa já existe!');
        } else {
            saveTodo(inputValue);

            const tasks = loadFromLocalStorage();

            tasks.push({
                title: inputValue,
                done: false
            });

            saveToLocalStorage(tasks);
        }
        todoInput.value = "";
        todoInput.focus();
    }
});

// Add o evento (click) através do DOM assim saberemos qual botão será clicado  
// Trabalhando com os botões DONE, EDIT, REMOVE
document.addEventListener("click", (e) => {

    const targetEl = e.target; // (target) Obtenha o elemento onde o evento ocorreu

    const parentEl = targetEl.closest("div"); // (closest) Elemento HTML DOM mais próximo() Método

    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }
    
    // TAREFA CONCLUIDA OU NÂO CONCLUIDA
    if (targetEl.classList.contains("finish-todo")) {
        // toggle (alternar)
        parentEl.classList.toggle("done");
    };

    // TAREFA REMOVIDA
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        const tasks = loadFromLocalStorage();
        const updatedTasks = tasks.filter(task => task.title !== todoTitle);
        saveToLocalStorage(updatedTasks);
    }

    // EDITAR TAREFA
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

// Evento de atualizar tarefa
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue);

        const tasks = loadFromLocalStorage();

        const updatedTasks = tasks.map(task => {
            if (task.title === oldInputValue) {
                return { ...task, title: editInputValue };
            }
            return task;
        });

        saveToLocalStorage(updatedTasks);
    }
    toggleForms();
});

// Evento filtar tarefas 
filterSelectElement.addEventListener("change", () => {

    const selectedFilter = filterSelectElement.value; // Obtém o valor selecionado no filtro

    const todos = document.querySelectorAll(".todo"); // Obtém todas as tarefas

    todos.forEach(todo => {
        const isDone = todo.classList.contains("done"); // Verifica se a tarefa está concluída

        if (selectedFilter === "all") {
            todo.style.display = "flex"; // Exibe todas as tarefas
        } else if (selectedFilter === "todo") {
            if (!isDone) {
                todo.style.display = "flex"; // Exibe apenas tarefas pendentes
            } else {
                todo.style.display = "none"; // Esconde tarefas concluídas
            }
        } else if (selectedFilter === "done") {
            if (isDone) {
                todo.style.display = "flex"; // Exibe apenas tarefas concluídas
            } else {
                todo.style.display = "none"; // Esconde tarefas pendentes
            }
        }
    });
});

// Evento de pesquisa de tarefas
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll(".todo");

    todos.forEach(todo => {
        const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        if (todoTitle.includes(searchText)) {
            todo.style.display = "flex"; // Exibe tarefas que correspondem à pesquisa
        } else {
            todo.style.display = "none"; // Oculta tarefas que não correspondem à pesquisa
        }
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const tasks = loadFromLocalStorage();
    tasks.forEach(task => {
        const { title, done } = task;
        saveTodo(title);

        const todoDiv = todoList.lastElementChild;
        if (done) {
            todoDiv.classList.add("done");
        }
    });
});
