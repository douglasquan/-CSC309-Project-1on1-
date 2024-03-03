import { setColorState, getColorState } from "./global_var.js";

document.addEventListener("DOMContentLoaded", function () {
  const tableContainer = document.getElementById("table-container");
  const cellColorStates = {}; //object to store cell colors
  let baseDate = new Date(); // Initialize baseDate to today's date
  let isMouseDown = false;
  let initialColor = "";

  //toggle functions
  const checkbox = document.getElementById("deadline-checkbox");
  checkbox.addEventListener("change", toggleDeadlineInput);
  const meetingDurationSelect = document.getElementById("meeting-duration");
  meetingDurationSelect.addEventListener("change", (event) =>
    toggleCustomInput(event.target.value)
  );

  function toggleCustomInput(value) {
    var customDurationDiv = document.getElementById("custom-duration");
    if (value === "custom") {
      customDurationDiv.classList.remove("hidden");
    } else {
      customDurationDiv.classList.add("hidden");
    }
  }

  function toggleDeadlineInput() {
    var dateInputDiv = document.getElementById("date-input");
    if (checkbox.checked) {
      dateInputDiv.classList.remove("hidden");
    } else {
      dateInputDiv.classList.add("hidden");
    }
  }

  // create table
  function createTable() {
    while (tableContainer.firstChild) {
      tableContainer.removeChild(tableContainer.firstChild);
    }

    const table = document.createElement("table");
    table.className = "table-fixed min-w-full";

    // Create thead
    const thead = document.createElement("thead");
    const theadRow = document.createElement("tr");
    theadRow.className = "bg-gray-200 select-none";
    const headers = ["Time"];

    // Calculate and format header dates
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i - baseDate.getDay());
      const dateString = date.toDateString().split(" ");
      const headerText = `${dateString[0]}<br><span class="text-xs">${dateString[1]} ${dateString[2]}</span>`;
      headers.push(headerText);
    }

    headers.forEach((text, index) => {
      const th = document.createElement("th");
      th.className = "px-4 py-2 select-none";
      th.innerHTML = text;

      // Highlight today's date header
      if (index > 0) {
        // Skip the "Time" header
        const headerDate = new Date(baseDate);
        headerDate.setDate(
          headerDate.getDate() + index - 1 - baseDate.getDay()
        );
        const today = new Date();
        if (
          headerDate.getDate() === today.getDate() &&
          headerDate.getMonth() === today.getMonth() &&
          headerDate.getFullYear() === today.getFullYear()
        ) {
          th.classList.add("bg-neutral-400"); // Example: Change background color to highlight
        }
      }

      theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    table.appendChild(thead);
    tableContainer.appendChild(table);

    // Create tbody
    const tbody = document.createElement("tbody");
    const times = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ];
    const days = 7;
    const rowsPerTime = 4;

    times.forEach((time) => {
      for (let i = 0; i < rowsPerTime; i++) {
        const row = document.createElement("tr");
        row.className = "bg-white-200";

        // Time cell
        if (i === 0) {
          const timeCell = document.createElement("td");
          timeCell.className = "border px-4";
          timeCell.innerHTML = `<span class="text-xs select-none">${time}</span>`;
          row.appendChild(timeCell);
        } else {
          const timeCell = document.createElement("td");
          timeCell.className = "border px-4";
          row.appendChild(timeCell);
        }

        // Day cells
        for (let j = 0; j < days; j++) {
          const dayCell = document.createElement("td");
          dayCell.className = "border px-4 py-3";
          row.appendChild(dayCell);
        }

        tbody.appendChild(row);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
      }
    });

    table.addEventListener("mousedown", function (event) {
      isMouseDown = true;
      const target = event.target;
      // console.log("clicked")
      if (initialColor === "") {
        initialColor = target.style.backgroundColor || "";
        initialColor = window.getComputedStyle(target).backgroundColor;
        // console.log(`Initial color: ${initialColor}`);
      }
      // console.log(`initial color ${initialColor}`);
      changeColor(target);
    });

    table.addEventListener("mouseover", function (event) {
      if (isMouseDown) {
        const target = event.target;
        changeColor(target);
        // console.log("drag")
      }
    });

    table.addEventListener("mouseup", function () {
      isMouseDown = false;
    });
  }

  createTable(); // Call createTable to initially create the table

  // Event listener for prevWeek/nextWeek/today button
  document.getElementById("prevWeek").addEventListener("click", function () {
    baseDate.setDate(baseDate.getDate() - 7);
    createTable(); // Re-create the table with updated dates
  });

  document.getElementById("nextWeek").addEventListener("click", function () {
    baseDate.setDate(baseDate.getDate() + 7);
    createTable(); // Re-create the table with updated dates
  });

  document.getElementById("today").addEventListener("click", function () {
    baseDate = new Date(); // Reset baseDate to today's date
    createTable(); // Re-create the table with the updated baseDate
  });

  function changeColor(cell) {
    if (cell.tagName === "TD") {
      const rowIndex = cell.parentElement.rowIndex;
      const colIndex = cell.cellIndex;
      const cellKey = `${rowIndex}-${colIndex}`; // Unique key for the cell
      const currentColor =
        cell.style.backgroundColor ||
        window.getComputedStyle(cell).backgroundColor;
      const selectedRadioButton = document.querySelector(
        'input[name="Preferences"]:checked'
      );

      const isFirstColumn = colIndex === 0;
      if (!isFirstColumn && selectedRadioButton) {
        const value = selectedRadioButton.value;

        if (currentColor === initialColor) {
          switch (value) {
            case "High":
              cell.style.backgroundColor = "rgb(0, 153, 51)";
              break;
            case "Medium":
              cell.style.backgroundColor = "rgb(102, 255, 102)";
              break;
            case "Low":
              cell.style.backgroundColor = "rgb(204, 255, 204)";
              break;
          }
          setColorState(cellKey, cell.style.backgroundColor);
        } else {
          cell.style.backgroundColor = initialColor;
          setColorState(cellKey, initialColor);
        }
      }
      console.log("Cell Color States:", getColorState());
    }
  }
});

