// Lấy dữ liệu từ localStrorage

const isLogin = JSON.parse(localStorage.getItem('isLogIn'));
const address = JSON.parse(localStorage.getItem('user-address')) || [];
const carts = JSON.parse(localStorage.getItem('cart')) || [];
const products = JSON.parse(localStorage.getItem('product')) || [];
const oders = JSON.parse(localStorage.getItem('oder')) || [];
let cartuser = null;

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
        return
    }
    cartuser = cart;
    let html = hienThiSanPham(cart)
    document.getElementById('cart-product').innerHTML = html;
    
}

// Tìm sản phẩm trong danh sách sản phẩm
function findProduct(id){
    let productFind = products.find(product =>{
        return id == product.id
    })
    return productFind;
}

// Tìm sản phẩm trong danh sách giỏ hàng
function findProductInCart(idProduct){
    let productFind = cartuser.listProduct.find(products =>{
        return idProduct == products.idProduct
    })
    return productFind;
}

function hienThiSanPham(cart){
    let html = '';
    cart.listProduct.forEach((product) => {

        // Tìm hình ảnh và tên sản phẩm
        let productFind = findProduct(product.idProduct);

    html +=    '<div class="item cart-grid">'
    html +=            '<div class="item-infor">'
    html +=            '<input type="checkbox" value="' + product.idProduct + '">'
    html +=            '<img src="' + productFind.src[0] + '" alt="hình ảnh">'
    html +=            '<div>'+ productFind.name + '</div>'
    html +=            '</div>'
    html +=            '<div>'
    html +=            '<p class="price">' + product.price + '<sup>$</sup></p>'
    html +=            '</div>'             
    html +=            '<div class="item-quantity">'
    html +=             '<div class="quantity">'
    html +=                '<button>-</button>'
    html +=                '<input type="tel" class="quantity-input" value="' + product.quantity + '" oninput="this.value = this.value.replace(/[^0-9]/g,\'\')">'
    html +=                '<button>+</button>'
    html +=             '</div>'
    html +=            '</div>'
    html +=            '<div class="item-total">'
    html +=            parseInt(product.quantity)*parseInt(product.price)
    html +=            '<sup>$</sup>'
    html +=            '</div>'
    html +=            '<div class="delete">'
    html +=            '<div>🗑</div>'
    html +=            '</div>'
    html +=        '</div>'
        
    });

    return html;
}


// Hàm lấy tất cả các sản phẩm trong giỏ hàng
function getCartItems() {
    return document.querySelectorAll('.item.cart-grid');
  }


// Hàm cập nhập tổng tiền
  function updateCartSummary() {
    let totalQuantity = 0;
    let totalPrice = 0;
  
    // Lấy danh sách sản phẩm hiện tại sau mỗi lần cập nhật
    const cartItems = getCartItems();
    cartItems.forEach((item) => {
        let id = item.querySelector("input[type='checkbox']").value;
        let product = findProductInCart(id)
        
        if (!product) {
            console.error(`Không tìm thấy sản phẩm với ID: ${id}`);
        }

        const checkbox = item.querySelector("input[type='checkbox']");
        const priceText = item.querySelector(".price").textContent;
        const price = parseInt(priceText.replace(" $", ""));
        const quantity = parseInt(item.querySelector(".item-quantity input").value);
      
        const total = price * quantity;
  
        // Cập nhật thành tiền cho sản phẩm
        item.querySelector(".item-total").textContent = `${total.toLocaleString()} $`;
        
        // Cộng dồn vào tổng số lượng và tổng tiền
        totalQuantity += quantity;

        product.quantity = quantity ;
        if(checkbox.checked){
            totalPrice += total;
        }
    });
  
    // Hiển thị tổng tiền
    document.querySelector(".summary-total").textContent = `Tổng tiền: ${totalPrice.toLocaleString()} $`;

    cartuser.totalQuantity = totalQuantity;
    cartuser.total = totalPrice;
    // Cập nhập localStrorage
    console.log(carts)
    localStorage.setItem('cart', JSON.stringify(carts));
  }

  // Lắng nghe sự thay đổi số lượng của mỗi sản phẩm
