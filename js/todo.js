/*jshint browser:true*/
$(function() {
  'use strict';

  var room, listKey, items;
  var connectUrl = 'CONNECT_URL_HERE';

  // Initialize our homemade view
  var todoList = new TodoList({
    list: $("#list"),
    form: $("form[name=todos]")
  });

  // Connect to the GoInstant platform
  var connect = goinstant.connect(connectUrl);

  // Lookup the connected user's info
  connect.then(function(res) {
    room = res.rooms[0];
    listKey = room.key('/todo-list');

    return listKey.get();

  // Populate the list with existing items
  }).then(function(res) {
    items = res.value || [];
    _.each(items, _loadItem);

  // Attach listeners for new items
  }).finally(function() {
    listKey.on('add', { local: true }, _handleAdd);
    listKey.on('remove', { local: true, bubble: true }, _handleRemove);

    todoList.submit(_handleForm);
    todoList.markComplete(_handleComplete);

  // Listen for errors
  }).fail(function(err) {
    console.error(err);
  });

  function _loadItem(item, id) {
    todoList.addTask(item.title, id);
  }

  function _handleForm(err, title) {
    listKey.add({
      title: title
    });
  }

  function _handleComplete(err, id) {
    var key = listKey.key(id);
    key.remove();
  }

  function _handleRemove(value, context) {
    var id = _idFromKey(context.key);
    todoList.removeTask(id);
  }

  function _handleAdd(item, id, context) {
    if (!_.isString(id)) {
      context = id;
      id = _idFromKey(context.addedKey);
    }

    return todoList.addTask(item.title, id);
  }

  function _idFromKey(key) {
    var value = key.replace(listKey.name + '/', '');
    return value;
  }
});
