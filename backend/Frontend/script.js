Notification.requestPermission();
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPet = null;
console.log("JS loaded");

// Elements
const topbar = document.getElementById('topbar');
const authBtn = document.getElementById('authBtn');
const demoBtn = document.getElementById('demoBtn');
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const authForm = document.getElementById('authForm');
const addPetBtn = document.getElementById('addPetBtn');
const addPetFormWrap = document.getElementById('addPetForm');
const petForm = document.getElementById('petForm');
const cancelAddPet = document.getElementById('cancelAddPet');
const petsContainer = document.getElementById('petsContainer');

const navDashboard = document.getElementById('navDashboard');
document.getElementById("navReminders").onclick = () => showSection("reminders");
const navVacc = document.getElementById('navVacc');
const navGroom = document.getElementById('navGroom');
const navVet = document.getElementById('navVet');
const navMed = document.getElementById('navMed');
const navStore = document.getElementById('navStore');
const navCart = document.getElementById('navCart');

const storeContainer = document.getElementById('storeContainer');

const petProducts = [
  { name: "Purepet 10kg Dog Food", price: "₹1,050", img: "assets/purepet10kgdog.png" },
  { name: "Pedigree 3kg Dog Food", price: "₹700", img: "assets/pedigree3kgdog.png" },
  { name: "Drools 4kg Dog Food", price: "₹1,400", img: "assets/drools4kgdog.png" },
  { name: "Cesar Wet Dog Food", price: "₹550", img: "assets/cesarwetfooddog.png" },

  { name: "Purepet 1kg Cat Food", price: "₹180", img: "assets/purepet1kgcat.png" },
  { name: "Whiskas 1kg Cat Food", price: "₹450", img: "assets/whiskas1kgcat.png" },
  { name: "Me-O Cat Food", price: "₹550", img: "assets/meocatfood.png" },
  { name: "Farmina Prime Cat Food", price: "₹1,600", img: "assets/farminaprime1kgcat.png" },
  { name: "Sheba Wet Cat Food", price: "₹850", img: "assets/shebawetcatfood.png" },

  { name: "Dog Leash", price: "₹350", img: "assets/dogleash.png" },
  { name: "Heads Up Dog Leash", price: "₹999", img: "assets/headsupleashdog.png" },
  { name: "PawsIndia Dog Leash", price: "₹499", img: "assets/pawsindiadogleash.png" },
  { name: "Retractable Dog Leash", price: "₹1,600", img: "assets/retractabledogleash.png" },

  { name: "Kong Rubber Dog Toy", price: "₹850", img: "assets/kongrubberdogtoy.png" },
  { name: "Catnip Mouse Toy", price: "₹200", img: "assets/catnipmousecattoy.png" },
  { name: "Feather Wand Toy", price: "₹350", img: "assets/featherwandcattoy.png" },
  { name: "Cat Scratcher Toy", price: "₹450", img: "assets/catscraturetoy.png" },

  { name: "Basic Cat Litter", price: "₹550", img: "assets/basiccatlitter.png" },
  { name: "Foodie Puppies Litter", price: "₹265", img: "assets/foodiepuppieslitter.png" },
  { name: "Catit Eco Litter", price: "₹1,900", img: "assets/catitecolitter.png" },
  { name: "Catsan Hygiene Litter", price: "₹650", img: "assets/catsanhygienelitter.png" },

  { name: "MeatUp Biscuits", price: "₹410", img: "assets/meatupbiscuits.png" },
  { name: "Rope Ring Toy", price: "₹350", img: "assets/roperingtoy.png" }
];
// NEW: Section messages updater
function updateSectionMessages() {
  const vaccMsg = document.getElementById("vaccMsg");
  const groomMsg = document.getElementById("groomMsg");
  const vetMsg = document.getElementById("vetMsg");
  const medMsg = document.getElementById("medMsg");

  const text = selectedPet 
    ? `Managing records for ${selectedPet.name} 🐾`
    : "Select a pet first 🐾";

  if (vaccMsg) vaccMsg.innerText = text;
  if (groomMsg) groomMsg.innerText = text;
  if (vetMsg) vetMsg.innerText = text;
  if (medMsg) medMsg.innerText = text;
}

