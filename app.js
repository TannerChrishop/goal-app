var model = (function () {
    
    var todoObj = {
        one: [],
        two: [],
        three: []
    };
    
    function Goal(val, wager) {
        
        this.val = val;
        this.completed = false;
        if (wager > 0) {
            this.wager = wager;
        } else {
            this.wager = 0;
        }
    }
    
    var points = {
        one: 0,
        two: 0,
        three: 0
    };
    
    return {
        addGoal: function () {
            
            return {
                newGoal: function (val, type, wager) {
                    
                    var newGoal = new Goal(val, wager);
                    todoObj[type].push(newGoal);
                },
                
                spliceGoal: function (type, position) {
                    
                    todoObj[type].splice(position, 1);
                },
                
                editGoal: function (type, pos, val) {
                  
                    todoObj[type][pos].val = val;
                    
                },
                
                toggle: function (type, pos) {
                    
                    var goalToggled = todoObj[type][pos];
                    
                    if (goalToggled.completed) {
                        goalToggled.completed = false;
                        points[type] -= (goalToggled.wager * 2) + 1;
                    } else {
                        todoObj[type][pos].completed = true;
                        points[type] += (goalToggled.wager * 2) + 1;
                    }
                },
            
                getGoals: function () {
                    
                    return todoObj;
                },
                
                getPoints: function () {
                    
                    return points;
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
            field: document.getElementById('textInput'),
            type: document.getElementById('typeSelect'),
            wager: document.getElementById('wager')
        },
        
        lists: lists,
        
        pointContaiers: {
            one: document.getElementById('p1'),
            two: document.getElementById('p2'),
            three: document.getElementById('p3')
        },
        
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
    var pointBoxes = viewAccess.pointContaiers;
    var points = goal.getPoints();
    
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
            var edit = document.getElementById('edit');
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
            pointBoxes[type].innerHTML = " " + points[type];
            viewAccess.render(type, goal);
        }
    }
    
    function getInput() {
        
        var val = input.field.value.trim();
        if (val) {
            var wager = input.wager.value;
            var type = input.type.value;
            if (wager <= points[type]) {
                goal.newGoal(val, type, wager);
                viewAccess.render(type, goal);
                if (wager > 0) {
                    points[type] -= wager;
                    pointBoxes[type].innerHTML = " " + points[type];
                }
                input.field.value = '';
                input.wager.value = '';
            } else {
                alert('Complete more goals of the same tier to wager that much');
            }
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