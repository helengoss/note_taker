// you can write this 'console.log("Updated script loaded!");' to check the path for the server is correct to this file
document.addEventListener("DOMContentLoaded", () => {
  const dataList = document.getElementById("data-list");
  const dataForm = document.getElementById("data-form");
  const dataInput = document.getElementById("data-input");
  
  let editingId = null; // tracks which note is being edited

  // script.js runs in the browser to control the user interface, 
  // send requests to the server, and display the notes on the page

  // FETCHES ALL NOTES
  const fetchData = async () => {
    try {
      const response = await fetch("/data");
      const data = await response.json();
      
      dataList.innerHTML = ""; // Clear the list before rendering
      data.forEach((item) => {
        const li = document.createElement("li"); 
        li.dataset.id = item.id;   // stores the note's id in the element
        li.textContent = item.text; // displays only the text (not the UUID)
      
        // EDIT BUTTON
        const editBtn = document.createElement("button");
        editBtn.textContent = "change"; // displays 'Edit' ready to be turned into a button
        editBtn.classList.add("edit-btn"); // NEED TO PUT A CLASS FOR THIS

        editBtn.addEventListener("click", () => {
          dataInput.value = item.text; // put text in input
          editingId = item.id; // mark this note as being edited
        });
        
        // DELETE BUTTON
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "x"; // displays delete ready to be turned into a button
        deleteBtn.classList.add("delete-btn"); // this is the class to put a space between the text and the button

        deleteBtn.addEventListener("click", async () => {
          const noteId = li.dataset.id;       // get the note's id from the li
          try {
            const response = await fetch(`/data/${noteId}`, {
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

        li.appendChild(editBtn); // puts the edit button in the list
        li.appendChild(deleteBtn); // puts the delete button in the list
        dataList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // HANDLE FORM SUBMISSION (CREATE OR EDIT)
  dataForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const noteData = { text: dataInput.value };

    try {
      if (editingId) {
        // SEND PUT REQUEST TO UPDATE NOTE
        await fetch(`/data/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        editingId = null; // reset after editing
      } else {
        // SEND POST REQUEST TO CREATE NOTE
        await fetch("/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
      }

      dataInput.value = ""; // clear input field
      fetchData(); // refresh list
    } catch (error) {
      console.error("Error saving note:", error);
    }
  });

  // YOU ALSO NEED TO DO THIS to make the delete button work add the code in the app.delete("/data/:id", (req, res) => { ... in the server.js file but above the wildcard

  // Initial fetch when page loads
  fetchData();
});