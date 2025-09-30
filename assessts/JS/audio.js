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
// this is for searching 
$(document).ready(function () {
    const $searchInput = $("#searchInput");
    const $searchResults = $("#searchResults");
    const $noResults = $("#noResults");

    function searchProducts(query) {
        query = query.toLowerCase();
        $searchResults.empty();
        let found = false;

        $(".card").each(function () {
            const productName = $(this).find("h2").text().toLowerCase();
            if (productName.includes(query)) {
                found = true;
                $searchResults.append($(this).clone());
            }
        });

        if (!found) {
            $noResults.removeClass("d-none");
        } else {
            $noResults.addClass("d-none");
        }
    }

    $searchInput.on("keyup", function () {
        const query = $(this).val().trim();
        if (query.length > 0) {
            searchProducts(query);
        } else {
            $searchResults.empty();
            $noResults.addClass("d-none");
        }
    });

    // Prevent form submit reload
    $("#searchModal form").on("submit", function (e) {
        e.preventDefault();
    })

    // this is for brands filter 
    let brandFilter = document.getElementById("brandFilter");
    let sections = document.querySelectorAll("section");
    let allcards = document.querySelectorAll(".card");

    brandFilter.addEventListener("change", function () {
        let selectedBrand = this.value.toLowerCase().trim();
        let foundAny = false;

        if (selectedBrand === "all brands" || selectedBrand === "") {
            sections.forEach(sec => sec.classList.remove("d-none"));
            allcards.forEach(card => card.parentElement.classList.remove("d-none"));
            document.getElementById("no-results").classList.add("d-none");
            return;
        }

        sections.forEach(function (section) {
            let sectionCards = section.querySelectorAll(".card");
            let found = false;

            sectionCards.forEach(function (card) {
                let cardBrand = (card.getAttribute("data-brand") || "").toLowerCase().trim();
                if (cardBrand === selectedBrand) {
                    card.parentElement.classList.remove("d-none");
                    found = true;
                    foundAny = true;
                } else {
                    card.parentElement.classList.add("d-none");
                }
            });

            if (found) {
                section.classList.remove("d-none");
            } else {
                section.classList.add("d-none");
            }
        });

        if (!foundAny) {
            document.getElementById("no-results").classList.remove("d-none");
        } else {
            document.getElementById("no-results").classList.add("d-none");
        }
    });
    // this is for lens aceesories filter 
    $("#accessories_filter").on("change", function () {
        let selected = $(this).val().toLowerCase().trim();
        $("#accessories_filter_cards .card").each(function () {
            let brand = $(this).data("brand")?.toLowerCase().trim();

            if (selected === "all accessories" || selected === "") {
                $(this).closest(".col-xl-4").show();
            } else if (brand === selected) {
                $(this).closest(".col-xl-4").show();
            } else {
                $(this).closest(".col-xl-4").hide();
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
})
