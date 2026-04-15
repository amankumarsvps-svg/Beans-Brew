// INIT EMAILJS
emailjs.init("MApCEGav7p3k-5IK8");

const coffeeMenu = [
    { name: "Caramel Macchiato", price: 280 },
    { name: "Midnight Cold Brew", price: 220 },
    { name: "Dark Chocolate Mocha", price: 310 },
    { name: "Java Chip Frappe", price: 350 },
    { name: "Classic Affogato", price: 190 },
    { name: "Spanish Cortado", price: 240 }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Populate Dropdown
let coffeeSelect = document.getElementById("coffee");
coffeeMenu.forEach(item => {
    let option = document.createElement("option");
    option.value = JSON.stringify(item);
    option.textContent = `${item.name} - ₹${item.price}`;
    coffeeSelect.appendChild(option);
});

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function addItem() {
    let coffeeData = JSON.parse(document.getElementById("coffee").value);
    let qty = parseInt(document.getElementById("qty").value);

    let existing = cart.find(item => item.name === coffeeData.name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...coffeeData, qty });
    }
    updateCart();
}

function increaseQty(index) {
    cart[index].qty++;
    updateCart();
}

function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function renderCart() {
    let cartDiv = document.getElementById("cartItems");
    let totalDisplay = document.getElementById("total");
    let total = 0;
    
    cartDiv.innerHTML = "";
    
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        cartDiv.innerHTML += `
            <div class="cart-item">
                <div><strong>${item.name}</strong><br>₹${item.price}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                </div>
                <div>₹${item.price * item.qty} <button class="remove-btn" onclick="removeItem(${index})">❌</button></div>
            </div>`;
    });
    totalDisplay.innerText = "Total: ₹" + total;
}

renderCart();

// ORDER SUBMIT
document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if(cart.length === 0){
        alert("Cart is empty ❌");
        return;
    }

    let orderDetails = cart.map(item => `${item.name} x ${item.qty} (₹${item.price * item.qty})`).join("\n");
    let grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Prepare EmailJS params
    let templateParams = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value, // ✅ ADDRESS ADDED
        order: orderDetails,
        total: grandTotal
    };

    emailjs.send("service_jekrjbq", "template_73c6rk6", templateParams)
    .then(function() {
        alert("Order placed successfully ☕");
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
        e.target.reset();
    }, function(error) {
        console.error("FAILED...", error);
        alert("Error ❌: " + JSON.stringify(error));
    });
});