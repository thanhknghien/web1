document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn form gửi đi

    const username = document.getElementById("username").value;
    const passwordss = document.getElementById("passwordss").value;
    const errorMessage = document.getElementById("error-message");

    // Thay đổi username và password
    const validUsername = "1";
    const validPassword = "1";

    if (username === validUsername && passwordss === validPassword) {
      // Xóa popup và bỏ hiệu ứng mờ
      document.getElementById("login-popup").style.display = "none";
      document.getElementById("main-content").classList.remove("blurred");
    } else {
      // Hiển thị thông báo lỗi
      errorMessage.textContent = "Sai tên đăng nhập hoặc mật khẩu!";
    }
  });

// Đảm bảo code chỉ chạy khi toàn bộ DOM đã được tải
document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử nút và các bảng
  const manageUserButton = document.querySelector("#manageUserButton");
  const manageUserLink = document.querySelector(".manage-user");
  const manageProductLink = document.querySelector(".manage-product");
  const manageOrderLink = document.querySelector(".manage-order");
  const manageStatisticsHeaderLink =
    document.querySelector(".manage-statistics"); // Nút "Quản lý Thống kê" ở header
  const userTableContainer = document
    .querySelector("#user-table")
    .closest(".admin-content");
  const productTableContainer = document
    .querySelector("#product-table")
    .closest(".admin-content");
  const orderTableContainer = document
    .querySelector("#oder-table")
    .closest(".admin-content");
  // Lấy container của bảng thống kê
  const statisticsTableContainer = document
    .querySelector(".content")
    .closest(".admin-content"); // Phần chứa bảng Thống kê

  // Thêm các nút quản lý ở sidebar
  const manageProductButton = document.querySelector(
    ".option-card:nth-child(2) .btn"
  );
  const manageOrderButton = document.querySelector(
    ".option-card:nth-child(3) .btn"
  );
  const manageStatisticsSidebarButton = document.querySelector(
    ".option-card:nth-child(4) .btn"
  ); // Nút "Quản lý Thống kê" ở sidebar

  // Nút để mở modal và lưu người dùng
  const addUserButton = document.getElementById("addUserButton");
  const userModal = document.getElementById("user-modal");
  const closeUserModal = document.getElementById("close-user-modal");
  const saveUserButton = document.getElementById("add-user-btn");

  // Hàm ẩn tất cả các bảng
  const hideAllTables = () => {
    [
      userTableContainer,
      productTableContainer,
      orderTableContainer,
      statisticsTableContainer, // Thêm bảng thống kê vào danh sách ẩn
    ].forEach((table) => {
      if (table) table.style.display = "none"; // Ẩn tất cả bảng
    });
  };

  // Hàm hiển thị bảng được chọn
  const showTable = (table) => {
    hideAllTables(); // Ẩn các bảng khác
    if (table) table.style.display = "block"; // Hiển thị bảng được chọn
  };

  // Gắn chức năng click cho từng nút
  manageUserButton.addEventListener("click", () =>
    showTable(userTableContainer)
  );
  manageUserLink.addEventListener("click", () => showTable(userTableContainer));
  manageProductLink.addEventListener("click", () =>
    showTable(productTableContainer)
  );
  manageOrderLink.addEventListener("click", () =>
    showTable(orderTableContainer)
  );

  // Gắn chức năng cho nút "Quản lý" trong sidebar
  manageProductButton.addEventListener("click", () =>
    showTable(productTableContainer)
  );
  manageOrderButton.addEventListener("click", () =>
    showTable(orderTableContainer)
  );

  // Gắn chức năng cho nút "Quản lý Thống kê"
  manageStatisticsSidebarButton.addEventListener("click", () =>
    showTable(statisticsTableContainer)
  );
  manageStatisticsHeaderLink.addEventListener("click", () =>
    showTable(statisticsTableContainer)
  );

  // Quản lý người dùng
  // Fetch dữ liệu người dùng từ file JSON
  let userData = []; // Biến lưu trữ dữ liệu người dùng

  fetch("../resource/user.json")
    .then((response) => response.json())
    .then((data) => {
      userData = data;
      initializeUserTable(); // Khởi tạo bảng người dùng sau khi dữ liệu được load
    });

  // Hiển thị modal thêm người dùng
  addUserButton.addEventListener("click", () => {
    userModal.style.display = "block";
    resetForm();
  });

  // Đóng modal
  closeUserModal.addEventListener("click", () => {
    userModal.style.display = "none";
    resetForm();
  });

  // Khởi tạo bảng người dùng
  function initializeUserTable() {
    populateUserTable(userData);
  }

  // Điền dữ liệu vào bảng người dùng
  function populateUserTable(users) {
    const tableBody = document.querySelector("#user-table tbody");
    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.fullname}</td>
      <td>${user.password}</td>
      <td>${user.sdt}</td>
      <td>
        <button class="status-btn">${user.status}</button>
      </td>
      <td>
        <button class="edit-btn">Sửa</button>
        <button class="delete-btn">Xóa</button>
      </td>
    `;
      tableBody.appendChild(row);

      // Chức năng thay đổi trạng thái
      row
        .querySelector(".status-btn")
        .addEventListener("click", () => toggleStatus(user.id));

      // Chức năng sửa và xóa
      row
        .querySelector(".edit-btn")
        .addEventListener("click", () => editUser(user.id));
      row
        .querySelector(".delete-btn")
        .addEventListener("click", () => confirmDeleteUser(user.id));
    });
  }

  // Hàm thay đổi trạng thái người dùng
  function toggleStatus(userId) {
    const user = userData.find((user) => user.id === userId);
    if (user) {
      user.status = user.status === "ACTIVE" ? "LOCK" : "ACTIVE";
      initializeUserTable(); // Cập nhật lại bảng
    }
  }

  // Hàm hiện xác nhận xoá
  function confirmDeleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUser(userId);
    }
  }

  // Hàm xoá danh sách người dùng
  function deleteUser(userId) {
    userData = userData.filter((user) => user.id !== userId);
    initializeUserTable();
  }

  // Hiển thị thông tin người dùng cần sửa
  function editUser(userId) {
    const user = userData.find((user) => user.id === userId);
    if (user) {
      document.getElementById("name").value = user.username;
      document.getElementById("full-name").value = user.fullname;
      document.getElementById("password").value = user.password;
      document.getElementById("sdt").value = user.sdt;
      currentRowToEdit = userId;
      userModal.style.display = "block";
    }
  }

  // Hàm lưu thông tin đã thêm và check lỗi ràng buộc
  saveUserButton.addEventListener("click", () => {
    const username = document.getElementById("name").value.trim();
    const fullName = document.getElementById("full-name").value.trim();
    const password = document.getElementById("password").value.trim();
    const phoneNumber = document.getElementById("sdt").value.trim();

    let hasError = false;

    function showError(inputId, message) {
      const inputElement = document.getElementById(inputId);
      const errorElement = inputElement.nextElementSibling;
      errorElement.textContent = message;
      if (message) {
        hasError = true; // Cập nhật trạng thái lỗi nếu có thông báo lỗi
      }
    }

    showError("name", username === "" ? "Vui lòng nhập tên đăng nhập!" : "");
    showError("full-name", fullName === "" ? "Vui lòng nhập họ và tên!" : "");
    showError("password", password === "" ? "Vui lòng nhập mật khẩu!" : "");
    showError(
      "sdt",
      phoneNumber === ""
        ? "Vui lòng nhập số điện thoại!"
        : /^0\d{9,10}$/.test(phoneNumber)
        ? ""
        : "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số!"
    );

    if (hasError) return;

    if (currentRowToEdit) {
      const userIndex = userData.findIndex(
        (user) => user.id === currentRowToEdit
      );
      if (userIndex !== -1) {
        userData[userIndex] = {
          ...userData[userIndex],
          username,
          fullname: fullName,
          password,
          sdt: phoneNumber,
        };
      }
      currentRowToEdit = null;
    } else {
      const newUser = {
        id: String(Math.floor(Math.random() * 9000) + 1000),
        username,
        fullname: fullName,
        password,
        sdt: phoneNumber,
        status: "ACTIVE",
      };
      userData.push(newUser);
    }

    initializeUserTable();
    userModal.style.display = "none";
    resetForm();
  });

  // Đặt lại form
  function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("full-name").value = "";
    document.getElementById("password").value = "";
    document.getElementById("sdt").value = "";
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
  }

  // Khởi tạo bảng người dùng
  initializeUserTable();
});
//CRUD của quản lý sản phẩm
// Biến lưu trạng thái sản phẩm đang chỉnh sửa
let currentProductToEdit = null;

// Thông báo lỗi
const errorMessages = {
  name: "Vui lòng nhập tên sản phẩm!",
  price: "Vui lòng nhập giá sản phẩm!",
  brand: "Vui lòng nhập thương hiệu!",
  fuel: "Vui lòng nhập nhiên liệu!",
  year: "Vui lòng nhập năm sản xuất!",
};

// Fetch dữ liệu từ JSON và lưu vào localStorage
async function fetchProductsAndSaveToLocal() {
  try {
    const response = await fetch("../resource/product.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    localStorage.setItem("product", JSON.stringify(data));
    initializeProductTable();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
  }
}

// Hiển thị dữ liệu sản phẩm từ localStorage
function initializeProductTable() {
  const products = JSON.parse(localStorage.getItem("product")) || [];
  const productTableBody = document.querySelector("#product-table tbody");

  if (!productTableBody) {
    console.error("Không tìm thấy bảng sản phẩm!");
    return;
  }

  // Xóa nội dung cũ
  productTableBody.innerHTML = "";

  // Tạo hàng mới
  products.forEach((product) => {
    const newRow = productTableBody.insertRow();
    newRow.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.brand}</td>
      <td>${product.fuel}</td>
      <td>${product.year}</td>
      <td>
        ${product.src
          .map(
            (src) =>
              `<img src="${src}" alt="${product.name}" class="product-img">`
          )
          .join("")}
      </td>
      <td>
        <button class="edit-btn">Sửa</button>
        <button class="delete-btn">Xóa</button>
      </td>
    `;

    // Gán chức năng cho nút sửa và xóa
    newRow
      .querySelector(".edit-btn")
      .addEventListener("click", () => editProduct(product.id));
    newRow
      .querySelector(".delete-btn")
      .addEventListener("click", () => confirmDeleteProduct(product.id));
  });
}

