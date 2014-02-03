/*jshint browser:true*/
var TodoList = (function(_, $) {
  'use strict';

  function TodoList(opts) {
    this.$list = opts.list;
    this.$form = opts.form;
    this.$input = this.$form.find('input[name=title]');
  }

  TodoList.prototype.submit = function(cb) {
    var self = this;
    this.$form.on('submit', function(e) {
      e.preventDefault();

      var title = self.$input.val();
      self.$input.val('');

      return cb(null, title);
    });
  };

  TodoList.prototype.markComplete = function(cb) {
    var self = this;
    $(document.body).on('click', 'input[type=checkbox]', function() {
      var $item = $(this);
      if ($item.is(':checked')) {
        var id = $item.val();

        return cb(null, id);
      }
    });
  };

  TodoList.prototype.removeTask = function(id) {
    var self = this;
    var selector = 'input[type=checkbox][value=' + id + ']';
    var $li = self.$list.find(selector).parents('li');
    $li.fadeOut(function() {
      $li.remove();

      if (self.$list.find('li').length < 1) {
        var $empty = $('<li></li>').text('You have completed all of your tasks!');
        $empty.attr('data-empty', true);

        self.$list.append($empty);
      }
    });
  };

  TodoList.prototype.addTask = function(title, id) {
    if (this.$list.children('li:first').data('empty')) {
      this.$list.empty();
    }

    var $li = $('<li></li>');
    $li.text(' ' + title).prepend(this._checkbox(id));

    this.$list.append($li);
  };

  TodoList.prototype._checkbox = function(id) {
    var $checkbox = $('<input type="checkbox">').val(id);
    return $checkbox;
  };

  return TodoList;
})(_, $);
