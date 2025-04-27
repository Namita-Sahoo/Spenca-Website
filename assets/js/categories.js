const categoryItems = document.querySelectorAll("#categoryFilter li");
const products = document.querySelectorAll(".shop-block");

categoryItems.forEach(item => {
    item.addEventListener("click", (event) => {
        event.preventDefault(); // 💥 Prevents the page refresh!

        const selectedCategory = item.getAttribute("data-category");

        products.forEach(product => {
            const productCategory = product.getAttribute("data-category");
            if (productCategory === selectedCategory || selectedCategory === "All") {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });
});