// Kiểm tra form
function validateForm() {
  let hasError = false;
  const fields = ["name", "price", "brand", "fuel", "year"];

  fields.forEach((field) => {
    const input = document.getElementById(`product-${field}`);
    const error = showError(
      `product-${field}`,
      input.value.trim() === "" ? errorMessages[field] : ""
    );
    if (error) hasError = true;
  });

  return !hasError;
}

// Hiển thị lỗi
function showError(inputId, message) {
  const inputElement = document.getElementById(inputId);
  if (!inputElement) return false;

  const errorElement = inputElement.nextElementSibling;
  if (errorElement) {
    errorElement.textContent = message;
  } else {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }
  return message !== "";
}

// Hiển thị modal Quản lý Sản phẩm
function showProductModal(product = null) {
  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-form");

  // Reset form khi mở modal
  form.reset();
  document
    .querySelectorAll(".error-message")
    .forEach((error) => (error.textContent = ""));
  document.getElementById("image-preview").innerHTML = "";

  if (product) {
    // Nếu có sản phẩm, điền dữ liệu vào form để sửa
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-brand").value = product.brand;
    document.getElementById("product-fuel").value = product.fuel;
    document.getElementById("product-year").value = product.year;

    // Hiển thị ảnh hiện tại
    const previewContainer = document.getElementById("image-preview");
    product.src.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      img.className = "product-img";
      previewContainer.appendChild(img);
    });

    currentProductToEdit = product.id; // Đặt trạng thái sửa
  } else {
    currentProductToEdit = null; // Đặt trạng thái thêm mới
  }

  modal.style.display = "block";
}

