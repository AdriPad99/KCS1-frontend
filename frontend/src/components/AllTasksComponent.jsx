import React from "react";
import { useState, useEffect } from "react";

export default function AllTasksComponent() {
  const [pageRefresh, setPageRefresh] = useState(0);

  const [taskData, setTaskData] = useState();

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [isUpdateMenuOpen, setIsUpdateMenuOpen] = useState(false);

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
  }, [pageRefresh]);

  const deleteTask = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/tasks/${id}/`, {
      method: "DELETE", // sets method
      headers: {
        "Content-Type": "application/json", // Indicates the content
      },
    });
    // if successful
    if (response.ok) {
      setPageRefresh(pageRefresh + 1);
      console.log("success");
    } else {
      // handles the errors
      console.error("Failed to delete workout:", response.statusText);
    }
  };

  const updateTask = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "task_name" : name,
        "task_description" : description,
      }),
    });
    if (response.ok) {
      console.log("Successfully updated task!");
    } else {
      console.error("Failed to update the task:", response.statusText);
    }
  };

  // handles the user input to be displayed in the
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // Handle changes in form inputs and displays them on screen as they happen
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  // handle the update menu being open
  const handleUpdateMenu = () => {
    setIsUpdateMenuOpen(!isUpdateMenuOpen);
  };

  return (
    <>
      <div>
        {/* If there is data display it on screen OR notify of no available tasks */}
        {taskData ? (
          taskData.map((task) => (
            <div key={task.id}>
              {isUpdateMenuOpen ? (
                <>
                  <form onSubmit={updateTask}>
                    <label htmlFor="userTaskName">Task Name:</label>
                    <input
                      type="text"
                      id="userTaskName"
                      value={name}
                      onChange={handleNameChange}
                    />

                    <br />

                    <label htmlFor="userTaskDescription">
                      Task Description:
                    </label>
                    <input
                      type="text"
                      id="userTaskDescription"
                      value={description}
                      onChange={handleDescriptionChange}
                    />

                    <br />

                    <button type="submit">Update Task</button>
                    {'\t'}
                    <button onClick={() => handleUpdateMenu()}>Cancel</button>
                  </form>
                </>
              ) : (
                <>
                  <h3>ID: {task.id}</h3>
                  <h3>Task Name: {task.task_name}</h3>
                  <p>Task Description: {task.task_description}</p>
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                    }}
                  >
                    Delete Task
                  </button>
                  {"\t"}
                  <button
                    onClick={() => {
                      handleUpdateMenu();
                      setDescription(task.task_description);
                      setName(task.task_name);
                    }}
                  >
                    Update Task
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <h3>There are no tasks available. Please create a task.</h3>
        )}
      </div>

      {/* <div>
                {taskData.length > 0 ? (
                    taskData.map((task) => (
                        <div key={task.id}>
                            <h3>{task.task_name}</h3>
                            <p>{task.task_description}</p>
                        </div>
                    ))
                ) : (
                    <p>No tasks available</p>
                )}
            </div> */}
    </>
  );
}
