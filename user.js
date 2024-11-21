// Lấy dữ liệu từ Local Storage
const userID = localStorage.getItem("isLogIn");

// Fetch dữ liệu từ file JSON và lưu vào Local Storage
fetch("./resource/user.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("user", JSON.stringify(data)));

fetch("./resource/user-address.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("user-address", JSON.stringify(data)));

fetch("./resource/oder.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("oder",JSON.stringify(data)));

// Lấy danh sách người dùng và địa chỉ từ Local Storage
const listUser = JSON.parse(localStorage.getItem("user")) || [];
const listOder = JSON.parse(localStorage.getItem("oder")) || [];
const listAddress = JSON.parse(localStorage.getItem("user-address")) || [];
//lưu vào mảng
const user = listUser.find(user => user.id === userID);
const addressData = listAddress.find(user => user.id === userID);
const oderData = listOder.filter(user => user.idCustomer === userID);

console.log(user);
console.log(addressData);
console.log(oderData);

// Hiển thị thông tin người dùng
function loadUserInfor(){
  if (user) {
    document.getElementById("username").textContent = user.username;
    document.getElementById("user-fullname").textContent = user.fullname || "Chưa có";
    document.getElementById("user-sdt").textContent = user.sdt || "Chưa có";
    document.getElementById("user-status").textContent = user.status || "Không rõ";
  } else {
    alert("Bạn chưa đăng nhập! Vui lòng đăng nhập để tiếp tục!");
  }
}

// Hiển thị danh sách địa chỉ
function loadUserAddresses() {
  const addressListElem = document.getElementById("address-list");
  addressListElem.innerHTML = ""; // Xóa nội dung cũ

  if (addressData && addressData.addresses.length > 0) {
    addressData.addresses.forEach(address => {
      const listItem = document.createElement("li");
      listItem.textContent = `${address.street}, ${address.district}, ${address.city}`;
      
      // Nút xóa địa chỉ
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Xóa";
      deleteBtn.addEventListener("click", () => deleteAddress(address));
      listItem.appendChild(deleteBtn);

      addressListElem.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement("li");
    listItem.textContent = "Bạn chưa có địa chỉ nào.";
    addressListElem.appendChild(listItem);
  }
}

loadUserInfor();
loadUserAddresses();

// Mở popup khi nhấn "Thêm Địa Chỉ"
const popup = document.getElementById("popup");
document.getElementById("add-address-btn").addEventListener("click", () => {
  popup.style.display = "flex";
});

// Đóng popup khi nhấn "Đóng"
document.getElementById("close-popup-btn").addEventListener("click", () => {
  popup.style.display = "none";
});

// Thêm địa chỉ mới
document.getElementById("save-address-btn").addEventListener("click", () => {
  const street = document.getElementById("popup-street").value;
  const district = document.getElementById("popup-district").value;
  const city = document.getElementById("popup-city").value;

  if (street && district && city) {
    const newAddress = { street, district, city };

    if (addressData) {
      addressData.addresses.push(newAddress);

      // Cập nhật Local Storage
      localStorage.setItem("user-address", JSON.stringify(listAddress));

      // Cập nhật giao diện
      loadUserAddresses();

      // Reset input và ẩn popup
      document.getElementById("popup-street").value = "";
      document.getElementById("popup-district").value = "";
      document.getElementById("popup-city").value = "";
      popup.style.display = "none";

      alert("Thêm địa chỉ thành công!");
    } else {
      alert("Không tìm thấy thông tin người dùng!");
    }
  } else {
    alert("Vui lòng điền đầy đủ thông tin.");
  }
});

// Xóa địa chỉ
function deleteAddress(addressToDelete) {
  if (addressData) {
    // Lọc bỏ địa chỉ cần xóa
    addressData.addresses = addressData.addresses.filter(
      address =>
        address.street !== addressToDelete.street ||
        address.district !== addressToDelete.district ||
        address.city !== addressToDelete.city
    );

    // Cập nhật Local Storage
    localStorage.setItem("user-address", JSON.stringify(listAddress));

    // Cập nhật giao diện
    loadUserAddresses();

    alert("Xóa địa chỉ thành công!");
  } else {
    alert("Không thể xóa địa chỉ.");
  }
}

// chuyển đổi từ đơn mua sang tài khoản và ngược lại
document.addEventListener('DOMContentLoaded', () => {
  const profileTab = document.getElementById('profile-tab');
  const orderHistoryTab = document.getElementById('order-history-tab');
  const profileContent = document.getElementById('profile-content');
  const orderContent = document.getElementById('orders-content');

  // Hiển thị nội dung "Tài khoản của tôi"
  profileTab.addEventListener('click', () => {
    profileContent.classList.remove('hidden');
    orderContent.classList.add('hidden');
  });

  // Hiển thị nội dung "Đơn mua"
  orderHistoryTab.addEventListener('click', () => {
    profileContent.classList.add('hidden');
    orderContent.classList.remove('hidden');
  });
});

//Hiển thị hóa đơn và chi tiết hóa đơn nếu ckick vào chi tiết hóa đơn
document.addEventListener('DOMContentLoaded', () => {
  const popupOder = document.getElementById('popup-oder');

  // Hiển thị các hóa đơn trong bảng
  const invoiceTable = document.getElementById('invoice-table').getElementsByTagName('tbody')[0];
  oderData.forEach(invoice => {
    const row = document.createElement('tr');

    // Tạo các ô cho từng cột
    const idCell = document.createElement('td');
    idCell.textContent = invoice.idOder;
    row.appendChild(idCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = user.fullname;
    row.appendChild(dateCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = invoice.date;
    row.appendChild(totalCell);

    const totalQuantityCell = document.createElement('td');
    totalQuantityCell.textContent = invoice.totalQuantity;
    row.appendChild(totalQuantityCell);

    const total = document.createElement('td');
    total.textContent = invoice.total;
    row.appendChild(total);

    const statusCell = document.createElement('td');
    statusCell.textContent = invoice.status;
    row.appendChild(statusCell);

    const detailsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Xem chi tiết';
    detailsButton.addEventListener('click', () => showInvoiceDetails(invoice.listProduct));
    detailsCell.appendChild(detailsButton);
    row.appendChild(detailsCell);

    // Thêm dòng vào bảng
    invoiceTable.appendChild(row);
  });

  // Hiển thị chi tiết hóa đơn trong popup
  function showInvoiceDetails(list) {
    popupOder.style.display = "flex";
    
    console.log(list);
    const detailTable = document.getElementById('detail-oder')?.getElementsByTagName('tbody')[0];

    list.forEach(detail => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = detail.idProduct;
      row.appendChild(idCell);

      const productName = document.createElement('td');
      productName.textContent = detail.name;
      row.appendChild(productName);

      const quantity = document.createElement('td');
      quantity.textContent = detail.quantity;
      row.appendChild(quantity);

      const unitPrice = document.createElement('td')
      unitPrice.textContent = detail.unitPrice + "$";
      row.appendChild(unitPrice);

      detailTable.appendChild(row);
    })
  }

  // Đóng popup
  document.getElementById('close-popup').addEventListener('click', () => {
    popupOder.style.display = "none";
    const detailTable = document.getElementById('detail-oder').getElementsByTagName('tbody')[0];
    while (detailTable.rows.length > 0) {
      detailTable.deleteRow(0);
    }
  });
});

//nghe sự kiện sửa thông tin người dùng
document.addEventListener('DOMContentLoaded', () => {
  const editButton = document.getElementById('edit-profile-btn');
  
  let isEditing = false; // Trạng thái chỉnh sửa

  // Sự kiện khi nhấn vào nút "Sửa thông tin"
  editButton.addEventListener('click', () => {
    const userFullname = document.getElementById('user-fullname');
    const userSdt = document.getElementById('user-sdt');

    if (!isEditing) {
      // Đổi trạng thái sang chỉnh sửa
      isEditing = true;
      editButton.textContent = 'Lưu thông tin';

      // Chuyển các span thành input để chỉnh sửa
      const fullnameInput = document.createElement('input');
      fullnameInput.type = 'text';
      fullnameInput.id = 'edit-fullname';
      fullnameInput.value = userFullname.textContent;
      userFullname.replaceWith(fullnameInput);

      const sdtInput = document.createElement('input');
      sdtInput.type = 'text';
      sdtInput.id = 'edit-sdt';
      sdtInput.value = userSdt.textContent;
      userSdt.replaceWith(sdtInput);
    } else {
      // Đổi trạng thái sang hiển thị
      isEditing = false;
      editButton.textContent = 'Sửa thông tin';

      // Lấy giá trị mới từ input
      const fullnameInput = document.getElementById('edit-fullname');
      const sdtInput = document.getElementById('edit-sdt');

      const newFullname = fullnameInput.value.trim();
      const newSdt = sdtInput.value.trim();

      // Tạo lại span và hiển thị thông tin đã sửa
      const updatedFullname = document.createElement('span');
      updatedFullname.id = 'user-fullname';
      updatedFullname.textContent = newFullname;

      const updatedSdt = document.createElement('span');
      updatedSdt.id = 'user-sdt';
      updatedSdt.textContent = newSdt;

      fullnameInput.replaceWith(updatedFullname);
      sdtInput.replaceWith(updatedSdt);

      //Kiểm tra thông tin hợp lệ
      if(newFullname === ""){
        alert('Vui lòng không để trống Họ và tên!');
        loadUserInfor();
        return;
      }
      if(newSdt === ""){
        alert('Số điện thoại không được để trống!');
        loadUserInfor();
        return;
      }
      if(newSdt.length <= 10 ){
        alert('Số điện thoại không hợp lệ!');
        loadUserInfor();
        return;
      }

      user.fullname = newFullname;
      user.phone = newSdt;
      localStorage.setItem('user', JSON.stringify(user));

      alert('Thông tin đã được cập nhật!');
    }
  });
});
