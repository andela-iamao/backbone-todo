var app = app || {};

var TodoView = Backbone.View.extend({
  tagName: 'li',

  id: 'no-li-style',

  template: _.template($('#item-template').html()),

  events: {
    'click .toggle': 'togglecompleted',
    'click .destroy': 'clear',
    'click .edit-btn': 'edit',
    'click .edit-note': 'editNote',
    'click .cancel-edit-note': 'cancelEditNote',
    'click .show-note': 'showNote',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());
  },

  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return (
      (!isCompleted && app.TodoFilter === 'completed')
      ||
      (isCompleted && app.TodoFilter === 'active')
    );
  },

  togglecompleted: function() {
    this.model.toggle();
  },

  edit: function() {
    this.$el.addClass('editing');
    this.$input.addClass('show-edit');
    this.$input[0].disabled = false;
    this.$input.focus();
  },

  showNote: function () {
    if (this.$('div.show-edit')[0]) {
      this.cancelEditNote();
      return;
    }
    this.$('div.hide-edit').addClass('show-edit');
    this.$('.todo-note').focus();
  },

  cancelEditNote: function () {
    this.$('.todo-note').val('');
    this.$('div.hide-edit').removeClass('show-edit');
  },

  editNote: function () {
    console.log('save');
    var note = this.$('.todo-note').val().trim();
    if(note) {
      this.model.save({ notes: note });
    }
    this.$('div.hide-edit').removeClass('show-edit');
  },

  close: function() {
    this.$input[0].disabled = true;
    var value = this.$input.val().trim();

    if(value) {
      this.model.save({ title: value });
    }

    this.$el.removeClass('editing');
    this.$input.removeClass('show-edit');
  },

  updateOnEnter: function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  clear: function () {
    this.model.destroy();
  }
});

app.TodoView = TodoView;