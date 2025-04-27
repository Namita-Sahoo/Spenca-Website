function showSlide(index) {
    const columns = document.querySelectorAll('.column');
    const dots = document.querySelectorAll('.carousel-dot');

    columns.forEach((col, i) => {
      col.classList.remove('active');
      if (i === index) col.classList.add('active');
    });

    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i === index) dot.classList.add('active');
    });
  }

  // Set first column as active on page load
  document.addEventListener("DOMContentLoaded", () => {
    const columns = document.querySelectorAll('.column');
    if (columns.length > 0) {
      columns[0].classList.add('active');
    }
  });