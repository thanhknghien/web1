
var danhSachSanPham = JSON.parse(localStorage.getItem('danhSachSanPham')) || [];
var currentPage = 1; // Trang hiện tại
var perPage = 10; // Số sản phẩm mỗi trang
var totalPage = Math.ceil(danhSachSanPham.length / perPage); // Tổng số trang
var product = danhSachSanPham;
updatePagination();
init();

// JS hiện thị danh sách sản phẩm
function chuyenDanhSachDoiTuongSanPhamThanhHTML(danhSachSanPham){
    var HTMLDanhSachSanPham = '<div class="grid_row">';

    danhSachSanPham.forEach((sanPham) =>{
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
    html +=        '<div class="product-item-price">' + sanPham.price + '</div>';
    html +=        '<div class="product-item-buy_detail">';
    html +=            '<div class="product-item-detail">';
    html +=                 '<button onclick="ClickChiTiet(' + sanPham.id + ')">Chi tiet</button>';
    html +=            '</div>';
    html +=            '<div class="product-item-buy">';
    html +=                '<button onclick="ClickThemGioHang(' + sanPham.id + ')">Mua</button>';
    html +=            '</div>';
    html +=        '</div>';
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
    html +=         '<div class="close-detalbuy">';
    html +=             '<button onclick="ClickThemGioHang(' + sanPham.id + ')">Thêm giỏ hàng</button>';
    html +=             '<button onclick="closeDetal()">Đóng</button>';             
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
    var html = '<ul class="pagination">';
    html += '<li><a href="#" onclick="changePage(' + (currentPage - 1) + '); filterbar()">&laquo;</a></li>';

    for (var i = 1; i <= totalPage; i++) {
        html += '<li class="' + (i === currentPage ? 'active' : '') + '">';
        html += '<a href="#" onclick="changePage(' + i + '); filterbar()">' + i + '</a>';
        html += '</li>';
    }

    html += '<li><a href="#" onclick="changePage(' + (currentPage + 1) + '); filterbar()">&raquo;</a></li>';
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
    updatePagination(danhSachSanPham);
}


// JS Hiẹn chi tiết sản phẩm
function ClickChiTiet(input) {
    console.log("Bạn đã click vào chi tiết:", input);

    var show = document.getElementById('form-detal');
    if (getComputedStyle(show).display == 'none'){
        show.style.display = 'block';
    }

    var find = danhSachSanPham.filter((sanPham) =>{
        return String(input) === String(sanPham.id);
    });

    if (find.length > 0) {
        var sanPham = find[0]; 

        show.querySelector('.detal-infor').innerHTML = `
            <div>Tên: ${sanPham.name}</div>
            <div>Giá: ${sanPham.price}</div>
            <div>Thương hiệu: ${sanPham.brand}</div>
            <div>Nhiên liệu: ${sanPham.fuel}</div>
        `;

        initSlideShow(show, sanPham.src);
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



// JS thêm sản phẩm vào giỏ hàng
function ClickThemGioHang(input) {
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}


// JS lọc sản phẩm
function findProduct() {
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

    const filteredProducts = danhSachSanPham.filter((sanPham) => {
        return (
            (!selectedCategories.length || selectedCategories.includes(sanPham.hang)) &&
            (!selectedFuelTypes.length || selectedFuelTypes.includes(sanPham.loai)) &&
            sanPham.gia >= priceMin &&
            sanPham.gia <= priceMax
        );
    });

    currentPage = 1;
    product = filteredProducts;
    updatePagination();
}


// JS hiện thi danh sách sản phẩm theo thương hiệu
function company_menu(input) {
    console.log("Đã click vào menu hãng sản xuất:", input);

    const filteredProducts = danhSachSanPham.filter((sanPham) => {
        return input.includes(sanPham.hang);
    });

    currentPage = 1;
    product = filteredProducts;

    updatePagination();
}

//JS thanh tìm kiếm

function Search(){
    let valueSearch = document.getElementById('search-input').value;
    let search = danhSachSanPham.filter(sanPham =>{
        return sanPham.name.toUpperCase().includes(valueSearch.toUpperCase());
    })

    console.log(search);

    product = search;
    updatePagination();
}




