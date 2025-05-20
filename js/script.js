import { fetchApi } from "./fetchApi.js";

const inputSearch = document.querySelector("#InputSearch");
const BtnSearch = document.querySelector("#BtnSearch");
const filter = document.querySelector("#filter");

// Category
fetchApi("http://localhost:3000/products").then((data) => {
  // console.log(data);
  // Lấy ra mảng category từ data
  const categories = data.map((item) => item.category);
  const divCategory = document.querySelector("#category");

  // Dùng Set để loại bỏ trùng lặp
  // Dùng spread operator [...] để chuyển Set thành mảng mới uniqueCategories.
  const uniqueCategories = [...new Set(categories)];

  // Tạo HTML cho mỗi category duy nhất
  let htmls = "";
  uniqueCategories.forEach((category) => {
    htmls += `
        <div class="category-item" data-category="${category}" style="cursor:pointer;">
          <h2>${category}</h2>
        </div>
      `;
  });

  // Gán HTML vào div

  divCategory.innerHTML = htmls;

  let currentCategory = null;
  divCategory.querySelectorAll(".category-item").forEach((elem) => {
    elem.addEventListener("click", () => {
      const selectedCategory = elem.getAttribute("data-category");
      console.log("Clicked category:", selectedCategory);
      if (selectedCategory === currentCategory) {
        showAllProducts();
        currentCategory = null; // Reset trạng thái về tất cả sản phẩm
      } else {
        currentCategory = selectedCategory; // Cập nhật trạng thái
        showProductsByCategory(selectedCategory);
      }
    });
  });
});
// Hàm fetch và hiển thị sản phẩm theo category
function showProductsByCategory(category) {
  fetchApi(
    `http://localhost:3000/products?category=${encodeURIComponent(category)}`
  ).then((data) => {
    const divProducts = document.querySelector("#Products-list");
    if (data.length === 0) {
      divProducts.innerHTML = "<p>Không tìm thấy sản phẩm nào</p>";
      return;
    }

    let htmls = "";
    data.forEach((p) => {
      htmls += `
        
          <div class="inner-item">
            <div class="inner-img">
              <img src="${p.images}" alt="${p.title}">
              <span>${p.discountPercentage}%</span>
            </div>
            <div class="inner-title">
              <h3>${p.title}</h3>
            </div>
            <div class="inner-price">
              <p>${p.price}$</p>
              <p>Còn lại: ${p.stock}</p>
            </div>
            
          </div>
        
        `;
    });
    divProducts.innerHTML = htmls;
  });
}
// End Category

// Products List
// phần hiển thị sản phẩm
fetchApi("http://localhost:3000/products").then((data) => {
  // console.log(data);
  let htmls = "";
  data.forEach((item) => {
    htmls += `
        
          <div class="inner-item">
            <div class="inner-img">
              <img src="${item.images}" alt="${item.title}">
              <span>${item.discountPercentage}%</span>
            </div>
            <div class="inner-title">
              <h3>${item.title}</h3>
               
            </div>
            <div class="inner-price">
              <p>${item.price}$</p>
              <p>Còn lại: ${item.stock}</p>
            </div>
           
          </div>
        
      `;
  });
  const divProducts = document.querySelector("#Products-list");
  divProducts.innerHTML = htmls;
});

//Hàm hiển thị sản phẩm
function renderProducts(Products){
  const divProducts = document.querySelector("#Products-list");
  if(Products.length === 0) {
    divProducts.innerHTML = "<p>Không tìm thấy sản phẩm nào</p>";
    return;
  }
  let htmls = "";
  Products.forEach((item) => {
    htmls += `
        
          <div class="inner-item">
            <div class="inner-img">
              <img src="${item.images}" alt="${item.title}">
              <span>${item.discountPercentage}%</span>
            </div>
            <div class="inner-title">
              <h3>${item.title}</h3>
               
            </div>
            <div class="inner-price">
              <p>${item.price}$</p>
              <p>Còn lại: ${item.stock}</p>
            </div>
           
          </div>
        
      `;
  })
  
  divProducts.innerHTML = htmls;
}
// hàm tìm kiếm sản phẩm
function searchProducts(keyword) {
   // Lấy tất cả sản phẩm
  fetchApi("http://localhost:3000/products").then((data) => {
    // Lọc các sản phẩm có chứa từ khóa trong các trường title, description, hoặc category
    const filteredProducts = data.filter((product) =>
      product.title.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase()) ||
      product.category.toLowerCase().includes(keyword.toLowerCase())
    );
    // Lọc sản phẩm theo từ khóa tìm kiếm trong tất cả các trường
    renderProducts(filteredProducts);
  });
}

BtnSearch.addEventListener("click", () => {
  const keyword = inputSearch.value.trim();
  console.log(keyword);
  if(!keyword){
    alert("Vui lòng nhập từ khóa tìm kiếm");
    return;
  }
  searchProducts(keyword);
});
inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    BtnSearch.click();
  }
});


// hàm hiển thị tất cả sản phẩm khi click lại vào category
function showAllProducts() {
  fetchApi("http://localhost:3000/products").then((data) => {
    console.log(data);
    let htmls = "";
    data.forEach((item) => {
      htmls += `
        
          <div class="inner-item">
            <div class="inner-img">
              <img src="${item.images}" alt="${item.title}">
              <span>${item.discountPercentage}%</span>
            </div>
            <div class="inner-title">
              <h3>${item.title}</h3>
              
            </div>
            <div class="inner-price">
              <p>${item.price}$</p>
              <p>Còn lại: ${item.stock}</p>
            </div>
            
          </div>
        
      `;
    });
    const divProducts = document.querySelector("#Products-list");
    divProducts.innerHTML = htmls;
  });
}

// End Products List
// sortProducts
filter.addEventListener("change", async function () {
  const sortType = this.value;
  console.log(sortType);

  // lấy dữ liệu từ API
  let products = await fetchApi("http://localhost:3000/products");

  // sắp xếp giá trị lựa chọn
  if(sortType === "asc"){
    products.sort((a,b) => a.price - b.price);
  } else if(sortType === "desc"){
    products.sort((a,b) => b.price - a.price);
  } else if(sortType === "Sale"){
    products.sort((a,b) => b.discountPercentage - a.discountPercentage);
  }else if(sortType === "Default"){
    renderProducts(products);
  }
  else{
    return;
  }

  renderProducts(products);
});
// End sortProducts