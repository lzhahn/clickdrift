"use strict";
var button = document.getElementById("movingButton");
var isMoving = false;
var transitionDuration = 1; // Start with 1 second transition
var speed = 1000;
var trailInterval;
function moveButtonFunction() {
    if (isMoving)
        return; // Prevent movement if the button is already moving
    isMoving = true; // Set the moving flag
    button.style.animationDuration = "".concat(transitionDuration, "s");
    button.classList.remove("color-animation"); // Reset animation
    void button.offsetWidth; // Trigger reflow
    button.classList.add("color-animation");
    var maxX = window.innerWidth - button.clientWidth;
    var maxY = window.innerHeight - button.clientHeight;
    var randomX = Math.floor(Math.random() * maxX);
    var randomY = Math.floor(Math.random() * maxY);
    button.style.transform = "translate(".concat(randomX, "px, ").concat(randomY, "px)");
    button.style.transitionDuration = "".concat(transitionDuration, "s");
    button.style.animationDuration = "".concat(transitionDuration, "s");
    // Create a trail at intervals while the button is moving
    trailInterval = setInterval(function () {
        createTrail(button);
    }, 0.1); // Create a trail element every 50ms
    button.addEventListener("transitionend", function () {
        isMoving = false; // Reset the moving flag after transition
        clearInterval(trailInterval); // Stop creating trails once the movement ends
    }, { once: true });
}
button.addEventListener("click", moveButtonFunction);
var autoclickerButton = document.getElementById("autoclickerButton");
var autoclickerActive = false;
var autoclickerInterval;
autoclickerButton.addEventListener("click", function () {
    if (!autoclickerActive) {
        autoclickerActive = true;
        autoclickerButton.textContent = "Stop Autoclicker";
        startAutoclicker();
    }
    else {
        autoclickerActive = false;
        autoclickerButton.textContent = "Autoclicker";
        clearInterval(autoclickerInterval);
        speed = 1000;
        transitionDuration = 1; // Reset transition duration to 1 second
    }
});
function startAutoclicker() {
    autoclickerInterval = setInterval(function () {
        button.click();
        if (speed > 100) {
            // Minimum interval of 100ms
            speed -= 50; // Decrease interval by 100ms on each click
            transitionDuration = speed / 1000; // Sync transition duration with interval
            clearInterval(autoclickerInterval);
            startAutoclicker();
        }
    }, speed);
}
function createTrail(element) {
    var trail = document.createElement("div");
    trail.className = "trail";
    // Copy the position and size of the button
    var rect = element.getBoundingClientRect();
    trail.style.left = "".concat(rect.left, "px");
    trail.style.top = "".concat(rect.top, "px");
    trail.style.width = "".concat(rect.width, "px");
    trail.style.height = "".concat(rect.height, "px");
    trail.style.backgroundColor =
        window.getComputedStyle(element).backgroundColor;
    // Append the trail to the body
    document.body.appendChild(trail);
    // Trigger the fade-out effect
    requestAnimationFrame(function () {
        trail.style.opacity = "0";
    });
    // Remove the trail after the fade-out is complete
    setTimeout(function () {
        trail.remove();
    }, 1000); // Duration matches the fade-out time
}
