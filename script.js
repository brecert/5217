const visualTimer = document.querySelector(".time");
const pauseButton = document.querySelector(".pause-play");
const resetButton = document.querySelector(".reset");
const themeSelect = document.getElementById("theme-select");

const MINUTE = 60000;
const WORKTIME = 52;
const BREAKTIME = 17;

let interval;
let timeLeft = WORKTIME;
let timeType = "work";

const intervals = {
  work: [WORKTIME, 35, 15],
  break: [BREAKTIME, 10, 5],
};

const reset = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  timeType = "work";
  timeLeft = WORKTIME;
  pause();
  update();
};

const isPaused = () => document.body.classList.contains("paused");
const pause = () => document.body.classList.add("paused");
const unpause = () => document.body.classList.remove("paused");

const genTitle = () => {
  let text = `${timeLeft}m ${timeType} remaining`;
  if (isPaused()) {
    text += ` (paused)`;
  }
  return text;
};

const update = () => {
  visualTimer.textContent = timeLeft;
  visualTimer.title = `${timeLeft} minute(s) of ${timeType} remaining`;
  visualTimer.datetime = `${timeLeft}m`;
  document.title = genTitle();
  if (intervals[timeType].includes(timeLeft) && !isPaused()) {
    new Notification(visualTimer.title);
  }
};

const onMinute = () => {
  timeLeft -= 1;
  if (timeLeft === 0) {
    if (timeType === "work") {
      timeType = "break";
      timeLeft = BREAKTIME;
    } else {
      timeType = "work";
      timeLeft = WORKTIME;
    }
  }
  update();
};

let alerted = false;
const queryNotifications = async () => {
  if (!("Notification" in window) && !alerted) {
    alert("This browser does not support desktop notification");
    alerted = true;
  } else if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    await Notification.requestPermission();
  }
};

pauseButton.addEventListener("click", async (ev) => {
  if (interval) {
    pause();
    clearInterval(interval);
    interval = null;
  } else {
    unpause();
    interval = setInterval(onMinute, MINUTE);
  }

  update();
});

const updateTheme = () => {
  switch (themeSelect.value) {
    case "light":
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      break;
    case "dark":
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    default:
      document.body.classList.remove("dark");
      document.body.classList.remove("light");
  }
};

themeSelect.addEventListener("input", updateTheme);

resetButton.addEventListener("click", reset);
reset();
