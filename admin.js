function showCar(carClass) {
    // Ẩn tất cả danh sách xe
    var items = document.querySelectorAll('.list-car ul');
    items.forEach(function(item) {
        item.classList.remove('active');
    });

    // Hiển thị danh sách xe được chọn
    var selectedItem = document.querySelector('.' + carClass);
    selectedItem.classList.add('active');

    // Cập nhật trạng thái active cho tab
    var tabs = document.querySelectorAll('.tab li');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelector('.tab-item' + carClass.charAt(carClass.length - 1)).classList.add('active');
}

function changeImg(picId) {
    alert("You clicked on " + picId); // Thay đổi điều gì xảy ra khi người dùng nhấn vào ảnh
}

// Hiển thị mặc định tab đầu tiên
document.addEventListener("DOMContentLoaded", function() {
    showCar('item1');
});
function changeImg(path){
    var overlay = document.getElementById('imageOverlay');
    var largeImage = document.getElementById('largeImage');
    largeImage.src = path;
    overlay.style.display = 'flex'; // Hiển thị lớp phủ
}
function closeOverlay() {
    document.getElementById('imageOverlay').style.display = 'none';
}