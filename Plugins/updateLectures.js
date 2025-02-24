async function updateLectures() {
    try {
        // Fetch existing lectures.json
        const response = await fetch("../Plugins/lectures.json?nocache=" + new Date().getTime());
        let data = await response.json();
        let existingLectures = data.lectures.map(lecture => lecture.html.trim()); // Store existing lectures for comparison

        // Fetch new lectures from newLectures.txt
        const newLecturesResponse = await fetch("../Plugins/newLectures.txt?nocache=" + new Date().getTime());
        const newLecturesText = await newLecturesResponse.text();
        const newLecturesArray = newLecturesText.trim().split("\n\n").map(item => item.trim()); // Split and clean

        // Get last used ID
        let lastId = data.lectures.length > 0 ? data.lectures[data.lectures.length - 1].id : 0;

        // Check for new lectures that are NOT already in lectures.json
        newLecturesArray.forEach(lectureHTML => {
            if (!existingLectures.includes(lectureHTML)) { // Only add new ones
                lastId++;
                data.lectures.push({ id: lastId, html: lectureHTML });
            }
        });

        // Log updated JSON (Replace this with backend API call to save JSON)
        console.log("Updated Lectures JSON:", JSON.stringify(data, null, 2));

        alert("Lectures updated successfully!");
    } catch (error) {
        console.error("Error updating lectures:", error);
    }
}

// Run the function on page load
document.addEventListener("DOMContentLoaded", updateLectures);
