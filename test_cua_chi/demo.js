
function closeDanhMucTrai(){
    var timkiem = document.getElementById("filter-bar");
    var loc = document.getElementById("filter-bar-main");
    var danhmuctrai = document.getElementById("categoryid");
    let t = document.getElementById("productid");
    let product =  document.getElementById("product");
    let gridRows = document.querySelectorAll(".grid_row");
    if (getComputedStyle(timkiem).display === "none" && getComputedStyle(loc).display === "flex"){
        timkiem.style.display = "flex";
        loc.style.display = "none";
        danhmuctrai.style.display = "none";
        t.style.width = "100%";
        product.style.display = "flex";
        product.style.justifyContent = "center";
        if (gridRows.length >= 2) {
            let secondRow = gridRows[1];
            secondRow.style.width = "83.334%";
        }
    }
}

function filterbar(){
    let danhmuctrai = document.getElementById("categoryid");
    let t = document.getElementById("productid");
    let product =  document.getElementById("product");
    let gridRows = document.querySelectorAll(".grid_row");
    if (getComputedStyle(danhmuctrai).display !== "block"){
        t.style.width = "100%";
        product.style.display = "flex";
        product.style.justifyContent = "center";
        if (gridRows.length >= 2) {
            let secondRow = gridRows[1];
            secondRow.style.width = "83.334%";
        }
    }
        

}

const listImg = [
	'S1.jpg',
	'S2.jpg',
	'S1.jpg',
	'S3.jpg',
];

let next = document.querySelector('.slide-show .next');
let prev = document.querySelector('.slide-show .prev');
let imgWrap = document.querySelector('.slide .img-wrap img');
let thumbnails = document.querySelectorAll('.thumbnail');

let currentIndex = 0;

function setCurrent(index) {
	currentIndex = index;
	imgWrap.src = listImg[currentIndex];

	thumbnails.forEach((thumbnail) => thumbnail.classList.remove('active'));

	thumbnails[currentIndex].classList.add('active');
}

thumbnails.forEach((thumbnail) => {
	thumbnail.addEventListener('click', () => {
		const index = parseInt(thumbnail.dataset.index, 10);
		setCurrent(index);
		resetAutoSlide();
	});
});

next.addEventListener('click', () => {
	currentIndex = (currentIndex + 1) % listImg.length;
	setCurrent(currentIndex);
	resetAutoSlide();
});

prev.addEventListener('click', () => {
	currentIndex = (currentIndex - 1 + listImg.length) % listImg.length;
	setCurrent(currentIndex);
	resetAutoSlide();
});

let autoSlideInterval = setInterval(() => {
	currentIndex = (currentIndex + 1) % listImg.length;
	setCurrent(currentIndex);
}, 3000);

function resetAutoSlide() {
	clearInterval(autoSlideInterval);
	autoSlideInterval = setInterval(() => {
		currentIndex = (currentIndex + 1) % listImg.length;
		setCurrent(currentIndex);
	}, 3000);
}

setCurrent(currentIndex);

