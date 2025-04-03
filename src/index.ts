const button = document.getElementById("movingButton")!;
let isMoving = false;
let transitionDuration = 1; // Start with 1 second transition
let speed = 1000;
let trailInterval: string | number | NodeJS.Timeout | undefined;
function moveButtonFunction() {
  if (isMoving) return; // Prevent movement if the button is already moving
  isMoving = true; // Set the moving flag
  button.style.animationDuration = `${transitionDuration}s`;
  button.classList.remove("color-animation"); // Reset animation
  void button.offsetWidth; // Trigger reflow
  button.classList.add("color-animation");
  const maxX = window.innerWidth - button.clientWidth;
  const maxY = window.innerHeight - button.clientHeight;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  button.style.transform = `translate(${randomX}px, ${randomY}px)`;

  button.style.transitionDuration = `${transitionDuration}s`;
  button.style.animationDuration = `${0.25}s`;
  // Create a trail at intervals while the button is moving
  trailInterval = setInterval(() => {
    createTrail(button);
  }, 0.1); // Create a trail element every 50ms
  button.addEventListener(
    "transitionend",
    () => {
      isMoving = false; // Reset the moving flag after transition
      clearInterval(trailInterval); // Stop creating trails once the movement ends
    },
    { once: true }
  );
}

button.addEventListener("click", moveButtonFunction);

const autoclickerButton = document.getElementById("autoclickerButton")!;
let autoclickerActive = false;
let autoclickerInterval: string | number | NodeJS.Timeout | undefined;
autoclickerButton.addEventListener("click", function () {
  if (!autoclickerActive) {
    autoclickerActive = true;
    autoclickerButton.textContent = "Stop Autoclicker";
    startAutoclicker();
  } else {
    autoclickerActive = false;
    autoclickerButton.textContent = "Autoclicker";
    clearInterval(autoclickerInterval);
    speed = 1000;
    transitionDuration = 1; // Reset transition duration to 1 second
  }
});

function startAutoclicker() {
  autoclickerInterval = setInterval(() => {
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

function createTrail(element: Element) {
  const trail = document.createElement("div");
  trail.className = "trail";

  // Copy the position and size of the button
  const rect = element.getBoundingClientRect();
  trail.style.left = `${rect.left}px`;
  trail.style.top = `${rect.top}px`;
  trail.style.width = `${rect.width}px`;
  trail.style.height = `${rect.height}px`;
  trail.style.backgroundColor =
    window.getComputedStyle(element).backgroundColor;

  // Append the trail to the body
  document.body.appendChild(trail);

  // Trigger the fade-out effect
  requestAnimationFrame(() => {
    trail.style.opacity = "0";
  });

  // Remove the trail after the fade-out is complete
  setTimeout(() => {
    trail.remove();
  }, 1000); // Duration matches the fade-out time
}