// Đóng modal
function closeProductModal() {
  const modal = document.getElementById("product-modal");
  modal.style.display = "none";
}

// Xử lý form khi Submit (Thêm hoặc Cập nhật sản phẩm)
function handleProductSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("product-name").value.trim(),
    price: document.getElementById("product-price").value.trim(),
    brand: document.getElementById("product-brand").value.trim(),
    fuel: document.getElementById("product-fuel").value.trim(),
    year: document.getElementById("product-year").value.trim(),
  };

  const fileInput = document.getElementById("product-image");
  const imageUrls =
    fileInput.files.length > 0 ? handleImageFiles(fileInput.files) : [];

  const products = JSON.parse(localStorage.getItem("product")) || [];

  if (currentProductToEdit) {
    // Cập nhật sản phẩm
    const productIndex = products.findIndex(
      (p) => p.id === currentProductToEdit
    );
    if (productIndex !== -1) {
      const existingProduct = products[productIndex];
      products[productIndex] = {
        ...existingProduct,
        ...formData,
        src: imageUrls.length > 0 ? imageUrls : existingProduct.src,
      };
    }
    currentProductToEdit = null;
  } else {
    // Thêm sản phẩm mới
    products.push({
      id: String(Math.floor(Math.random() * 900) + 100), // Tạo ID ngẫu nhiên
      ...formData,
      src: imageUrls,
    });
  }

  localStorage.setItem("product", JSON.stringify(products));
  initializeProductTable();
  closeProductModal();
}

