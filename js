const cars = [
  {
    name: "Lamborghini",
    img: "assets/cars/lamborghini.jpg",
    alt: "Red Lamborghini Aventador ride-on car",
    eyebrow: "Official ride-on series",
    title: "Drive Like a Legend.",
    desc: "Scissor doors, LED headlights and a V-shaped body. Your child becomes the star of every street.",
    price: "₹24,999",
    old: "₹29,999",
    showcase: "Scissor doors. Full throttle fun.",
    showcaseDesc: "Watch the Aventador come alive as you scroll through its signature design.",
    bg1: "#2a0a0a", bg2: "#7a1414", accent: "#ff4d4d"
  },
  {
    name: "Bugatti",
    img: "assets/cars/bugatti.jpg",
    alt: "Red Bugatti Chiron ride-on car",
    eyebrow: "Hypercar edition",
    title: "Speed Meets Style.",
    desc: "Candy-red paint, orange leather seat and a sleek low-slung body inspired by the Chiron.",
    price: "₹18,499",
    old: "₹22,999",
    showcase: "Built for the fast lane.",
    showcaseDesc: "Hypercar lines and a leather-lined cockpit make every ride feel special.",
    bg1: "#2b1000", bg2: "#8a3d0a", accent: "#ff9a3c"
  },
  {
    name: "BMW M5",
    img: "assets/cars/bmw-m5.jpg",
    alt: "Blue BMW M5 ride-on car",
    eyebrow: "M Performance line",
    title: "Power in Every Turn.",
    desc: "Glossy blue finish, signature kidney grille and a 12V battery for long afternoons of play.",
    price: "₹21,999",
    old: "₹26,499",
    showcase: "Sedan power, toy-sized.",
    showcaseDesc: "The M5 brings premium looks and smooth handling to the driveway.",
    bg1: "#06142e", bg2: "#1b4a9c", accent: "#4da3ff"
  },
  {
    name: "BMW M6 GT3",
    img: "assets/cars/bmw-m6.jpg",
    alt: "Black BMW M6 GT3 ride-on car",
    eyebrow: "Race edition",
    title: "Race Day, Every Day.",
    desc: "M Power stripes, a rear spoiler and track-ready livery for little racers with big dreams.",
    price: "₹19,999",
    old: "₹24,999",
    showcase: "Track-ready from the start.",
    showcaseDesc: "Race stripes and a rear wing make this the car for serious young drivers.",
    bg1: "#0a0c10", bg2: "#2a3140", accent: "#3dd6ff"
  }
];

const root = document.documentElement;
const stack = document.getElementById("carStack");
const pills = document.querySelectorAll(".pill");
const nav = document.getElementById("nav");

const heroEyebrow = document.getElementById("heroEyebrow");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");
const heroPrice = document.getElementById("heroPrice");
const heroOld = document.getElementById("heroOld");
const heroText = document.querySelector(".hero-text");
const showcaseImg = document.querySelector("[data-showcase-img]");
const showcaseTitle = document.getElementById("showcaseTitle");
const showcaseDesc = document.getElementById("showcaseDesc");
const showcaseBar = document.getElementById("showcaseBar");
const showcase = document.getElementById("showcase");

let current = 0;
let textTimer = null;

/* ---------- Build car images inside the hero stage ---------- */
cars.forEach((car, i) => {
  const img = document.createElement("img");
  img.src = car.img;
  img.alt = car.alt;
  img.dataset.index = i;
  if (i === 0) img.classList.add("active");
  stack.appendChild(img);
});
const stageImgs = stack.querySelectorAll("img");

/* ---------- Switch car ---------- */
function setCar(index) {
  if (index === current) return;
  const car = cars[index];
  const prevIndex = current;
  current = index;

  // Theme colors transition smoothly through CSS variables
  root.style.setProperty("--bg-1", car.bg1);
  root.style.setProperty("--bg-2", car.bg2);
  root.style.setProperty("--accent", car.accent);

  // Car image animation
  stageImgs.forEach((img, i) => {
    img.classList.remove("active", "prev");
    if (i === index) img.classList.add("active");
    else if (i === prevIndex) img.classList.add("prev");
  });

  // Pills
  pills.forEach((p, i) => {
    const on = i === index;
    p.classList.toggle("active", on);
    p.setAttribute("aria-selected", on);
  });

  // Text fade out, swap, fade in
  heroText.querySelectorAll("*").forEach(el => el.classList.add("swap-out"));
  clearTimeout(textTimer);
  textTimer = setTimeout(() => {
    heroEyebrow.textContent = car.eyebrow;
    heroTitle.textContent = car.title;
    heroDesc.textContent = car.desc;
    heroPrice.textContent = car.price;
    heroOld.textContent = car.old;
    heroText.querySelectorAll("*").forEach(el => el.classList.remove("swap-out"));
  }, 350);

  // Showcase section follows the selected car
  showcaseImg.src = car.img;
  showcaseImg.alt = car.alt;
  showcaseTitle.textContent = car.showcase;
  showcaseDesc.textContent = car.showcaseDesc;
}

pills.forEach(p => p.addEventListener("click", () => setCar(Number(p.dataset.index))));

// Lineup "View" buttons jump back to hero and select the car
document.querySelectorAll(".card-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setCar(Number(btn.dataset.index));
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
  });
});

// Keyboard arrows
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") setCar((current + 1) % cars.length);
  if (e.key === "ArrowLeft") setCar((current - 1 + cars.length) % cars.length);
});

/* ---------- Scroll effects ---------- */
let ticking = false;

function onScroll() {
  const y = window.scrollY;

  // Nav background after scrolling
  nav.classList.toggle("scrolled", y > 40);

  // Hero background drifts with scroll (parallax)
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) heroBg.style.transform = `translateY(${y * 0.25}px)`;

  // Hero car drifts up slightly
  const stage = document.getElementById("heroStage");
  if (stage && y < window.innerHeight) {
    stage.style.transform = `translateY(${y * -0.12}px)`;
  }

  // Pinned showcase: progress drives car movement and bar
  const rect = showcase.getBoundingClientRect();
  const total = showcase.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  const progress = total > 0 ? scrolled / total : 0;

  showcaseBar.style.width = `${progress * 100}%`;
  const carEl = document.querySelector(".showcase-car img");
  carEl.style.transform = `translateX(${(1 - progress) * 80 - 40}px) rotate(${(progress - 0.5) * 6}deg) scale(${0.92 + progress * 0.08})`;

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => io.observe(el));

// Initial state
root.style.setProperty("--bg-1", cars[0].bg1);
root.style.setProperty("--bg-2", cars[0].bg2);
root.style.setProperty("--accent", cars[0].accent);
onScroll();

