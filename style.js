// Navbar Toggle
const toggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// --- SMART CART LOGIC ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateNavCart() {
    const cartCountElement = document.getElementById("cart-count");
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if(cartCountElement) cartCountElement.innerText = totalQty;
}

function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateNavCart();

    const cartBtn = document.querySelector('.nav-cart');
    cartBtn.style.transform = "scale(1.2)";
    setTimeout(() => cartBtn.style.transform = "scale(1)", 200);
} // <--- Added missing bracket here

// --- SLIDER LOGIC ---
let currentIdx = 0;
const sliderContainer = document.getElementById("testimonial-slider");
const allSlides = document.querySelectorAll(".t-card");
const totalSlides = allSlides.length; // Renamed to avoid conflict

function moveSlide(direction) {
    currentIdx += direction;
    if (currentIdx >= totalSlides) {
        currentIdx = 0;
    } else if (currentIdx < 0) {
        currentIdx = totalSlides - 1;
    }
    updateSliderPos();
}

function updateSliderPos() {
    if (allSlides.length > 0) {
        const width = allSlides[0].offsetWidth;
        sliderContainer.style.transform = `translateX(${-currentIdx * width}px)`;
    }
}

window.addEventListener('resize', updateSliderPos);

// Automatic slide
setInterval(() => {
    moveSlide(1);
}, 5000);

// Initial call
updateNavCart();