// Khởi tạo sự kiện nút Thêm mới
document
  .getElementById("addProductButton")
  .addEventListener("click", handleProductSubmit);

// Sửa sản phẩm
function editProduct(productId) {
  const products = JSON.parse(localStorage.getItem("product")) || [];
  const product = products.find((p) => p.id === productId);

  if (product) {
    showProductModal(product);
  }
}

// Thêm sản phẩm mới
document.getElementById("addProductButton").addEventListener("click", () => {
  showProductModal();
});

// Xử lý ảnh (xem trước)
function handleImageFiles(files) {
  const previewContainer = document.getElementById("image-preview");
  previewContainer.innerHTML = ""; // Xóa nội dung cũ
  const imageUrls = [];

  for (const file of files) {
    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.className = "product-img";
      previewContainer.appendChild(img);
      imageUrls.push(imageUrl);
    }
  }
  return imageUrls;
}

// Đóng modal khi nhấn nút đóng
document
  .getElementById("close-product-modal")
  .addEventListener("click", closeProductModal);

// Cập nhật danh sách sản phẩm
function initializeProductTable() {
  const products = JSON.parse(localStorage.getItem("product")) || [];
  const productTableBody = document.querySelector("#product-table tbody");

  // Xóa nội dung cũ
  productTableBody.innerHTML = "";

  // Tạo hàng mới
  products.forEach((product) => {
    const newRow = productTableBody.insertRow();
    newRow.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.brand}</td>
          <td>${product.fuel}</td>
          <td>${product.year}</td>
          <td>
              ${product.src
                .map(
                  (src) =>
                    `<img src="${src}" alt="${product.name}" class="product-img">`
                )
                .join("")}
          </td>
          <td>
              <button class="edit-btn">Sửa</button>
              <button class="delete-btn">Xóa</button>
          </td>
      `;

    // Gán sự kiện cho nút sửa và xóa
    newRow
      .querySelector(".edit-btn")
      .addEventListener("click", () => editProduct(product.id));
    newRow
      .querySelector(".delete-btn")
      .addEventListener("click", () => confirmDeleteProduct(product.id));
  });
}

// Xóa sản phẩm
function confirmDeleteProduct(productId) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    const products = JSON.parse(localStorage.getItem("product")) || [];
    const updatedProducts = products.filter((p) => p.id !== productId);
    localStorage.setItem("product", JSON.stringify(updatedProducts));
    initializeProductTable();
  }
}

// Khởi chạy ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", handleProductSubmit);
  }
  fetchProductsAndSaveToLocal();
});
//CRUD của hoá đơn
//Lấy phtu trong DOM
document.addEventListener("DOMContentLoaded", function () {
  const orderTableBody = document.querySelector("#oder-table tbody");
  const dateFromInput = document.getElementById("date-from");
  const dateToInput = document.getElementById("date-to");
  const statusFilter = document.getElementById("status-filter");
  const districtFilter = document.getElementById("district-filter");
  const filterBtn = document.getElementById("filter-btn");
  const orderModal = document.getElementById("orderModal");
  const orderDetails = document.getElementById("orderDetails");
  const span = document.getElementsByClassName("close")[0];
  //Khởi tạo lưu trữ đơn hàng
  let orders = [];

  //Lấy dữ liệu từ local
  fetch("../resource/oder.json")
    .then((response) => response.json())
    .then((data) => {
      orders = data;
      displayOrders(orders);
    })
    .catch((error) => console.error("Error fetching data:", error));

  //Hàm hiển thị danh sách đơn hàng
  function displayOrders(orders) {
    orderTableBody.innerHTML = "";
    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${order.idOder}</td>
              <td>${order.date}</td>
              <td>${order.idCustomer}</td>
              <td>${order.listProduct.map((p) => p.name).join(", ")}</td>
              <td>${order.totalQuantity}</td>
              <td>${order.address.street}, ${order.address.district}, ${
        order.address.city
      }</td>
              <td>${order.total}</td>
              <td>${order.payment}</td>
              <td>${order.status}</td>
              <td><button class="view-btn" data-id="${
                order.idOder
              }">View</button></td>
          `;
      orderTableBody.appendChild(row);
    });
    //Thêm chức năng là nút xem
    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-id");
        const order = orders.find((o) => o.idOder === orderId);
        showOrderDetails(order);
      });
    });
  }

  //Hàm hiển thị chi tiết
  function showOrderDetails(order) {
    orderDetails.innerHTML = `
          <p><strong>ID Đơn hàng:</strong> ${order.idOder}</p>
          <p><strong>Ngày:</strong> ${order.date}</p>
          <p><strong>ID Khách hàng:</strong> ${order.idCustomer}</p>
          <p><strong>Sản phẩm:</strong></p>
          <ul>
              ${order.listProduct
                .map(
                  (p) =>
                    `<li>${p.name} - Số lượng: ${p.quantity} - Đơn giá: ${p.unitPrice}</li>`
                )
                .join("")}
          </ul>
          <p><strong>Tổng sản phẩm:</strong> ${order.totalQuantity}</p>
          <p><strong>Địa chỉ:</strong> ${order.address.street}, ${
      order.address.district
    }, ${order.address.city}</p>
          <p><strong>Tổng tiền:</strong> ${order.total}</p>
          <p><strong>Hình thức thanh toán:</strong> ${order.payment}</p>
          <p><strong>Trạng thái:</strong> ${order.status}</p>
      `;

    orderModal.style.display = "block";
  }

  //Ấn nút tắt bảng
  span.onclick = function () {
    orderModal.style.display = "none";
  };

  //Khi ấn ra ngoài thì đóng
  window.onclick = function (event) {
    if (event.target == orderModal) {
      orderModal.style.display = "none";
    }
  };

  // FSự keienj lọc
  function filterOrders() {
    const dateFromValue = dateFromInput.value;
    const dateToValue = dateToInput.value;
    const status = statusFilter.value;
    const district = districtFilter.value.toLowerCase();

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date.split("/").reverse().join("-")); // Chuyển đổi định dạng từ dd/MM/yyyy sang yyyy-MM-dd
      const matchDate =
        (!dateFromValue || new Date(dateFromValue) <= orderDate) &&
        (!dateToValue || new Date(dateToValue) >= orderDate);
      const matchStatus = status === "all" || order.status === status;
      const matchDistrict =
        district === "" ||
        order.address.street.toLowerCase().includes(district) ||
        order.address.district.toLowerCase().includes(district) ||
        order.address.city.toLowerCase().includes(district);
      return matchDate && matchStatus && matchDistrict;
    });

    displayOrders(filteredOrders);
  }

  //Thêm chức năng cho nút lọc
  filterBtn.addEventListener("click", filterOrders);
});

