// Lấy dữ liệu từ localStrorage

const isLogin = JSON.parse(localStorage.getItem('isLogIn'));
const address = JSON.parse(localStorage.getItem('user-address')) || [];
const carts = JSON.parse(localStorage.getItem('cart')) || [];
const products = JSON.parse(localStorage.getItem('product')) || [];
const oders = JSON.parse(localStorage.getItem('oder')) || [];

// Kiểm tra đã đăng nhập chưa


//Hiện thị các sản phẩm trong giỏ hàng
showProductInCart();
function showProductInCart(){
    // Tìm giỏ hàng của khách hàng đăng nhập qua id
        //  không có return
        //  ngược lại
            //xuất ra các sản phẩm
    
    let cart = carts.find(find => {
        return (find.id == isLogin)
    });

    if (!cart){
        console.log('khong tim duoc')
        return
    }

    console.log('tim duoc',cart)
    let html = hienThiSanPham(cart)
    document.getElementById('cart-product').innerHTML = html;
    
}

// Tìm hình ảnh và tên sản phẩm
function imagesNameProduct(id){
    let productFind = products.find(product =>{
        return id == product.id
    })
    return productFind;
}

function hienThiSanPham(cart){
    let html = '';
    cart.listProduct.forEach((product) => {

        // Tìm hình ảnh và tên sản phẩm
        console.log(product.idProduct)
        let productFind = imagesNameProduct(product.idProduct);
        console.log('san pham tim dc',productFind)
         
    html +=    '<div class="item cart-grid">'
    html +=            '<div class="item-infor">'
    html +=            '<input type="checkbox">'
    html +=            '<img src="' + productFind.src[0] + '" alt="hình ảnh">'
    html +=            '<div>'+ productFind.name + '</div>'
    html +=            '</div>'
    html +=            '<div>'
    html +=            '<p class="price">' + product.price + '<sup>$</sup></p>'
    html +=            '</div>'             
    html +=            '<div class="item-quantity">'
    html +=            '<div class="quantity">'
    html +=                '<button>-</button>'
    html +=                '<input type="tel" class="quantity-input" value="' + product.quantity +'" oninput="this.value = this.value.replace(/[^0-9]/g,\'\')">'
    html +=                '<button>+</button>'
    html +=            '</div>'
    html +=            '</div>'
    html +=            '<div class="item-total">'
    html +=            parseInt(product.quantity)*parseInt(product.price)
    html +=            '<sup>$</sup>'
    html +=            '</div>'
    html +=            '<div class="delect">'
    html +=            '<div>🗑</div>'
    html +=            '</div>'
    html +=        '</div>'
        
    });

    return html;
}