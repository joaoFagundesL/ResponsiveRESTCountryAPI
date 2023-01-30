let body = document.querySelector('body'); // Body element to manipulate throughout the code
let containerCountry = document.querySelector('.container-country'); // This my grid section

const headerMode = document.querySelector('.header-mode');
headerMode.addEventListener(('click'), ()=> {
    let p = headerMode.querySelector('p');
    let imgDark = headerMode.querySelector('.dark-icon');
    let imgLight = headerMode.querySelector('.light-icon');

    imgDark.classList.toggle('icon-hide');
    imgLight.classList.toggle('icon-hide');

    if(imgDark.classList.contains('icon-hide')) {
        p.textContent = "Light Mode";
        
    } else {
        p.textContent = "Dark Mode";
    }

    body.classList.toggle('dark-mode');
});



// || When the user first opens the page all countries will be showed
let promiseAllCountries = getResponseAllCountries();
promiseAllCountries.then((data) => {
    showAll(data);
    handleClickCountry(); 
});


let inputText = document.querySelector('.input-text');
inputText.addEventListener('input', async () => { // Here is an event of input, it means I'll watch every letter 
    let optionField = handleChange(); // Getting the actual value of the <option></option>
    let userCountryName = inputText.value; // Getting each letter given by the user

    try {
        if(optionField.value == 0 && userCountryName != "") { 
            let data = await getResponseName(userCountryName); 
            removePreviousCountries();
            showPerEachLetter(data); 
            
        }
        
        else if(inputText.value == "" && optionField.value == 0) {
            let data = await getResponseAllCountries();  
            removePreviousCountries();
            showAll(data);
        }
    
        else if(optionField != 0 && inputText.value == "") {
            
            let data = await getResponseByRegionName(optionField.text);
            removePreviousCountries();
            showPerRegion(data);
            
        }
    
        else if(optionField.value != 0) {
            let data = await getResponseName(inputText.value);
            removePreviousCountries();
            data = data.filter((e) => e.region == optionField.text);
            data.forEach((e) => {  
                setCardVisual(e) ;
                 
            } );
        }
    } catch(e) {
        console.log(e);
    }

    handleClickCountry();
});

/* || Here I'm searching for the region and returning the option so that I can filter */
let select = document.querySelector('.select-menu');
select.addEventListener('change', handleChange);
function handleChange() { /* This function will return my <option></option> */
    let optionField = select.options[select.selectedIndex]; /* Getting the option itself */
    return optionField; /* From here, I can get the value and the region name */
}

/* || Every time the user select a new region option I will display the information on change */
select.addEventListener('change', async () => {
    inputText.value = "";
    let optionField = select.options[select.selectedIndex]; // This is the <option>Some text</option>

    removePreviousCountries(); // removing all information to display the new one

    if(optionField.value == 0) { // If the selected option is 0 I'll show all countries
        let data = await getResponseAllCountries();
        showAll(data);
    }

    else { // If the user is filtering I will search by region
        let data = await getResponseByRegionName(optionField.text);
        showPerRegion(data);
    }

    handleClickCountry();
});


function setCardVisual(countryData) {
    let officialName = countryData.name.official; // Storing the official name
    let population = countryData.population; // Storing the population
    let imageUrl = countryData.flags.svg; // Storing the image >>SVG<<
    let region = countryData.region;

    // Now I'll create the following structure

    /* 
        <div class="div-country">           (1)
            <img src="">                    (2)
            <div class="div-info">          (3)
                <h2></h2>                   (4)
                <p class="population"></p>  (5)
                <p class="region"></p>      (6)
                <p class="capital"></p>     (7)
            </div>
        </div>
    */
    let divElement = document.createElement('div'); // (1)

    imgCreate(imageUrl, divElement);        //(2)
    let secondDiv = internalDivCreate(divElement); // (3)

    titleCreate(secondDiv, officialName);           // (4)

    populationCreate(secondDiv, population); //(5)
    regionCreate(secondDiv, region); //(6)
    setDivElement(divElement);

    // (7)
    if(countryData.capital != undefined) { // I notice the API has one capital that is undefined, so here I'll check it
        let capitalArray = countryData.capital;
        let capitalElement = document.createElement('p');
        capitalElement.classList.add('capital');
        capitalElement.textContent = capitalArray.join(', '); // there is some countries with more than one capital, so I'm gonna split them
        secondDiv.appendChild(capitalElement); // just adding some classes and making an append
    }
  
}