// On load
window.addEventListener('load', () => {
  updateUserUI();
  showSection('intro');
  topbar.style.display = 'flex';
});

function showSection(id) {

  console.log("Switching to:", id);

  document.querySelectorAll(".page").forEach(p => p.style.display = "none");

  document.getElementById(id).style.display = "block";

  // load data
  if (id === "dashboard") renderPets();
  if (id === "store") renderStore();
  if (id === "cart") renderCart();
  if (id === "reminders") loadReminders();

}
// AUTH
authBtn && authBtn.addEventListener('click', () => {
  authModal.style.display = 'flex';
});

authClose && authClose.addEventListener('click', ()=> authModal.style.display = 'none');

// Demo
demoBtn && demoBtn.addEventListener('click', () => {
  showSection('dashboard');
});

// Auth submit
authForm && authForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  // Save user
  const user = { email, password };
  localStorage.setItem("user", JSON.stringify(user));

  // Set logged in
  localStorage.setItem("loggedIn", "true");

  authModal.style.display = 'none';

  updateUserUI();

  showSection('dashboard');
});
// Add pet toggle
addPetBtn && addPetBtn.addEventListener('click', ()=> {
  if (!addPetFormWrap) return;  // ✅ safety

  addPetFormWrap.style.display =
    addPetFormWrap.style.display === 'block' ? 'none' : 'block';
});

cancelAddPet && cancelAddPet.addEventListener('click', ()=> {
  if (addPetFormWrap) addPetFormWrap.style.display = 'none';
});
// Add pet
petForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const name = document.getElementById('petName').value;
  const type = document.getElementById('petType').value;
  const age = document.getElementById('petAge').value;
  const breed = document.getElementById('petBreed').value;

  console.log("Sending data...");

  fetch("http://localhost:5000/pets", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    type: type,
    age: age,
    breed: breed
  })
})
.then(res => res.text())
.then(data => {
  console.log("Response:", data);
  renderPets();

  // 👇 MUST be inside .then
  addPetFormWrap.style.display = "none";
})
.catch(err => {
  console.error("Error:", err);
});
})

