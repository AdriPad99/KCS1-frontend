import React from "react";
import { useState } from "react";
import CreateTaskComponent from "./components/CreateTaskComponent";
import AllTasksComponent from "./components/AllTasksComponent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  // holds update state which will allow the useEffect to render in the AllTasksComponent
  // when the following function is called in the CreateTaskComponent
  // passed as a prop to AllTasksComponent
  const [update, setUpdate] = useState(0);

  // State for the snackbar being opened
  const [open, setOpen] = React.useState(false);

  // sets the state for the snackbar message that pops up
  const [message, setMessage] = useState("Success!");

  // handles the click by setting the snackbar as opened
  const handleClick = () => {
    setOpen(true);
  };

  // handles the close. toggles the snackbar to closed
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // controls the ability to close/ interact with the snackbar
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // updates the update state and renders the AllTasksComponent from the CreateTaskComponent
  // passed as a prop to CreateTaskComponent
  const handleUpdate = () => {
    setUpdate(update + 1); // increments the update value
  };

  // updates the message
  const updateMessage = (messageInfo) => {
    setMessage(messageInfo)
  }

  return (
    <>
      <div>
        <CreateTaskComponent
          handleUpdate={handleUpdate}
          handleClick={handleClick}
          updateMessage={updateMessage}
        />
        <AllTasksComponent
          update={update}
          handleClick={handleClick}
          open={open}
          handleClose={handleClose}
          action={action}
          message={message}
          updateMessage={updateMessage}
        />
      </div>
    </>
  );
}

export default App;
