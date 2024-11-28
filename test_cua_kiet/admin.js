document.addEventListener("DOMContentLoaded", () => {
  // Modal Người dùng
  const userModal = document.getElementById("user-modal");
  const closeUserModal = document.getElementById("close-user-modal");
  const manageUserButtons = document.querySelectorAll(".manage-user");

  // Gắn sự kiện cho tất cả các nút "Quản lý người dùng"
  manageUserButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      userModal.style.display = "flex";
    });
  });

  closeUserModal.addEventListener("click", () => {
    userModal.style.display = "none";
  });

  // Modal Sản phẩm
  const productModal = document.getElementById("product-modal");
  const closeProductModal = document.getElementById("close-product-modal");
  const manageProductButtons = document.querySelectorAll(".manage-product");

  // Gắn sự kiện cho tất cả các nút "Quản lý sản phẩm"
  manageProductButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      productModal.style.display = "flex";
    });
  });

  closeProductModal.addEventListener("click", () => {
    productModal.style.display = "none";
  });

  // Modal Đơn hàng
  const orderModal = document.getElementById("order-modal");
  const closeOrderModal = document.getElementById("close-order-modal");
  const manageOrderButtons = document.querySelectorAll(".manage-order");

  // Gắn sự kiện cho tất cả các nút "Quản lý đơn hàng"
  manageOrderButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      orderModal.style.display = "flex";
    });
  });

  closeOrderModal.addEventListener("click", () => {
    orderModal.style.display = "none";
  });

  //Modal Thống kê
  const statsModal = document.getElementById("stats-modal");
  const closeStatsModal = document.getElementById("close-stats-modal");
  const manageStatsButtons = document.querySelectorAll(".manage-stats");

  // Gắn sự kiện cho tất cả các nút "Thống kê kinh doanh"
  manageStatsButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      statsModal.style.display = "flex";
    });
  });

  closeStatsModal.addEventListener("click", () => {
    statsModal.style.display = "none";
  });

  // Đóng modal khi click ngoài modal
  window.addEventListener("click", (e) => {
    if (e.target === userModal) userModal.style.display = "none";
    if (e.target === productModal) productModal.style.display = "none";
    if (e.target === orderModal) orderModal.style.display = "none";
    if (e.target === statsModal) statsModal.style.display = "none";
  });
});

//CRUD của User
// Biến để lưu trạng thái người dùng đang chỉnh sửa
let currentRowToEdit = null;

// Fetch dữ liệu từ file JSON và lưu vào Local Storage
function fetchDataAndSaveToLocal() {
  fetch("../resource/user.json")
    .then((response) => response.json())
    .then((data) => localStorage.setItem("user", JSON.stringify(data)))
    .catch((error) => console.error("Lỗi khi tải user.json:", error));
}

