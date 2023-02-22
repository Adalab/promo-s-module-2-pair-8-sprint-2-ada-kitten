'use strict';


/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const inputRace = document.querySelector('.js-input-race');
const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_search_race = document.querySelector ('.js_in_search_race');


//Objetos con cada gatito
const kittenData_1 = {
    image: "https://dev.adalab.es/gato-siames.webp",
    name: "Anastacio",
    desc: "Porte elegante, su patrón de color tan característico y sus ojos de un azul intenso, pero su historia se remonta a Asia al menos hace 500 años, donde tuvo su origen muy posiblemente.",
    race: "Siamés",
};
const kittenData_2 = {
    image: "https://dev.adalab.es/sphynx-gato.webp",
    name: "Fiona",
    desc: "Produce fascinación y curiosidad. Exótico, raro, bello, extraño… hasta con pinta de alienígena han llegado a definir a esta raza gatuna que se caracteriza por la «ausencia» de pelo.",
    race: "Sphynx",
};
const kittenData_3 = {
    image: "https://dev.adalab.es/maine-coon-cat.webp",
    name: "Cielo",
    desc: " Tienen la cabeza cuadrada y los ojos simétricos, por lo que su bella mirada se ha convertido en una de sus señas de identidad. Sus ojos son grandes y las orejas resultan largas y en punta.",
    race: "Maine Coon",
};

//Funciones
/* function renderKitten(kittenData) {
    const kitten = `<li class="card">
    <article>
      <img
        class="card_img"
        src=${kittenData.image}
        alt="gatito"
      />
      <h3 class="card_title">${kittenData.name}</h3>
      <h3 class="card_race">${kittenData.race}</h3>
      <p class="card_description">
      ${kittenData.desc}
      </p>
    </article>
    </li>`;
    return kitten;
} */

function renderKitten(kittenData) {
  const liElement = document.createElement('li');
  liElement.classList.add('list');
  const articleElement = document.createElement('article');
  const imgElement = document.createElement('img');
  imgElement.classList.add('card_img');
  imgElement.setAttribute("src", kittenData.image);
  imgElement.setAttribute("alt", "gatito"); 
  const h3NameElement = document.createElement('h3');
  h3NameElement.classList.add('card_title');
  const title = document.createTextNode(kittenData.name);
  const h3RaceElement = document.createElement('h3');
  h3RaceElement.classList.add('card_race');
  const raceTitle = document.createTextNode(kittenData.race);
  const pElement = document.createElement('p');
  pElement.classList.add('card_description');
  const textForDesc = document.createTextNode(kittenData.desc);

  articleElement.appendChild(imgElement);
  articleElement.appendChild(h3NameElement);
  h3NameElement.appendChild(title);
  articleElement.appendChild(h3RaceElement);
  h3RaceElement.appendChild(raceTitle);
  articleElement.appendChild(pElement);
  pElement.appendChild(textForDesc);
  liElement.appendChild(articleElement);
  console.log(liElement);

  return liElement;
}


let kittenListStored = JSON.parse(localStorage.getItem('kittensList'));
const GITHUB_USER = 'lauramorenochico';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

let kittenDataList = [];

if (kittenListStored) {
  kittenListStored=kittenDataList;
  renderKittenList(kittenDataList);
 
} else {
  fetch(SERVER_URL, {
  method: 'GET',
  headers: {'Content-Type': 'application/json'},
}).then((response) => response.json())
.then((data) => {
    console.log(data)
    kittenDataList = data.results;
    renderKittenList(kittenDataList);
}
)
 .catch((error) => {
      console.error(error);
    });
}

function renderKittenList(kittenDataList) {
    listElement.innerHTML = "";
    for (const kittenItem of kittenDataList) {
        const newLiItem = renderKitten(kittenItem);
        listElement.appendChild(newLiItem);
    } 
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
    newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
    newFormElement.classList.add('collapsed');
}

function handleClickNewCatForm(event) {
    event.preventDefault();
    if (newFormElement.classList.contains('collapsed')) {
        showNewCatForm();
    } else {
        hideNewCatForm();
    }
}
//Adicionar nuevo gatito

function addNewKitten(event) {
    event.preventDefault();
    
    // Creamos objeto <- guardar llos campos del gatito
    const newKittenDataObject = {
        name: inputName.value,
        desc: inputDesc.value,
        image: inputPhoto.value,
        race: inputRace.value,
    };

    if (newKittenDataObject.desc === "" || newKittenDataObject.image === ""|| newKittenDataObject.name === "" || newKittenDataObject.race === "") {
        // No lo ha rellenado
        labelMessageError.innerHTML = "¡Uy! parece que has olvidado algo";
    }
    else {
        // Si que lo ha rellenado
        // Mandar los datos al servidor
         fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newKittenDataObject),
            })
            .then(response => response.json())
            .then(data => {
                 if (data.success) {
                    // push
                    kittenDataList.push(newKittenDataObject);
                    localStorage.setItem('kittensList', JSON.stringify(kittenDataList));
                    
                    labelMessageError.innerHTML = 'Mola! Un nuevo gatito en Adalab!';
                    // Vaciar el formulario
                    inputDesc.value = "";
                    inputPhoto.value = "";
                    inputName.value = ""; 
                    inputRace.value = "";

                    // renderGattios
                    renderKittenList(kittenDataList); 
                 }
                 else {
                    labelMessageError.innerHTML = 'Ha habido un problema en el servidor';
                 }
            });
    }
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
    event.preventDefault();
    newFormElement.classList.add("collapsed");
    inputDesc.value = "";
    inputPhoto.value = "";
    inputName.value = ""; 
    inputRace.value = "";
}

//Filtrar por descripción
//Haz un filter sobre el listado de gatitos
//Haz un filter anidado sobre el listado de gatitos
//queremos que la búsqueda no le afecten las mayúsculas
//Vuelve a pintar el listado de gatitos filtrados en el HTML (renderKittenList (kittenListFiltered);
//detrás de la flecha del segundo filtro como no queremos includes ponemos la variable === '' ||
function filterKitten(event) {
    event.preventDefault();
    const descrSearchText = input_search_desc.value.toLowerCase();
    const raceSearchText= input_search_race.value.toLowerCase();
    listElement.innerHTML = "";   
    const kittenListFiltered = kittenDataList.filter((kitten) => kitten.desc.toLowerCase().includes(descrSearchText)).filter((kitten) => raceSearchText === '' || kitten.race.toLowerCase() === raceSearchText );
    renderKittenList (kittenListFiltered);
     
}

//Mostrar el listado de gatitos en el HTML
renderKittenList(kittenDataList);

//Eventos
linkNewFormElememt.addEventListener("click", handleClickNewCatForm);
searchButton.addEventListener("click", filterKitten);
buttonAdd.addEventListener("click", addNewKitten);
buttonCancelForm.addEventListener("click", cancelNewKitten);






