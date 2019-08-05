(function() {
  const input = $("input");
  const list = $("#list");
  const status = $("#status-bar");
  const select = $("#select-all");
  const clear = $("#clear");
  const filters = $("#filters");
  let count = 0;

  // add to-dos
  input.on("keyup", function(event) {
    if (event.keyCode == 13) {
      console.log("enter");

      addToDo();
      input.val("");
    }
  });

  // edit to-dos by double-clicking
  list.on("dblclick", ".todo", function(event) {
    let target = event.currentTarget;
    let value = target.innerHTML;

    $(target).html(`<input name="edit" type="text" value="${value}">`);

    // puts cursor at the end of input field
    $("input[name=edit]")
      .putCursorAtEnd()
      .on("focus", function() {
        $("input[name=edit]").putCursorAtEnd();
      });

    $(target).on("keyup", function(event) {
      if (event.keyCode == 13) {
        let newValue = $("input[name=edit]").val();
        $(target).html(newValue);
      }
    });
    event.stopPropagation;
  });

  /////
  // Move Cursor To End of Input (CSS Tricks)
  jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {
      // Cache references
      var $el = $(this),
        el = this;

      // Only focus if input isn't already
      if (!$el.is(":focus")) {
        $el.focus();
      }

      // If this function exists... (IE 9+)
      if (el.setSelectionRange) {
        // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
        var len = $el.val().length * 2;

        // Timeout seems to be required for Blink
        setTimeout(function() {
          el.setSelectionRange(len, len);
        }, 1);
      } else {
        // As a fallback, replace the contents with itself
        // Doesn't work in Chrome, but Chrome supports setSelectionRange
        $el.val($el.val());
      }

      // Scroll to the bottom, in case we're in a tall textarea
      // (Necessary for Firefox and Chrome)
      this.scrollTop = 999999;
    });
  };
  /////

  // check/uncheck to-dos
  list.on("click", ".check", function(event) {
    let target = event.currentTarget;

    if (target.checked) {
      count--;
      addCompleted(target);
    } else {
      count++;
      removeCompleted(target);
    }
    updateTaskCounter();
  });

  // select/unselect all
  select.on("click", function() {
    $(".item").each(function() {
      let checkbox = this.firstElementChild;

      if (checkbox.checked === true) {
        count++;
        $(checkbox).prop("checked", false);
        removeCompleted(checkbox);
      } else {
        count--;

        $(checkbox).prop("checked", true);
        addCompleted(checkbox);
      }
    });
    updateTaskCounter();
  });

  // clear completed
  clear.on("click", function(event) {
    $(".completed").each(function() {
      this.remove();
    });
    if (!$(".completed").length && count <= 0) {
      hideList();
    }
  });

  // delete to-dos
  list.on("click", ".delete", function(event) {
    count--;

    let parent = $(event.currentTarget)
      .parent()
      .eq(0);
    parent.remove();

    if ($(".item").length < 1) {
      hideList();
    }
    updateTaskCounter();
  });

  // filters
  filters.on("click", function(event) {
    let target = event.target;
    console.log(event);

    if (target.innerText === "All") {
      $(target.parentElement)
        .find("div")
        .removeClass("active");
      $(target).addClass("active");
      list.find(".item").show();
    } else if (target.innerText === "Active") {
      $(target.parentElement)
        .find("div")
        .removeClass("active");

      $(target).toggleClass("active");
      list.find(".item").show();
      list.find(".completed").hide();
    } else {
      $(target.parentElement)
        .find("div")
        .removeClass("active");

      $(target).toggleClass("active");
      list.find(".item").hide();
      list.find(".completed").show();
    }
  });

  function addToDo() {
    count++;

    let toDo = input.val();
    showList();

    list.append(`<div class="item">
      <input type="checkbox" class="check"><label></label>
      <div class="todo">${toDo}</div>
      <div class="delete">
        ✕
      </div>
    </div>`);

    updateTaskCounter();
  }

  function showList() {
    list.css({ display: "block" });
    status.css({ display: "block" });
    select.css({ visibility: "visible" });
  }

  function hideList() {
    count = 0;
    list.css({ display: "none" });
    status.css({ display: "none" });
    select.css({ visibility: "hidden" });
  }

  function addCompleted(target) {
    $(target)
      .closest(".item")
      .addClass("completed");

    clear.css({ visibility: "visible" });
  }

  function removeCompleted(target) {
    $(target)
      .closest(".item")
      .removeClass("completed");

    if ($(".completed").length < 1) {
      clear.css({ visibility: "hidden" });
    }
  }

  function updateTaskCounter() {
    console.log(count);
    if (count === 1) {
      $(".count").html(`${count} task left`);
    } else {
      $(".count").html(`${count} tasks left`);
    }
  }
})();
