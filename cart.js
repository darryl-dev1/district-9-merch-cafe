
let cart = [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

document.querySelectorAll(".product-card").forEach(card => {
    const productInfo = card.querySelector(".product-info");

    if (!productInfo) return;

    const nameElement = productInfo.querySelector("h3");
    const priceElements = productInfo.querySelectorAll("p");

    if (!nameElement) return;

    const productName = nameElement.textContent.trim();
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "cart-buttons";

    priceElements.forEach(priceElement => {
        const text = priceElement.textContent.trim();

        const pesoMatch = text.match(/₱\s*(\d+(?:\.\d+)?)/);
        const fallbackMatch = text.match(/(\d+(?:\.\d+)?)/);

        const price = pesoMatch
            ? Number(pesoMatch[1])
            : fallbackMatch
                ? Number(fallbackMatch[1])
                : null;

        if (price === null) return;

        const sizeMatch = text.match(/(\d+oz)/i);
        const itemName = sizeMatch
            ? `${productName} (${sizeMatch[1]})`
            : productName;

        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.type = "button";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(itemName, price);
        });

        buttonContainer.appendChild(button);
    });

    productInfo.appendChild(buttonContainer);
});

document.querySelectorAll(".addons p").forEach(addon => {
    const text = addon.textContent.trim();
    const match = text.match(/(.+?)\s*[—-]\s*₱\s*(\d+(?:\.\d+)?)/);

    if (match) {
        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.type = "button";
        button.textContent = "Add " + match[1].trim();

        button.addEventListener("click", () => {
            addToCart(match[1].trim(), Number(match[2]));
        });

        addon.appendChild(button);
    }
});

document.querySelectorAll(".center").forEach(element => {
    const match = element.textContent.match(/Extra Shot\s*[—-]\s*₱\s*(\d+)/);

    if (match) {
        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.type = "button";
        button.textContent = "Add Extra Shot";

        button.addEventListener("click", () => {
            addToCart("Extra Coffee Shot", Number(match[1]));
        });

        element.appendChild(button);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    displayCart();
}

function displayCart() {
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is currently empty.";
    }

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("span");
        details.textContent =
            `${item.name} x ${item.quantity} - ₱${subtotal.toFixed(2)}`;

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.type = "button";
        minus.addEventListener("click", () => changeQuantity(index, -1));

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.type = "button";
        plus.addEventListener("click", () => changeQuantity(index, 1));

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.type = "button";
        remove.addEventListener("click", () => {
            cart.splice(index, 1);
            displayCart();
        });

        controls.append(minus, quantity, plus, remove);
        row.append(details, controls);
        cartItems.appendChild(row);
    });

    cartTotal.textContent = total.toFixed(2);

    const checkoutTotal = document.getElementById("checkout-total");

    if (checkoutTotal) {
        checkoutTotal.textContent = total.toFixed(2);
    }
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    displayCart();
});

document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    document.getElementById("checkout-form").style.display = "block";
    displayCart();

    document.getElementById("checkout-form").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("place-order").addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const payment = document.getElementById("payment-method").value;

    if (!name || !phone) {
        alert("Please complete your information.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    alert(
        "ORDER PLACED SUCCESSFULLY!\n\n" +
        "Customer: " + name +
        "\nContact: " + phone +
        "\nPayment: " + payment +
        "\nTotal: ₱" + total.toFixed(2)
    );

    cart = [];
    displayCart();

    document.getElementById("checkout-form").style.display = "none";
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-phone").value = "";
});

displayCart();
