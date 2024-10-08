import React from "react";
import { useState } from "react";

export default function CreateTaskComponent({
  handleUpdate,
  handleClick, 
  updateMessage
}) {
  // holds the state for the description
  const [description, setDescription] = useState("");

  // holds state for the name
  const [name, setName] = useState("");

  // holds state that determines if the task menu is open
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);

  // controls the state for the button name
  const [buttonName, setButtonName] = useState("New Task");

  // responsible for creating a task
  const createTask = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior
    const response = await fetch("http://127.0.0.1:8000/tasks/", {
      method: "POST", // sets method
      headers: {
        "Content-Type": "application/json", // Indicates the content
      },
      body: JSON.stringify({
        // uses these values in the body
        task_name: name,
        task_description: description,
      }), //send data in JSON format
    });
    // if successful
    if (response.ok) {
      handleUpdate();
      handleClick(); // brings up the snackbar
      toggleNewTask(); // closes the new task menu
      // clears both form fields
      setName("");
      setDescription("");
    } else {
      // handles the errors
      console.error("Failed to create task:", response.statusText);
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

  // controls the toggle for the new task component
  const toggleNewTask = () => {
    // sets the button name to a different state depending on which word it currently is
    if (buttonName === "Cancel") {
      setButtonName("New Task");
    } else if (buttonName === "New Task") {
      setButtonName("Cancel");
    }
    // toggles menu being open by reversing the current boolean
    setIsTaskMenuOpen(!isTaskMenuOpen);
  };

  return (
    <>
      <div>
        {/* calls the toggleNewTask function and opens the new task menu */}
        <div className="new-tsk-btn">
          <button
            onClick={() => {
              toggleNewTask();
            }}
          >
            <h3>{buttonName}</h3>
          </button>
        </div>
        <form onSubmit={createTask}>
          {/* shows the new task form is the menu boolean is true OR
                abstracts the menu if the boolean is false */}
          {isTaskMenuOpen ? (
            <>
              <div className="new-tsk-btn">
                <label htmlFor="userTaskName">Task Name:</label>
                <input
                  type="text"
                  id="userTaskName"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="new-tsk-btn">
                <label htmlFor="userTaskDescription">Task Description:</label>
                <input
                  type="text"
                  id="userTaskDescription"
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <button onClick={() => {updateMessage(`Successfully created task: ${name}!`)}} type="submit">Create Task</button>
              </div>
            </>
          ) : (
            <></>
          )}
        </form>
      </div>
      <br/>
    </>
  );
}