// Render pets
function renderPets(){
  console.log("Rendering pets...");
  petsContainer.innerHTML = "<p style='color:white;'>Loading pets...</p>";

  fetch("http://localhost:5000/pets")
    .then(res => res.json())
    .then(pets => {
      console.log(pets);

      // ✅ FIX: check inside here
      if (!pets || pets.length === 0) {
        petsContainer.innerHTML = "<p style='color:white;'>No pets added yet 🐾</p>";
        return;
      }

      pets.forEach((p) => {
        const div = document.createElement('div');

        div.style.border = selectedPet && selectedPet.id === p.id
          ? "2px solid #ff6b6b"
          : "1px solid #ccc";

        div.style.padding = "10px";
        div.style.margin = "10px";
        div.style.cursor = "pointer";

        div.innerHTML = `
  <h3>${p.name}</h3>
  <p>${p.type}</p>
  <button onclick="deletePet(${p.id})" class="btn ghost">Delete</button>
`;

        div.addEventListener("click", () => {
          selectedPet = p;
          console.log("Selected:", selectedPet);
          alert("Selected " + p.name);
          updateSectionMessages();
        });

        petsContainer.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Error loading pets:", err);
    });
}
// Store demo
const exampleProducts = [
  {id:1,name:'Premium Dog Food',price:'₹899',img:'assets/dog-food.png'},
  {id:2,name:'Cat Treats',price:'₹349',img:'assets/cat-treats.png'},
  {id:3,name:'Grooming Brush',price:'₹499',img:'assets/brush.png'}
];

function renderStore(search = "") {
  storeContainer.innerHTML = "";

  let products = petProducts;

// 🧠 Category filter
if (currentCategory !== "all") {
  products = products.filter(p => p.category === currentCategory);
}

  // 🔍 Search filter
  if (search) {
    products = petProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ❗ Empty state
  if (products.length === 0) {
    storeContainer.innerHTML = "<p>No pet products found 🐾</p>";
    return;
  }

  // 🎨 Render
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = "store-card";

    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
<div style="font-weight:700">${p.name}</div>
<div class="pet-sub">${p.price}</div>
<button class="btn primary add-cart" onclick="addToCart('${p.name}', '${p.price}')">
  Add to Cart
</button>
    `;
    div.addEventListener("click", () => {
  openProductModal(p);
});

    storeContainer.appendChild(div);
  });
}

// Navigation

// Navigation

navDashboard && navDashboard.addEventListener('click', () => {
  showSection('dashboard');
});

navStore && navStore.addEventListener('click', () => {
  showSection('store');
  renderStore();
});

navCart && navCart.addEventListener('click', () => {
  showSection('cart');
  renderCart();
});

navVacc && navVacc.addEventListener('click', () => requirePet('vaccinations'));
navGroom && navGroom.addEventListener('click', () => requirePet('grooming'));
navVet && navVet.addEventListener('click', () => requirePet('vet'));
navMed && navMed.addEventListener('click', () => requirePet('medications'));

function requirePet(section) {
  if (!selectedPet) {
    alert("Please select a pet first 🐾");
    showSection('dashboard');
    return;
  }

  console.log("Opening section:", section); // 👈 debug

  showSection(section);

  // 👇 THIS IS THE IMPORTANT FIX
  if (section === "grooming") {
    console.log("Calling loadGrooming...");
    loadGrooming();
  }
  if (section === "vaccinations") {
  loadVaccinations();
}
if (section === "medications") {
  loadMedications();
}
if (section === "vet") {
  loadVet();
}
}


navVacc && navVacc.addEventListener('click', () => requirePet('vaccinations'));
navGroom && navGroom.addEventListener('click', () => requirePet('grooming'));
navVet && navVet.addEventListener('click', () => requirePet('vet'));
navMed && navMed.addEventListener('click', () => requirePet('medications'));

// Quick start
document.getElementById('getStarted')?.addEventListener('click', () => {
  authModal.style.display = 'flex';
});

document.getElementById('tryDemo')?.addEventListener('click', () => {
  showSection('dashboard');
});

// Open Groom Form
document.getElementById("addGroomBtn")?.addEventListener("click", () => {
  if (!selectedPet) {
    alert("Select a pet first 🐾");
    showSection("dashboard");
    return;
  }
  document.getElementById("groomForm").style.display = "block";
});

// Close form
function closeGroomForm() {
  document.getElementById("groomForm").style.display = "none";
}

// Save grooming
function saveGrooming() {
  const service = document.getElementById("groomService").value;
  const date = document.getElementById("groomDate").value;
  const notes = document.getElementById("groomNotes").value;
  const reminder = document.getElementById("groomReminder").value;

  console.log("Saving grooming for pet:", selectedPet);
  fetch("http://localhost:5000/grooming", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  pet_id: Number(selectedPet.id),
  service,
  date,
  notes,
  reminder
})
  })
  .then(res => res.text())
  .then(data => {
    console.log("Grooming Reminder:", reminder);
    alert("Grooming saved ✅");
    closeGroomForm();
  })
  .catch(err => {
    console.error(err);
  });
}
function loadGrooming() {
  document.getElementById("groomingContainer")
  console.log("Loading grooming for pet:", selectedPet);
  if (!selectedPet) return;

  fetch(`http://localhost:5000/grooming/${selectedPet.id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("groomingContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No grooming records yet</p>";
        return;
      }

      data.forEach(g => {
        const div = document.createElement("div");
        div.className = "card";

       div.innerHTML = `
  <h4>${g.service}</h4>
  <p>Date: ${g.date}</p>

  <p class="reminder-badge">
    ⏰ Reminder: ${g.reminder || "Not set"}
  </p>

  <p>${g.notes || ""}</p>
  <button onclick="deleteGrooming(${g.id})" class="btn ghost">Delete</button>
`;

        container.appendChild(div);
      });
    });
}
// Open Vaccination Form
document.getElementById("addVaccBtn")?.addEventListener("click", () => {
  if (!selectedPet) {
    alert("Select a pet first 🐾");
    showSection("dashboard");
    return;
  }
  document.getElementById("vaccForm").style.display = "block";
});

