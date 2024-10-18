const carouselWrapper = document.querySelector('.carousel-wrapper');
const reviews = document.querySelectorAll('.review');
let currentIndex = 0;
let startPosition = 0;
let isDragging = false;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
const reviewWidth = reviews[0].clientWidth;
let autoScrollInterval; // For auto-scroll timer

// Disable right-click on reviews
reviews.forEach((review) => {
  review.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent the right-click menu
  });
});

// Touch event handlers
carouselWrapper.addEventListener('touchstart', touchStart);
carouselWrapper.addEventListener('touchmove', touchMove);
carouselWrapper.addEventListener('touchend', touchEnd);

// Mouse event handlers (for desktop)
carouselWrapper.addEventListener('mousedown', touchStart);
carouselWrapper.addEventListener('mousemove', touchMove);
carouselWrapper.addEventListener('mouseup', touchEnd);
carouselWrapper.addEventListener('mouseleave', touchEnd);

function touchStart(event) {
  isDragging = true;
  startPosition = getPositionX(event);
  animationID = requestAnimationFrame(animation);
  clearInterval(autoScrollInterval); // Stop auto-scroll when user interacts
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

  // Calculate how far the user swiped, and determine the next or previous review
  const movedBy = currentTranslate - previousTranslate;

  if (movedBy < -50) {
    currentIndex = (currentIndex + 1) % reviews.length; // Loop forward
  } else if (movedBy > 50) {
    currentIndex = (currentIndex - 1 + reviews.length) % reviews.length; // Loop backward
  }

  setPositionByIndex();
  //startAutoScroll(); // Resume auto-scroll after user interaction ends
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
  // Snap to the nearest review
  currentTranslate = currentIndex * -reviewWidth;
  previousTranslate = currentTranslate;
  carouselWrapper.style.transition = 'transform 0.5s ease-in-out'; // Add smooth snapping effect
  setCarouselPosition();
}

// Auto Slide function
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % reviews.length; // Loop forward automatically
    setPositionByIndex();
  }, 10000); // Auto-scroll every 5 seconds
}

// Start the auto-scroll initially
//startAutoScroll();
