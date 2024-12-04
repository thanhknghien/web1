

// Tạo key isLogin(dùng để value id người đăng nhập)
createIsLoginKey();
showAvatar();
// Nếu đã có key thì không cần tạo nữa
function createIsLoginKey() {
    if (!localStorage.getItem('isLogIn')) {
        localStorage.setItem('isLogIn', '');
        console.log('Key isLogin đã được tạo với giá trị mặc định.');
    } else {
        console.log('Key isLogin đã tồn tại:', localStorage.getItem('isLogIn'));
    }
}

function updateIsLoginKey(userId) {
    if (localStorage.getItem('isLogIn') !== null) {
        localStorage.setItem('isLogIn', JSON.stringify(parseInt(userId)));
        console.log('Key isLogIn đã được cập nhật với ID:', userId);
    } else {
        console.error('Key isLogIn chưa được tạo!');
    }
}

// Kiểm tra isLogIn
  // - Nếu isLogIn == null thì class:login_signin hiện thị ẩn avatar user
  // - Ngược lại isLogin != null thì class:login_signin ẩn hiện thị avatar user
function showAvatar(){
    let showLoginSignin = document.getElementById('login_signin')
    let showAvatar = document.getElementById('avatar-login')
    if(!localStorage.getItem('isLogIn')){
        console.log('hien thi login-signin')
        showLoginSignin.style.display = 'block';
        showAvatar.style.display = 'none';
    }
    else{
        console.log('hien thi avatar')
        showLoginSignin.style.display = 'none';
        showAvatar.style.display = 'block';
    }
}


// Lấy dữ liệu từ localStorage
const products = JSON.parse(localStorage.getItem('product')) || [];
const users = JSON.parse(localStorage.getItem('user')) || []; 
const carts = JSON.parse(localStorage.getItem('cart')) || [];
var currentPage = 1; // Trang hiện tại
var perPage = 10; // Số sản phẩm mỗi trang
var totalPage = Math.ceil(products.length / perPage); // Tổng số trang
var product = products;
updatePagination();
init();

// JS hiện thị danh sách sản phẩm
function chuyenDanhSachDoiTuongSanPhamThanhHTML(products){
    var HTMLDanhSachSanPham = '<div class="grid_row" id="grid_row1">';

    products.forEach((sanPham) =>{
        var htmlSanPham = chuyenSanPhamThanhHTML(sanPham); 
        HTMLDanhSachSanPham = HTMLDanhSachSanPham + htmlSanPham;
    })

    HTMLDanhSachSanPham = HTMLDanhSachSanPham + '</div>';

    return HTMLDanhSachSanPham;
}

// JS hiện thị sản phẩm kèm kèm nút thêm giỏ hàng và chi tiết sản phẩm
function chuyenSanPhamThanhHTML(sanPham){
    var html ='';
    html +='<div class="grid_column-2">';
    html +=    '<div class="product-item">';
    html +=        '<img src="' + sanPham.src[0] + '" alt="">';
    html +=        '<div class="product-item-name">' + sanPham.name + '</div>';
    html +=        '<div class="product-item-price">' + sanPham.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' $</div>';
    html +=            '<div class="product-item-detail">';
    html +=                 '<div onclick="ClickChiTiet(' + String(sanPham.id) + '); ; overLay2()">Chi tiết</div>';
    html +=            '</div>';
    html +=            '<div class="product-item-buy">';
    html +=                '<div onclick="addProductCart(' + String(sanPham.id) + ', ' + sanPham.price + ')">'
    html +=                        '<i class="fa-solid fa-cart-plus iconcart"></i></div>';
    html +=            '</div>';
    html +=    '</div>';
    html +=     '<div class="form-detal" id="form-detal">';
    html +=         '<div class="detal-img">';
    html +=             '<span class="control prev">';
    html +=                 '<i class="bx bx-chevron-left"></i>';
    html +=             '</span>';
    html +=             '<span class="control next">';
    html +=                 '<i class="bx bx-chevron-right"></i>';
    html +=             '</span>';
    html +=             '<div class="img-wrap">';
    html +=                 '<img src="" alt="" />';
    html +=             '</div>'; 
    html +=         '</div>';
    html +=         '<div class="detal-infor">';
    html +=         '</div>';
    html +=     '</div>';
    html +='</div>';
    return html;
}

