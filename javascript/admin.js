//Dảm bảo code chỉ chạy khi toàn bộ DOM đã được tải
document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử nút và các bảng
  const manageUserButton = document.querySelector("#manageUserButton"); //
  const manageUserLink = document.querySelector(".manage-user");
  const manageProductLink = document.querySelector(".manage-product");
  const manageOrderLink = document.querySelector(".manage-order");
  const userTableContainer = document
    .querySelector("#user-table")
    .closest(".admin-content");
  const productTableContainer = document
    .querySelector("#product-table")
    .closest(".admin-content");
  const orderTableContainer = document
    .querySelector("#oder-table")
    .closest(".admin-content");

  // Thêm các nút quản lý ở sidebar
  const manageProductButton = document.querySelector(
    ".option-card:nth-child(2) .btn"
  );
  const manageOrderButton = document.querySelector(
    ".option-card:nth-child(3) .btn"
  );
  //Nút để mở modal và lưu người dùng
  const addUserButton = document.getElementById("addUserButton");
  const userModal = document.getElementById("user-modal");
  const closeUserModal = document.getElementById("close-user-modal");
  const saveUserButton = document.getElementById("add-user-btn");
  //Khởi tạo biến
  let currentRowToEdit = null;

  // Hàm ẩn tất cả các bảng
  const hideAllTables = () => {
    [userTableContainer, productTableContainer, orderTableContainer].forEach(
      (table) => {
        table.style.display = "none"; // Ẩn tất cả bảng
      }
    );
  };

  // Hàm hiển thị bảng được chọn
  const showTable = (table) => {
    hideAllTables(); // Ẩn các bảng khác
    table.style.display = "block"; // Hiển thị bảng được chọn
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

  //CRUD của user
  //Hiển thị modal thên ng dùng
  fetch("../resource/user.json")
    .then((response) => response.json())
    .then((data) => localStorage.setItem("user", JSON.stringify(data)));

  addUserButton.addEventListener("click", () => {
    userModal.style.display = "block";
    resetForm();
  });
  //Đóng modal
  closeUserModal.addEventListener("click", () => {
    userModal.style.display = "none";
    resetForm();
  });
  //Khởi tạo bảng
  function initializeUserTable() {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    populateUserTable(users);
  }
  //Điền dữ liệu vào bảng ng dùng
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

      //Chức năng thay đổi trạng thái
      row
        .querySelector(".status-btn")
        .addEventListener("click", () => toggleStatus(user.id));

      //Chức năng sửa và xóa
      row
        .querySelector(".edit-btn")
        .addEventListener("click", () => editUser(user.id));
      row
        .querySelector(".delete-btn")
        .addEventListener("click", () => confirmDeleteUser(user.id));
    });
  }
  //Hàm thay đổi trạng thái người dùng
  function toggleStatus(userId) {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.status = user.status === "ACTIVE" ? "LOCK" : "ACTIVE";
      localStorage.setItem("user", JSON.stringify(users));
      initializeUserTable(); // Cập nhật lại bảng
    }
  }
  //Hàm hiện xác nhận xoá
  function confirmDeleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUser(userId);
    }
  }
  //Hàm xoá danh sách người dùng
  function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem("user")) || [];
    users = users.filter((user) => user.id !== userId);
    localStorage.setItem("user", JSON.stringify(users));
    initializeUserTable();
  }
  //Hiển thị thông tin người dùng cần sửa
  function editUser(userId) {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const user = users.find((user) => user.id === userId);
    if (user) {
      document.getElementById("name").value = user.username;
      document.getElementById("full-name").value = user.fullname;
      document.getElementById("password").value = user.password;
      document.getElementById("sdt").value = user.sdt;
      currentRowToEdit = userId;
      userModal.style.display = "block";
    }
  }
  //Hàm lưu thông tin đã thêm và check lỗi ràng buộc
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
      hasError = !!message;
    }

    showError("name", username === "" ? "Vui lòng nhập tên đăng nhập!" : "");
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

    const users = JSON.parse(localStorage.getItem("user")) || [];
    //Hàm xử lý random, chỉnh sửa...
    if (currentRowToEdit) {
      const userIndex = users.findIndex((user) => user.id === currentRowToEdit);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
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
      users.push(newUser);
    }

    localStorage.setItem("user", JSON.stringify(users));
    initializeUserTable();
    userModal.style.display = "none";
    resetForm();
  });
  //Đặt lại form
  function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("full-name").value = "";
    document.getElementById("password").value = "";
    document.getElementById("sdt").value = "";
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
  }
  //Khởi tạo bảng người dùng
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

//hàm tạo dữ liệu mẫu lên localStorage
function addData(){
  Promise.all([
    fetch("../resource/oder.json").then(response => response.json()),
    fetch("../resource/user.json").then(response => response.json()),
    fetch("../resource/product.json").then(response => response.json()),
    fetch("../resource/cart.json").then(response => response.json()),
    fetch("../resource/user-address.json").then(response => response.json())
  ])
  .then(([orders, users, products,carts,userAddress]) => {
    localStorage.setItem("order", JSON.stringify(orders));
    localStorage.setItem("user", JSON.stringify(users));
    localStorage.setItem("product", JSON.stringify(products));
    localStorage.setItem("cart", JSON.stringify(carts));
    localStorage.setItem("user-address", JSON.stringify(userAddress));
  })
  .catch(error => console.error("Error loading resources:", error));
  
}

