const themeToggleBtn = document.getElementById("themeToggle");
const generateBtn = document.getElementById("generateBtn");
const ballsContainer = document.getElementById("balls");

function setTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  const label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";
  themeToggleBtn.title = label;
  themeToggleBtn.setAttribute("aria-label", label);
}

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme ? savedTheme === "dark" : systemPrefersDark);

themeToggleBtn.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark-mode");
  setTheme(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

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

function renderBalls() {
  generateBtn.disabled = true;
  ballsContainer.replaceChildren();
  generateLottoNumbers().forEach((number, index, numbers) => {
    window.setTimeout(() => {
      const ball = document.createElement("div");
      ball.className = `ball ${getBallColorClass(number)}`;
      ball.textContent = number;
      ballsContainer.appendChild(ball);
      window.requestAnimationFrame(() => ball.classList.add("show"));
      if (index === numbers.length - 1) {
        window.setTimeout(() => { generateBtn.disabled = false; }, 300);
      }
    }, index * 400);
  });
}

generateBtn.addEventListener("click", renderBalls);