// JS tính tổng số trang
function calculateTotalPages(products, perPage) {
    return Math.ceil(products.length / perPage);
}

// JS lấy danh sách sản phẩm theo trang
function getPaginatedProducts(products, currentPage, perPage) {
    return products.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );
}

// JS cập nhật giao diện phân trang
function updatePagination() {
    
    totalPage = calculateTotalPages(product, perPage);

    var perSanPham = getPaginatedProducts(product, currentPage, perPage);

    var HTML = chuyenDanhSachDoiTuongSanPhamThanhHTML(perSanPham);
    document.getElementById('product').innerHTML = HTML;

    var pagination = renderPageNumber();
    document.getElementById('product-next').innerHTML = pagination;
}

// JS tạo giao diện phân trang 1 2 3....
function renderPageNumber() {
    // Nếu chỉ có 1 trang thì không hiển thị phân trang
    if (totalPage <= 1) {
        return '';
    }

    var html = '<ul class="pagination">';

    // Ẩn nút chuyển trang sang trái nếu ở đầu trang
    if (currentPage > 1) {
        html += '<li><a href="#" onclick="changePage(' + (currentPage - 1) + '); filterbar()">&laquo;</a></li>';
    }

    for (var i = 1; i <= totalPage; i++) {
        html += '<li class="' + (i === currentPage ? 'active' : '') + '">';
        html += '<a href="#" onclick="changePage(' + i + '); filterbar()">' + i + '</a>';
        html += '</li>';
    }

    // Ẩn nút chuyển trang sang phải nếu ở cuối trang
    if (currentPage < totalPage) {
        html += '<li><a href="#" onclick="changePage(' + (currentPage + 1) + '); filterbar()">&raquo;</a></li>';
    }

    html += '</ul>';
    return html;
}

function changePage(page) {
    if (page >= 1 && page <= totalPage) {
        currentPage = page;
        updatePagination(product);
    }
}

// Hàm khởi tạo
function init() {
    updatePagination(products);
}

// JS Hiẹn chi tiết sản phẩm
function ClickChiTiet(input) {
    console.log("Bạn đã click vào chi tiết:", input);

    var show = document.getElementById('form-detal');
    if (getComputedStyle(show).display == 'none'){
        show.style.display = 'block';
    }

    var find = products.find((sanPham) =>{
        return String(input) === sanPham.id;
    });
    if (find) {

        show.querySelector('.detal-infor').innerHTML = `
            <div class="infor">Tên: ${find.name}</div>
            <div class="infor">Giá: ${find.price} $</div>
            <div class="infor">Thương hiệu: ${find.brand}</div>
            <div class="infor">Nhiên liệu: ${find.fuel}</div>
            <div class="infor">Năm sản xuất: ${find.year}</div>
            <div class="detail-buy" onclick="addProductCart('${String(find.id)}', '${find.price}')"><i class="fa-solid fa-cart-plus iconcart"></i></div>
            <div class="hide-detail" onclick="closeDetal(); overLay2()">Đóng</div>
        `;


        initSlideShow(show, find.src);
    } else {
        console.error("Không tìm thấy sản phẩm với ID:", input);
    }
}

//Hàm đóng chi tiết sản phẩm
function closeDetal(){
    var show = document.getElementById('form-detal');
    if (getComputedStyle(show).display == 'block'){
        show.style.display = 'none';
    }
}

function initSlideShow(container, images) {
    let currentIndex = 0;
    let autoSlideInterval;

    const imgWrap = container.querySelector('.form-detal .img-wrap img'); 
    const nextBtn = container.querySelector('.form-detal .next'); 
    const prevBtn = container.querySelector('.form-detal .prev'); 

    const updateImage = (index) => {
        currentIndex = index;
        imgWrap.src = images[currentIndex];
    };

    const startAutoSlide = () => {
        clearInterval(autoSlideInterval);

        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage(currentIndex);
        }, 5000);
    };

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage(currentIndex);
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage(currentIndex);
        startAutoSlide();
    });

    updateImage(currentIndex);
    startAutoSlide();
}

