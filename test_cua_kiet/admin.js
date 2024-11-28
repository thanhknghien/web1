//Phần quản lý người dùng
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

  // Đóng modal khi click ngoài modal
  window.addEventListener("click", (e) => {
    if (e.target === userModal) userModal.style.display = "none";
    if (e.target === productModal) productModal.style.display = "none";
    if (e.target === orderModal) orderModal.style.display = "none";
  });
});

// Fetch dữ liệu từ file JSON và lưu vào Local Storage
fetch("./resource/user.json")
  .then((response) => response.json())
  .then((data) => localStorage.setItem("user", JSON.stringify(data)));

fetch("./resource/user-address.json")
  .then((response) => response.json())
  .then((data) => localStorage.setItem("user-address", JSON.stringify(data)));

fetch("./resource/oder.json")
  .then((response) => response.json())
  .then((data) => localStorage.setItem("oder", JSON.stringify(data)));

//CRUD của User
// Khởi tạo dữ liệu từ Local Storage
function initializeUserTable() {
  // Lấy dữ liệu từ Local Storage
  const users = JSON.parse(localStorage.getItem("user")) || [];
  const userTable = document
    .getElementById("user-table")
    .querySelector("tbody");

  // Xóa nội dung cũ trong bảng
  userTable.innerHTML = "";

  // Hiển thị dữ liệu từ Local Storage vào bảng
  users.forEach((user) => {
    const newRow = userTable.insertRow();
    newRow.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td>${user.password}</td>
            <td>${user.sdt}</td>
            <td class="status">${
              user.status === "ACTIVE" ? "Unlock" : "Lock"
            }</td>
            <td>
                <button class="toggle-status">${
                  user.status === "ACTIVE" ? "Lock" : "Unlock"
                }</button>
            </td>
            <td>
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;

    // Thêm sự kiện cho nút Lock/Unlock
    const toggleButton = newRow.querySelector(".toggle-status");
    toggleButton.addEventListener("click", function () {
      const statusCell = newRow.querySelector(".status");
      if (statusCell.innerText === "Unlock") {
        statusCell.innerText = "Lock";
        toggleButton.innerText = "Unlock";
        updateUserStatus(user.id, "INACTIVE");
      } else {
        statusCell.innerText = "Unlock";
        toggleButton.innerText = "Lock";
        updateUserStatus(user.id, "ACTIVE");
      }
    });

    // Thêm sự kiện cho nút sửa
    const editButton = newRow.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      document.getElementById("name").value = user.username;
      document.getElementById("full-name").value = user.fullname;
      document.getElementById("password").value = user.password;
      document.getElementById("sdt").value = user.sdt;
      currentRowToEdit = user.id; // Lưu ID để sửa sau
    });

    // Thêm sự kiện cho nút xóa
    const deleteButton = newRow.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      deleteUser(user.id);
      newRow.remove();
    });
  });
}

// Cập nhật trạng thái người dùng
function updateUserStatus(userId, status) {
  const users = JSON.parse(localStorage.getItem("user")) || [];
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = status;
    localStorage.setItem("user", JSON.stringify(users));
  }
}

// Xóa người dùng
function deleteUser(userId) {
  let users = JSON.parse(localStorage.getItem("user")) || [];
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("user", JSON.stringify(users));
}

// Thêm hoặc sửa người dùng
document.getElementById("add-user-btn").addEventListener("click", function () {
  // Lấy giá trị từ các trường nhập liệu
  const username = document.getElementById("name").value.trim();
  const fullName = document.getElementById("full-name").value.trim();
  const password = document.getElementById("password").value.trim();
  const phoneNumber = document.getElementById("sdt").value.trim();

  // Cờ kiểm tra xem có lỗi hay không
  let hasError = false;

  // Hàm hiển thị lỗi
  function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = inputElement.nextElementSibling;
    if (message) {
      errorElement.innerText = message;
      hasError = true;
    } else {
      errorElement.innerText = "";
    }
  }

  // Kiểm tra lỗi cho từng trường
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

  // Nếu có lỗi, dừng việc thêm người dùng
  if (hasError) return;

  // Lấy dữ liệu hiện tại từ Local Storage
  const users = JSON.parse(localStorage.getItem("user")) || [];

  // Nếu đang chỉnh sửa, cập nhật người dùng
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
    currentRowToEdit = null; // Reset trạng thái chỉnh sửa
  } else {
    // Nếu không, thêm người dùng mới
    const newUser = {
      id: String(Math.floor(Math.random() * 100000)), // Tạo ID ngẫu nhiên
      username,
      fullname: fullName,
      password,
      sdt: phoneNumber,
      status: "ACTIVE",
    };
    users.push(newUser);
  }

  // Cập nhật lại Local Storage
  localStorage.setItem("user", JSON.stringify(users));

  // Làm mới bảng hiển thị
  initializeUserTable();

  // Reset form sau khi thêm
  document.getElementById("name").value = "";
  document.getElementById("full-name").value = "";
  document.getElementById("password").value = "";
  document.getElementById("sdt").value = "";
});

