(function() {
  const input = $("input");
  const toDoList = $("#list");

  input.on("keyup", function(event) {
    if (event.keyCode == 13) {
      console.log("enter");

      addToDo();
    }
  });

  function addToDo() {
    let toDo = input.val();
    toDoList.append(`<div class="check"></div><div class="item">${toDo}</div>`);
    console.log(toDo);
  }
})();