// JS lọc sản phẩm
function findProduct() {
    let valueSearch = document.getElementById('search-input').value;

    let selectedCategories = [];
    const categoryCheckboxes = document.querySelectorAll('.filter-category input[type="checkbox"]:checked');
    categoryCheckboxes.forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });

    let selectedFuelTypes = [];
    const fuelCheckboxes = document.querySelectorAll('.filter-fuel input[type="checkbox"]:checked');
    fuelCheckboxes.forEach(checkbox => {
        selectedFuelTypes.push(checkbox.value);
    });

    const priceMin = parseInt(document.getElementById('price-min').value) || 0;
    const priceMax = parseInt(document.getElementById('price-max').value) || Infinity;

    const filteredProducts = products.filter((sanPham) => {
        return (
            sanPham.name.toUpperCase().includes(valueSearch.toUpperCase())&&
            (!selectedCategories.length || selectedCategories.includes(sanPham.brand)) &&
            (!selectedFuelTypes.length || selectedFuelTypes.includes(sanPham.fuel)) &&
            sanPham.price >= priceMin &&
            sanPham.price <= priceMax
        );
    });

    currentPage = 1;
    product = filteredProducts;
    updatePagination();
}

// JS sắp xếp sản phẩm 

function sortProducts(input) {

     // Lấy giá trị của nút bấm mà người dùng chọn
    let sortedProducts = [...product]; // Tạo một bản sao của danh sách sản phẩm hiện tại

    // Dựa trên lựa chọn của người dùng, sắp xếp danh sách sản phẩm
    if (input === 'price-asc') {
    // Sắp xếp theo giá tăng dần
    sortedProducts.sort((a, b) => a.price - b.price);
    }
    if (input === 'price-desc') {
       // Sắp xếp theo giá giảm dần
    sortedProducts.sort((a, b) => b.price - a.price);
    }
    // Cập nhật danh sách sản phẩm đã sắp xếp
    currentPage = 1;
    product = sortedProducts;
    updatePagination(); // Cập nhật phân trang sau khi sắp xếp           
    filterbar()   
}

// JS hiện thi danh sách sản phẩm theo thương hiệu
function company_menu(input) {
    console.log("Đã click vào menu hãng sản xuất:", input);

    const filteredProducts = products.filter((sanPham) => {
        return input.includes(sanPham.brand);
    });

    currentPage = 1;
    product = filteredProducts;

    updatePagination();
}

//JS thanh tìm kiếm
function Search(){
    let valueSearch = document.getElementById('search-input').value;
    let search = products.filter(sanPham =>{
        return sanPham.name.toUpperCase().includes(valueSearch.toUpperCase());
    })

    console.log(search);

    product = search;
    updatePagination();
}

// JS xử lý đăng nhập
document.getElementById('form-login').addEventListener('submit', function(event){
    event.preventDefault();
    
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // // Kiểm tra độ dài tài khoản
    // if (username.length < 8) {
    //     alert('Tên tài khoản phải có ít nhất 8 ký tự.');
    //     return;
    // }

    // // Kiểm tra độ dài mật khẩu
    // if (password.length < 8) {
    //     alert('Mật khẩu phải có ít nhất 8 ký tự.');
    //     return;
    // }

    let userValue = users.find(user => {
        return password.includes(user.password) && username.includes(user.username);
    });

    if (userValue){
        updateIsLoginKey(userValue.id);
        hidePopup('form-login');
        overLay1();
        showAvatar();
    }else{
        alert('Sai tài khoảng hoặc mật khẩu!');
    }
})