// Close form
function closeVaccForm() {
  document.getElementById("vaccForm").style.display = "none";
}

// Save vaccination
function saveVaccination() {
  const reminder = document.getElementById("vaccReminder").value;
  const vaccine = document.getElementById("vaccName").value;
  const date = document.getElementById("vaccDate").value;
  const notes = document.getElementById("vaccNotes").value;
  console.log("Reminder value:", reminder);

  fetch("http://localhost:5000/vaccinations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  pet_id: Number(selectedPet.id),
  vaccine,
  date,
  notes,
  reminder
})
  })
  .then(res => res.text())
  .then(data => {
  console.log(data);
    alert("Vaccination saved ✅");
    closeVaccForm();
    loadVaccinations();
  })
  .catch(err => console.error(err));
}
function loadVaccinations() {
  if (!selectedPet) return;

  fetch(`http://localhost:5000/vaccinations/${selectedPet.id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("vaccinationContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No vaccinations yet</p>";
        return;
      }

      data.forEach(v => {
        const div = document.createElement("div");
        div.className = "card";

    div.innerHTML = `
  <h4>${v.vaccine}</h4>
  <p>Date: ${v.date}</p>
  
  <p class="reminder-badge">
    ⏰ Reminder: ${v.reminder || "Not set"}
  </p>

  <p>${v.notes || ""}</p>
  <button onclick="deleteVaccination(${v.id})" class="btn ghost">Delete</button>
`;

        container.appendChild(div);
      });
    });
}

// Open Medication form
document.getElementById("addMedBtn")?.addEventListener("click", () => {
  if (!selectedPet) {
    alert("Select pet first 🐾");
    showSection("dashboard");
    return;
  }
  document.getElementById("medForm").style.display = "block";
});

// Close form
function closeMedForm() {
  document.getElementById("medForm").style.display = "none";
}

// Save medication
function saveMedication() {
  const medicine = document.getElementById("medName").value;
  const date = document.getElementById("medDate").value;
  const notes = document.getElementById("medNotes").value;
  const reminder = document.getElementById("medReminder").value;

  fetch("http://localhost:5000/medications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  body: JSON.stringify({
  pet_id: Number(selectedPet.id),
  medicine,
  date,
  notes,
  reminder
})
  })
  .then(res => res.text())
  .then(() => {
    console.log("Medication Reminder:", reminder);
    alert("Medication saved ✅");
    closeMedForm();
    loadMedications();
  })
  .catch(err => console.error(err));
}

function loadMedications() {
  if (!selectedPet) return;

  fetch(`http://localhost:5000/medications/${selectedPet.id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("medicationContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No medications yet</p>";
        return;
      }

      data.forEach(m => {
        const div = document.createElement("div");
        div.className = "card";

div.innerHTML = `
  <h4>${m.medicine}</h4>
  <p>Date: ${m.date}</p>

  <p class="reminder-badge">
    ⏰ Reminder: ${m.reminder || "Not set"}
  </p>

  <p>${m.notes || ""}</p>
  <button onclick="deleteMedication(${m.id})" class="btn ghost">Delete</button>
`;
        container.appendChild(div);
      });
    });
}

document.getElementById("addVetBtn")?.addEventListener("click", () => {
  if (!selectedPet) {
    alert("Select pet first 🐾");
    showSection("dashboard");
    return;
  }
  document.getElementById("vetForm").style.display = "block";
});
function closeVetForm() {
  document.getElementById("vetForm").style.display = "none";
}
function saveVet() {
  const doctor = document.getElementById("vetDoctor").value;
  const date = document.getElementById("vetDate").value;
  const notes = document.getElementById("vetNotes").value;
  const reminder = document.getElementById("vetReminder").value;

  fetch("http://localhost:5000/vet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  body: JSON.stringify({
  pet_id: Number(selectedPet.id),
  doctor,
  date,
  notes,
  reminder
  })
  })
  .then(res => res.text())
  .then(() => {
    console.log("Vet Reminder:", reminder);
    alert("Vet visit saved ✅");
    closeVetForm();
    loadVet();
  });
}
function loadVet() {
  if (!selectedPet) return;

  fetch(`http://localhost:5000/vet/${selectedPet.id}`)
    .then(res => res.json())
    .then(data => {
      console.log("Vet Data:", data);
      const container = document.getElementById("vetContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>No vet visits yet</p>";
        return;
      }

      data.forEach(v => {
        const div = document.createElement("div");
        div.className = "card";

       div.innerHTML = `
  <h4>${v.doctor}</h4>
  <p>Date: ${v.date}</p>

  <p class="reminder-badge">
    ⏰ Reminder: ${v.reminder || "Not set"}
  </p>

  <p>${v.notes || ""}</p>
  <button onclick="deleteVet(${v.id})" class="btn ghost">Delete</button>
`;
        container.appendChild(div);
      });
    });
}
function deleteGrooming(id) {
  fetch(`http://localhost:5000/grooming/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadGrooming();
  })
  .catch(err => console.error(err));
}

function deleteGrooming(id) {
  fetch(`http://localhost:5000/grooming/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadGrooming();
  });
}

