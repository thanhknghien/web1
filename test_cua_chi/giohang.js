// Hàm lấy tất cả các sản phẩm trong giỏ hàng
function getCartItems() {
  return document.querySelectorAll('.item.cart-grid');
}

function getCartItemsValue(){
  return document.querySelectorAll('.item.cart-grid').value;
}
// Hàm tính toán tổng tiền và số lượng
function updateCartSummary() {
  console.log('update')
  let totalQuantity = 0;
  let totalPrice = 0;

  // Lấy danh sách sản phẩm hiện tại sau mỗi lần cập nhật
  const cartItems = getCartItemsValue();
  console.log(cartItems)
  cartItems.forEach((item) => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const priceText = item.querySelector(".price").textContent;
    const price = parseInt(priceText.replace(" $", ""));
    const quantity = parseInt(item.querySelector(".item-quantity input").value);
    
      const total = price * quantity;

      // Cập nhật thành tiền cho sản phẩm
      item.querySelector(".item-total").textContent = `${total.toLocaleString()} $`;

      // Cộng dồn vào tổng số lượng và tổng tiền
      totalQuantity += quantity;
      totalPrice += total;

  });

  // Hiển thị tổng tiền
  // document.querySelector(".summary-total p strong").textContent = `Tổng tiền: ${totalPrice.toLocaleString()} đ`;
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

  // // Cập nhật khi chọn checkbox sản phẩm
  // checkbox.addEventListener("change", updateCartSummary);
}

// Lắng nghe sự kiện xóa sản phẩm
function attachDeleteListener(item) {
  const deleteBtn = item.querySelector(".delete");

  deleteBtn.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      item.remove();  // Xóa sản phẩm khỏi giỏ hàng
      updateCartSummary();  // Cập nhật lại tổng tiền sau khi xóa
    }
  });
}

// Tích chọn tất cả sản phẩm
document.querySelector(".cart-header input[type='checkbox']").addEventListener("change", function () {
  const checkboxes = document.querySelectorAll(".cart-items input[type='checkbox']");
  checkboxes.forEach((checkbox) => (checkbox.checked = this.checked));
  updateCartSummary();
});

// Lắng nghe sự thay đổi checkbox của từng sản phẩm
document.querySelectorAll(".cart-items input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const allCheckboxes = document.querySelectorAll(".cart-items input[type='checkbox']");
    const selectAllCheckbox = document.querySelector(".cart-header input[type='checkbox']");
    
    // Kiểm tra nếu tất cả checkbox đều được chọn
    const allChecked = [...allCheckboxes].every(cb => cb.checked);
    
    // Cập nhật trạng thái checkbox "Chọn tất cả" nếu tất cả sản phẩm được chọn hoặc không
    selectAllCheckbox.checked = allChecked;
    
    // Nếu không phải tất cả đều được chọn, bỏ chọn "Chọn tất cả"
    if (!allChecked) {
      selectAllCheckbox.checked = false;
    }
    
    updateCartSummary();
  });
});

// Lắng nghe sự kiện xóa sản phẩm
// Lắng nghe sự kiện xóa sản phẩm
document.querySelectorAll('.delete').forEach(button => {
  button.addEventListener('click', function(event) {
    const item = event.target.closest('.item'); // Tìm sản phẩm gần nhất
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    
    // Nếu người dùng chọn "OK" (confirm trả về true), xóa sản phẩm
    if (confirmDelete) {
      item.remove();  // Xóa sản phẩm khỏi giỏ hàng
      updateCartSummary();  // Cập nhật lại tổng tiền
    }
    // Nếu người dùng chọn "Cancel", không làm gì cả
  });
});

// Khởi chạy tính toán ban đầu
function initializeCart() {
  const cartItems = getCartItems();
  console.log(`Cart contains ${cartItems.length} items.`);
  
  cartItems.forEach(item => {
      console.log('Initializing item:', item);
      attachQuantityListeners(item);
      attachDeleteListener(item);
  });

  updateCartSummary();
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
  document.querySelector('input[value="credit"]').checked = true;  // Tích chọn "Thẻ tín dụng"
  document.getElementById('credit-card-form').style.display = "none"; // Ẩn form nhập thẻ
  return true;
} 
// Hàm hiển thị form nhập thẻ tín dụng
function showCreditCardForm() {
  document.getElementById('credit-card-form').style.display = "block";
}

initializeCart();
