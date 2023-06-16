const sideMenu = document.querySelector("aside");
const closeBtn = document.querySelector("#close-btn");

//show sidebar


//close sidebar
closeBtn.addEventListener("click", () => {
    sideMenu.style.display = "none";
});

//display services

let productsContainer = document.getElementById("product-container");
let baseUrl = `https://hid-food-apii.onrender.com/product_data`;
let mainSection = document.getElementById("container");
let hotelLS = JSON.parse(localStorage.getItem("hotelCard")) || [];
// let productsArray = JSON.parse(localStorage.getItem("products")) || [];

window.addEventListener("load", fetchData(1))

async function fetchData(Page) {
    try {
        let responce = await fetch(`${baseUrl}?_page=${Page}&_limit=10`)
        let total = responce.headers.get(`X-Total-Count`)
        pagination.innerHTML = "";
        let page = Math.ceil(total/10);

        for (let i = 1; i <= page; i++) {
            pagination.append(creatBtn(i))
        }

        let data = await responce.json();
        globle = data;
        displayHotel(data);
    } catch (error) {
        console.log(error)
    }
}

function creatBtn(id) {

    let btn = document.createElement("button");
    btn.classList.add("pageBtn");
    btn.textContent = id;
    btn.addEventListener("click", () => fetchData(id))


    return btn;
}

function displayHotel(data) {

    mainSection.innerHTML = "";
    let cardlist = document.createElement("div")
    cardlist.classList.add("cardList");

    data.forEach(hotel => {

        cardlist.append(displaycard(hotel));
    })
    mainSection.append(cardlist);
}

function displaycard(hotel) {

    let card = document.createElement("div");
    card.id="card"

    let imagediv = document.createElement("div");
    imagediv.classList.add("imagediv");

    let image = document.createElement("img");
    image.src = hotel.avatar;
    image.setAttribute("alt", hotel.name);

    imagediv.append(image);

    let cardbody = document.createElement("div");
    cardbody.classList.add("cardbody");

    let name = document.createElement("h2");
    name.textContent = hotel.name;

    let description = document.createElement("p");
    description.textContent = hotel.details;

    let distance = document.createElement("p");
    distance.textContent = `Distance : ${hotel.distance}m`;

    let rateing = document.createElement("p");
    rateing.textContent = hotel.rateing;

    let review = document.createElement("h4");
    review.textContent = `Review of Hotel :- ${hotel.review}`;

    cardbody.append(name, description, distance, review)

    let cardbuy = document.createElement("div");
    cardbuy.classList.add("cardbuy");

    let price = document.createElement("p");
    price.textContent = `Price : ₹ ${hotel.price}`;

    let tax = document.createElement("p")
    tax.textContent = `Tax : ₹ ${hotel.tax}`;

    let buy = document.createElement("button");
    buy.classList.add("buybtn");
    buy.textContent = "Book Now"

    let stars = document.createElement("i")
    stars.textContent = `Rating ${hotel.rating}`
    buy.addEventListener("click", () => {
       
            Swal.fire({
                title: `${hotel.name}`,
                text: `Is Select For Booking`,
                imageUrl: `${hotel.avatar}`,
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
               
              })
            hotelLS.push({ ...hotel, day: 1, Guest: 0 });
            localStorage.setItem("hotelCard", JSON.stringify(hotelLS))
            window.location.href="./booking.html"
      
    })
    cardbuy.append(stars, price, tax, buy)



    card.append(imagediv, cardbody, cardbuy)
    return card;
}

// displayProducts(productsArray);

function displayProducts(data){
    productsContainer.innerHTML = "";

    data.forEach((product, index) => {
        //console.log(product.description)
        let productCard = document.createElement("div");
        productCard.setAttribute("class", "product-card");

        let productImg = document.createElement("img");
        productImg.setAttribute("class", "product-img");
        productImg.src = product.img;

        let productDesc = document.createElement("p");
        productDesc.setAttribute("class", "product-desc");
        productDesc.innerText = product.description;

        let date = document.createElement("p");
        date.setAttribute("class", "product-desc");
        date.innerText = product.date;

        let productName = document.createElement("h3");
        productName.setAttribute("class", "product-category");
        productName.innerText = product.title;
        

        let removeButton = document.createElement("button");
        removeButton.innerText = "Remove";
        removeButton.setAttribute("class", "remove-btn");

        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.setAttribute("class", "edit-btn");
        removeButton.addEventListener("click", function(){
            removeProduct(product.id);
        })

        editButton.addEventListener("click", function(){
            localStorage.setItem("editBlog", product.id)
            window.location.href="editBlog.html";

        })

        productCard.append(productImg, productName, date, productDesc,  removeButton, editButton);
        productsContainer.append(productCard);
    });
}

function removeProduct(productid){
    fetch(`http://localhost:3000/blogs/${productid}`, {
        method : 'DELETE',
        headers : {
            'Content-type' : 'application/json'
        }
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        console.log(data);
        fetchProducts();
    })
}