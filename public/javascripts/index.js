// Display and hide new post form body
const showForm = () => {
  const formBody = document.querySelector(".newPostFormBody");
  formBody.classList.toggle("showForm");
  const icon = document.getElementById("formToggle");
  console.log(icon);
  if (icon.src.endsWith("/down.svg")) {
    icon.src = "/imgs/up.svg";
  } else if (icon.src.endsWith("/up.svg")) {
    icon.src = "/imgs/down.svg";
  }
};

const formToggle = document.querySelector("#formToggle");
formToggle.addEventListener("click", showForm);