// Khởi tạo dữ liệu vào bảng từ Local Storage
function initializeUserTable() {
  const users = JSON.parse(localStorage.getItem("user")) || [];
  const userTable = document.querySelector("#user-table tbody");

  // Xóa nội dung cũ trong bảng
  userTable.innerHTML = "";

  // Hiển thị từng người dùng trong bảng
  users.forEach((user) => {
    const newRow = userTable.insertRow();
    newRow.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.fullname}</td>
        <td>${user.password}</td>
        <td>${user.sdt}</td>
        <td class="status">${user.status === "ACTIVE" ? "Unlock" : "Lock"}</td>
        <td>
          <button class="toggle-status">${
            user.status === "ACTIVE" ? "active" : "lock"
          }</button>
        </td>
        <td>
          <button class="edit-btn">Sửa</button>
          <button class="delete-btn">Xóa</button>
        </td>
      `;

    // Thêm sự kiện cho các nút
    newRow
      .querySelector(".toggle-status")
      .addEventListener("click", () => toggleStatus(user.id));
    newRow
      .querySelector(".edit-btn")
      .addEventListener("click", () => editUser(user.id));
    newRow
      .querySelector(".delete-btn")
      .addEventListener("click", () => confirmDeleteUser(user.id));
  });
}

// Cập nhật trạng thái của người dùng
function toggleStatus(userId) {
  const users = JSON.parse(localStorage.getItem("user")) || [];
  const user = users.find((user) => user.id === userId);
  if (user) {
    user.status = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    localStorage.setItem("user", JSON.stringify(users));
    initializeUserTable();
  }
}

// Xóa người dùng với xác nhận
function confirmDeleteUser(userId) {
  const confirmation = confirm("Bạn có chắc chắn muốn xóa người dùng này?");
  if (confirmation) {
    deleteUser(userId);
  }
}

// Thực hiện xóa người dùng
function deleteUser(userId) {
  let users = JSON.parse(localStorage.getItem("user")) || [];
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("user", JSON.stringify(users));
  initializeUserTable();
}

// Chỉnh sửa người dùng
function editUser(userId) {
  const users = JSON.parse(localStorage.getItem("user")) || [];
  const user = users.find((user) => user.id === userId);
  if (user) {
    document.getElementById("name").value = user.username;
    document.getElementById("full-name").value = user.fullname;
    document.getElementById("password").value = user.password;
    document.getElementById("sdt").value = user.sdt;
    currentRowToEdit = userId;
  }
}

// Thêm hoặc cập nhật người dùng
document.getElementById("add-user-btn").addEventListener("click", () => {
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

  // Kiểm tra các trường nhập liệu
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

  if (currentRowToEdit) {
    // Chỉnh sửa người dùng
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
    // Thêm người dùng mới (ID ngẫu nhiên từ 100 đến 999)
    const newUser = {
      id: String(Math.floor(Math.random() * (999 - 100 + 1)) + 100), // ID từ 100 đến 999
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

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("full-name").value = "";
  document.getElementById("password").value = "";
  document.getElementById("sdt").value = "";
});

// Gọi các hàm khởi tạo khi tải trang
fetchDataAndSaveToLocal();
initializeUserTable();

//Phần quản lý sản phẩm

// Biến lưu trạng thái sản phẩm đang chỉnh sửa
let currentProductToEdit = null;

// Khởi tạo các thông báo lỗi
const errorMessages = {
  name: "Vui lòng nhập tên sản phẩm!",
  price: "Vui lòng nhập giá sản phẩm!",
  brand: "Vui lòng nhập thương hiệu!",
  fuel: "Vui lòng nhập nhiên liệu!",
  year: "Vui lòng nhập năm sản xuất!",
};

// Fetch dữ liệu sản phẩm từ file JSON và lưu vào Local Storage
async function fetchProductsAndSaveToLocal() {
  try {
    const response = await fetch("../resource/product.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    localStorage.setItem("product", JSON.stringify(data));
    initializeProductTable();
  } catch (error) {
    console.error("Lỗi khi tải product.json:", error);
  }
}

// Hiển thị dữ liệu sản phẩm từ Local Storage
function initializeProductTable() {
  const products = JSON.parse(localStorage.getItem("product")) || [];
  const productTable = document.querySelector("#product-table tbody");
  if (!productTable) {
    console.error("Không tìm thấy bảng sản phẩm!");
    return;
  }

  productTable.innerHTML = "";

  products.forEach((product) => {
    const newRow = productTable.insertRow();
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

// Xử lý file ảnh
function handleImageFiles(files) {
  const imageUrls = [];
  for (const file of files) {
    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      imageUrls.push(imageUrl);
    }
  }
  return imageUrls;
}

// Thêm hoặc cập nhật sản phẩm
function handleProductSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

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
      id: String(Math.floor(Math.random() * 900) + 100),
      ...formData,
      src: imageUrls,
    });
  }

  localStorage.setItem("product", JSON.stringify(products));
  initializeProductTable();
  resetForm();
}

// Reset form
function resetForm() {
  const form = document.getElementById("product-form");
  if (form) {
    form.reset();
    // Xóa tất cả thông báo lỗi
    document
      .querySelectorAll(".error-message")
      .forEach((error) => (error.textContent = ""));
  }
  currentProductToEdit = null;
}

// Sửa sản phẩm
function editProduct(productId) {
  const products = JSON.parse(localStorage.getItem("product")) || [];
  const product = products.find((p) => p.id === productId);

  if (product) {
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-brand").value = product.brand;
    document.getElementById("product-fuel").value = product.fuel;
    document.getElementById("product-year").value = product.year;
    currentProductToEdit = productId;
  }
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

// Khởi tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("product-form");
  if (form) {
    form.addEventListener("submit", handleProductSubmit);
  }
  fetchProductsAndSaveToLocal();
});

//Quản lý đơn hàng
document.addEventListener("DOMContentLoaded", () => {
  const orderModal = document.getElementById("order-modal");
  const closeOrderModal = document.getElementById("close-order-modal");
  const filterBtn = document.getElementById("filter-btn");
  const orderTableBody = document.querySelector("#order-table tbody");
  const statusFilter = document.getElementById("status-filter");

  let orders = [];

  // Đọc dữ liệu từ file oder.json
  function fetchOrders() {
    fetch("../resource/oder.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        orders = data;
        renderOrders(orders);
      })
      .catch((error) => {
        console.error("Lỗi khi tải oder.json:", error);
        orderTableBody.innerHTML =
          '<tr><td colspan="10" style="text-align: center; color: red;">Lỗi khi tải dữ liệu</td></tr>';
      });
  }

  // Hiển thị modal
  document.querySelector(".manage-order").addEventListener("click", (e) => {
    e.preventDefault();
    orderModal.style.display = "flex";
  });

  // Đóng modal
  closeOrderModal.addEventListener("click", () => {
    orderModal.style.display = "none";
  });

  function renderOrders(filteredOrders) {
    orderTableBody.innerHTML = "";
    if (filteredOrders.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td colspan="10" style="text-align: center;">Không tìm thấy đơn hàng nào</td>';
      orderTableBody.appendChild(row);
      return;
    }

    filteredOrders.forEach((order) => {
      const row = document.createElement("tr");
      const products = order.listProduct
        .map(
          (product) =>
            `${product.name} (Số lượng: ${product.quantity}, Giá: ${product.unitPrice})`
        )
        .join("<br>");

      row.innerHTML = `
          <td>${order.idOder}</td>
          <td>${order.date}</td>
          <td>${order.idCustomer}</td>
          <td>${products}</td>
          <td>${order.totalQuantity}</td>
          <td>${order.address.street}, ${order.address.district}, ${order.address.city}</td>
          <td>${order.total} USD</td>
          <td>${order.payment}</td>
          <td>${order.status}</td>
          <td><a href="#" class="view-details" data-id="${order.idOder}">Xem chi tiết</a></td>
        `;
      orderTableBody.appendChild(row);
    });
  }

  function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  function applyFilters() {
    const dateFrom = document.getElementById("date-from").value;
    const dateTo = document.getElementById("date-to").value;
    const statusValue = statusFilter.value;
    const districtFilter = document.getElementById("district-filter").value;

    let filteredOrders = [...orders];

    // Lọc theo trạng thái
    if (statusValue && statusValue !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusValue
      );
    }

    // Lọc theo ngày
    if (dateFrom) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = convertDateFormat(order.date);
        return orderDate >= dateFrom;
      });
    }
    if (dateTo) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = convertDateFormat(order.date);
        return orderDate <= dateTo;
      });
    }

    // Lọc theo quận
    if (districtFilter) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.address.district.toLowerCase().trim() ===
          districtFilter.toLowerCase().trim()
      );
    }

    renderOrders(filteredOrders);
  }

  // Gắn sự kiện cho nút lọc
  filterBtn.addEventListener("click", applyFilters);

  // Khởi tạo bằng cách đọc dữ liệu từ file
  fetchOrders();
});

//Thống kê
// Đọc file JSON từ local
async function fetchOrders() {
  const response = await fetch("../resource/oder.json");
  const orders = await response.json();
  return orders;
}

// Thống kê mặt hàng
function calculateProductsStats(orders) {
  const productStats = {};

  orders.forEach((order) => {
    order.listProduct.forEach((product) => {
      const id = product.idProduct;
      const name = product.name;
      const quantity = parseInt(product.quantity, 10);
      const price = parseFloat(product.unitPrice.replace(/,/g, ""));

      if (!productStats[id]) {
        productStats[id] = { id, name, totalQuantity: 0, totalRevenue: 0 };
      }
      productStats[id].totalQuantity += quantity;
      productStats[id].totalRevenue += quantity * price;
    });
  });

  return Object.values(productStats);
}

// Thống kê khách hàng
function calculateCustomerStats(orders) {
  const customerStats = {};

  orders.forEach((order) => {
    const id = order.idCustomer;
    const total = parseFloat(order.total.replace(/,/g, ""));

    if (!customerStats[id]) {
      customerStats[id] = { id, orderCount: 0, totalSpent: 0 };
    }
    customerStats[id].orderCount += 1;
    customerStats[id].totalSpent += total;
  });

  return Object.values(customerStats);
}

// Hiển thị dữ liệu mặt hàng
function displayProductStats(stats) {
  const tbody = document.getElementById("productsBody");
  tbody.innerHTML = "";

  stats.forEach((product) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.totalQuantity}</td>
            <td>${product.totalRevenue.toLocaleString()} VND</td>
            <td>${product.totalQuantity > 5 ? "Bán chạy" : "Chậm"}</td>
            <td><button onclick="viewProductDetails('${
              product.id
            }')">Xem hóa đơn</button></td>
        `;
    tbody.appendChild(tr);
  });
}

