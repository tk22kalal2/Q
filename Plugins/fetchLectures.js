async function loadLectures(tableId, startId, endId) {
    try {
        const response = await fetch('../Plugins/lectures.json?nocache=' + new Date().getTime());
        const lectures = await response.json();

        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = ""; // Clear previous data

        const filteredLectures = lectures.filter(lecture => lecture.id >= startId && lecture.id <= endId);

        filteredLectures.forEach(lecture => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="#" onclick="loadIframe('${lecture.url}')">${lecture.title}</a></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading lectures:", error);
    }
}

// Function to open lecture in iframe
function loadIframe(url) {
    document.getElementById('iframe-container').style.display = 'block';
    document.getElementById('external-frame').src = url;
}
