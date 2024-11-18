fetch("../resource/user.json")
.then((response) => response.json())
.then((data) => {
  localStorage.setItem("user", JSON.stringify(data));
})

