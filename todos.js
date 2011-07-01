Todos = SC.Application.create();

Todos.Todo = SC.Object.extend({
  title: null,
  isDone: false
});

Todos.todosController = SC.ArrayProxy.create({
  content: [],

  contentTitles: function() { 
    console.log('contentTitles');
    return this.get('content').map(function(e) { return e.get('title'); });
  }.property('content.@each.title').cacheable(),

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title });
    this.pushObject(todo);
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = SC.View.extend({
  remainingBinding: 'Todos.todosController.remaining',

  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
});

Todos.CreateTodoView = JQueryUI.AutocompleteTextField.extend({
  contentBinding: "Todos.todosController",

  source: function(req, res) { 
    var options = this.options.sc_view.get('content').get('contentTitles');
    res(options);
  },

  selectTarget: "Todos.todosController",
  selectAction: "createTodo",
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
      this.get('ui').close();
    }
  }
});

