const user = [
  {
    id: '002',
    username : 'thanhknghien',
    name : 'Thành Đinh',
    email : 'thanh2005dinh@gmail.com',
    sdt : '09876453',
    address : 'q8',
    sex : 'male',
    birthday : '12/5/2000',
    status : 'Khóa'
  },
  {
    id : '001',
    username : 'thanh rat ngu',
    name : 'thành bị khùng',
    email : 'thanh k ció',
    sdt : 'k có đâu',
    address : 'q chín',
    sex : 'male',
    birthday : '12/2/2004',
    status: 'Hoạt động'
  }
]

function loadUser(index){
  const u = user[index];
  
  document.getElementById('username').textContent = u.username
  document.getElementById('name').textContent = u.name
  document.getElementById('email').textContent = u.email
  document.getElementById('sdt').textContent = u.sdt
  document.getElementById('address').textContent = u.address
  document.getElementById('sex').textContent = u.sex
  document.getElementById('birthday').textContent = u.birthday
  document.getElementById('status').textContent = u.status

}

document.addEventListener("DOMContentLoaded", loadUser(1));