const formEl = document.querySelector(".short-link-form");
const inputEl = formEl.querySelector(".short-link-input");
const outputEl = document.querySelector(".short-link-output");
const sectionShortEl = document.querySelector(".section-short-link");
const errTextEl = document.querySelector(".err-text");
// Nav
const headerEl = document.querySelector(".header");
const btnMobileNavEl = document.querySelector(".btn-mobile-nav");

const showErr = function (msg) {
  formEl.classList.add("short-link-err");
  errTextEl.textContent = msg;
};

const shortLinkAPI = async function (orgLink) {
  try {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${orgLink}`);
    const data = await res.json();
    if (!data.ok) {
      throw new Error(data.error);
    }
    return data.result;
  } catch (err) {
    throw err;
  }
};

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!checkInput()) return;
  const orgLink = inputEl.value;

  shortLinkAPI(orgLink)
    .then((data) => {
      sectionShortEl.style.paddingBottom = "14rem";
      const outMarkup = `
    <div class="output">
      <p class="original-link">${data.original_link}</p>
      <p class="output-link">${data.full_short_link}</p>
      <button class="btn btn-copy">Copy</button>
    </div>
  `;
      outputEl.classList.add("output-show");
      outputEl.insertAdjacentHTML("afterbegin", outMarkup);

      document
        .querySelector(".btn-copy")
        .addEventListener("click", function (e) {
          navigator.clipboard.writeText(data.full_short_link);
          this.textContent = "Copied!";
          this.style.backgroundColor = "hsl(257, 27%, 26%)";

          setTimeout(() => {
            this.style.backgroundColor = "hsl(180, 66%, 49%)";
            this.textContent = "Copy";
          }, 2000);
        });
    })
    .catch((err) => {
      showErr(err);
    });
});

function checkInput() {
  if (inputEl.value === "") {
    showErr("Please add a link");
    return false;
  }
  return true;
}

inputEl.addEventListener("input", function () {
  formEl.classList.remove("short-link-err");
});

outputEl.addEventListener("click", function (e) {
  const btnCopy = e.target.closest("btn-copy");
  if (!btnCopy) return;
  navigator.clipboard.writeText();
});

btnMobileNavEl.addEventListener("click", function (e) {
  headerEl.querySelector(".main-nav").classList.remove("icon-click");
  headerEl.classList.toggle("nav-open");
});
