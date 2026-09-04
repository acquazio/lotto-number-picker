const MAX_HISTORY = 5;
const HISTORY_KEY = "lotto-history";

const themeToggleBtn = document.getElementById("themeToggle");
const generateBtn = document.getElementById("generateBtn");
const ballsContainer = document.getElementById("balls");
const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggleBtn.textContent = isDark ? "\u2600\uFE0F" : "\u263E";
  const label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";
  themeToggleBtn.title = label;
  themeToggleBtn.setAttribute("aria-label", label);
}

function getBallColorClass(number) {
  if (number <= 10) return "color-1";
  if (number <= 20) return "color-2";
  if (number <= 30) return "color-3";
  if (number <= 40) return "color-4";
  return "color-5";
}

function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) numbers.add(Math.floor(Math.random() * 45) + 1);
  return [...numbers].sort((a, b) => a - b);
}

function readHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(history) ? history.filter((entry) => Array.isArray(entry) && entry.length === 6).slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveHistory(numbers) {
  const history = [numbers, ...readHistory()].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory(history);
}

function createBall(number, className) {
  const ball = document.createElement("span");
  ball.className = `${className} ${getBallColorClass(number)}`;
  ball.textContent = number;
  return ball;
}

function renderHistory(history = readHistory()) {
  historyList.replaceChildren();
  history.forEach((numbers, index) => {
    const item = document.createElement("li");
    item.className = "history-item";
    const order = document.createElement("span");
    order.className = "history-index";
    order.textContent = String(index + 1).padStart(2, "0");
    const numberList = document.createElement("div");
    numberList.className = "history-balls";
    numbers.forEach((number) => numberList.appendChild(createBall(number, "history-ball")));
    item.append(order, numberList);
    historyList.appendChild(item);
  });
  emptyHistory.hidden = history.length > 0;
  clearHistoryBtn.hidden = history.length === 0;
}

function renderBalls() {
  generateBtn.disabled = true;
  ballsContainer.replaceChildren();
  const numbers = generateLottoNumbers();
  saveHistory(numbers);

  numbers.forEach((number, index) => {
    window.setTimeout(() => {
      const ball = createBall(number, "ball");
      ballsContainer.appendChild(ball);
      window.requestAnimationFrame(() => ball.classList.add("show"));
      if (index === numbers.length - 1) {
        window.setTimeout(() => { generateBtn.disabled = false; }, 280);
      }
    }, index * 180);
  });
}

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme ? savedTheme === "dark" : systemPrefersDark);
renderHistory();

themeToggleBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  setTheme(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

generateBtn.addEventListener("click", renderBalls);
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory([]);
});