function attachQuantityListeners(item) {
    const quantityInput = item.querySelector(".item-quantity .quantity input");
    const incrementBtn = item.querySelector(".item-quantity .quantity button:nth-child(3)");
    const decrementBtn = item.querySelector(".item-quantity .quantity button:nth-child(1)");
    const checkbox = item.querySelector("input[type='checkbox']");
  
    // Tăng số lượng
    incrementBtn.addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
      updateCartSummary();
    });
  
    // Giảm số lượng
    decrementBtn.addEventListener("click", () => {
      if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        updateCartSummary();
      }
    });
  
    // Xử lý khi nhập số lượng trực tiếp
    quantityInput.addEventListener("input", () => {
      if (quantityInput.value < 1) {
        quantityInput.value = 1;
      }
      updateCartSummary();
    });
  
     // Cập nhật khi chọn checkbox sản phẩm
    checkbox.addEventListener("change", updateCartSummary);
  }

// Lắng nghe sự kiện xóa sản phẩm
function attachDeleteListener(item) {
    const deleteBtn = item.querySelector(".delete");
    deleteBtn.addEventListener("click", ()=> { 
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
        let index = cartuser.listProduct.findIndex(product => product.id === item.querySelector("input[type='checkbox']").value)
        cartuser.listProduct.splice(index, 1);
        console.log(cartuser)
        item.remove();  // Xóa sản phẩm khỏi giỏ hàng
        updateCartSummary();  // Cập nhật lại tổng tiền sau khi xóa
      }
    });
  }

// Khởi chạy tính toán ban đầu
function initializeCart() {
    const cartItems = getCartItems();   // 
    cartItems.forEach(item => {
        attachQuantityListeners(item);
        attachDeleteListener(item);
    });
  
    updateCartSummary();
  }


initializeCart();

// Tích chọn tất cả sản phẩm
document.querySelector(".quantity-product input[type='checkbox']").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".item-infor input[type='checkbox']");
    checkboxes.forEach((checkbox) => (checkbox.checked = this.checked));
    updateCartSummary();
  });
  
  // Lắng nghe sự thay đổi checkbox của từng sản phẩm
  document.querySelectorAll(".item-infor input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allCheckboxes = document.querySelectorAll(".item-infor input[type='checkbox']");
      const selectAllCheckbox = document.querySelector(".quantity-product input[type='checkbox']");
      
      // Kiểm tra nếu tất cả checkbox đều được chọn
      const allChecked = [...allCheckboxes].every(cb => cb.checked);//
      
      // Cập nhật trạng thái checkbox "Chọn tất cả" nếu tất cả sản phẩm được chọn hoặc không
      selectAllCheckbox.checked = allChecked;
      
      // Nếu không phải tất cả đều được chọn, bỏ chọn "Chọn tất cả"
      if (!allChecked) {
        selectAllCheckbox.checked = false;
      }
      
      updateCartSummary();
    });
  });


  document.querySelector('.delete-all').addEventListener('click', function () {
    // Xác nhận xóa tất cả
    if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng không?")) {
        // Xóa tất cả phần tử từ giao diện
        const cartItems = document.querySelectorAll('.item.cart-grid');
        cartItems.forEach(item => item.remove());

        // Xóa tất cả sản phẩm khỏi danh sách giỏ hàng
        if (cartuser && cartuser.listProduct) {
            cartuser.listProduct = [];
        }

        // Cập nhật tổng tiền và lưu dữ liệu vào localStorage
        updateCartSummary();
        localStorage.setItem('cart', JSON.stringify(carts));

    }
});

function findAddress(){
  let add = address.find(find => {
    return (find.id == isLogin)
  });
  return add;
}

