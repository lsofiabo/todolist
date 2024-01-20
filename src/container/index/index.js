export class TodoList {
    static #STORAGE_KEY = 'todos';

    static #saveData = () => {
        localStorage.setItem(
            this.#STORAGE_KEY,
            JSON.stringify({
                todos: this.#todos,
                count: this.#count,
            }),
        );
    };

    static #loadData = () => {
        const data = localStorage.getItem(
            this.#STORAGE_KEY,
        );

        if (data) {
            const { todos, count } = JSON.parse(data);
            this.#todos = todos;
            this.#count = count;
        }
    };

    static #todos = [];
    static #count = 0;

    static #createTaskData = (text) => {
        this.#todos.push({
            id: ++this.#count,
            text,
            done: false,
        });
    };

    static #block = null;
    static #template = null;
    static #input = null;
    static #button = null;

    static init = () => {
        this.#template =
            document.getElementById(
                'task-template',
            ).content;
        this.#block = document.querySelector('.todolist');

        this.#input = document.querySelector('input');
        this.#button = document.getElementById(
            'add-task-button',
        );
        this.#button.onclick = this.#handleAdd;

        this.#loadData();
        this.#render();
    };

    static #render = () => {
        this.#block.innerHTML = '';

        if (this.#count === 0) {
            this.#block.innerHTML = 'No tasks';
        } else {
            this.#todos.forEach((taskData) => {
                const el =
                    this.#createTaskElement(taskData);
                this.#block.append(el);
            });
        }
    };

    static #createTaskElement = (taskData) => {
        const el = this.#template.cloneNode(true);

        const [id, text, btnDo, btnDel] =
            el.children[0].children;

        id.innerHTML = `${taskData.id}. `;
        text.innerHTML = taskData.text;

        btnDo.onclick = this.#handleDo(
            taskData,
            btnDo,
            el.children[0],
        );
        btnDel.onclick = this.#handleDelete(taskData);

        if (taskData.done) {
            el.children[0].classList.add('task--done');
            btnDo.classList.add('task__button--done');
            btnDo.children[0].src = '/svg/done.svg';
        }

        return el;
    };

    static #handleAdd = () => {
        if (this.#input.value === '') {
            return;
        }
        this.#createTaskData(this.#input.value);
        this.#input.value = '';
        this.#render();
        this.#saveData();
    };

    static #handleDelete = (data) => () => {
        console.log(data);
        const result = this.#deleteById(data.id);
        if (result) {
            this.#render();
            this.#saveData();
        }
    };

    static #handleDo = (data, btn, el) => () => {
        const task_status = this.#toggleDone(data.id);
        el.classList.toggle('task--done');
        btn.classList.toggle('task__button--done');
        if (task_status) {
            btn.children[0].src = '/svg/done.svg';
        } else {
            btn.children[0].src = '/svg/do.svg';
        }
        this.#saveData();
    };

    static #deleteById = (id) => {
        const prevCount = this.#count;
        this.#todos = this.#todos.filter(
            (task) => task.id !== id,
        );
        this.#count = this.#todos.length;
        if (prevCount > this.#count) {
            return true;
        }
    };

    static #toggleDone = (id) => {
        let foundTask = this.#todos.find(
            (x) => x.id === id,
        );
        return (foundTask.done = !foundTask.done);
    };
}

TodoList.init();
window.todolist = TodoList;
