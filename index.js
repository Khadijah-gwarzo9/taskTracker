document.addEventListener("DOMContentLoaded", (event) => {
  let taskInput = document.getElementById("taskInput");
  let timeInput = document.getElementById("timeInput");
  let submit = document.getElementById("submitTaskBtn");
  let card = document.querySelector(".card");

  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      if (taskInput.value.trim() == "") {
        alert("You must write something!");
      }
    }
  });

  submit.addEventListener("click", function (e) {
    e.preventDefault();
    let taskName = taskInput.value.trim();
    let taskTime = timeInput.value.trim();

    if (taskName !== "") {
      let newTask = {
        name: taskName,
        time: taskTime || "No Time",
        status: "Pending",
      };

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      let taskList = document.querySelector(".taskList ul");
      let li = document.createElement("li");
      li.innerHTML = `
        <label class="checkbox-container">
          <input class="custom-checkbox" type="checkbox" />
          <span class="checkmark"></span>
        </label>
        <span class="taskName"><b>${taskName}</b></span>
        <span class="taskStatus"><i>Pending</i></span>
        <span class="taskTime">${taskTime || "No Time"}</span>
        <div class="actions">
          <button class="viewBtn"><i class="bi bi-eye"></i></button>
          <button class="editBtn"><i class="bi bi-pencil-square"></i></button>
          <button class="deleteBtn"><i class="bi bi-trash"></i></button>
        </div>
      `;
      // Add the new task to the list
      taskList.appendChild(li);

      alert("Task added successfully");

      // Clear input fields
      taskInput.value = "";
      timeInput.value = "";

      setReminder(taskName, taskTime);

      // Attach event listeners to newly appended buttons
      let viewBtn = li.querySelector(".viewBtn");
      let editBtn = li.querySelector(".editBtn");
      let deleteBtn = li.querySelector(".deleteBtn");
      let checkbox = li.querySelector(".custom-checkbox");

      // view button
      viewBtn.addEventListener("click", function () {
        // task details
        let taskItem = li;
        let taskName = taskItem.querySelector(".taskName").innerText;
        let taskTime = taskItem.querySelector(".taskTime").innerText;
        let taskStatus = taskItem.querySelector(".taskStatus").innerText;

        // Update view popup with task details
        document.getElementById("viewTaskName").innerText = taskName;
        document.getElementById("viewTaskTime").innerText = taskTime;
        document.getElementById("viewTaskStatus").innerText = taskStatus;

        // Calculate remaining time
        let currentTime = new Date();
        let dueTime = new Date(taskTime);
        let timeDifference = dueTime - currentTime;
        let remainingMinutes = Math.ceil(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

        //view popup
        viewPopup.classList.add("open-view");
        document.getElementById("viewRemainingTime").innerText = `${remainingMinutes} minutes`;
      });

      checkbox.addEventListener("change", function () {
        newTask.status = this.checked ? "Completed" : "Pending";
        li.querySelector(".taskStatus").innerHTML = `<i>${newTask.status}</i>`;
        updateTaskInLocalStorage(newTask);
      });

      editBtn.addEventListener("click", function () {
        editedTaskInput.value = taskName;
        editedTimeInput.value = taskTime;
        openEditModal(newTask, li);
      });

      deleteBtn.addEventListener("click", function () {
        let text = "Are you sure you want to delete this?";
        if (confirm(text) == true) {
          let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
          let index = tasks.findIndex(
            (task) => task.name === newTask.name && task.time === newTask.time
          );
          if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            li.remove();
          }
        }
      });
    } else {
      alert("Please fill in both task and time.");
    }
  });
  timeInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      submit.click(); 
    }
  });

  function setReminder(taskName, taskTime) {
    let currentTime = new Date();
    let dueTime = new Date(taskTime);

    let timeDifference = dueTime - currentTime;

    if (timeDifference > 0) {
      setTimeout(() => {
        alert(`Reminder: Task "${taskName}" is due now!`);

        // Update remaining time in the view popup
        let remainingMinutes = Math.ceil(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
        document.getElementById("viewRemainingTime").innerText = `${remainingMinutes} minutes`;

        // update the task status
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let taskToUpdate = tasks.find((task) => task.name === taskName && task.time === taskTime);
        if (taskToUpdate) {
          taskToUpdate.status = "Overdue";
          updateTaskInLocalStorage(taskToUpdate);
        }
      }, timeDifference);
    }
  }
//event listeners for list items
  let viewAll1 = document.querySelector(".viewAllBtn1");
  let popup = document.getElementById("popup");
  let closePopup = document.querySelector(".close2");

  viewAll1.addEventListener("click", function () {
    popup.classList.add("open-popup");
  });

  closePopup.addEventListener("click", function () {
    popup.classList.remove("open-popup");
  });

  let viewBtns = document.querySelectorAll(".viewBtn");
  let viewPopup = document.getElementById("viewPopup");
  let closeView = document.querySelector(".close3");

  viewBtns.forEach(function (viewBtn) {
    viewBtn.addEventListener("click", function () {
      viewPopup.classList.add("open-view");
    });
  });

  let addNewTask = document.querySelector("#addNewTask");
  addNewTask.addEventListener("click", function () {
    card.style.display = "none";
    popup.classList.remove("open-popup");
    card.style.display = "block";
  });

  closeView.addEventListener("click", function () {
    viewPopup.classList.remove("open-view");
  });

  
  let editModal = document.getElementById("editModal");
  let closeModal = document.querySelector(".close");
  // Function to open edit modal
  function openEditModal(task, listItem) {
    editedTaskitem = listItem;
    editedTaskInput.value = task.name;
    editedTimeInput.value = task.time;
    editModal.style.display = "block";
  }

  // Function to close edit modal
  function closeEditModal() {
    editModal.style.display = "none";
  }
  closeModal.addEventListener("click", function () {
    closeEditModal();
  });
  // Event listener to close edit modal when outside modal area is clicked
  window.addEventListener("click", function (event) {
    if (event.target == editModal) {
      closeEditModal();
    }
  });
  //update edited tasks
  let updateBtn = document.getElementById("updateBtn");
  let editedTaskInput = document.getElementById("editedTaskInput");
  let editedTimeInput = document.getElementById("editedTimeInput");
  let editedTaskitem = null;

  updateBtn.addEventListener("click", function () {
    let updatedTaskName = editedTaskInput.value.trim();
    let updatedTaskTime = editedTimeInput.value.trim();

    if (updatedTaskName !== "" && updatedTaskTime !== "") {
      editedTaskitem.querySelector(
        ".taskName"
      ).innerHTML = `<b>${updatedTaskName}</b>`;
      editedTaskitem.querySelector(".taskTime").innerText = updatedTaskTime;

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let index = tasks.findIndex(
        (task) => task.name === updatedTaskName && task.time === updatedTaskTime
      );
      if (index !== -1) {
        tasks[index].name = updatedTaskName;
        tasks[index].time = updatedTaskTime;

        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      closeEditModal();
      alert("Task updated successfully!");
    }
    updateTaskInLocalStorage(tasks);
  });

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // task list element
  let taskList = document.querySelector(".taskList ul");

  // Loop through each task and create HTML elements
  tasks.forEach(function (task) {
    let li = document.createElement("li");
    li.innerHTML = `
      <label class="checkbox-container">
        <input class="custom-checkbox" type="checkbox" ${
          task.status === "Completed" ? "checked" : ""
        } />
        <span class="checkmark"></span>
      </label>
      <span class="taskName"><b>${task.name}</b></span>
      <span class="taskStatus">${task.status}</span>
      <span class="taskTime">${task.time || "No Time"}</span>
      <div class="actions">
        <button class="viewBtn"><i class="bi bi-eye"></i></button>
        <button class="editBtn"><i class="bi bi-pencil-square"></i></button>
        <button class="deleteBtn"><i class="bi bi-trash"></i></button>
      </div>
    `;
    // Add the new task to the list
    taskList.appendChild(li);

    // Attach event listeners to buttons within the task element
    let viewBtn = li.querySelector(".viewBtn");
    let editBtn = li.querySelector(".editBtn");
    let deleteBtn = li.querySelector(".deleteBtn");
    let checkbox = li.querySelector(".custom-checkbox");

    viewBtn.addEventListener("click", function () {
      // Display task details
      document.getElementById("viewTaskName").innerText = task.name;
      document.getElementById("viewTaskTime").innerText = task.time;
      document.getElementById("viewTaskStatus").innerText = task.status;

      // Calculate remaining time
      let currentTime = new Date();
      let dueTime = new Date(task.time);
      let timeDifference = dueTime - currentTime;
      let remainingMinutes = Math.ceil(timeDifference / (1000 * 60)); // Convert milliseconds to minutes

      viewPopup.classList.add("open-view");
      document.getElementById("viewRemainingTime").innerText = `${remainingMinutes} minutes`;
    });

    checkbox.addEventListener("change", function () {
      if (this.checked) {
        task.status = "Completed";
      } else {
        task.status = "Pending";
      }
      // Update task status in local storage
      updateTaskInLocalStorage(task);
      // Update task status in task list
      li.querySelector(".taskStatus").innerText = task.status;
    });

    editBtn.addEventListener("click", function () {
      openEditModal(task, li);
    });

    deleteBtn.addEventListener("click", function () {
      let text = "Are you sure you want to delete this?";
      if (confirm(text) == true) {
        let index = tasks.indexOf(task);
        if (index !== -1) {
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          li.remove();
        }
      }
    });
  });

  // Function to update task status in local storage
  function updateTaskInLocalStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let index = tasks.findIndex(
      (task) => task.name === updatedTask.name && task.time === updatedTask.time
    );
    if (index !== -1) {
      tasks[index].status = updatedTask.status;
      tasks[index].name = updatedTask.name;
      tasks[index].time = updatedTask.time;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  function updateTaskStatus() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentTime = new Date();

    tasks.forEach(function (task) {
      let taskTime = new Date(task.time);
      if (taskTime <= currentTime && task.status !== "Completed") {
        task.status = "Completed";
        let taskItem = taskList.querySelector(
          `.taskName:contains('${task.name}')`
        );
        if (taskItem) {
          taskItem.nextElementSibling.innerHTML = `<i>Completed</i>`;
        }
        updateTaskInLocalStorage(task);
      }
    });
  }

  // load tasks from local storage
  updateTaskStatus();

  // Call updateTaskStatus periodically (every minute in this example)
  setInterval(updateTaskStatus, 60000); // 60000 milliseconds = 1 minute

  console.log("DOM fully loaded and parsed");
});
