document.addEventListener('DOMContentLoaded', function() {
  const tableContainer = document.getElementById('table-container');
  const table = document.createElement('table');
  table.className = 'table-fixed min-w-full';

  // Create thead
  const thead = document.createElement('thead');
  const theadRow = document.createElement('tr');
  theadRow.className = 'bg-gray-200';
  const headers = [
    'Time', 
    'Mon<br><span class="text-xs">Feb 04</span>',
    'Tue<br><span class="text-xs">Feb 05</span>',
    'Wed<br><span class="text-xs">Feb 06</span>',
    'Thu<br><span class="text-xs">Feb 07</span>',
    'Fri<br><span class="text-xs">Feb 08</span>',
    'Sat<br><span class="text-xs">Feb 09</span>',
    'Sun<br><span class="text-xs">Feb 10</span>'
  ];

  headers.forEach((text) => {
    const th = document.createElement('th');
    th.className = 'px-4 py-2';
    th.innerHTML = text; 
    theadRow.appendChild(th);
  });

  thead.appendChild(theadRow);
  table.appendChild(thead);

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
        timeCell.innerHTML = `<span class="text-xs">${time}</span>`;
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
    }
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  let isMouseDown = false;
  let initialColor = '';

  table.addEventListener('mousedown', function(event) {
    isMouseDown = true;
    const target = event.target;
    console.log("clicked")
    if (initialColor === '') {
      initialColor = target.style.backgroundColor || '';
      initialColor = window.getComputedStyle(target).backgroundColor;
      console.log(`Initial color: ${initialColor}`);
    }
    console.log(`initial color ${initialColor}`);
    changeColor(target);
  });

  table.addEventListener('mouseover', function(event) {
    if (isMouseDown) {
      const target = event.target;
      changeColor(target);
      console.log("drag")
    }
  });

  table.addEventListener('mouseup', function() {
    isMouseDown = false;
  });

  function changeColor(cell) {
    if (cell.tagName === 'TD') {
      const currentColor = cell.style.backgroundColor || window.getComputedStyle(cell).backgroundColor;
      console.log(`current color ${currentColor}`)
      if (currentColor === initialColor) {
        cell.style.backgroundColor = 'grey';
        console.log(`c===i ${cell.style.backgroundColor}`)     

      } else {
        cell.style.backgroundColor = initialColor;

        console.log(cell.style.backgroundColor)     
      }
      console.log("==========================")

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