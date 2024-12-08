// Get data from localStorage
const isLogin = JSON.parse(localStorage.getItem('isLogIn'));
const listUser = JSON.parse(localStorage.getItem("user")) || [];
const address = JSON.parse(localStorage.getItem('user-address')) || [];
const carts = JSON.parse(localStorage.getItem('cart')) || [];
const products = JSON.parse(localStorage.getItem('product')) || [];
const oders = JSON.parse(localStorage.getItem('oder')) || [];
let cartuser = null;
taoAddress();
showProductInCart();
let addressIndex = taoAddress(); // Danh sách địa chỉ ban đầu, có thể trống
console.log(addressIndex)
function taoAddress(){
  let diachi1 = findAddress();
console.log("tim di ch8i",diachi1)

if(!diachi1){
 
var add = {
  id: isLogin,
  addresses: []
}

console.log(add)
address.push(add)
localStorage.setItem('user-address',JSON.stringify(address))
}
else{
  return diachi1
}

}

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
          <div>
            <button class="select">Chọn</button>
            <button class="delete">Xóa</button>
          </div> 
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
  addressIndex.addresses.splice(index, 1);
  showAddressList()
  document.getElementById('selected-address').textContent = 'Chưa có địa chỉ nào.';
  
  // lưu thay đổi localStrorage
  localStorage.setItem('user-address', JSON.stringify(address))
}

// Chọn địa chỉ từ danh sách
function selectAddress(index) {
  let addressListForm = document.querySelector('.address-list-form');
  renderSelectedAddress(index); // Cập nhật địa chỉ được chọn
  addressListForm.style.display = 'none'; // Ẩn danh sách
  overLay1()
}

