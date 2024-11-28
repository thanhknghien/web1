document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử nút và các bảng
  const manageUserButton = document.querySelector("#manageUserButton");
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

  // Thêm các nút "Quản lý" ở sidebar
  const manageProductButton = document.querySelector(
    ".option-card:nth-child(2) .btn"
  );
  const manageOrderButton = document.querySelector(
    ".option-card:nth-child(3) .btn"
  );

  const addUserButton = document.getElementById("addUserButton");
  const userModal = document.getElementById("user-modal");
  const closeUserModal = document.getElementById("close-user-modal");
  const saveUserButton = document.getElementById("add-user-btn");

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

  // Gắn sự kiện click cho từng nút
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

  // Gắn sự kiện cho nút "Quản lý" trong sidebar
  manageProductButton.addEventListener("click", () =>
    showTable(productTableContainer)
  );
  manageOrderButton.addEventListener("click", () =>
    showTable(orderTableContainer)
  );

  //CRUD của user
  addUserButton.addEventListener("click", () => {
    userModal.style.display = "block";
    resetForm();
  });

  closeUserModal.addEventListener("click", () => {
    userModal.style.display = "none";
    resetForm();
  });

  function initializeUserTable() {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    populateUserTable(users);
  }

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

      // Sự kiện thay đổi trạng thái
      row
        .querySelector(".status-btn")
        .addEventListener("click", () => toggleStatus(user.id));

      // Sự kiện sửa và xóa
      row
        .querySelector(".edit-btn")
        .addEventListener("click", () => editUser(user.id));
      row
        .querySelector(".delete-btn")
        .addEventListener("click", () => confirmDeleteUser(user.id));
    });
  }

  function toggleStatus(userId) {
    const users = JSON.parse(localStorage.getItem("user")) || [];
    const user = users.find((user) => user.id === userId);
    if (user) {
      user.status = user.status === "ACTIVE" ? "LOCK" : "ACTIVE";
      localStorage.setItem("user", JSON.stringify(users));
      initializeUserTable(); // Cập nhật lại bảng
    }
  }

  function confirmDeleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      deleteUser(userId);
    }
  }

  function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem("user")) || [];
    users = users.filter((user) => user.id !== userId);
    localStorage.setItem("user", JSON.stringify(users));
    initializeUserTable();
  }

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

  function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("full-name").value = "";
    document.getElementById("password").value = "";
    document.getElementById("sdt").value = "";
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
  }

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

    // Gán sự kiện cho nút sửa và xóa
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
