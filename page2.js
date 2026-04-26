// ===============================
// FEATURED EVENTS (static)
// ===============================
let featuredEvents = [
    "Finals – Monday–Friday",
    "Last Day to Leave – Friday @ 5 PM"
];

// ===============================
// LOAD SAVED REQUESTS
// ===============================
let savedRequests = JSON.parse(localStorage.getItem("eventRequests")) || [];

// Render saved requests
function renderRequests() {
    const list = document.getElementById("requestedEvents");
    list.innerHTML = "";

    savedRequests.forEach((eventName, index) => {
        let li = document.createElement("li");
        li.textContent = "• " + eventName;

        // Delete button
        let del = document.createElement("span");
        del.textContent = "✖";
        del.className = "deleteBtn";

        del.addEventListener("click", function() {
            if (confirm("Delete this event request?")) {
                savedRequests.splice(index, 1);
                localStorage.setItem("eventRequests", JSON.stringify(savedRequests));
                renderRequests();
            }
        });

        li.appendChild(del);
        list.appendChild(li);
    });
}

renderRequests();


// ===============================
// ADD NEW REQUEST
// ===============================
document.getElementById("addEventBtn").addEventListener("click", function() {
    let input = document.getElementById("eventInput");
    let eventName = input.value.trim();

    if (eventName === "") return;

    savedRequests.push(eventName);
    localStorage.setItem("eventRequests", JSON.stringify(savedRequests));

    renderRequests();

    input.value = "";

    let msg = document.getElementById("eventMessage");
    msg.style.display = "block";
    setTimeout(() => msg.style.display = "none", 1500);
});
