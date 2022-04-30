class Todolist {
    constructor(todolist) {
        this.todolist = todolist;
        this.contexts = [];
    }

    addContext(type, number) {
        console.log("in addContext")
        console.log("Type" + type)
        console.log.log("Number" + number)
        this.constexts.push(new Context(type, number));
    }
}

class Context {
    constructor(type, number) {
        this.type = type;
        this.number = number;
    }
}

class TodolistService {
    static url = "https://crudcrud.com/api/e3fa705a51e1409bbd20fff7ef55201b/unicorns";

    static getAllTodolists() {
        return $.get(this.url);
    }

    static getTodolist(id) {
        return $.get(this.url + `/${id}`);
    }

    static createTodolist(todolist) {
        console.log("todolist create" + todolist)
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(todolist),
            contentType: 'application/json',
            type: "POST"
        });
    }

    static updateTodolist(todolist) {
        console.log("todolist update" + todolist);
        return $.ajax({
            url: this.url + `/${todolist._id}`,
            dataType: 'json',
            data: JSON.stringify({
                "todolist": todolist.todolist,
                "contexts": todolist.contexts
            }),
            contentType: 'application/json',
            type: 'PUT'
        });
    };

    static deleteTodolist(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: "DELETE"
        })
    }
}

class DOMManager {
    static todolists;

    static getAllTodolists() {
        console.log("inside getAllTodolists")
        TodolistService.getAllTodolists().then(todolists => this.render(todolists));
    }

    static createTodolist(type) {
        console.log("inside DOMManager createTodolist")
        TodolistService.createTodolist(new Todolist(type))
            .then(() => {
                return TodolistService.getAllTodolists();
            })
            .then((todolists) => this.render(todolists));
    }

    static deleteTodolist(id) {
        TodolistService.deleteTodolist(id)
            .then(() => {
                return TodolistService.getAllTodolists();
            })
            .then((todolists) => this.render(todolists));
    }

    static addContext(id) {
        console.log(this.todolist + "this.todolist in static AddContext")
        console.log("This is the type of variable" + typeof this.todolist)
        console.log(this.todolist)
        for (let todolist of this.todolists) {
            console.log("Hooray in the for loop")
            if (todolist._id == id) {
                console.log("Hooray in the for if")
                todolist.contexts.push(new Context($(`#${todolist._id}-context-type`).val(), $(`#$(todolist._id}-context-type`).val()));
                TodolistService.updateTodolist(todolist)
                    .then(() => {
                        return TodolistService.getAllTodolists();
                    })
                    .then(todolists => this.render(todolists));
                console.log(this.todolists);
                console.log("Hooray bottom of if statement")
            }
        }
        console.log("bottom of addContext method")
    }

    static deleteContext(todolistId, contextType) {
        for (let todolist of this.todolists) {
            if (todolist._id == todolistId) {

                todolist.contexts = todolist.contexts.filter(function (e) {

                    return e.type != contextType;
                });
                TodolistService.updateTodolist(todolist)
                    .then(() => {
                        return TodolistService.getAllTodolists();
                    })
                    .then(todolists => this.render(todolists));
            }
        }
    }

    static render(todolists) {
        this.todolists = todolists;
        $("#app").empty();
        for (let todolist of todolists) {
            $("#app").prepend(
                `<div id="${todolist._id}" class= "card text-black bg-light mb-3">
                    <div class="card-header">
                    <h2>${todolist.todolist}<h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteTodolist('${todolist._id}')">Delete</button>
                    </div>
                    <div class="card=body">
                        <div class="card text-black bg-light mb-3">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${todolist._id}-context-type" class="form-control" placeholder="Tasks context">
                                    </div>
                                    <div class="col-sm">
                                        <input type="text" id="${todolist._id}-context-number" class="form-control" placeholder="Number of tasks">
                                        </div>
                                    </div>
                                    <button id="${todolist._id}-new-context" onclick="DOMManager.addContext('${todolist._id}')" class="btn btn-primary form-control">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>`
            );

            for (let context of todolist.contexts) {
                $(`#${todolist._id}`).find("a.card-body").append(
                    `<p>
                        <span id="name-${context.type}"><strong>Type:  </strong> ${context.type}</span>
                        <span id="number-${context.number}"><strong>Number  </strong> ${context.number}</span><br>
                        <button class="btn btn-danger" onclick="DOMManager.deleteContext('${todolist._id}', '${todolist.type}')">Delete Context</button>`
                );
            }
        }
    }
}
$('#create-new-todolist').click(() => {
    DOMManager.createTodolist($('#new-todolist-type').val());
    $('#new-todolist-type').val('');
    console.log("new todolist name")
    console.log($('#new-todolist-type').val(''))
});


DOMManager.getAllTodolists();
