const navbarMenu = document.getElementById('navbarMenu');
const menuOverlay = document.getElementById('menuOverlay');

navbarMenu.addEventListener('show.bs.collapse', () => {
  menuOverlay.classList.add('active');
});

navbarMenu.addEventListener('hidden.bs.collapse', () => {
  menuOverlay.classList.remove('active');
});

// Close menu when clicking on overlay
menuOverlay.addEventListener('click', () => {
  const bsCollapse = bootstrap.Collapse.getInstance(navbarMenu);
  bsCollapse.hide();
});
// this is for slider 
// Particle generator in background
const particlesContainer = document.querySelector('.particles');
const colors = [
  "rgba(255, 255, 255, 0.96)",
  "rgba(173, 255, 200, 0.98)",
  "rgba(144, 238, 144, 0.65)",
  "rgba(173, 216, 230, 1)",
  "rgba(224, 255, 186, 1)"
];

for (let i = 0; i < 120; i++) {
  const particle = document.createElement('span');
  particle.classList.add('particle');

  const size = Math.random() * 15 + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;

  const color = colors[Math.floor(Math.random() * colors.length)];
  particle.style.background = color;
  particle.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}`;

  const randomX = (Math.random() - 0.5) * 600;
  const randomY = (Math.random() - 0.5) * 600;
  particle.style.setProperty('--x', `${randomX}px`);
  particle.style.setProperty('--y', `${randomY}px`);

  particle.style.animationDuration = `${Math.random() * 10 + 5}s`;

  particlesContainer.appendChild(particle);
}

// Camera movement effect 
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.slider-img img').forEach(img => {
    const x = (e.clientX - window.innerWidth / 2) / 30;
    const y = (e.clientY - window.innerHeight / 2) / 30;
    img.style.transform = `translate(${x}px, ${y}px)`;
  });
});
// this is for brand name slider 
$(document).ready(function () {
  var $carousel = $('.brand-carousel');

  $carousel.slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 2 }
      }
    ]
  });


  $carousel.find('.slick-prev').hide();

  $carousel.on('afterChange', function (event, slick, currentSlide) {
    var totalSlides = slick.slideCount;
    var slidesToShow = slick.options.slidesToShow;

    if (currentSlide === 0) {
      $carousel.find('.slick-prev').hide();
    } else {
      $carousel.find('.slick-prev').show();
    }


    if (currentSlide >= totalSlides - slidesToShow) {
      $carousel.find('.slick-next').hide();
    } else {
      $carousel.find('.slick-next').show();
    }
  });


  // this is for searching 
  $("#searchInput").on("keyup", function () {
    let query = $(this).val().toLowerCase();
    $("#searchResults").empty();
    $("#noResults").addClass("d-none");

    if (query.length > 0) {
      let hasResult = false;

      $(".product-cards-area .card").each(function () {
        let title = $(this).find(".card-title").text().toLowerCase();
        if (title.includes(query)) {
          let clone = $(this).parent().clone();
          $("#searchResults").append(clone);
          hasResult = true;
        }
      });

      if (!hasResult) {
        $("#noResults").removeClass("d-none");
      } else {
        // Scroll modal body to top when results update
        $("#searchModal .modal-body").scrollTop(0);
      }
    }
  });
});

// Select all cards
let cards = document.querySelectorAll('.card');
let add_btns = document.querySelectorAll('.third-btn');
let table = document.querySelector("#card_table tbody")
let cart_counters = document.querySelectorAll("#cart_counter")
let cart_info = [];


// this is for looping over indivi btn
add_btns.forEach(function (btn, index) {
  btn.addEventListener('click', function () {
    // this is for getting parent card of respective btn
    let card = btn.closest('.card');

    // extract data from that card
    const name = card.querySelector('h2').innerText;
    const price = card.querySelector('span').innerText;
    const img = card.querySelector('img').getAttribute('src');


    // this is for checking that dat is exists or not if exist qty+1 w.r.t btn click
    let existing = cart_info.find(function (item) {
      return item.productName === name
    });

    if (existing) {
      existing.qty += 1;
    } else {
      let coll_data = {
        productName: name,
        productPrice: price,
        productImage: img,
        qty: 1
      };
      cart_info.push(coll_data);
    }

    // save to localStorage
    localStorage.setItem('card-data', JSON.stringify(cart_info));

    console.log(cart_info);
    // this is for show data function in modal 
    show_cart_data()
    // this is for cart item value 
    cart_count_value()
  });
});
// cart number increment
function cart_count_value() {
  let total_count = 0;
  cart_info.forEach(function (item) {
    total_count += item.qty;
  });
  cart_counters.forEach(function (cart_counter) {
    cart_counter.innerText = total_count
  })

}

// this is for show data in modal 
function show_cart_data() {
  table.innerHTML = ''
  cart_info.forEach(function (item, index) {
    let row = `
       <tr>
                                <td>${index + 1}</td>
                                <td>${item.productName}</td>
                                <td>  <img src="${item.productImage}" width="40px" alt=""></td>
                                <td>${item.productPrice}</td>
                                <td><button class="dec-btn btn btn-sm btn-outline-secondary" data-index="${index}">-</button>
                                 <span class="mx-2">${item.qty}</span>
                                  <button class="inc-btn btn btn-sm btn-outline-secondary" data-index="${index}">+</button></td>
                                <td><i class="fa-solid fa-trash text-danger del-btn"i></td>
                            </tr>
      `
    table.insertAdjacentHTML("beforeend", row);


  })
  // this is for cart item value 
  cart_count_value()
}
// this is for increment and decrement and delete btn 
table.addEventListener("click", function (e) {
  const target = e.target;
  const idx = target.getAttribute("data-index");

  if (target.classList.contains("inc-btn")) {
    cart_info[idx].qty += 1;
  } else if (target.classList.contains("dec-btn")) {
    if (cart_info[idx].qty > 1) {
      cart_info[idx].qty -= 1;
    } else {
      cart_info.splice(idx, 1);
    }
  } else if (target.classList.contains("del-btn")) {
    cart_info.splice(idx, 1);
  } else {
    return; // clicked something else
  }

  localStorage.setItem('card-data', JSON.stringify(cart_info));
  show_cart_data();
});
// this is for compare items 
let compare_btns = document.querySelectorAll('.sec-btn')
let compare_table = document.querySelector("#compare_table tbody")
let compare_counters = document.querySelectorAll("#compare_counter")
let compare_info = [];
// this is for looping over indivi btn
compare_btns.forEach(function (cbtn, index) {
  cbtn.addEventListener('click', function () {
    // this is for getting parent card of respective btn
    let card = cbtn.closest('.card');

    // extract data from that card
    const name = card.querySelector('h2').innerText;
    const price = card.querySelector('span').innerText;
    const img = card.querySelector('img').getAttribute('src');
    let liElements = card.querySelectorAll("ul li");
    let key_features = Array.from(liElements).map(li => li.innerText).join(",<br> ");
    // check if product already exists
    let exists = compare_info.some(item => item.productName === name);
    if (exists) {
      alert("This product is already in compare list!");
      return;
    }
    let coll_data = {
      productName: name,
      productPrice: price,
      productImage: img,
      keyFeatures: key_features
    };
    compare_info.push(coll_data);


    // save to localStorage
    localStorage.setItem('compare-card-data', JSON.stringify(compare_info));

    // this is for show data function in modal 
    show_compare_data()
    // this is for compare item value 
    update_compare_counter()
  });
});

// this is for show data in modal 
function show_compare_data() {
  compare_table.innerHTML = ''
  compare_info.forEach(function (item, index) {
    let row = `
       <tr>
                                <td>${index + 1}</td>
                                <td>${item.productName}</td>
                                <td>  <img src="${item.productImage}" width="40px" alt=""></td>
                                <td>${item.productPrice}</td>
                                <td>
                                ${item.keyFeatures}
                                    </td>
                                <td><i class="fa-solid fa-trash text-danger del-btn"i></td>
                            </tr>
      `
    compare_table.insertAdjacentHTML("beforeend", row);


  })

}
compare_table.addEventListener('click', function (e) {
  if (e.target.classList.contains('del-btn')) {
    let rowIndex = e.target.closest('tr').rowIndex - 1; // adjust for header
    compare_info.splice(rowIndex, 1);
    localStorage.setItem('compare-card-data', JSON.stringify(compare_info));
    show_compare_data();
    // this is for compare counter value 
    update_compare_counter()
  }
});
// update compare counter
function update_compare_counter() {
  compare_counters.forEach(counter => {
    counter.innerText = compare_info.length;
  });
}