// Khởi tạo bảng khi tải trang
initializeUserTable();

//Phần quản lý sản phẩm

// Modal Quản lý Sản phẩm
document.addEventListener("DOMContentLoaded", () => {
  const carPriceInput = document.getElementById("car-price");
  const carImgInput = document.getElementById("car-img");
  const addProductBtn = document.getElementById("add-product-btn");
  const productTable = document
    .getElementById("product-table")
    .querySelector("tbody");

  let productId = 0; // Tạo ID duy nhất cho sản phẩm

  // Hàm hiển thị lỗi
  function showError(inputElement, message) {
    const errorElement = inputElement.nextElementSibling;
    if (message) {
      errorElement.innerText = message;
      return true;
    } else {
      errorElement.innerText = "";
      return false;
    }
  }

  // Kiểm tra giá hợp lệ
  function isValidPrice(price) {
    const priceRegex = /^\d{3,}(\.\d{3})*$/; // Giá phải bắt đầu bằng ít nhất 3 chữ số và có thể có các nhóm ".000"
    return priceRegex.test(price);
  }

  // Hàm hiển thị hình ảnh từ file
  function readImages(files, callback) {
    const fileReaders = [];
    const images = [];

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = () => {
        images.push(reader.result);
        if (images.length === files.length) callback(images);
      };

      reader.readAsDataURL(file);
    });
  }

  // Hàm thêm sản phẩm vào bảng
  function addProductRow({ id, name, price, brand, fuel, images }) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", id);

    const imagesHtml = images
      .map(
        (imgSrc) =>
          `<img src="${imgSrc}" alt="Car Image" width="50" height="50" style="margin-right: 5px;">`
      )
      .join("");

    newRow.innerHTML = `
      <td>${id}</td>
      <td>${name}</td>
      <td>${price}</td>
      <td>${brand}</td>
      <td>${fuel}</td>
      <td>${imagesHtml}</td>
      <td>
        <button class="detail-btn">Chi tiết</button>
        <button class="edit-btn">Sửa</button>
        <button class="delete-btn">Xóa</button>
      </td>
    `;

    productTable.appendChild(newRow);

    // Thêm sự kiện cho các nút Chi tiết, Sửa, Xóa
    newRow
      .querySelector(".detail-btn")
      .addEventListener("click", () => showProductDetails(id));
    newRow
      .querySelector(".edit-btn")
      .addEventListener("click", () => editProduct(id));
    newRow
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteProduct(id));
  }

  // Hàm hiển thị chi tiết sản phẩm
  function showProductDetails(id) {
    const row = productTable.querySelector(`tr[data-id='${id}']`);
    alert(`Chi tiết sản phẩm:
      - Tên: ${row.cells[1].innerText}
      - Giá: ${row.cells[2].innerText}
      - Hãng: ${row.cells[3].innerText}
      - Nhiên liệu: ${row.cells[4].innerText}`);
  }

  // Hàm sửa sản phẩm
  function editProduct(id) {
    const row = productTable.querySelector(`tr[data-id='${id}']`);
    const name = prompt("Sửa tên sản phẩm:", row.cells[1].innerText);
    const price = prompt("Sửa giá sản phẩm:", row.cells[2].innerText);
    const brand = prompt("Sửa hãng sản phẩm:", row.cells[3].innerText);
    const fuel = prompt("Sửa nhiên liệu:", row.cells[4].innerText);

    if (name) row.cells[1].innerText = name;
    if (price && isValidPrice(price)) row.cells[2].innerText = price;
    if (brand) row.cells[3].innerText = brand;
    if (fuel) row.cells[4].innerText = fuel;
  }

  // Hàm xóa sản phẩm
  function deleteProduct(id) {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      const row = productTable.querySelector(`tr[data-id='${id}']`);
      productTable.removeChild(row);
    }
  }

  // Xử lý khi nhấn nút Thêm mới
  addProductBtn.addEventListener("click", () => {
    const carName = document.getElementById("car-name").value.trim();
    const carPrice = carPriceInput.value.trim();
    const carBrand = document.getElementById("brand").value.trim();
    const carFuel = document.getElementById("fuel").value.trim();
    const carImgFiles = carImgInput.files;

    let hasError = false;

    // Kiểm tra các trường nhập liệu
    if (!carName) {
      hasError = showError(
        document.getElementById("car-name"),
        "Vui lòng nhập tên xe!"
      );
    }
    if (!carPrice || !isValidPrice(carPrice)) {
      hasError = showError(
        carPriceInput,
        "Giá xe không hợp lệ! Định dạng: xxx.xxx"
      );
    }
    if (!carBrand) {
      hasError = showError(
        document.getElementById("brand"),
        "Vui lòng nhập thương hiệu xe!"
      );
    }
    if (!carFuel) {
      hasError = showError(
        document.getElementById("fuel"),
        "Vui lòng nhập loại nhiên liệu!"
      );
    }
    if (carImgFiles.length === 0) {
      hasError = showError(carImgInput, "Vui lòng chọn ít nhất một hình ảnh!");
    }

    if (hasError) return;

    // Xóa lỗi nếu hợp lệ
    showError(document.getElementById("car-name"), "");
    showError(carPriceInput, "");
    showError(document.getElementById("brand"), "");
    showError(document.getElementById("fuel"), "");
    showError(carImgInput, "");

    // Đọc hình ảnh và thêm vào bảng
    readImages(carImgFiles, (images) => {
      productId++;
      addProductRow({
        id: productId,
        name: carName,
        price: carPrice,
        brand: carBrand,
        fuel: carFuel,
        images: images,
      });

      // Reset các trường nhập liệu sau khi thêm thành công
      document.getElementById("car-name").value = "";
      carPriceInput.value = "";
      document.getElementById("brand").value = "";
      document.getElementById("fuel").value = "";
      carImgInput.value = "";
    });
  });
});