const listOrders = JSON.parse(localStorage.getItem("oder")) || [];
const listUsers = JSON.parse(localStorage.getItem("user")) || [];
const listProducts = JSON.parse(localStorage.getItem("product")) || [];

//Hàm lọc hóa đơn theo khoảng thời gian
function filterOrdersByDateRange(orders, startDate, endDate) {
  if (startDate === null || endDate === null) {
    alert("Vui lòng chọn đầy dủ khoảng thời gian!");
    return;
  }

  // Chuyển đổi các ngày từ chuỗi sang đối tượng Date
  const start = new Date(startDate.split("/").reverse().join("-"));
  const end = new Date(endDate.split("/").reverse().join("-"));

  // Lọc các hóa đơn nằm trong khoảng thời gian
  return orders.filter((order) => {
    if (order.status !== "Đã thanh toán") {
      return false;
    }
    const orderDate = new Date(order.date.split("/").reverse().join("-"));
    return orderDate >= start && orderDate <= end;
  });
}

// Hàm tính tổng doanh thu của các khách hàng sau khi đã lọc
function calculateTotalRevenueByCustomer(orders) {
  const customerRevenue = {};

  orders.forEach((order) => {
    const customerId = order.idCustomer;
    const orderTotal = parseInt(order.total);

    if (!customerRevenue[customerId]) {
      customerRevenue[customerId] = {
        totalRevenue: 0,
        orderIds: [], // Mảng lưu các id hóa đơn của khách hàng
      };
    }

    customerRevenue[customerId].totalRevenue += orderTotal;
    customerRevenue[customerId].orderIds.push(order.idOder); // Lưu id hóa đơn
  });

  // Chuyển đối tượng thành mảng
  const result = Object.keys(customerRevenue).map((customerId) => ({
    customerId,
    totalRevenue: customerRevenue[customerId].totalRevenue,
    orderIds: customerRevenue[customerId].orderIds, // Lưu id hóa đơn
  }));

  return result;
}

