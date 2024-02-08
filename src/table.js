document.addEventListener('DOMContentLoaded', function() {
const tableContainer = document.getElementById('table-container');
  let baseDate = new Date(); // Initialize baseDate to today's date

  function createTable() {
    while(tableContainer.firstChild) {
      tableContainer.removeChild(tableContainer.firstChild);
    }

    const table = document.createElement('table');
    table.className = 'table-fixed min-w-full';

    // Create thead
    const thead = document.createElement('thead');
    const theadRow = document.createElement('tr');
    theadRow.className = 'bg-gray-200 select-none';
    const headers = ['Time'];

    // Calculate and format header dates
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i - baseDate.getDay());
      const dateString = date.toDateString().split(' ');
      const headerText = `${dateString[0]}<br><span class="text-xs">${dateString[1]} ${dateString[2]}</span>`;
      headers.push(headerText);
    }

    headers.forEach((text, index) => {
      const th = document.createElement('th');
      th.className = 'px-4 py-2 select-none';
      th.innerHTML = text;
    
      // Highlight today's date header
      if (index > 0) { // Skip the "Time" header
        const headerDate = new Date(baseDate);
        headerDate.setDate(headerDate.getDate() + index - 1 - baseDate.getDay());
        const today = new Date();
        if (headerDate.getDate() === today.getDate() && headerDate.getMonth() === today.getMonth() && headerDate.getFullYear() === today.getFullYear()) {
          th.classList.add('bg-neutral-400'); // Example: Change background color to highlight
        }
      }
    
      theadRow.appendChild(th);
    });

    thead.appendChild(theadRow);
    table.appendChild(thead)    
    tableContainer.appendChild(table);
    
    // Create tbody
    const tbody = document.createElement('tbody');
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'];
    const days = 7;
    const rowsPerTime = 4;

    times.forEach((time) => {
      for (let i = 0; i < rowsPerTime; i++) {
        const row = document.createElement('tr');
        row.className = 'bg-white-200';

        // Time cell
        if (i === 0) {
          const timeCell = document.createElement('td');
          timeCell.className = 'border px-4';
          timeCell.innerHTML = `<span class="text-xs select-none">${time}</span>`;
          row.appendChild(timeCell);
        } else {
          const timeCell = document.createElement('td');
          timeCell.className = 'border px-4';
          row.appendChild(timeCell);
        }

        // Day cells
        for (let j = 0; j < days; j++) {
          const dayCell = document.createElement('td');
          dayCell.className = 'border px-4 py-3';
          row.appendChild(dayCell);
        }

        tbody.appendChild(row);
        table.appendChild(tbody);
        tableContainer.appendChild(table);
      }
    });
    
    // Event listener for click and drag cells:
    table.addEventListener('mousedown', function(event) {
      isMouseDown = true;
      const target = event.target;
      // console.log("clicked")
      if (initialColor === '') {
        initialColor = target.style.backgroundColor || '';
        initialColor = window.getComputedStyle(target).backgroundColor;
        // console.log(`Initial color: ${initialColor}`);
      }
      // console.log(`initial color ${initialColor}`);
      changeColor(target);
    });
  
    table.addEventListener('mouseover', function(event) {
      if (isMouseDown) {
        const target = event.target;
        changeColor(target);
        // console.log("drag")
      }
    });
  
    table.addEventListener('mouseup', function() {
      isMouseDown = false;
    });


  }

  createTable(); // Call createTable to initially create the table

  
  // Event listener for prevWeek/nextWeek/today button
  document.getElementById('prevWeek').addEventListener('click', function() {
    baseDate.setDate(baseDate.getDate() - 7);
    createTable(); // Re-create the table with updated dates
  });

  document.getElementById('nextWeek').addEventListener('click', function() {
    baseDate.setDate(baseDate.getDate() + 7);
    createTable(); // Re-create the table with updated dates
  });

  document.getElementById('today').addEventListener('click', function() {
    baseDate = new Date(); // Reset baseDate to today's date
    createTable(); // Re-create the table with the updated baseDate
  });

  let isMouseDown = false;
  let initialColor = '';

  function changeColor(cell) {
    if (cell.tagName === 'TD') {
      const currentColor = cell.style.backgroundColor || window.getComputedStyle(cell).backgroundColor;
      const selectedRadioButton = document.querySelector('input[name="Preferences"]:checked');
      // console.log(`current color ${currentColor}`)

      // Check if the cell is in the first column (time column)
      const isFirstColumn = cell.cellIndex === 0;
      if (!isFirstColumn && selectedRadioButton) {
        const value = selectedRadioButton.value;

        if (currentColor === initialColor) {
          switch (value) {
            case "High":
                cell.style.backgroundColor = 'rgb(0, 153, 51)';
                break;
            case "Medium":
                cell.style.backgroundColor = 'rgb(102, 255, 102)';
                break;
            case "Low":
                cell.style.backgroundColor = 'rgb(204, 255, 204)';
                break;
        }
          // console.log(`c===i ${cell.style.backgroundColor}`)     

        } else {
          cell.style.backgroundColor = initialColor;

          // console.log(cell.style.backgroundColor)     
        }
        // console.log("==========================")
      } 
    }
  }
});

function toggleCustomInput(value) {
  var customDurationDiv =
    document.getElementById("custom-duration");
  if (value === "custom") {
    customDurationDiv.classList.remove("hidden");
  } else {
    customDurationDiv.classList.add("hidden");
  }
}

function toggleDeadlineInput() {
  var checkbox = document.getElementById('deadline-checkbox');
  var dateInputDiv = document.getElementById('date-input');
  if (checkbox.checked) {
    dateInputDiv.classList.remove('hidden');
  } else {
    dateInputDiv.classList.add('hidden');
  }
}