const dishes = [
  {
    name: "Борщ со сметаной",
    image: "assets/borscht.svg",
    alt: "Тарелка красного борща со сметаной и зеленью",
  },
  {
    name: "Пицца Маргарита",
    image: "assets/pizza.svg",
    alt: "Круглая пицца Маргарита с сыром, томатами и базиликом",
  },
  {
    name: "Спагетти Болоньезе",
    image: "assets/spaghetti.svg",
    alt: "Тарелка спагетти с мясным соусом болоньезе",
  },
  {
    name: "Роллы Филадельфия",
    image: "assets/sushi.svg",
    alt: "Два ролла Филадельфия с лососем сверху",
  },
  {
    name: "Тако с говядиной",
    image: "assets/tacos.svg",
    alt: "Тако с говядиной, салатом, томатами и сыром",
  },
  {
    name: "Овощной салат",
    image: "assets/salad.svg",
    alt: "Миска овощного салата с зеленью и томатами",
  },
  {
    name: "Шашлык из курицы",
    image: "assets/shashlik.svg",
    alt: "Шашлык из курицы на шампурах с луком",
  },
  {
    name: "Шоколадный десерт",
    image: "assets/dessert.svg",
    alt: "Шоколадный торт с кремовой прослойкой и вишней",
  },
];

const lunchImage = document.getElementById("lunch-image");
const lunchName = document.getElementById("lunch-name");
const card = document.querySelector(".card");
const button = document.getElementById("generate-button");
const menuList = document.getElementById("menu-list");

for (const dish of dishes) {
  const item = document.createElement("li");
  item.textContent = dish.name;
  menuList.appendChild(item);
}

function generateLunch() {
  const index = Math.floor(Math.random() * dishes.length);
  const dish = dishes[index];

  lunchImage.src = dish.image;
  lunchImage.alt = dish.alt;
  lunchImage.classList.remove("hidden");
  lunchName.textContent = dish.name;

  card.classList.remove("pop");
  void card.offsetWidth;
  card.classList.add("pop");
}

button.addEventListener("click", generateLunch);