// Lấy dữ liệu từ Local Storage
const userID = String(JSON.parse(localStorage.getItem("isLogIn"))); 

console.log(userID)
// Lấy danh sách người dùng và địa chỉ từ Local Storage
const listUser = JSON.parse(localStorage.getItem("user")) || [];
const listOder = JSON.parse(localStorage.getItem("oder")) || [];
const listAddress = JSON.parse(localStorage.getItem("user-address")) || [];

//lưu vào mảng
const user = listUser.find(user => user.id === userID);
const addressData = listAddress.find(user => user.id === userID);
const oderData = listOder.filter(user => user.idCustomer === userID);
console.log(user)
//Các biến
const popupOder = document.getElementById('popup-oder');
const popup = document.getElementById("popup");


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

//hiển thị chi tiết hóa đơn
function showInvoiceDetails(list) {
  const detailTable = document.getElementById('detail-oder')?.getElementsByTagName('tbody')[0];

  if (!popupOder || !detailTable) {
    console.error("Popup hoặc bảng chi tiết không tồn tại!");
    return;
  }

  // Hiển thị popup
  popupOder.style.display = "flex";

  // Xóa dữ liệu cũ trong bảng chi tiết
  detailTable.innerHTML = '';

  // Thêm dữ liệu mới vào bảng
  list.forEach(detail => {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = detail.idProduct || 'N/A'; // Giá trị mặc định nếu thiếu
    row.appendChild(idCell);

    const productName = document.createElement('td');
    productName.textContent = detail.name || 'N/A';
    row.appendChild(productName);

    const quantity = document.createElement('td');
    quantity.textContent = detail.quantity || '0';
    row.appendChild(quantity);

    const unitPrice = document.createElement('td');
    unitPrice.textContent = (detail.unitPrice || 0) + "$";
    row.appendChild(unitPrice);

    detailTable.appendChild(row);
  });
}

loadUserInfor();
loadUserAddresses();

// Mở popup khi nhấn "Thêm Địa Chỉ"
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

// chuyển đổi từ đơn mua sang tài khoản và ngược lại
document.addEventListener('DOMContentLoaded', () => {
  const profileTab = document.getElementById('profile-tab');
  const orderHistoryTab = document.getElementById('order-history-tab');
  const profileContent = document.getElementById('profile-content');
  const orderContent = document.getElementById('orders-content');

  // Hiển thị nội dung "Tài khoản của tôi"
  profileTab.addEventListener('click', () => {

    orderContent.classList.add('hidden');
    profileContent.classList.remove('hidden');
  });

  // Hiển thị nội dung "Đơn mua"
  orderHistoryTab.addEventListener('click', () => {
    profileContent.classList.add('hidden');
    orderContent.classList.remove('hidden');
  });
});

