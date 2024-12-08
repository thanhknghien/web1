const isLogin = JSON.parse(localStorage.getItem('isLogIn'));
const address = JSON.parse(localStorage.getItem('user-address')) || [];
const carts = JSON.parse(localStorage.getItem('cart')) || [];
const products = JSON.parse(localStorage.getItem('product')) || [];
const oders = JSON.parse(localStorage.getItem('oder')) || [];
let cartuser = null;
function showCreditCardForm(){
  document.getElementById("credit-card-form").style.display="block";

}
function dongform(){
  
  document.getElementById("credit-card-form").style.display="none";
}

function TaoHoaDon(e){

  var newhoadon = {
    idOder: "",
    idCustomer: "",
    listProduct: [],
    totalQuantity: "",
    total: "",
    payment: "",
    address: {},
    date: "",
    status: ""
  }
  newhoadon.idOder =generateInvoiceID();
  newhoadon.idCustomer=isLogin;
  newhoadon.payment =e;
  newhoadon.date=getCurrentDate();
  console.log(newhoadon.date)
  if(e==='Thẻ tín dụng'||e==='Chuyển Khoản'){
    newhoadon.status='Đang xử lý';

  }
else {
  newhoadon.status='Chưa thanh toán';
}

  
}
function generateInvoiceID() {
  // Tạo số ngẫu nhiên từ 1000 đến 9999
  return Math.floor(1000 + Math.random() * 9000);
}
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Lấy ngày (2 chữ số)
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Lấy tháng (2 chữ số, tháng bắt đầu từ 0)
  const year = today.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
}