// Hàm tính tổng doanh thu và số lượng xe đã bán trong khoảng thời gian
function calculateTotalSalesAndRevenue(orders, startDate, endDate) {
  let totalQuantity = 0;
  let totalRevenue = 0;

  // Chuyển đổi các ngày từ chuỗi sang đối tượng Date
  const start = new Date(startDate.split("/").reverse().join("-"));
  const end = new Date(endDate.split("/").reverse().join("-"));

  orders.forEach((order) => {
    // Lọc các đơn hàng có ngày trong khoảng thời gian đã chọn và trạng thái đã thanh toán
    const orderDate = new Date(order.date.split("/").reverse().join("-"));
    if (
      orderDate >= start &&
      orderDate <= end &&
      order.status === "Đã thanh toán"
    ) {
      // Tính tổng số lượng xe và doanh thu cho đơn hàng
      totalQuantity += parseInt(order.totalQuantity);
      totalRevenue += parseInt(order.total);
    }
  });

  return { totalQuantity, totalRevenue };
}

// Hàm để hiển thị các chi tiết hóa đơn vào trong bảng
function showAllOrders(orderIds) {
  const tableBody = document.getElementById("body-order-details");
  tableBody.innerHTML = ""; // Xóa các dữ liệu cũ trước khi thêm mới

  // Duyệt qua các hóa đơn đã lọc và thêm từng dòng vào bảng
  orderIds.forEach((order) => {
    const detail = listOrders.find((o) => o.idOder === order);

    const row = document.createElement("tr");

    // Tạo các ô trong mỗi dòng của bảng
    const idCell = document.createElement("td");
    idCell.textContent = detail.idOder;

    const dateCell = document.createElement("td");
    dateCell.textContent = detail.date;

    const quantityCell = document.createElement("td");
    quantityCell.textContent = detail.totalQuantity;

    const totalCell = document.createElement("td");
    totalCell.textContent = detail.total;

    // Thêm các ô vào trong dòng
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(quantityCell);
    row.appendChild(totalCell);

    // Thêm dòng vào bảng
    tableBody.appendChild(row);
  });

  // Mở popup (hiện bảng chi tiết hóa đơn)
  document.getElementById("order-list").style.display = "flex";
}
//Thống kê
// Hàm để cập nhật bảng với dữ liệu khách hàng
function updateCustomerTable(orders) {
  const tableBody = document
    .getElementById("customer-table")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  orders.forEach((e) => {
    const user = listUsers.find((user) => user.id === e.customerId);
    const row = document.createElement("tr");
    if (!user) {
      return;
    }

    const idCusCell = document.createElement("td");
    idCusCell.textContent = e.customerId;

    const cusNameCell = document.createElement("td");
    cusNameCell.textContent = user.fullname;

    const totalCell = document.createElement("td");
    totalCell.textContent = e.totalRevenue;

    const detailsCell = document.createElement("td");
    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Xem chi tiết";
    detailsButton.addEventListener("click", () => showAllOrders(e.orderIds));
    detailsCell.appendChild(detailsButton);

    //thêm các dòng vào bảng
    row.appendChild(idCusCell);
    row.appendChild(cusNameCell);
    row.appendChild(totalCell);
    row.appendChild(detailsCell);
    tableBody.appendChild(row);
  });
}

