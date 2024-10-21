const carouselWrapper = document.querySelector('.carousel-wrapper');
const reviews = document.querySelectorAll('.review');
let currentIndex = 0;
let startPosition = 0;
let isDragging = false;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
const reviewWidth = reviews[0].clientWidth;
let autoScrollInterval; 


reviews.forEach((review) => {
  review.addEventListener('contextmenu', (e) => {
    e.preventDefault(); 
  });
});

carouselWrapper.addEventListener('touchstart', touchStart);
carouselWrapper.addEventListener('touchmove', touchMove);
carouselWrapper.addEventListener('touchend', touchEnd);

carouselWrapper.addEventListener('mousedown', touchStart);
carouselWrapper.addEventListener('mousemove', touchMove);
carouselWrapper.addEventListener('mouseup', touchEnd);
carouselWrapper.addEventListener('mouseleave', touchEnd);

function touchStart(event) {
  isDragging = true;
  startPosition = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  clearInterval(autoScrollInterval); 
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = previousTranslate + currentPosition - startPosition;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;

  const movedBy = currentTranslate - previousTranslate;

  if (movedBy < -50) {
    currentIndex = (currentIndex + 1) % reviews.length; 
  } else if (movedBy > 50) {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length; 
  }

  setPositionByIndex();
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setCarouselPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setCarouselPosition() {
  carouselWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -reviewWidth;
  previousTranslate = currentTranslate;
  carouselWrapper.style.transition = 'transform 0.5s ease-in-out'; 
  setCarouselPosition();
}
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