function deleteVaccination(id) {
  fetch(`http://localhost:5000/vaccinations/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadVaccinations();
  });
}

function deleteMedication(id) {
  fetch(`http://localhost:5000/medications/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadMedications();
  });
}

function deleteVet(id) {
  fetch(`http://localhost:5000/vet/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Deleted ✅");
    loadVet();
  });
}

function deletePet(id) {
  fetch(`http://localhost:5000/pets/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Pet deleted 🗑️");
    renderPets();
  })
  .catch(err => console.error(err));
}
document.getElementById("storeSearch")?.addEventListener("input", (e) => {
  renderStore(e.target.value);
});
let currentCategory = "all";

function filterCategory(category) {
  currentCategory = category;
  renderStore(document.getElementById("storeSearch")?.value || "");
}
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartCount();
  saveCart();

  showSection("cart");
  saveCart();
}
function updateCartCount() {
  const cartEl = document.getElementById("cartCount");
  if (cartEl) {
    cartEl.innerText = "Cart: " + cart.length;
  }
}
function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🐾</p>";
    totalEl.innerText = "Total: ₹0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
  const price = Number(item.price.replace("₹", "").replace(",", ""));
  const itemTotal = price * item.qty;
  total += itemTotal;

  const div = document.createElement("div");
  div.className = "cart-card";

  div.innerHTML = `
    <div class="cart-left">
      <div class="cart-name">${item.name}</div>
      <div class="cart-price">${item.price}</div>
    </div>

    <div class="cart-right">
      <div class="qty-control">
        <button onclick="decreaseQty(${index})">−</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})">+</button>
      </div>

      <div class="item-total">₹${itemTotal}</div>

      <button onclick="removeFromCart(${index})" class="btn ghost">✕</button>
    </div>
  `;

  container.appendChild(div);
});

  totalEl.innerText = "Total: ₹" + total;
}
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  updateCartCount();
  saveCart();
}
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty 🛒");
    return;
  }

  alert("Order placed successfully 🎉");

  cart = [];
  saveCart();
  renderCart();
  updateCartCount();
}
function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
  updateCartCount();
  saveCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
  updateCartCount();
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateUserUI() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loggedIn = localStorage.getItem("loggedIn");

  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");

  updateUserUI();

  showSection("intro");
});

  if (loggedIn && user) {
    userInfo.innerText = "👤 " + user.email;
    logoutBtn.style.display = "inline-block";
  } else {
    userInfo.innerText = "";
    logoutBtn.style.display = "none";
  }
}
let selectedProduct = null;

function openProductModal(product) {
  selectedProduct = product;

  document.getElementById("modalImg").src = product.img;
  document.getElementById("modalName").innerText = product.name;
  document.getElementById("modalPrice").innerText = product.price;
  document.getElementById("modalDesc").innerText = product.desc || "Premium pet product";

  document.getElementById("productModal").style.display = "flex";
}

function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
}

