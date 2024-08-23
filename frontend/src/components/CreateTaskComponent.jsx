import React from "react";
import { useState } from "react";

export default function CreateTaskComponent() {

  const [description, setDescription] = useState("");

  const [name, setName] = useState("");

  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);

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
      console.log("success");
      // closes the new task menu
      toggleNewTask();
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
    setIsTaskMenuOpen(!isTaskMenuOpen);
  };

  return (
    <>
      <div>
        <button
          onClick={() => {
            toggleNewTask();
          }}
        >
          <h3>New Task</h3>
        </button>
        <form onSubmit={createTask}>
          {/* shows the new task form is the menu boolean is true OR
                abstracts the menu if the boolean is false */}
          {isTaskMenuOpen ? (
            <>
              <label htmlFor="userTaskName">Task Name:</label>
              <input
                type="text"
                id="userTaskName"
                value={name}
                onChange={handleNameChange}
              />

              <br />

              <label htmlFor="userTaskDescription">Task Description:</label>
              <input
                type="text"
                id="userTaskDescription"
                value={description}
                onChange={handleDescriptionChange}
              />

              <br />

              <button type="submit">Create Task</button>
            </>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  );
}
