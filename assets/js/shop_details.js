
document.addEventListener("DOMContentLoaded", loadProductDetails);

async function loadProductDetails() {
    const productId = getProductIdFromURL(); // Get product ID from URL
    if (!productId) {
        alert("Product ID not found!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product details");

        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error(error);
        alert("Error loading product details");
    }
}

// Function to get Product ID from URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id"); // Example: shop-details.html?id=1
}

// Function to dynamically display product details
function displayProductDetails(product) {
    document.querySelector(".image img").src = product.image; // Replace with product.image
    document.querySelector(".product-details h3").innerText = product.name;
    document.querySelector(".product-details h5").innerText = `$${product.price}`;
    document.querySelector(".product-details .text p").innerText = product.description;
    document.querySelector(".other-option .list li:nth-child(2)").innerText = product.sku;
    document.querySelector(".category.list li:nth-child(2)").innerText = product.category;
    document.querySelector(".tags.list").innerHTML = `
        <li>Tags:</li> ${product.tags.split(',').map(tag => `<li>${tag.trim()}</li>`).join('')}
    `;
}
