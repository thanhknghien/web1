// Hàm để mở/đóng form đăng nhập
function toggleLoginForm() {
  const form = document.getElementById("login-form-container");
  form.classList.toggle("show"); // Thêm/loại bỏ class show
}

// Bắt sự kiện khi nhấn vào nút Đăng Nhập
document.getElementById("login-btn").addEventListener("click", toggleLoginForm);

// Bắt sự kiện cho hamburger menu
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", function () {
  menu.classList.toggle("show"); // Thêm/loại bỏ class show cho menu
});
// Mảng để lưu trữ các đơn hàng
let orders = [];

// Hàm để tạo mã đơn hàng tự động
function generateOrderID() {
  return `#${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;
}

// Hàm xác nhận mua hàng
function confirmOrder(productName) {
  const newOrder = {
    id: generateOrderID(),
    customerName: "Tên Khách hàng Mặc định", // Có thể thay bằng tên khách hàng thật khi có chức năng đăng nhập
    product: productName,
    status: "Chưa xử lý",
  };
  orders.push(newOrder);
  alert(`Đơn hàng của bạn với sản phẩm ${productName} đã được tạo.`);
  displayOrders(); // Cập nhật bảng đơn hàng
}

// Hàm hiển thị đơn hàng lên bảng
function displayOrders() {
  const orderTableBody = document
    .getElementById("orderTable")
    .getElementsByTagName("tbody")[0];
  orderTableBody.innerHTML = ""; // Xóa nội dung cũ trước khi cập nhật

  // Duyệt qua các đơn hàng và thêm từng dòng vào bảng
  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td>${order.id}</td>
              <td>${order.customerName}</td>
              <td>${order.product}</td>
              <td>${order.status}</td>
              <td><button class="button" onclick="viewOrderDetail('${order.id}')">Xem</button></td>
          `;
    orderTableBody.appendChild(row);
  });
}

// Hàm xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    alert(
      `Chi tiết đơn hàng:\n- Mã Đơn hàng: ${order.id}\n- Khách hàng: ${order.customerName}\n- Sản phẩm: ${order.product}\n- Trạng thái: ${order.status}`
    );
  }
}