// Sắp xếp khách hàng theo tổng doanh thu giảm dần
function getTopCustomers(customerData, topN) {
  const sortedCustomers = customerData.sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );
  return sortedCustomers.slice(0, topN + 1);
}

// Sắp xếp sản phẩm theo số lượng bán từ cao đến thấp
function getTopProductsBySales(productDetails, topN) {
  const sortedProducts = productDetails.sort((a, b) => b.quantity - a.quantity);

  // Lấy top N sản phẩm bán chạy nhất (số lượng lớn nhất)
  const bestSellingProducts = sortedProducts.slice(0, topN);
  // Lấy top N sản phẩm bán ế nhất (số lượng nhỏ nhất)
  const worstSellingProducts = sortedProducts.slice(-topN);

  return { bestSellingProducts, worstSellingProducts };
}

//Đếm số sản phẩm của các hóa đơn để tìm sản phẩm có số lượng mua cao nhất
function countProductsByOrder(orders) {
  const productDetails = [];

  // Duyệt qua tất cả các đơn hàng
  orders.forEach((order) => {
    // Duyệt qua danh sách sản phẩm trong mỗi đơn hàng
    order.listProduct.forEach((product) => {
      const productId = product.idProduct;
      const orderId = order.idOder;
      const quantity = parseInt(product.quantity, 10);
      const revenue = quantity * parseInt(product.unitPrice, 10); // Tính doanh thu

      // Kiểm tra xem sản phẩm đã có trong danh sách productDetails chưa
      let existingProduct = productDetails.find(
        (item) => item.idProduct === productId
      );

      if (existingProduct) {
        // Nếu sản phẩm đã có trong danh sách, cộng thêm số lượng và doanh thu
        existingProduct.quantity += quantity;
        existingProduct.revenue += revenue;

        // Kiểm tra nếu chưa có idOrder này trong mảng, thì thêm vào
        if (!existingProduct.idOrders.includes(orderId)) {
          existingProduct.idOrders.push(orderId);
        }
      } else {
        // Nếu chưa có, thêm sản phẩm mới vào danh sách
        productDetails.push({
          idProduct: productId,
          idOrders: [orderId], // Khởi tạo mảng idOrder với id hóa đơn hiện tại
          quantity: quantity,
          revenue: revenue,
        });
      }
    });
  });

  return productDetails;
}

