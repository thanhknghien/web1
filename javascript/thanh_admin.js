
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

// Hàm tính tổng doanh thu và số lượng xe đã bán trong khoảng thời gian
function calculateTotalSalesAndRevenue(orders, startDate, endDate) {
  let totalQuantity = 0;
  let totalRevenue = 0;

  // Chuyển đổi các ngày từ chuỗi sang đối tượng Date
  const start = new Date(startDate.split("/").reverse().join("-"));
  const end = new Date(endDate.split("/").reverse().join("-"));

  orders.forEach(order => {
    // Lọc các đơn hàng có ngày trong khoảng thời gian đã chọn và trạng thái đã thanh toán
    const orderDate = new Date(order.date.split("/").reverse().join("-"));
    if (orderDate >= start && orderDate <= end && order.status === "Đã thanh toán") {
      // Tính tổng số lượng xe và doanh thu cho đơn hàng
      totalQuantity += parseInt(order.totalQuantity);
      totalRevenue += parseInt(order.total);
    }
  });

  return { totalQuantity, totalRevenue };
}

// Hàm để hiển thị các chi tiết hóa đơn vào trong bảng
function showAllOrders( orderIds) {
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

// Sắp xếp khách hàng theo tổng doanh thu giảm dần
function getTopCustomers(customerData, topN) {
  const sortedCustomers = customerData.sort((a, b) => b.totalRevenue - a.totalRevenue);
  return sortedCustomers.slice(0, topN+1);
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
  orders.forEach(order => {
      // Duyệt qua danh sách sản phẩm trong mỗi đơn hàng
      order.listProduct.forEach(product => {
          const productId = product.idProduct;
          const orderId = order.idOder;
          const quantity = parseInt(product.quantity, 10);
          const revenue = quantity * parseInt(product.unitPrice, 10); // Tính doanh thu

          // Kiểm tra xem sản phẩm đã có trong danh sách productDetails chưa
          let existingProduct = productDetails.find(item => item.idProduct === productId);

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
                  revenue: revenue
              });
          }
      });
  });

  return productDetails;
}

//Hàm hiển thị các sản phẩm ra bảng
function displayTopSellingProducts(product, tableID){
  const table = document.getElementById(tableID).getElementsByTagName('tbody')[0];
  table.innerHTML = ''
  product.forEach(product => {
    const row = document.createElement('tr');

    const idProductCell = document.createElement('td');
    idProductCell.textContent = product.idProduct || 'N/A';

    const productNameCell = document.createElement('td');
    const p = listProducts.find(e => e.id === product.idProduct)
    productNameCell.textContent = p.name || 'N/A';

    const quantityCell = document.createElement('td');
    quantityCell.textContent = product.quantity || 'N/A'

    const revenueCell = document.createElement('td');
    revenueCell.textContent = (product.revenue || '0') + '$';

    const detailsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Xem chi tiết';
    detailsButton.addEventListener('click', () => showAllOrders(product.idOrders));
    detailsCell.appendChild(detailsButton);

    row.appendChild(idProductCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    row.appendChild(detailsCell);

    table.appendChild(row);
  })
}

// Gắn sự kiện cho nút đóng
document.getElementById('close-popup').addEventListener('click', () =>{
  const popup = document.querySelector('.orders');
  popup.style.display = 'none';
});

//hàm hiển thị các sản phẩm đã bán trong khoảng time
function displayProducts(products){
  const table = document.getElementById('all-selling').getElementsByTagName('tbody')[0];
  table.innerHTML = '';

  products.forEach(p => {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = p.idProduct;

    const productNameCell = document.createElement('td');
    const product = listProducts.find(pr => pr.id === p.idProduct) 
    productNameCell.textContent = product.name;

    const quantityCell = document.createElement('td');
    quantityCell.textContent = p.quantity;

    const revenueCell = document.createElement('td');
    revenueCell.textContent = (p.revenue) + '$';

    const detailsCell = document.createElement('td');
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Xem chi tiết';
    detailsButton.addEventListener('click', () => showAllOrders(p.idOrders));
    detailsCell.appendChild(detailsButton);

    row.appendChild(idCell);
    row.appendChild(productNameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    row.appendChild(detailsCell);

    table.appendChild(row);
  })
}

//Hiển thị kết quả tìm kiếm
document.getElementById('show').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const topN = parseInt(document.getElementById('top-selling').value, 10);
  const totalSold = document.getElementById('total-sold');
  const totalRevenue = document.getElementById('total-revenue');
  let objectTotal = {total : 0, revenue : 0};
  
  totalSold.textContent = '';
  totalRevenue.textContent = '';

  // Lọc hóa đơn theo khoảng thời gian
  const listSearch = filterOrdersByDateRange(listOrders, startDate, endDate);
  
  if (listSearch.length === 0) {
    alert("Không có hóa đơn nào trong khoảng thời gian đã chọn.");
    return;
  }
  objectTotal = calculateTotalSalesAndRevenue(listOrders,startDate,endDate);
  console.log(objectTotal)

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
  
  const { bestSellingProducts, worstSellingProducts } = getTopProductsBySales(productCounts, topN);

  displayTopSellingProducts(bestSellingProducts,'best-selling');
  displayTopSellingProducts(worstSellingProducts,'worst-selling');
  displayProducts(productCounts);
})