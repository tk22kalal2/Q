async function loadLectures(tableId, startId, endId) {
  try {
    const response = await fetch("../Plugins/lectures.json?nocache=" + new Date().getTime());
    const data = await response.json();
    const tableBody = document.querySelector(`#${tableId} tbody`);

    // Clear existing content
    tableBody.innerHTML = "";

    // Filter lectures based on range
    const filteredLectures = data.lectures.filter(lecture => lecture.id >= startId && lecture.id <= endId);

    // Insert filtered lectures into table
    filteredLectures.forEach(lecture => {
      const row = document.createElement("tr");
      row.innerHTML = lecture.html;
      row.id = `lecture-${lecture.id}`; // Assign numeric ID
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading lectures:", error);
  }
}