document.querySelector('.address-list-form .btn-exit').addEventListener('click', function(event){
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
      address.push(addressIndex)
      localStorage.setItem('user-address', JSON.stringify(address));
      document.getElementById("add-address-btn").style.display="block";
    } else {
      alert("Không tìm thấy thông tin người dùng!");
    }
  } else {
    alert("Vui lòng điền đầy đủ thông tin.");
  }
  console.log(addressIndex)
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
  function showCreditCardForm(){
    document.getElementById("credit-card-form").style.display="flex";
  
  }
  function dongform(){
    
    document.getElementById("credit-card-form").style.display="none";
  }
  
  function TaoHoaDon(e){
    if (!e) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }
  
    // Kiểm tra nếu chưa chọn địa chỉ giao hàng
    const diachichon= document.getElementById("selected-address").textContent;
    if (diachichon === '' || diachichon === 'Chưa có địa chỉ nào.') {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    // Kiểm tra nếu không có sản phẩm nào được chọn
    const check = getCartItems();
    let isAnyProductChecked = false;
    check.forEach((item) => {
        const checkbox = item.querySelector("input[type='checkbox']");
        if (checkbox.checked) {
            isAnyProductChecked = true;
        }
    });

    if (!isAnyProductChecked) {
        alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
        return; // Dừng hàm nếu không có sản phẩm nào được chọn
    }

    if(e==='Thẻ tín dụng'){
      if(!saveCardDetails()){
        return;
      }
    }

    newhoadon.idOder = String(generateInvoiceID());
    newhoadon.idCustomer = String(isLogin);
    newhoadon.payment = e;
    newhoadon.date = getCurrentDate();
   
    if(e === 'Thẻ tín dụng'||e === 'Chuyển Khoản'){
      newhoadon.status = 'Đang xử lý';
  
    }else {
    newhoadon.status = 'Chưa thanh toán';
    }
    
      // Lấy danh sách sản phẩm hiện tại sau mỗi lần cập nhật
      const temp=[];
      var tongtien=0;
      var tongsl=0;
      const cartItems = getCartItems();
      cartItems.forEach((item) => {
          let id = item.querySelector("input[type='checkbox']").value;

          let product = findProduct(id)
          
          if (!product) {
              console.error(`Không tìm thấy sản phẩm với ID: ${id}`);
          }
          
        const checkbox = item.querySelector("input[type='checkbox']");
        const priceText = item.querySelector(".price").textContent;
        const price = parseInt(priceText.replace(" $", ""));
        const quantity = parseInt(item.querySelector(".item-quantity input").value);
      
        const total = price * quantity;
        
   
        const tem={  
          idProduct: id,
          quantity: quantity,
          name: product.name,
          unitPrice: product.price
        }
        if(checkbox.checked){
          temp.push(tem)
          tongtien += total;
          tongsl+=quantity;
          
        }
        }
      )
      newhoadon.listProduct =temp;
    
      newhoadon.total=String(tongtien);
    
      newhoadon.totalQuantity=String(tongsl);
    
      const address =   document.getElementById("selected-address").textContent;
      var bien=address.split(',');
      const diachi={
        street: bien[0],
        district:bien[1],
        city: bien[2]
      }

    newhoadon.address=diachi;
    if(document.getElementById("credit-card-form").style.display === 'flex'){
      document.getElementById("credit-card-form").style.display = 'none'
    }
  
    inhoadon();


  }

  function generateInvoiceID() {
    // Tạo số ngẫu nhiên từ 1000 đến 9999
    return Math.floor(1000 + Math.random() * 9000);
  }
  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày (2 chữ số)
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng (2 chữ số, tháng bắt đầu từ 0)
    const year = today.getFullYear(); // Lấy năm
  
    return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
  }

  var newhoadon = { 
    idOder: "",
    idCustomer: "",
    listProduct: [],
    totalQuantity: "",
    total: "",
    payment: "",
    address: {},
    date: "",
    status: ""
  }

  document.getElementById("x-confirmOrderForm").addEventListener("click",()=>{
    document.getElementById("confirmOrderForm").style.display="none";
  });

  function inhoadon(){
        document.getElementById("confirmOrderForm").style.display="block";
        
    const id= document.getElementById("id-confirmOrderForm");
      id.textContent = `ID hóa đơn: ${newhoadon.idOder}`;
    const date  = document.getElementById("date-confirmOrderForm");
      date.textContent = `Ngày thanh toán: ${newhoadon.date}`;
    const listsp = document.getElementById("listproduct-confirmOrderForm");
    
      listsp.innerHTML ='';
      newhoadon.listProduct.forEach((item)=>{
        const div = document.createElement('div');
        div.className = "item-confirmOrderForm"
        const totall = parseInt(item.quantity)*parseInt(item.unitPrice);
        var unitPrice = parseInt(item.unitPrice)
        div.innerHTML=`
        <div> ${item.name}</div>
        <div class="item-1">
          <div>${item.quantity}</div>
          <div>${unitPrice.toLocaleString()}</div>
          <div>${totall.toLocaleString()}</div>
        </div>
        `;
        listsp.appendChild(div);

      }) 
  
  const totalQuantity = document.getElementById("totalQuantity-confirmOrderForm");
  totalQuantity.textContent = `Tổng sản phẩm: ${newhoadon.totalQuantity}`;
  const total = document.getElementById("total-confirmOrderForm");
  total.textContent = `Tổng tiền: ${newhoadon.total.toLocaleString()} $`;
  const payment = document.getElementById("payment-confirmOrderForm");
  payment.textContent = `Phương thức thanh toán: ${newhoadon.payment}`;
  const diachi = document.getElementById("diachi-confirmOrderForm")
  diachi.textContent=`Địa chỉ: ${newhoadon.address.street}, ${newhoadon.address.district}, ${newhoadon.address.city}`  ;
}
  
  function setdata(){
    console.log(newhoadon)
  oders.push(newhoadon)
  localStorage.setItem('oder', JSON.stringify(oders));
  console.log(oders)
  document.querySelector(".confirmOrderForm").style.display = 'none' 
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

  // Hàm kiểm tra ngày hết hạn (định dạng DD/MM/YYYY)
function validateExpiryDate(expiryDate) {
  // Kiểm tra định dạng ngày hết hạn (DD/MM/YYYY)
  const expiryDateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = expiryDate.match(expiryDateRegex);
  
  if (!match) {
    return false;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Kiểm tra năm trong khoảng từ 2000 đến 2100
  if (year < 2000 || year > 2100) {
    return false;
  }

  // Kiểm tra tháng trong khoảng từ 1 đến 12
  if (month < 1 || month > 12) {
    return false;
  }

  // Kiểm tra ngày hợp lệ cho mỗi tháng
  const daysInMonth = new Date(year, month, 0).getDate();  // Số ngày trong tháng
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  return true;
}

// Hàm kiểm tra số thẻ (16 chữ số)
function validateCardNumber(cardNumber) {
  const cardNumberRegex = /^\d{16}$/;  // Kiểm tra nếu số thẻ có đúng 16 chữ số
  return cardNumberRegex.test(cardNumber);
}

// Hàm kiểm tra CVV (3 chữ số)
function validateCVV(cvv) {
  const cvvRegex = /^\d{3}$/;  // Kiểm tra nếu CVV có đúng 3 chữ số
  return cvvRegex.test(cvv);
}

// Hàm để kiểm tra và lưu thông tin thẻ
function saveCardDetails() {
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;

  // Kiểm tra các trường nhập vào
  if (!cardNumber || !expiryDate || !cvv) {
    alert("Vui lòng nhập đầy đủ thông tin thẻ.");
    return false;
  }

  if (!validateCardNumber(cardNumber)) {
    alert("Số thẻ phải có 16 chữ số.");
    return false;
  }

  if (!validateExpiryDate(expiryDate)) {
    alert("Ngày hết hạn không đúng định dạng (MM/YYYY).");
    return false;
  }

  if (!validateCVV(cvv)) {
    alert("CVV phải có 3 chữ số.");
    return false;
  }

  // Hiển thị thông báo và quay lại phần phương thức thanh toán
  alert("Thông tin thẻ đã được lưu thành công!");
  return true;
} 

document.getElementById("btn-credit").addEventListener('click', ()=>{
  document.getElementById("credit-card-form").style.display = 'none'

  
})