/* || This part is very important, it seems that two functions below are the same, however the data parameter is diferent
    because this data come from a promise  
*/
function showPerRegion(data) {
    data.forEach((e) => {
        setCardVisual(e); 
    })
}

function showAll(data) {
    data.forEach((e) => {
        setCardVisual(e);
    });
}

function showPerEachLetter(data) {
    data.forEach((e) => {
        setCardVisual(e);
    });
}

/* || Remove previous, when the user select a new region all the cards will be replaced */
function removePreviousCountries() {
    let divCountry = document.querySelectorAll('.div-country'); // Getting all the divs (all the cards)

    if(divCountry.length == 0) { // If there is any div
        return;
    }

    divCountry.forEach((e) => { // removing each element 
        e.remove();
    });
}

// || Creating elements
// This function will create the most important div where the content is gonna be.
function setDivElement(divElement) {
    divElement.classList.add('div-country');
    body.appendChild(divElement);
    containerCountry.appendChild(divElement);
}

// Creating the region when the user select a region filter 
function regionCreate(secondDiv, region) {
    let regionElement = document.createElement('p');
    regionElement.textContent = region;
    regionElement.classList.add('region');
    secondDiv.appendChild(regionElement);
}

// Creating the population info
function populationCreate(secondDiv, population) {
    let populationElement = document.createElement('p');
    populationElement.textContent = population;
    populationElement.classList.add('population');
    secondDiv.appendChild(populationElement);
}

// Creating the country name
function titleCreate(secondDiv, officialName) {
    let titleElement = document.createElement('h2');
    titleElement.textContent = officialName;
    secondDiv.appendChild(titleElement);
}

// This function will create the internal div that holds information about population, region...
function internalDivCreate(divElement) {
    let secondDiv = document.createElement('div');
    secondDiv.classList.add('div-info');
    divElement.appendChild(secondDiv);
    return secondDiv;
}

// Creating the country image
function imgCreate(imageUrl, divElement) {
    let imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    divElement.appendChild(imgElement);
}

function displayLoading() {
    const loader = document.querySelector('.loading');
    loader.classList.add('display');
    setTimeout(() => {
        loader.classList.remove('display');
    }, 5000);
}

function hideLoading() {
    const loader = document.querySelector('.loading');
    loader.classList.remove('display');
}

function handleClickCountry() {
    let containerCountry = document.querySelector('.container-country');
    let oneCountry = document.querySelector('.one-country');
    let back = document.querySelector('.back');

    setTimeout(() => {
        let divCountry = document.querySelectorAll('.div-country');
    
        divCountry.forEach((e) =>{
            e.addEventListener('click', async () => {
                let countryName = e.children[1].children[0].innerText;
                
                inputText.classList.add('hide');
                showOneCountrySection(containerCountry, oneCountry, e);
                let data = await getResponseByCountryName(countryName);
                
                displaySectionClick(data);
                
            });
        });

        back.addEventListener(('click'), () => {
            handleBack(containerCountry, oneCountry);
        });
    }, 100);
    
}

function showOneCountrySection(containerCountry, oneCountry) {
    const sectionValues = document.querySelector('.user-values');
    sectionValues.classList.add('hide');
    containerCountry.classList.add('hide');
    select.classList.add('hide');
    oneCountry.classList.remove('hide');
}

function handleBack(containerCountry, oneCountry) {
    const sectionValues = document.querySelector('.user-values');
    sectionValues.classList.remove('hide');
    let img = document.querySelector('.one-country-infos div img');
    inputText.classList.remove('hide');
    img.removeAttribute('src', "");
    img.classList.add('blur');
    img.classList.remove('noblur');
    containerCountry.classList.remove('hide');
    oneCountry.classList.add('hide');
    select.classList.remove('hide');
    removeBorders();
    removeCurrencies();
}