// Hiển thị dữ liệu khách hàng
function displayCustomerStats(stats) {
  const tbody = document.getElementById("customersBody");
  tbody.innerHTML = "";

  stats.forEach((customer) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.orderCount}</td>
            <td>${customer.totalSpent.toLocaleString()} VND</td>
            <td><button onclick="viewCustomerDetails('${
              customer.id
            }')">Xem hóa đơn</button></td>
        `;
    tbody.appendChild(tr);
  });
}

// Chuyển đổi giữa các tab
function switchTab(tabId) {
  document.getElementById("productsTab").style.display =
    tabId === "productsTab" ? "block" : "none";
  document.getElementById("customersTab").style.display =
    tabId === "customersTab" ? "block" : "none";

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.getAttribute("onclick").includes(tabId));
  });
}

// Lọc theo ngày
function filterByDate(orders, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return orders.filter((order) => {
    const orderDate = new Date(order.date.split("/").reverse().join("-"));
    return orderDate >= start && orderDate <= end;
  });
}

// Xử lý hiển thị dữ liệu theo tab và ngày
async function updateStats() {
  const orders = await fetchOrders();

  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const filteredOrders =
    startDate && endDate ? filterByDate(orders, startDate, endDate) : orders;

  const productStats = calculateProductsStats(filteredOrders);
  const customerStats = calculateCustomerStats(filteredOrders);

  displayProductStats(productStats);
  displayCustomerStats(customerStats);
}

// Sự kiện khi tải trang
document.addEventListener("DOMContentLoaded", async () => {
  await updateStats();

  document.getElementById("close-stats-modal").addEventListener("click", () => {
    document.getElementById("stats-modal").style.display = "none";
  });

  document.getElementById("startDate").addEventListener("change", updateStats);
  document.getElementById("endDate").addEventListener("change", updateStats);
});
