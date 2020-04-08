const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

const createTodoElement = (todo) => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    todoItem.dataset.id = todo.id;

    if (todo.editing) {
        todoItem.className += ' edit-mode';
        todoItem.innerHTML = `
            <input type="text" value="${todo.text}" class="edit-input">
            <div class="todo-actions">
                <button class="save-btn">Save</button>
            </div>
        `;

        const input = todoItem.querySelector('.edit-input');
        const saveBtn = todoItem.querySelector('.save-btn');

        saveBtn.onclick = () => {
            const newText = input.value.trim();
            if (newText) {
                updateTodo(todo.id, { text: newText, editing: false });
            }
        };
    } else {
        todoItem.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="complete-btn">${todo.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        const completeBtn = todoItem.querySelector('.complete-btn');
        const editBtn = todoItem.querySelector('.edit-btn');
        const deleteBtn = todoItem.querySelector('.delete-btn');

        completeBtn.onclick = () => toggleComplete(todo.id);
        editBtn.onclick = () => updateTodo(todo.id, { editing: true });
        deleteBtn.onclick = () => deleteTodo(todo.id);
    }

    return todoItem;
};

const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
};

const addTodo = (text) => {
    const todo = {
        id: Date.now(),
        text,
        completed: false,
        editing: false
    };
    todos.unshift(todo);
    saveTodos();
    renderTodos();
};

const updateTodo = (id, updates) => {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
    );
    saveTodos();
    renderTodos();
};

const toggleComplete = (id) => {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
};

const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

todoForm.onsubmit = (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
};

renderTodos();