import React from "react";
import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";

export default function AllTasksComponent({
  update,
  handleClick,
  open,
  handleClose,
  action,
  message,
  updateMessage,
}) {
  // handles when the page gets reloaded through the useEffect
  const [pageRefresh, setPageRefresh] = useState(0);

  // holds the returned tasks in this state
  const [taskData, setTaskData] = useState([]);

  // holds state and determines if the update menu is open
  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);

  // holds the ID state for the current task being updated
  const [editTaskId, setEditTaskId] = useState(null);

  const [taskFormData, setTaskFormData] = useState({});

  // gets all the concurrent tasks on the page render
  useEffect(() => {
    const getTasks = async () => {
      // fetches the server api that has all the Tasks
      const res = await fetch("http://127.0.0.1:8000/tasks/");
      if (res.ok) {
        const data = await res.json();
        setTaskData(data);
      }
      // if not error out
      else {
        console.error("Couldn't get the Tasks :(");
      }
    };

    getTasks();
  }, [pageRefresh, update]); // renders on pageRefresh being updated

  // responsible for deleting the designated tasks
  const deleteTask = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/tasks/${id}/`, {
      method: "DELETE", // sets method
      headers: {
        "Content-Type": "application/json", // Indicates the content
      },
    });
    // if successful
    if (response.ok) {
      setPageRefresh(pageRefresh + 1); // refresh the page
      handleClick(); // makes the snackbar appear
      console.log("success");
    } else {
      // handles the errors
      console.error("Failed to delete workout:", response.statusText);
    }
  };

  // responsible for updating specific user tasks given the id, name, and description
  const updateTask = async (id, t_name, t_description) => {
    const response = await fetch(`http://127.0.0.1:8000/tasks/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_name: t_name,
        task_description: t_description,
      }),
    });
    if (response.ok) {
      console.log("Successfully updated task!");
      handleClick(); // makes the snackbar appear
      setPageRefresh(pageRefresh + 1); // refresh any visible tasks
      setEditTaskId(null); // reset the current task ID
      setIsUpdateMenuOpen(false); // set the menu being open to false to close it
    } else {
      console.error("Failed to update the task:", response.statusText);
    }
  };

  // handles setting the current task ID and setting the form data
  const handleUpdateMenu = (task) => {
    setEditTaskId(task.id);
    setTaskFormData({
      task_name: task.task_name,
      task_description: task.task_description,
    });
  };

  // handles the inputs currently being placed in by the user
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value,
    });
  };

  return (
    <>
      <div className="tasks-parent">
        {/* If there are any tasks available... */}
        {taskData ? (
          // map through all the tasks
          taskData.map((task) => (
            <div className="tasks" key={task.id}>
              {/* if the state of editTaskId is === to the currently rendered task id... */}
              {editTaskId === task.id ? (
                <>
                  {/* create the form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // prevents the default from being submitted

                      // calls the update task function passing in the current ID, name, and description as arguments
                      updateTask(
                        task.id,
                        taskFormData.task_name,
                        taskFormData.task_description
                      );
                    }}
                  >
                    <label htmlFor={`taskName-${task.id}`}>Task Name:</label>
                    {/* Name update field */}
                    <input
                      type="text"
                      id={`taskName-${task.id}`}
                      name="task_name"
                      value={taskFormData.task_name || ""}
                      onChange={handleInputChange}
                    />
                    <br />

                    <label htmlFor={`taskDescription-${task.id}`}>
                      Task Description:
                    </label>
                    {/* description update field */}
                    <input
                      type="text"
                      id={`taskDescription-${task.id}`}
                      name="task_description"
                      value={taskFormData.task_description || ""}
                      onChange={handleInputChange}
                    />
                    <br />

                    {/* toggles close the currently open menu on click */}
                    <button
                      onClick={() => {
                        setIsUpdateMenuOpen(!isUpdateMenuOpen);
                        updateMessage(`Successfully updated task: ${taskFormData.task_name}!`)
                      }}
                      type="submit"
                    >
                      Update Task
                    </button>
                    {"\t"}
                    {/* resets the state of the current task ID if the user chosses to cancel the update */}
                    <button onClick={() => setEditTaskId(null)}>Cancel</button>
                  </form>
                </>
              ) : (
                <>
                  {/* if editTaskID !== current rendered ID, hide the update menu */}
                  <h3>Task: {task.task_name}</h3>
                  <p>Description: {task.task_description}</p>
                  {/* Opens the update menu when the button is clicked */}
                  <button
                    onClick={() => {
                      handleUpdateMenu(task);
                      setIsUpdateMenuOpen(!isUpdateMenuOpen);
                    }}
                  >
                    Edit Task
                  </button>
                  {"\t"}
                  {/* calls the delete task function and deletes the current task at the current ID */}
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      updateMessage(`Successfully Deleted task: ${task.task_name}!`)
                    }}
                  >
                    Delete Task
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          // if there are no tasks in the db or it fails the API call, inform user of non-existent tasks
          <h3>There are no tasks available. Please create a task.</h3>
        )}
      </div>

      {/* snackbar that will appear on responses */}
      <div>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          action={action}
        />
      </div>
    </>
  );
}