// JS xử lý đăng kí
document.getElementById('form-signIn').addEventListener('submit', function(event){
    event.preventDefault();

    let name = document.getElementById('fullname').value;
    let number = document.getElementById('soDienThoai').value;
    let username = document.getElementById('username-sign').value;
    let password = document.getElementById('password-sign').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    // // Kiểm tra độ dài tài khoản
    // if (username.length < 8) {
    //     alert('Tên tài khoản phải có ít nhất 8 ký tự.');
    //     return;
    // }

    // // Kiểm tra độ dài mật khẩu
    // if (password.length < 8) {
    //     alert('Mật khẩu phải có ít nhất 8 ký tự.');
    //     return;
    // }

    let userValue = users.find(user => {
        return username == user.username;
    });
    if(userValue){
        alert('Tên tài khoản đã tồn tại.')
        return;
    }

    if(number)

    if(password != confirmPassword){
        alert('Xác nhận mật khẩu và mật khẩu không trùng khớp.')
        return;
    }

    // Tạo id mới
    let id = generateId();
    // Tạo tài khoảng mới
    let user = {     
            id: id,
            fullname: name,
            username: username,
            password: password,
            sdt: number
    }
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    // update value isLogin
    updateIsLoginKey(user.id);
    // Tắt form đăng kí
    hidePopup('form-signIn');
    overLay1();
    // Kiểm tra isLogin để hiện icon mặc định cho tài khoảng mới
    showAvatar();

})


// JS tạo id 
function generateId() {
    // Lấy timestamp hiện tại
    const timestamp = Date.now(); // Tính bằng milliseconds

    // Tạo 10 chữ số ngẫu nhiên
    const randomDigits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');

    // Kết hợp timestamp và chữ số ngẫu nhiên
    return `${timestamp}${randomDigits}`;
}

// JS đăng xuất

document.getElementById('logout').addEventListener('click', function(){
    localStorage.setItem('isLogIn', '')
    showAvatar();
}) 



// JS Thêm sản phẩm vào giỏ hàng (Tạo đối tượng giỏ hàng)
function addProductCart(idSanPham, priceSanPham){
    // Kiểm tra xem khách hàng đã đăng nhập chưa
    if (!localStorage.getItem('isLogIn')) {
        showFormLogin();
        showAvatar();
    }else{
        var idUser = JSON.parse(localStorage.getItem('isLogIn'));
        var userCart = carts.find(cart =>{
            return idUser == cart.id;
        });

        console.log(userCart)
        if(!userCart){
            alert('Đã thêm sản phẩm vào giỏ hàng')
            var listProductBuy = [{
                idProduct : String(idSanPham),
                quantity : "1",
                price : String(priceSanPham)
            }]

            var cart = {
                id : idUser,
                listProduct : listProductBuy,
                total : priceSanPham,
                totalQuantity : "1"
            }

            carts.push(cart);

        }else{
            var productValue = userCart.listProduct.find(product =>{
                return product.idProduct == idSanPham;
            });

            if (productValue){
                alert('Đã thêm sản phẩm vào giỏ hàng')
                productValue.quantity = String(parseInt(productValue.quantity) + 1);
                userCart.total = String(parseFloat(userCart.total) + parseFloat(priceSanPham));
                userCart.totalQuantity = String(parseInt(userCart.totalQuantity) + 1);
            }else{          
                alert('Đã thêm sản phẩm vào giỏ hàng')
                var SanPham = {
                    idProduct : String(idSanPham),
                    quantity : "1",
                    price : String(priceSanPham)
                }
                userCart.listProduct.push(SanPham);
                userCart.total = String(parseFloat(userCart.total) + parseFloat(priceSanPham));
                userCart.totalQuantity = String(parseInt(userCart.totalQuantity) + 1);
            }

        }
        localStorage.setItem('cart', JSON.stringify(carts));
    }
    

    console.log('Giỏ hàng đã được cập nhật');
        // Kiểm tra khách hàng đã có giỏ hàng chưa
            // Nếu có thì kiểm tra id sản phẩm mua đã tồn tại chưa
                // Nếu có thì + thêm số lượng
                // Cập nhập lại tổng tiền + số lượng sản phẩm mua
            // Nếu không thì thêm sản phẩm đó vào
                // Cập nhập lại tổng tiền + số lượng sản phẩm mua
        // Nếu chưa tồn tại giỏ hàng 
            // Tạo giỏ hàng mới 
                // Đưa id khách hàng vào
                // Tạo list chứa sản phẩm mua
                    // Danh sách sản phẩm mua chứa id sản phẩm mua, số lượng, giá tiền
                // Tính tổng tiền 
                // Tổng số sản phẩm mua
        // Cập nhập giỏ hàng vào list giỏ hàng localStorage
}


