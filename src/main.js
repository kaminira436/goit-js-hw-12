import "./styles.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0;

hideLoadMoreButton();

// 🔍 ПОШУК
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  query = event.target.elements["search-text"].value.trim();

  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    if (data.hits.length === 0) {
      iziToast.warning({
        message:
          "Sorry, there are no images matching your search query.",
      });
      return;
    }

    totalHits = data.totalHits;

    createGallery(data.hits);

    if (page * 15 < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();

      iziToast.info({
        message:
          "We're sorry, but you've reached the end of search results.",
      });
    }

  } catch {
    iziToast.error({
      message: "Something went wrong.",
    });
  } finally {
    hideLoader();
  }
});

// 🔄 LOAD MORE
loadMoreBtn.addEventListener("click", async () => {
  page++;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);

    createGallery(data.hits);

    const card = document
      .querySelector(".gallery-item")
      .getBoundingClientRect();

    window.scrollBy({
      top: card.height * 2,
      behavior: "smooth",
    });

    if (page * 15 < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();

      iziToast.info({
        message:
          "We're sorry, but you've reached the end of search results.",
      });
    }

  } catch {
    iziToast.error({
      message: "Error loading more images",
    });
  } finally {
    hideLoader();
  }
});