//Xác nhận xoá
document.addEventListener("DOMContentLoaded", () => {
  const productTable = document
    .getElementById("product-table")
    .querySelector("tbody");

  // Modal Xác nhận Xóa
  const deleteModal = document.getElementById("confirm-delete-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  let productToDelete = null; // Lưu dòng sản phẩm đang yêu cầu xóa

  // Xử lý sự kiện Xóa trong bảng sản phẩm
  productTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const productRow = event.target.closest("tr");
      openDeleteModal(productRow); // Mở modal xác nhận xóa
    }
  });
});

//Quản lý đơn hàng
document.addEventListener("DOMContentLoaded", () => {
  const orderModal = document.getElementById("order-modal");
  const closeOrderModal = document.getElementById("close-order-modal");
  const filterBtn = document.getElementById("filter-btn");
  const orderTableBody = document.querySelector("#order-table tbody");

  // Hiển thị modal
  document.querySelector(".manage-order").addEventListener("click", (e) => {
    e.preventDefault();
    orderModal.style.display = "flex";
  });

  // Đóng modal
  closeOrderModal.addEventListener("click", () => {
    orderModal.style.display = "none";
  });

  // Thêm dữ liệu mẫu
  const orders = [
    {
      id: 1,
      customerName: "Nguyen Van A",
      time: "2024-11-01",
      address: "Quận 1, TP.HCM",
      status: "pending",
    },
    {
      id: 2,
      customerName: "Tran Thi B",
      time: "2024-11-10",
      address: "Quận 5, TP.HCM",
      status: "confirmed",
    },
    {
      id: 3,
      customerName: "Le Van C",
      time: "2024-11-15",
      address: "Quận 3, TP.HCM",
      status: "delivered",
    },
  ];

  // Hàm hiển thị đơn hàng
  function renderOrders(filteredOrders) {
    orderTableBody.innerHTML = "";
    filteredOrders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${order.id}</td>
              <td>${order.customerName}</td>
              <td>${order.time}</td>
              <td>${order.address}</td>
              <td>${order.status}</td>
              <td>
                  <button class="edit-btn" data-id="${order.id}">Sửa</button>
                  <button class="delete-btn" data-id="${order.id}">Xóa</button>
              </td>
          `;
      orderTableBody.appendChild(row);
    });
  }

  // Lọc đơn hàng
  filterBtn.addEventListener("click", () => {
    const dateFrom = document.getElementById("date-from").value;
    const dateTo = document.getElementById("date-to").value;
    const statusFilter = document.getElementById("status-filter").value;
    const districtSort = document.getElementById("district-sort").value;

    let filteredOrders = [...orders];

    // Lọc theo ngày
    if (dateFrom) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.time) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filteredOrders = filteredOrders.filter(
        (order) => new Date(order.time) <= new Date(dateTo)
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "all") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    // Sắp xếp theo quận
    if (districtSort === "asc") {
      filteredOrders.sort((a, b) => a.address.localeCompare(b.address));
    } else if (districtSort === "desc") {
      filteredOrders.sort((a, b) => b.address.localeCompare(a.address));
    }

    renderOrders(filteredOrders);
  });

  // Khởi tạo hiển thị
  renderOrders(orders);
});
