                  // Căutare produse

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".product-card");

  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    products.forEach((card) => {
      const name = card.getAttribute("data-name").toLowerCase();
      card.style.display = name.includes(query) ? "" : "none";
    });
  });
});


function openMenu() {
  document.getElementById('sideMenu').style.width = '250px'; /* Lățimea meniului */
}

function closeMenu() {
  document.getElementById('sideMenu').style.width = '0';
}




                              // Simulăm dacă utilizatorul e logat

let isLoggedIn = true; // Schimbă în false ca să testezi

function toggleProfileMenu() {
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    // Curățăm dropdown-ul
    dropdown.innerHTML = '';

    if (isLoggedIn) {
      dropdown.innerHTML += '<a href="profile.html">My Profile</a>';
      dropdown.innerHTML += '<a href="#" onclick="logout()">Log Out</a>';
    } else {
      dropdown.innerHTML += '<a href="login.html">Log In</a>';
    }

    dropdown.style.display = 'block';
  }
}

function logout() {
  isLoggedIn = false;
  alert('Te-ai delogat!');
  // Oprește meniul după delogare
  document.getElementById('profileDropdown').style.display = 'none';
}
