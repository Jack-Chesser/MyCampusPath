// ===============================
// FEATURED EVENTS (static)
// these are the ones that always show up
// ===============================
let featuredEvents = [
    "Finals – Monday–Friday",
    "Last Day to Leave – Friday @ 5 PM"
];

// ===============================
// LOAD SAVED REQUESTS
// pulling from localStorage so your requests stay forever
// ===============================
let savedRequests = JSON.parse(localStorage.getItem("eventRequests")) || [];

// render the saved requests on the page
function renderRequests() {
    const list = document.getElementById("requestedEvents");
    list.innerHTML = ""; // clear so we don't double-add stuff

    savedRequests.forEach((eventName, index) => {
        let li = document.createElement("li");
        li.textContent = "" + eventName; // bullet point like the others

        // delete button (the little red X)
        let del = document.createElement("span");
        del.textContent = "X";
        del.className = "deleteBtn";

        // delete event when clicked
        del.addEventListener("click", function() {
            if (confirm("Delete this event request?")) {
                savedRequests.splice(index, 1); // remove from array
                localStorage.setItem("eventRequests", JSON.stringify(savedRequests)); // save updated list
                renderRequests(); // refresh list
            }
        });

        li.appendChild(del);
        list.appendChild(li);
    });
}

// run once on page load
renderRequests();


// ===============================
// ADD NEW REQUEST
// this handles the input box + button
// ===============================
document.getElementById("addEventBtn").addEventListener("click", function() {
    let input = document.getElementById("eventInput");
    let eventName = input.value.trim(); // remove extra spaces

    if (eventName === "") return; // don't add empty stuff

    savedRequests.push(eventName); // add to array
    localStorage.setItem("eventRequests", JSON.stringify(savedRequests)); // save it

    renderRequests(); // update the list

    input.value = ""; // clear the box

    // show the little green "added" message
    let msg = document.getElementById("eventMessage");
    msg.style.display = "block";

    // hide it after 1.5 seconds
    setTimeout(() => {
        msg.style.display = "none";
    }, 1500);
});
