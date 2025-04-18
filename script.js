document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(card => {
    const name = card.getAttribute('data-name').toLowerCase();
    if (name.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});
