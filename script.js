const page = document.querySelector(".page");
const openButton = document.querySelector(".open-button");
const intro = document.querySelector(".intro");
const letterScene = document.querySelector(".letter-scene");
const letter = document.querySelector(".letter");
const letterBody = document.querySelector("[data-letter]");
const floatingLayer = document.querySelector(".floating-layer");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const fullLetter = (letterBody.dataset.message || letterBody.textContent).trim();
let hasOpened = false;

const symbols = [
  {
    name: "star",
    color: "#f4c95d",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.5 6.7 7.1.4-5.5 4.5 1.8 6.9-6-3.8-6 3.8 1.8-6.9-5.5-4.5 7.1-.4L12 2Z"/></svg>',
  },
  {
    name: "spark",
    color: "#9fb7a2",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.8 4.9 2.6 6.7 7.5 7.5-4.9.8-6.7 2.6-7.5 7.5-.8-4.9-2.6-6.7-7.5-7.5 4.9-.8 6.7-2.6 7.5-7.5Zm6.2 10.7c.4 2.4 1.3 3.3 3.7 3.7-2.4.4-3.3 1.3-3.7 3.7-.4-2.4-1.3-3.3-3.7-3.7 2.4-.4 3.3-1.3 3.7-3.7Z"/></svg>',
  },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function addFloaties() {
  const count = window.matchMedia("(max-width: 640px)").matches ? 14 : 22;

  Array.from({ length: count }).forEach((_, index) => {
    const symbol = symbols[index % symbols.length];
    const floaty = document.createElement("span");

    floaty.className = `floaty floaty-${symbol.name}`;
    floaty.innerHTML = symbol.svg;
    floaty.style.setProperty("--left", `${randomBetween(3, 97)}%`);
    floaty.style.setProperty("--size", `${randomBetween(0.65, 1.35)}rem`);
    floaty.style.setProperty("--duration", `${randomBetween(12, 20)}s`);
    floaty.style.setProperty("--delay", `${randomBetween(-18, 2)}s`);
    floaty.style.setProperty("--sway", `${randomBetween(-5, 5)}rem`);
    floaty.style.setProperty("--rotate", `${randomBetween(-28, 28)}deg`);
    floaty.style.setProperty("--opacity", `${randomBetween(0.16, 0.34)}`);
    floaty.style.setProperty("--color", symbol.color);

    floatingLayer.appendChild(floaty);
  });
}

function typeLetter() {
  letterBody.classList.remove("is-finished");
  letterBody.textContent = "";

  if (reduceMotion.matches) {
    letterBody.textContent = fullLetter;
    letterBody.classList.add("is-finished");
    return;
  }

  let index = 0;

  function writeNextCharacter() {
    letterBody.textContent += fullLetter.charAt(index);
    index += 1;

    if (index < fullLetter.length) {
      const current = fullLetter.charAt(index - 1);
      const pause = current === "\n" ? 180 : current === "." || current === "," || current === "!" ? 58 : randomBetween(8, 20);
      window.setTimeout(writeNextCharacter, pause);
      return;
    }

    letterBody.classList.add("is-finished");
  }

  writeNextCharacter();
}

function addOpenBurst() {
  Array.from({ length: 12 }).forEach((_, index) => {
    const burst = document.createElement("span");
    burst.className = "open-burst";
    burst.style.setProperty("--x", `${randomBetween(-7, 7)}rem`);
    burst.style.setProperty("--y", `${randomBetween(-7, -2)}rem`);
    burst.style.setProperty("--delay", `${index * 28}ms`);
    floatingLayer.appendChild(burst);

    window.setTimeout(() => burst.remove(), 1200);
  });
}

openButton.addEventListener("click", () => {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  page.classList.add("is-opening");
  openButton.setAttribute("aria-expanded", "true");
  openButton.disabled = true;
  addOpenBurst();

  window.setTimeout(() => {
    page.classList.add("is-open");
    intro.setAttribute("aria-hidden", "true");
    letterScene.removeAttribute("aria-hidden");
    letter.focus({ preventScroll: true });
    typeLetter();
  }, reduceMotion.matches ? 0 : 760);
});

addFloaties();