function addModalToCart() {
  if (!selectedProduct) return;

  addToCart(selectedProduct.name, selectedProduct.price);

  closeProductModal();
}
// 🔔 COMBINED REMINDER SYSTEM
setInterval(() => {

  if (!selectedPet) return;

  const today = new Date().toISOString().split("T")[0];

  Promise.all([
    fetch(`http://localhost:5000/vaccinations/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/medications/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/vet/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/grooming/${selectedPet.id}`).then(res => res.json())
  ])
  .then(([vacc, meds, vet, groom]) => {

    // Vaccinations
    vacc.forEach(v => {
      if (v.reminder === today) {
        alert("💉 Vaccination Reminder: " + v.vaccine);
      }
    });

    // Medications
    meds.forEach(m => {
      if (m.reminder === today) {
        alert("💊 Medication Reminder: " + m.medicine);
      }
    });

    // Vet Visits
    vet.forEach(v => {
      if (v.reminder === today) {
        alert("🩺 Vet Visit Reminder: " + v.doctor);
      }
    });

    // Grooming
    groom.forEach(g => {
      if (g.reminder === today) {
        alert("✂️ Grooming Reminder: " + g.service);
      }
    });

  })
  .catch(err => console.error("Reminder error:", err));

}, 5000); // every 1 min
Notification.requestPermission().then(permission => {
  console.log("Permission:", permission);
});
setInterval(() => {

  if (!selectedPet) return;

  const today = new Date().toISOString().split("T")[0];

  Promise.all([
    fetch(`http://localhost:5000/vaccinations/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/medications/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/vet/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/grooming/${selectedPet.id}`).then(res => res.json())
  ])
  .then(([vacc, meds, vet, groom]) => {

    // Vaccinations
    vacc.forEach(v => {
      if (v.reminder === today) {
        showReminderPopup(`💉 Vaccination: ${v.vaccine}`);
      }
    });

    // Medications
    meds.forEach(m => {
      if (m.reminder === today) {
        showReminderPopup(`💊 Medication: ${m.medicine}`);
      }
    });

    // Vet
    vet.forEach(v => {
      if (v.reminder === today) {
        showReminderPopup(`🩺 Vet Visit: ${v.doctor}`);
      }
    });

    // Grooming
    groom.forEach(g => {
      if (g.reminder === today) {
        showReminderPopup(`✂️ Grooming: ${g.service}`);
      }
    });

  });

}, 5000);
function showReminderPopup(message) {
  alert("🐾 Reminder Today!\n\n" + message);
}
function loadReminders() {

  if (!selectedPet) {
    alert("Select a pet first 🐾");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const todayDiv = document.getElementById("todayReminders");
  const upcomingDiv = document.getElementById("upcomingReminders");

  todayDiv.innerHTML = "<h3>🔥 Today</h3><div class='reminder-list'></div>";
  upcomingDiv.innerHTML = "<h3>📅 Upcoming</h3><div class='reminder-list'></div>";

  Promise.all([
    fetch(`http://localhost:5000/vaccinations/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/medications/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/vet/${selectedPet.id}`).then(res => res.json()),
    fetch(`http://localhost:5000/grooming/${selectedPet.id}`).then(res => res.json())
  ])
  .then(([vacc, meds, vet, groom]) => {

    console.log("Vacc:", vacc); // ✅ INSIDE
    console.log("Meds:", meds);

    const all = [
      ...vacc.map(v => ({ type: "Vaccination", name: v.vaccine, reminder: v.reminder })),
      ...meds.map(m => ({ type: "Medication", name: m.medicine, reminder: m.reminder })),
      ...vet.map(v => ({ type: "Vet Visit", name: v.doctor, reminder: v.reminder })),
      ...groom.map(g => ({ type: "Grooming", name: g.service, reminder: g.reminder }))
    ];

    const todayList = todayDiv.querySelector(".reminder-list");
    const upcomingList = upcomingDiv.querySelector(".reminder-list");

    all.forEach(item => {

      if (!item.reminder) return;

      const card = document.createElement("div");
      card.className = "reminder-card";

      card.innerHTML = `
        <div class="reminder-card-top">
          <span class="reminder-type">${item.type}</span>
          <span class="reminder-date">${item.reminder}</span>
        </div>
        <div class="reminder-name">${item.name}</div>
      `;

      if (item.reminder === today) {
        card.classList.add("today");
        todayList.appendChild(card);
      } else if (item.reminder > today) {
        upcomingList.appendChild(card);
      }

    });

  });

}