function closeDanhMucTrai(){
  var timkiem = document.getElementById("filter-bar");
  var loc = document.getElementById("filter-bar-main");
  var danhmuctrai = document.getElementById("categoryid");
  let t = document.getElementById("productid");
  let product =  document.getElementById("product");
  let gridRows = document.getElementById("grid_row1");
  if (getComputedStyle(timkiem).display === "none" && getComputedStyle(loc).display === "flex"){
      timkiem.style.display = "flex";
      loc.style.display = "none";
      danhmuctrai.style.display = "none";
      t.style.width = "100%";
      product.style.display = "flex";
      product.style.justifyContent = "center";
      gridRows.style.width = "80.8334%";
  }
}

function filterbar(){
    
  let danhmuctrai = document.getElementById("categoryid");
  let t = document.getElementById("productid");
  let product =  document.getElementById("product");
  let gridRows = document.getElementById("grid_row1");
  console.log(window.getComputedStyle(document.getElementById('grid_row1')).width);
  if (getComputedStyle(danhmuctrai).display !== "block"){
    console.log(window.getComputedStyle(document.getElementById('grid_row1')).width);
    console.log('filterbar')
      t.style.width = "100%";
      product.style.display = "flex";
      product.style.justifyContent = "center";
      gridRows.style.width = "80.8334%";
  }
  console.log(window.getComputedStyle(document.getElementById('grid_row1')).width);


}

const listImg = [
'../assets/image/S1.jpg',
'../assets/image/BG3.jpg',
'../assets/image/S2.jpg',
'../assets/image/S4.jpg',
];

let next = document.querySelector('.slide-show .next');
let prev = document.querySelector('.slide-show .prev');
let imgWrap = document.querySelector('.slide .img-wrap img');
let thumbnails = document.querySelectorAll('.thumbnail');

let currentIndex = 0;

function setCurrent(index) {
    currentIndex = index;
    imgWrap.src = listImg[currentIndex];

    thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active'));

    thumbnails[currentIndex].classList.add('active');
}

thumbnails.forEach((thumbnail) => {
thumbnail.addEventListener('click', () => {
  const index = parseInt(thumbnail.dataset.index, 10);
  setCurrent(index);
  resetAutoSlide();
});
});

next.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % listImg.length;
    setCurrent(currentIndex);
    resetAutoSlide();
});

prev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + listImg.length) % listImg.length;
    setCurrent(currentIndex);
    resetAutoSlide();
});

let autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % listImg.length;
    setCurrent(currentIndex);
}, 3000);

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % listImg.length;
    setCurrent(currentIndex);
    }, 3000);
}

setCurrent(currentIndex);

function showPopup(formId) {
    document.getElementById(formId).style.display = 'block';
}

function hidePopup(formId) {
    document.getElementById(formId).style.display = 'none';
}

function overLay1(){
    let login = document.getElementById('form-login');
    let sign = document.getElementById('form-signIn');

    if (login.style.display == 'block' || sign.style.display == 'block'){
        document.getElementById('overlay').style.display = 'block';
    }else{
        document.getElementById('overlay').style.display = 'none';
    }
}

function overLay2(){
    let detal = document.getElementById('form-detal') 

    if (detal.style.display == 'block'){
        document.getElementById('overlay').style.display = 'block';
    }else{
        document.getElementById('overlay').style.display = 'none';
    }
}


document.querySelector('.form-signIn .form-box .form-value .inputbox input[type="number"]').addEventListener('keypress', function (event) {
    if (!/\d/.test(event.key)) {
        event.preventDefault();
    }
});