document.addEventListener("click", function (event) {
  if (event.target.matches(".remove-row-icon")) {
    event.target.closest("tr").remove();
  }
});

document.getElementById("addContactBtn").addEventListener("click", function () {
  document.getElementById("addContactModal").classList.remove("hidden");
});

document.getElementById('cancelBtn').addEventListener('click', function() {
  document.getElementById('addContactModal').classList.add('hidden');
});

document
  .getElementById("saveContactBtn")
  .addEventListener("click", function () {
    const email = document.getElementById("email").value;
    const name = document.getElementById("contactName").value;
    if (email) {
      const table = document
        .getElementById("contactsTable")
        .getElementsByTagName("tbody")[0];
      const newRow = table.insertRow();
      newRow.innerHTML = `
      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p class="whitespace-no-wrap">[new_contact_id]</p>
      </td>
      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <div class="flex items-center">
          <div class="ml-3">
            <p class="whitespace-no-wrap">${name}</p>
          </div>
        </div>
      </td>
      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p class="whitespace-no-wrap">${email}</p>
      </td>
      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p class="whitespace-no-wrap">${new Date().toLocaleDateString()}</p>
      </td>
      <td class="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <img src="https://icons.getbootstrap.com/assets/icons/trash.svg" class="h-4 w-4 cursor-pointer delete-icon" alt="icon" >
      </td>
    `;
      document.getElementById("addContactModal").classList.add("hidden");
    }
  });

document.querySelectorAll(".back-to-dashboard-btn").forEach(function (element) {
  element.addEventListener("click", function () {
    window.location.href = "dashboard.html";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const confirmationPopup = document.getElementById("confirmationPopup");
  const confirmDeleteBtn = confirmationPopup.querySelector(".confirm-delete");
  const cancelDeleteBtn = confirmationPopup.querySelector(".cancel-delete");
  let currentRowForDeletion = null;

  document.querySelectorAll(".delete-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      currentRowForDeletion = this.closest("tr");
      confirmationPopup.style.display = "block";
    });
  });

  confirmDeleteBtn.addEventListener("click", function () {
    if (currentRowForDeletion) {
      currentRowForDeletion.remove();
      confirmationPopup.style.display = "none";
      currentRowForDeletion = null;
    }
  });

  cancelDeleteBtn.addEventListener("click", function () {
    confirmationPopup.style.display = "none";
    currentRowForDeletion = null;
  });
});
