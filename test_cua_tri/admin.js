const loginBtn = document.getElementById('login-btn');
        const loginFormContainer = document.getElementById('login-form-container');

        // Hàm hiển thị/ẩn form đăng nhập
        function toggleLoginForm() {
            loginFormContainer.classList.toggle('show');
        }

        // Lắng nghe sự kiện click vào nút Đăng Nhập
        loginBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn chuyển hướng mặc định
            toggleLoginForm(); // Hiển thị form đăng nhập
        });