//Hiển thị hóa đơn và chi tiết hóa đơn nếu click vào chi tiết hóa đơn
document.addEventListener('DOMContentLoaded', () => {
  console.log("jsjdj",oderData)
  // Hiển thị các hóa đơn trong bảng
  const invoiceTable = document.getElementById('invoice-table').getElementsByTagName('tbody')[0];
  oderData.forEach(invoice => {
    const row = document.createElement('tr');
    console.log(invoice.idOder)
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
    total.textContent = (invoice.total || 0) + " $";
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
      if(newSdt.length < 10 ){
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

//Tìm kiếm hóa đơn
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-btn');
  const startDateInput = document.getElementById('search-start-date');
  const endDateInput = document.getElementById('search-end-date');
  const totalInput = document.getElementById('search-total');
  const statusInput = document.getElementById('search-status');
  const addressInput = document.getElementById('search-address');
  const paymentInput = document.getElementById('search-payment');
  const invoiceTableBody = document.getElementById('body-oder');

  // Hàm hiển thị dữ liệu lên bảng
  function displayInvoices(invoices) {
    // Xóa bảng cũ
    invoiceTableBody.innerHTML = '';

    // Thêm các hóa đơn vào bảng
    invoices.forEach(invoice => {
      const row = document.createElement('tr');

      //ID
      const idCell = document.createElement('td');
      idCell.textContent = invoice.idOder;
      row.appendChild(idCell);

      //tên khách
      const nameCell = document.createElement('td');
      nameCell.textContent = user.fullname;
      row.appendChild(nameCell);

      //Ngày mua
      const dateCell = document.createElement('td');
      dateCell.textContent = invoice.date;
      row.appendChild(dateCell);

      //Số lượng
      const quantityCell = document.createElement('td');
      quantityCell.textContent = invoice.totalQuantity;
      row.appendChild(quantityCell);

      //Tổng tiền
      const totalCell = document.createElement('td');
      totalCell.textContent = invoice.total;
      row.appendChild(totalCell);

      //Phương thức thanh toán
      const paymentCell = document.createElement('td');
      paymentCell.textContent = invoice.payment;
      row.appendChild(paymentCell)

      //Địa chỉ
      const addresCell = document.createElement('td');
      addresCell.textContent = `${invoice.address.street}, ${invoice.address.district}, ${invoice.address.city}`;
      row.appendChild(addresCell);

      //Trạng thái
      const statusCell = document.createElement('td');
      statusCell.textContent = invoice.status;
      row.appendChild(statusCell);

      const detailsCell = document.createElement('td');
      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Xem chi tiết';
      detailsButton.addEventListener('click', () => showInvoiceDetails(invoice.listProduct));
      detailsCell.appendChild(detailsButton);
      row.appendChild(detailsCell);

      invoiceTableBody.appendChild(row);
    });
  }

  // Hàm tìm kiếm hóa đơn
  function searchInvoices() {
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    const searchTotal = totalInput.value ? parseFloat(totalInput.value) : null;
    const searchStatus = statusInput.value;
    const searchAddress = addressInput.value.toLowerCase();
    const searchPayment = paymentInput.value.toLowerCase();

    // Lọc dữ liệu
    const filteredInvoices = oderData.filter(invoice => {
      const invoiceDate = new Date(invoice.date.split("/").reverse().join("-")); // Chuyển ngày từ dd/mm/yyyy sang yyyy-mm-dd

      // Kiểm tra khoảng thời gian
      const matchesDate = (startDate && endDate) 
        ? invoiceDate >= startDate && invoiceDate <= endDate
        : true;

      // Kiểm tra tổng tiền
      const matchesTotal = searchTotal ? parseFloat(invoice.total) <= searchTotal : true;

      // Kiểm tra trạng thái
      const matchesStatus = searchStatus ? invoice.status === searchStatus : true;

      // Kiểm tra địa chỉ (bao gồm cả street, district, city)
      const address = `${invoice.address.street} ${invoice.address.district} ${invoice.address.city}`.toLowerCase();
      const matchesAddress = searchAddress ? address.includes(searchAddress) : true;

      // Kiểm tra phương thức thanh toán
      const matchesPayment = searchPayment ? invoice.payment.toLowerCase().includes(searchPayment) : true;

      return matchesDate && matchesTotal && matchesStatus && matchesAddress && matchesPayment;
    });

    // Hiển thị kết quả lọc
    displayInvoices(filteredInvoices);
  }

  // Gắn sự kiện click cho nút tìm kiếm
  searchButton.addEventListener('click', searchInvoices);

  // Hiển thị toàn bộ dữ liệu ban đầu
  displayInvoices(oderData);
});

//Hiển thị các nút đăng nhập đăng xuất
document.addEventListener('DOMContentLoaded', ()=>{
  if(!userID){
    document.getElementById("logIn").style.display = "block";
    document.getElementById("logIn").addEventListener('click', () =>{
      alert("Chuyển về trang chủ để đăng nhập!");
      window.location.href ='home.html';
      return false;
    })
  }else{
    document.getElementById("logOut").style.display = "block";
    document.getElementById("logOut").addEventListener('click', ()=>{
      alert("Đăng xuất thành công");
      localStorage.setItem('isLogIn','');  // Xóa userID trong localStorage
      window.location.reload();
      return false;  // Ngăn chặn hành động mặc định của sự kiện
    })
  }
})

//Đổi ảnh đại diện
document.addEventListener('DOMContentLoaded', () => {
  // Lấy ảnh đại diện mặc định
  const defaultAvatar = "../assets/logo-icon/account.svg";

  // Lấy phần tử ảnh đại diện
  const avatarImg = document.getElementById("user-avatar");

  // Xử lý thay đổi ảnh đại diện khi nhấn nút
  document.getElementById('change-avatar-btn').addEventListener('click', () => {
    document.getElementById('avatar-upload').click();  // Mở hộp thoại chọn ảnh
  });

  // Xử lý khi người dùng chọn ảnh mới
  document.getElementById('avatar-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;  // Lấy URL của ảnh đã chọn
        avatarImg.src = imageUrl;  // Cập nhật ảnh đại diện trên giao diện
      };
      reader.readAsDataURL(file);  // Đọc ảnh dưới dạng Base64
    }
  });
});

//Nút clear tìm kiếm
document.getElementById("reset-btn").addEventListener('click', () => {
  // Lấy tất cả các thẻ input
  const inputs = document.getElementsByTagName('input');
  
  for (let input of inputs) {
    input.value = ''; // Đặt giá trị của input về chuỗi rỗng
  }

  const selects = document.getElementsByTagName('select');
  for (let select of selects) {
    select.selectedIndex = 0; // Đặt về tùy chọn đầu tiên
  }
});

//DOM tìm kiếm
document.getElementById('search-form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const search = document.getElementById('searching').value;
  if(search === null){
    alert("Bạn chưa nhập thông tin tìm kiếm!"); return;
  }else{
    localStorage.setItem("search",search);
    window.location.href = 'home.html'
  }
})
