function renderResults(results, containerResults) {
  if (containerResults.hasChildNodes()) {
    containerResults.firstChild.remove();
  }

  const $resultText = document.createElement("p");
  $resultText.classList.add("results__text");
  $resultText.textContent = "Resultados: " + results;
  containerResults.appendChild($resultText);
}

function addLinksToProduct(link, product) {
  product.addEventListener("click", () => {
    window.open(link, "_blank");
  });
}

function renderProduct(imgUrl, name, state, price) {
  const template = document.querySelector(".template");
  const container = document.querySelector(".products");

  const img = template.content.querySelector(".product__img");
  img.src = imgUrl;

  const nameProduct = template.content.querySelector(".product__name");
  nameProduct.textContent = name;

  const stateProduct = template.content.querySelector(".product__state");
  if (state == "new") {
    stateProduct.textContent = "Nuevo";
  } else if (state == "used") {
    stateProduct.textContent = "Usado";
  }

  const priceProduct = template.content.querySelector(".product__price");
  priceProduct.textContent = "$" + price;

  const clone = template.content.cloneNode(true);

  container.appendChild(clone);
}

function fetchUrl(query) {
  fetch("https://api.mercadolibre.com/sites/MLA/search?q=" + query)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      const containerResults = document.querySelector(".results");

      const results = res.paging.total;
      renderResults(results, containerResults);

      res.results.map((i) => {
        const img = i.thumbnail;
        const productName = i.title;
        const productState = i.condition;
        const productPrice = i.price;

        renderProduct(img, productName, productState, productPrice);
      });
      return res;
    })
    .then((res) => {
      const $products = document.querySelectorAll(".product");

      res.results.map((i, index) => {
        const $product = $products[index];
        const link = i.permalink;

        addLinksToProduct(link, $product);
      });
    });
}

function deleteProducts() {
  const $products = document.querySelectorAll(".product");
  $products.forEach(($product) => {
    $product.remove();
  });
}

function main() {
  const $form = document.querySelector(".form");
  $form.addEventListener("submit", (e) => {
    e.preventDefault();

    const $contProducts = document.querySelector(".products");
    if ($contProducts.querySelector(".product")) {
      deleteProducts();
    }

    const query = e.target.input.value;
    fetchUrl(query);
  });
}
main();