function displaySectionClick(data) {
    let imgUrl = data[0].flags.svg;
    let img = document.querySelector('.one-country-infos div img');
    
    img.onload = function() {
        img.classList.add('noblur');
        img.classList.remove('blur');
    }

    setTimeout(function() {
        img.src = imgUrl;
    }, 50);

    setCapital(data);
    setLanguages(data);
    setCurrencies(data)
    setBorders(data);
   
    updateData(data[0]);
}

function updateData(data) {
    document.querySelector('.column-1 li .population').textContent = data.population;
    document.querySelector('.column-1 li .region').textContent =  data.region;
    document.querySelector('.column-1 li .subregion').textContent =  data.subregion;
    document.querySelector('.column-1 li .common').textContent =  data.name.common;
    document.querySelector('.country-name').textContent = data.name.official;
}

function setCapital(data) {
    let capitalElement = document.querySelector('.capitals');

    if(data[0].capital != undefined) {
        capitalElement.textContent = data[0].capital.join(', ');
    } else {
        capitalElement.textContent = "";
    }

}

function setLanguages(data) {
    if(data[0].languages != undefined) {
        document.querySelector('.column-2 li .languages').textContent = Object.values(data[0].languages).join(', ');
    } else {
        document.querySelector('.column-2 li .languages').textContent = "";
    }
}

function setCurrencies(data) {
    currenciesObj = data[0].currencies;
    let arrCurrencies = [];
    for(key in currenciesObj) {
        currName = currenciesObj[key].name;
        arrCurrencies.push(currName);
        document.querySelector('.column-2 li .currencies').textContent = arrCurrencies.join(',')
    }
}

function setBorders(data) {
    arrayBorder = data[0].borders;
    let ulBorder = document.querySelector('.div-border-countries ul');
    if(arrayBorder != undefined) {
        arrayBorder.forEach((e) => {
            let liBorder = document.createElement('li');
            ulBorder.appendChild(liBorder);
            let a = document.createElement('a');
            liBorder.appendChild(a);
            a.textContent = e;
            a.classList.add('link-border')
        });
    } else {
        removeBorders();
    }

    const borders = document.querySelectorAll('.div-border-countries ul li');
    borders.forEach((element) => {
        element.addEventListener(('click'), async ()=> {
            removeBorders();
            let country = await getResponseByCode(element.textContent);
            displaySectionClick(country);
        });
    });
}

function removeCurrencies() {
    document.querySelector('.column-2 li .currencies').textContent = "";
}

function removeBorders() {
    let ulBorder = document.querySelector('.div-border-countries ul');
    ulBorder.innerHTML = "";
}

/* || Setting the API */ 
// Async function that will return a promise
async function getResponseByCountryName(countryName) { // take as a parameter the country name
    displayLoading();
	const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`); // setting the url of the API
    if(response.status != 200) {
        console.error('error fetching');
    } else {
        const data = await response.json();
        hideLoading();
        return data;
    }
}

async function getResponseByRegionName(regionName) { // this function is very similar to the other, but here I'm getting the countries according to the region  
    displayLoading();
    const response = await fetch(`https://restcountries.com/v3.1/region/${regionName}`);
    if(response.status != 200) {
        console.error('error fetching');
    } else {
        const data = await response.json();
        hideLoading();
        return data;
    }
}

async function getResponseAllCountries() {
    displayLoading();
    const response = await fetch(`https://restcountries.com/v3.1/all`)
    if(response.status != 200) {
        console.error('error fetching');
    } else {
        const data = await response.json();
        hideLoading();
        return data;
    }
}

async function getResponseName(countryName) {
    displayLoading();
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if(response.status != 200) {
        console.error('error fetching');
    } else {
        const data = await response.json();
        hideLoading();
        return data;
    }
}

async function getResponseByCode(code) {
    displayLoading();
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if(response.status != 200) {
        console.error('error fetching');
    } else {
        const data = await response.json();
        hideLoading();
        return data;
    }
}