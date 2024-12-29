/** @format */

const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "677060c460a208ee1fdede6b";
let allToDos = [];
const loadingScreen = document.querySelector(".loading");

getAllToDos();

formElement.addEventListener("submit", (e) => {
	e.preventDefault();
	addTodo();
});

async function addTodo() {
	showLoading();

	if (!inputElement.value.trim()) {
		toastr.error("Input is empty");
		return;
	}

	const todo = {
		title: inputElement.value,
		apiKey: apiKey,
	};
	const obj = {
		method: "POST",
		body: JSON.stringify(todo),
		headers: {
			"Content-Type": "application/json",
		},
	};
	try {
		const response = await fetch(
			"https://todos.routemisr.com/api/v1/todos",
			obj
		);
		if (response.ok) {
			const data = await response.json();
			if (data.message === "success") {
				toastr.success("Added Successfully");
				await getAllToDos();
				formElement.reset();
			}
		} else {
			toastr.error("Failed to add todo");
		}
	} catch (error) {
		console.error("Error adding todo:", error);
		toastr.error("Something went wrong while adding the task.");
	}
	hideLoading();
}

async function getAllToDos() {
	showLoading();

	try {
		const response = await fetch(
			`https://todos.routemisr.com/api/v1/todos/${apiKey}`
		);
		if (response.ok) {
			const data = await response.json();
			if (data.message === "success") {
				allToDos = data.todos;
				displayData();
			}
		}
	} catch (error) {
		console.error("Error fetching todos:", error);
	}
	hideLoading();
}

function displayData() {
	let cartona = "";
	for (const todo of allToDos) {
		cartona += `
      <li class="border-bottom pb-2 my-2 w-100 d-flex justify-content-between align-items-center">
          <span class="taskName ${todo.completed ? "completed-task" : ""}" 
              data-id="${todo._id}" 
              onclick="${
								todo.completed
									? `cancelComplete('${todo._id}')`
									: `markComplete('${todo._id}')`
							}">
          ${todo.title}
          </span>
          <div class="d-flex align-items-center gap-3 ms-auto">
              ${
								todo.completed
									? `<span class="correctIcon"><i class='fa-regular fa-circle-check fs-4' style='color: #63E6BE;'></i></span>`
									: ""
							}
              <span class="trash-icon" onclick="deleteTodo('${todo._id}')">
                  <i class="fa-solid fa-trash-can trash"></i>
              </span>
          </div>
      </li>`;
	}
	document.querySelector(".task-container").innerHTML = cartona;
	changeProgress();
}

async function deleteTodo(idTodo) {
	Swal.fire({
		title: "Are you sure?",
		text: "You won't be able to revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!",
	}).then(async (result) => {
		if (result.isConfirmed) {
			showLoading();

			const toDoData = { todoId: idTodo };
			const obj = {
				method: "DELETE",
				body: JSON.stringify(toDoData),
				headers: {
					"Content-Type": "application/json",
				},
			};
			try {
				const response = await fetch(
					"https://todos.routemisr.com/api/v1/todos",
					obj
				);
				if (response.ok) {
					const data = await response.json();
					if (data.message === "success") {
						await getAllToDos();
					}
				}
			} catch (error) {
				console.error("Error deleting todo:", error);
			}

			Swal.fire({
				title: "Deleted!",
				text: "Your ToDo has been deleted.",
				icon: "success",
			});
			hideLoading();
		}
	});
}

async function markComplete(idTodo) {
	Swal.fire({
		title: "Are you sure to make it complete?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, Complete it!",
	}).then(async (result) => {
		if (result.isConfirmed) {
			showLoading();

			const toDoData = { todoId: idTodo };
			const obj = {
				method: "PUT",
				body: JSON.stringify(toDoData),
				headers: {
					"Content-Type": "application/json",
				},
			};
			try {
				const response = await fetch(
					"https://todos.routemisr.com/api/v1/todos",
					obj
				);
				if (response.ok) {
					const data = await response.json();
					if (data.message === "success") {
						await getAllToDos();
					}
				}
			} catch (error) {
				console.error("Error marking todo as complete:", error);
			}

			Swal.fire({
				title: "Completed!",
				text: "Your ToDo has been Completed.",
				icon: "success",
			});
			hideLoading();
		}
	});
}
function showLoading() {
	loadingScreen.classList.remove("d-none"); // Show Loading
}

function hideLoading() {
	loadingScreen.classList.add("d-none"); // hide Loading
}

async function changeProgress() {
	const completedTaskNumber = allToDos.filter((todo) => todo.completed).length;
	const totalTask = allToDos.length;
  
	document.getElementById("progress").style.width = `${(completedTaskNumber / totalTask) * 100}%`;
  
	const statusNumber = document.querySelectorAll(".status-number span");
	statusNumber[0].innerHTML = completedTaskNumber;
	statusNumber[1].innerHTML = totalTask;
  }

// async function cancelComplete(idTodo) {
// 	Swal.fire({
// 		title: "Are you sure to cancel completion?",
// 		icon: "warning",
// 		showCancelButton: true,
// 		confirmButtonColor: "#3085d6",
// 		cancelButtonColor: "#d33",
// 		confirmButtonText: "Yes, Cancel it!",
// 	}).then(async (result) => {
// 		if (result.isConfirmed) {
// 			const toDoData = { todoId: idTodo };
// 			const obj = {
// 				method: "PUT",
// 				body: JSON.stringify(toDoData),
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			};
// 			try {
// 				const response = await fetch(
// 					"https://todos.routemisr.com/api/v1/todos",
// 					obj
// 				);
// 				if (response.ok) {
// 					const data = await response.json();
// 					if (data.message === "success") {
// 						// Remove the 'completed-task' class from the task element
// 						const taskElement = document.querySelector(
// 							`.taskName[data-id='${idTodo}']`
// 						);
// 						if (taskElement) {
// 							taskElement.classList.remove("completed-task");
// 						}

// 						// Remove the checkmark icon
// 						const checkIcon = document.querySelector(
// 							`.taskName[data-id='${idTodo}'] + .d-flex .correctIcon`
// 						);
// 						if (checkIcon) {
// 							checkIcon.remove();
// 						}

// 						// Re-fetch and update the task list
// 						// await getAllToDos();
// 					} else {
// 						toastr.error("Failed to cancel completion");
// 					}
// 				} else {
// 					toastr.error("Failed to cancel todo completion");
// 				}
// 			} catch (error) {
// 				console.error("Error canceling todo completion:", error);
// 				toastr.error("Something went wrong while canceling the task.");
// 			}

// 			Swal.fire({
// 				title: "Cancelled!",
// 				text: "The ToDo completion has been cancelled.",
// 				icon: "success",
// 			});
// 		}
// 	});
// }
