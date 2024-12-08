// Thêm địa chỉ mới
 var addressData=
 {
    "id": "1111",
    "addresses": [
      {
        "street": "123 Nguyễn Trãi",
        "district": "Thanh Xuân",
        "city": "Hà Nội"
      },
      {
        "street": "456 Lê Lợi",
        "district": "Hà Đông",
        "city": "Hà Nội"
      }
    ]
  };
document.getElementById("save-address-btn").addEventListener("click", () => {
    const street = document.getElementById("popup-street").value;
    const district = document.getElementById("popup-district").value;
    const city = document.getElementById("popup-city").value;

  
    if (street && district && city) {
      const newAddress = { street, district, city };
  
      if (addressData) {
        addressData.addresses.push(newAddress);
  
        // Reset input và ẩn popup
        document.getElementById("popup-street").value = "";
        document.getElementById("popup-district").value = "";
        document.getElementById("popup-city").value = "";
        popup.style.display = "none";
        hienthi()
  
        alert("Thêm địa chỉ thành công!");
      } else {
        alert("Không tìm thấy thông tin người dùng!");
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin.");
    }
    console.log(addressData)
  });
  document.getElementById("add-address-btn").addEventListener("click",()=>{
    const form = document.getElementById("popup");
    form.style.display="block";
    

  })
  document.getElementById("close-popup-btn").addEventListener('click',()=>{
    const dong = document.getElementById("popup");
    dong.style.display="none";
  })

 function hienthi(){
    const show=document.getElementById("all-address");
    show.innerHTML = "";
    addressData.addresses.forEach(element => {
        const duong=element.street;
        const quan=element.district;
        const tinh=element.city;
        const diachi=document.createElement('div')
        diachi.innerHTML=`
        <div id="duong">${duong}</div> 
        <div id="quan">${quan}</div>
        <div id="tinh">${tinh}</div>
        `
    show.appendChild(diachi);
    });


 }

 hienthi()
