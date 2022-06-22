let cart = []; // carrinho
let modalQt = 1; // quantidade da pizza definida quando o modal é aberto
let modalKey; // chave da pizza referente ao modal

const c = (el) => document.querySelector(el);
const all = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
  let pizzaItem = c(".pizza-item").cloneNode(true); // clonando a classe pizza-item dentro da div models.

  pizzaItem.setAttribute("data-key", index);
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--price").innerHTML =
    "R$ " + item.price.toFixed(2);
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    openModal();
    let key = e.target.closest(".pizza-item").getAttribute("data-key"); // função 'closest' pega o atributo mais próximo com a classe 'pizza-item'.
    modalQt = 1;
    modalKey = key;

    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2
    )}`;
    c(".pizzaInfo--size.selected").classList.remove("selected"); // removendo a classe selected do modal.

    // ao selecionar mais de uma classe como o caso abaixo é retornado um array, por isso uso do forEach
    all(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected"); // adicionando a classe selected no segundo item dos tamanhos selecionado na classe 'pizza-Info--size'.
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]; // passando os tamanhos para o modal, os tamanhos estão em um array, por isso o uso do index.
    });

    c(".pizzaInfo--qt").innerHTML = modalQt;
  });

  // preencher as informações em pizzaitem
  c(".pizza-area").append(pizzaItem); // adicionando pizzaItem na classe .pizza-area.
});

// modal
// função para abrir o modal.
function openModal() {
  let modal = c(".pizzaWindowArea");

  modal.style.opacity = "0";
  modal.style.display = "flex";
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 200);
}

// função para fechar o modal.
function closeModal() {
  let modal = c(".pizzaWindowArea");

  modal.style.opacity = "0";
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
}

// selecionamos mais de uma classe, isso nos devolve um array, por isso o uso do forEach.
all(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

// Diminuir o número de pizza ao clicarmos no sinal de - no modal.
c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt -= 1;
    c(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

// Acrescentar o número de pizza ao clicarmos no sinal de + no modal.
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt += 1;
  c(".pizzaInfo--qt").innerHTML = modalQt;
});

// Selecionar o tamanho da pizza, e marcar o mesmo com a classe 'selected'.
all(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", () => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected"); // size para garantir que estou selecionando o item.
  });
});

// adicionar um identificador na pizza, e adicionar a pizza no carrinho.
c(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = c(".pizzaInfo--size.selected").getAttribute("data-key");
  let identificador = pizzaJson[modalKey].id + "@" + size;
  let key = cart.findIndex((item) => item.identificador == identificador);

  if (key > -1) {
    cart[key].qtd += modalQt;
  } else {
    cart.push({
      identificador,
      id: pizzaJson[modalKey].id,
      size,
      qtd: modalQt,
    });
  }
  updateCart();
  closeModal();
});

c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = "0";
  }
});

c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vh";
});

function updateCart() {
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      subtotal += pizzaItem.price * cart[i].qtd;

      let cartItem = c(".models .cart--item").cloneNode(true);
      cartItem.querySelector("img").src = pizzaItem.img;

      let pizzaSizeName;

      if (cart[i].size == 0) {
        pizzaSizeName = "P";
      } else if (cart[i].size == 1) {
        pizzaSizeName = "M";
      } else {
        pizzaSizeName = "G";
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qtd;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qtd > 1) {
            cart[i].qtd--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qtd++;
          updateCart();
        });

      c(".cart").append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vh";
  }
}