let addressIndex = findAddress(); // Danh sách địa chỉ ban đầu, có thể trống
console.log(addressIndex)
// Hàm hiển thị địa chỉ mặc định
function renderSelectedAddress(index) {
  console.log('hien thi dia chi giao hang')
  let selectedAddress = document.getElementById('selected-address');
  if (addressIndex.addresses.length === 0) {
      selectedAddress.textContent = 'Chưa có địa chỉ nào.';
  } else {
      selectedAddress.textContent = `${ addressIndex.addresses[index].street}, ${ addressIndex.addresses[index].district}, ${ addressIndex.addresses[index].city}`; // Hiển thị địa chỉ đầu tiên
  }
}

// Hiển thị danh sách địa chỉ để thay đổi
function showAddressList() {
  let addressListForm = document.querySelector('.address-list-form');
  let addressList = document.querySelector('.address-list');
  addressListForm.style.display = 'block';
  addressList.innerHTML = ''; // Xóa danh sách cũ

  addressIndex.addresses.forEach((address, index) => {
      let addressItem = document.createElement('div');
      addressItem.className = 'address-item';
      addressItem.innerHTML = `
          <div>${address.street}, ${address.district}, ${address.city}</div>
          <button class="select">Chọn</button>
          <button class="delete">Xóa</button>
      `;
      // gán sự kiện chọn địa chỉ cho từng item địa chỉ
      addressItem.querySelector('.select').addEventListener('click', function(event){
        event.preventDefault();
        selectAddress(index)
      });
      // gán sự kiện xóa địa chỉ cho từng item địa chỉ
      addressItem.querySelector('.delete').addEventListener('click', function(event){
        event.preventDefault();
        deleteAddress(index)
      });

      addressList.appendChild(addressItem);
  });

}

// Xóa địa chỉ từ danh sách
function deleteAddress(index){
  console.log('xoa dia chi',index)
  addressIndex.addresses.splice(index, 1);
  showAddressList();
  // lưu thay đổi localStrorage
  localStorage.setItem('user-address', JSON.stringify(address))
}

// Chọn địa chỉ từ danh sách
function selectAddress(index) {
  console.log('chon dia chi')
  let addressListForm = document.querySelector('.address-list-form');
  renderSelectedAddress(index); // Cập nhật địa chỉ được chọn
  addressListForm.style.display = 'none'; // Ẩn danh sách
  overLay1()
}

document.querySelector('.address-list-form .btn-exit').addEventListener('click', function(event){
  console.log('111')
  event.preventDefault();
  document.querySelector('.address-list-form').style.display = 'none';
  overLay1();
})

// Hiển thị địa chỉ mặc định ban đầu
renderSelectedAddress(0);

function overLay1(){
  let over = document.querySelector('.address-list-form');
  if(over.style.display == 'block'){
    console.log('overlay')
    document.getElementById('overlay').style.display = 'block'
  }else{
    console.log('off-overlay')
    document.getElementById('overlay').style.display = 'none'
  }
}


// hiện thị form thêm địa chỉ



document.getElementById("save-address-btn").addEventListener("click", () => {
  const street = document.getElementById("popup-street").value;
  const district = document.getElementById("popup-district").value;
  const city = document.getElementById("popup-city").value;




  if (street && district && city) {
    const newAddress = { street, district, city };

    if (addressIndex) {
      addressIndex.addresses.push(newAddress);

      // Reset input và ẩn popup
      document.getElementById("popup-street").value = "";
      document.getElementById("popup-district").value = "";
      document.getElementById("popup-city").value = "";
      popup.style.display = "none";
      showAddressList()

      alert("Thêm địa chỉ thành công!");
    } else {
      alert("Không tìm thấy thông tin người dùng!");
    }
  } else {
    alert("Vui lòng điền đầy đủ thông tin.");
  }
  console.log(addressIndex)
  document.getElementById("add-address-btn").style.display="block";
});

document.getElementById("add-address-btn").addEventListener("click",()=>{
  const form = document.getElementById("popup");
  form.style.display="block";
  const an= document.getElementById('add-address-btn' );
  an.style.display="none";
  

  

})
//dong
 document.getElementById("close-popup-btn").addEventListener('click',()=>{
    const dong = document.getElementById("popup");
    dong.style.display="none";
    document.getElementById("add-address-btn").style.display="block";

  })




