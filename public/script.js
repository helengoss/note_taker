// you can write this 'console.log("Updated script loaded!");' to check the path for the server is correct to this file
document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");

  // script.js runs in the browser to control the user interface, 
  // send requests to the server, and display the notes on the page

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li"); 
        li.dataset.id = item.id;   // stores the note's id in the element
        li.textContent = item.text; // displays only the text (not the UUID)

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete"; // displays delete ready to be turned into a button
        deleteBtn.classList.add("delete-btn"); // this is the class to put a space between the text and the button

        deleteBtn.addEventListener("click", async () => {
         const noteId = li.dataset.id;       // get the note's id from the li
        

    try {
    const response = await fetch(`/data/${noteId}`, { // 'await' only works inside an async function' in the addeventlistener which without is only a normal synchronos
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Note ${noteId} deleted successfully`);
      fetchData(); // refresh the list after deletion
    } else {
      console.error("Failed to delete note:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting note:", error);
  }
  });

        li.appendChild(deleteBtn); // puts the delete button in the list
        dataList.appendChild(li);
      });


    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
// to make the delete button work add the code in the app.delete("/data/:id", (req, res) => { ... in the server.js file but above the wildcard

  // Handle form submission to create a new note
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newData = { text: dataInput.value };

    try {
      const response = await fetch("/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  });

    // Handle form submission to edit new data?
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const editData = { text: dataInput.value };

    try {
      const response = await fetch("/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        dataInput.value = ""; // Clear input field
        fetchData(); // Refresh the list
      }
    } catch (error) {
      console.error("Error editing data:", error);
    }
  });

  // Fetch data on page load
  fetchData();
});


