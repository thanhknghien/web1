fetch("../resource/oder.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("oder",JSON.stringify(data)));

fetch("../resource/user.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("user",JSON.stringify(data)));

fetch("../resource/product.json")
  .then(response => response.json())
  .then(data => localStorage.setItem("product",JSON.stringify(data)));

const listOrders = JSON.parse(localStorage.getItem("oder")) || [];
const listUsers = JSON.parse(localStorage.getItem("user")) || [];
const listProducts = JSON.parse(localStorage.getItem("product")) || [];

//Hàm lọc hóa đơn theo khoảng thời gian
function filterOrdersByDateRange(orders, startDate, endDate) {
  if(startDate === null || endDate === null){
    alert("Vui lòng chọn đầy dủ khoảng thời gian!");
    return;
  }
  
  // Chuyển đổi các ngày từ chuỗi sang đối tượng Date
  const start = new Date(startDate.split("/").reverse().join("-"));
  const end = new Date(endDate.split("/").reverse().join("-"));
  
  // Lọc các hóa đơn nằm trong khoảng thời gian
  return orders.filter(order => {
if(order.status !== "Đã thanh toán"){
  return false;
}
    const orderDate = new Date(order.date.split("/").reverse().join("-"));
    return orderDate >= start && orderDate <= end;
  });
}

// Hàm tính tổng doanh thu của các khách hàng sau khi đã lọc
function calculateTotalRevenueByCustomer(orders) {
  const customerRevenue = {};

  orders.forEach(order => {
    const customerId = order.idCustomer;
    const orderTotal = parseInt(order.total);

    if (!customerRevenue[customerId]) {
      customerRevenue[customerId] = {
        totalRevenue: 0,
        orderIds: [] // Mảng lưu các id hóa đơn của khách hàng
      };
    }

    customerRevenue[customerId].totalRevenue += orderTotal;
    customerRevenue[customerId].orderIds.push(order.idOder); // Lưu id hóa đơn
  });

  // Chuyển đối tượng thành mảng
  const result = Object.keys(customerRevenue).map(customerId => ({
    customerId,
    totalRevenue: customerRevenue[customerId].totalRevenue,
    orderIds: customerRevenue[customerId].orderIds // Lưu id hóa đơn
  }));

  return result;
}

// Hàm để hiển thị các hóa đơn vào trong bảng
function showAllOrders( orderIds) {

  // Lấy phần tử tbody của bảng để cập nhật dữ liệu
  const tableBody = document.getElementById('body-order-details');
  tableBody.innerHTML = ''; // Xóa các dữ liệu cũ trước khi thêm mới

  // Duyệt qua các hóa đơn đã lọc và thêm từng dòng vào bảng
  orderIds.forEach(order => {
    const detail = listOrders.find(o => o.idOder === order)

    const row = document.createElement('tr');

    // Tạo các ô trong mỗi dòng của bảng
    const idCell = document.createElement('td');
    idCell.textContent = detail.idOder;

    const dateCell = document.createElement('td');
    dateCell.textContent = detail.date;

    const quantityCell = document.createElement('td');
    quantityCell.textContent = detail.totalQuantity;

    const totalCell = document.createElement('td');
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




// Hàm để cập nhật bảng với dữ liệu khách hàng
function updateCustomerTable(orders) {
  const tableBody = document.getElementById('customer-table').getElementsByTagName('tbody')[0];  
  tableBody.innerHTML = '';

  orders.forEach(e => {
    const user = listUsers.find(user => user.id === e.customerId);
    const row = document.createElement('tr');
    if (!user) {
      return;
    }
    
    const idCusCell = document.createElement('td');
    idCusCell.textContent = e.customerId;

    const cusNameCell = document.createElement('td')
    cusNameCell.textContent = user.fullname;

    const totalCell = document.createElement('td');
    totalCell.textContent = e.totalRevenue;

    const detailsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Xem chi tiết';
    console.log(e.orderIds)
    detailsButton.addEventListener('click', () => showAllOrders(e.orderIds));
    detailsCell.appendChild(detailsButton);

    //thêm các dòng vào bảng
    row.appendChild(idCusCell);
    row.appendChild(cusNameCell);
    row.appendChild(totalCell);
    row.appendChild(detailsCell);
    tableBody.appendChild(row);
  })
}


//Hiển thị kết quả tìm kiếm
document.getElementById('show').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  const listSearch = filterOrdersByDateRange(listOrders, startDate, endDate);
  console.log(listSearch);
  console.log(calculateTotalRevenueByCustomer(listSearch))
  if (listSearch.length === 0) {
    alert("Không có hóa đơn nào trong khoảng thời gian đã chọn.");
    return;
  }
  updateCustomerTable(calculateTotalRevenueByCustomer(listSearch));
});