//Hàm hiển thị các sản phẩm ra bảng
function displayTopSellingProducts(product, tableID) {
  const table = document
    .getElementById(tableID)
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";
  product.forEach((product) => {
    const row = document.createElement("tr");

    const idProductCell = document.createElement("td");
    idProductCell.textContent = product.idProduct || "N/A";

    const productNameCell = document.createElement("td");
    const p = listProducts.find((e) => e.id === product.idProduct);
    productNameCell.textContent = p.name || "N/A";

    const quantityCell = document.createElement("td");
    quantityCell.textContent = product.quantity || "N/A";

    const revenueCell = document.createElement("td");
    revenueCell.textContent = (product.revenue || "0") + "$";

    const detailsCell = document.createElement("td");
    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Xem chi tiết";
    detailsButton.addEventListener("click", () =>
      showAllOrders(product.idOrders)
    );
    detailsCell.appendChild(detailsButton);

    row.appendChild(idProductCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    row.appendChild(detailsCell);

    table.appendChild(row);
  });
}

// Gắn sự kiện cho nút đóng
document.getElementById("close-popup").addEventListener("click", () => {
  const popup = document.querySelector(".orders");
  popup.style.display = "none";
});

//hàm hiển thị các sản phẩm đã bán trong khoảng time
function displayProducts(products) {
  const table = document
    .getElementById("all-selling")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  products.forEach((p) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = p.idProduct;

    const productNameCell = document.createElement("td");
    const product = listProducts.find((pr) => pr.id === p.idProduct);
    productNameCell.textContent = product.name;

    const quantityCell = document.createElement("td");
    quantityCell.textContent = p.quantity;

    const revenueCell = document.createElement("td");
    revenueCell.textContent = p.revenue + "$";

    const detailsCell = document.createElement("td");
    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Xem chi tiết";
    detailsButton.addEventListener("click", () => showAllOrders(p.idOrders));
    detailsCell.appendChild(detailsButton);

    row.appendChild(idCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    row.appendChild(detailsCell);

    table.appendChild(row);
  });
}

//Hiển thị kết quả tìm kiếm
document.getElementById("show").addEventListener("click", () => {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const topN = parseInt(document.getElementById("top-selling").value, 10);
  const totalSold = document.getElementById("total-sold");
  const totalRevenue = document.getElementById("total-revenue");
  let objectTotal = { total: 0, revenue: 0 };

  totalSold.textContent = "";
  totalRevenue.textContent = "";

  // Lọc hóa đơn theo khoảng thời gian
  const listSearch = filterOrdersByDateRange(listOrders, startDate, endDate);

  if (listSearch.length === 0) {
    alert("Không có hóa đơn nào trong khoảng thời gian đã chọn.");
    return;
  }
  objectTotal = calculateTotalSalesAndRevenue(listOrders, startDate, endDate);
  console.log(objectTotal);

  if (totalSold && totalRevenue) {
    totalSold.textContent = objectTotal.totalQuantity;
    totalRevenue.textContent = objectTotal.totalRevenue;
  }

  // Tính doanh thu tổng theo khách hàng
  const customerData = calculateTotalRevenueByCustomer(listSearch);

  // Lọc Top N khách hàng
  const topCustomers = getTopCustomers(customerData, topN);

  // Hiển thị danh sách khách hàng trong bảng
  updateCustomerTable(topCustomers);

  const productCounts = countProductsByOrder(listOrders);

  const { bestSellingProducts, worstSellingProducts } = getTopProductsBySales(
    productCounts,
    topN
  );

  displayTopSellingProducts(bestSellingProducts, "best-selling");
  displayTopSellingProducts(worstSellingProducts, "worst-selling");
  displayProducts(productCounts);
});
