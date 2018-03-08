var model = (function () {
    
    var todoObj = {
        one: [],
        two: [],
        three: []
    };
    
    function Goal(val) {
        
        this.val = val;
        this.completed = false;
    }
    
    return {
        addGoal: function () {
            
            return {
                newGoal: function (val, type) {
                    
                    var newGoal = new Goal(val);
                    todoObj[type].push(newGoal);
                },
                
                spliceGoal: function (type, position) {
                    
                    todoObj[type].splice(position, 1);
                },
                
                editGoal: function (type, pos, val) {
                  
                    todoObj[type][pos].val = val;
                    
                },
                
                toggle: function (type, pos) {
                    
                    todoObj[type][pos].completed = !todoObj[type][pos].completed;
                },

                getGoals: function () {
                    
                    return todoObj;
                }
            };
        }
    };
}());

var view = (function () {
    
    var lists = {
        one: document.getElementById('one'),
        two: document.getElementById('two'),
        three: document.getElementById('three')
    };
    
    return {
        input: {
            field: document.querySelector('input'),
            type: document.querySelector('select')
        },
        
        lists: lists,
        
        render: function (type, goal) {
            
            var list = lists[type];
            var goals = goal.getGoals();
            var array = goals[type];
            list.innerHTML = '';
            array.forEach(function (item, index) {
                var li = document.createElement('li');
                var completedBtn = document.createElement('button');
                var editBtn = document.createElement('button');
                var deleteBtn = document.createElement('button');
                deleteBtn.className = "delete ion-trash-b";
                editBtn.className = "edit ion-edit";
                completedBtn.className = "completed ion-checkmark";
                li.appendChild(completedBtn);
                li.innerHTML = '<span>' + item.val + '</span>';
                li.id = index;
                li.appendChild(deleteBtn);
                li.appendChild(editBtn);
                if (item.completed) {
                    li.className += 'complete';
                }
                list.appendChild(li);
                editBtn.parentNode.prepend(completedBtn);
            });
        }
    };
}());

var controller = (function (modelAccess, viewAccess) {
    
    var input = viewAccess.input;
    var lists = viewAccess.lists;
    var goal = modelAccess.addGoal();
    
    function deleteGoal(e) {
            
        if (e.target.className === "delete ion-trash-b") {
            var pos = e.target.closest('li');
            var posID = pos.id;
            var type = pos.parentElement.id;
            goal.spliceGoal(type, posID);
            viewAccess.render(type, goal);
        }
    }
    
    function editGoal(e) {
            
        if (e.target.className === "edit ion-edit") {
            var text = e.target.parentElement.textContent;
            var pos = e.target.closest('li');
            var posID = pos.id;
            var type = pos.parentElement.id;
            e.target.parentElement.innerHTML = "<input id = 'edit' type = 'text' placeholder = '" +
                text + "'><button id = 'confirm'>Confirm</button><button id = 'cancel'>Cancel</button>";
            var edit =  document.getElementById('edit');
            edit.focus();
            document.getElementById('confirm').addEventListener('click', function () {
                
                var val = edit.value;
                if (val) {
                    goal.editGoal(type, posID, val);
                    viewAccess.render(type, goal);
                }
            });
            document.getElementById('cancel').addEventListener('click', function () {
                
                viewAccess.render(type, goal);
            });
        }
    }
    
    function toggleGoal(e) {
        
        if (e.target.className === "completed ion-checkmark") {
            var pos = e.target.closest('li');
            var posID = pos.id;
            var type = pos.parentElement.id;
            goal.toggle(type, posID);
            viewAccess.render(type, goal);
        }
    }
    
    function getInput() {
        
        var val = input.field.value.trim();
        if (val) {
            var type = input.type.value;
            goal.newGoal(val, type, goal);
            viewAccess.render(type, goal);
            input.field.value = '';
        }
    }
    
    document.addEventListener('keypress', function (e) {
        
        if (e.keyCode === 13) {
            getInput();
        }
    });
    
    return {
        setUpEvents: function () {
            
            var masterList = document.getElementById('list');
            masterList.addEventListener('click', deleteGoal);
            masterList.addEventListener('click', editGoal);
            masterList.addEventListener('click', toggleGoal);
        }
    };
                        
}(model, view));

controller.setUpEvents();