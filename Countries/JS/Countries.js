import paises from './Data/AllCountries.js';
import pais from './Data/OneCountry.js';

const tabela = document.querySelector('#tableLine');
const pagination = document.querySelector('#pagination');
const modal = document.querySelector('#countryModal');
const close = document.querySelector('#close');
const info = document.querySelector('#info');

let offset = 20;
let totalPaises = 0;

const totalPages = () => Math.ceil(totalPaises / offset);

const countriesTable = (data, numPage = 1) => {
    let countriesList = '';
    let regIn = (numPage - 1) * offset;
    let regFin = numPage * offset;
    regFin = regFin > totalPaises ? totalPaises : regFin;

    for (let i = regIn; i < regFin; i++){
        countriesList += `<tr>
            <td>${i+1}</td>
            <td country='${data[i].name.common}'>${data[i].name.common}</td>
            <td>${data[i].region}</td>
            <td>${data[i].subregion}</td>
            <td><img src="${data[i].flags.png}" width="50px"></td>
        </tr>`
    };
    return countriesList;
}

const toggleLoader = () => {
    document.querySelector('.loader').classList.toggle('hide');
    document.querySelector('.container').classList.toggle('hide');
}

const buildPagination = () => {
    let numPages = "";
    for (let page = 1; page <= totalPages(); page++){
        numPages += `<span>${page}</span>`;
    }
    pagination.innerHTML = numPages;
}

close.addEventListener('click', e => {
    modal.classList.add('hide');
})

paises()
    .then(data => {
        totalPaises = data.length;

        tabela.innerHTML = countriesTable(data);

        buildPagination();

        pagination.addEventListener('click', e => {
            if (e.target.tagName == 'SPAN') {
                tabela.innerHTML = countriesTable(data, e.target.innerText.trim());
            }
        })

        document.querySelector('#sort').addEventListener('click', e => {
            data.sort((a, b) => a.name.common.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > b.name.common.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ? 1 : -1);
            tabela.innerHTML = countriesTable(data);
        })

        tabela.addEventListener('click', e => {
            if (e.target.hasAttribute('country')){
                pais(e.target.getAttribute('country'))
                    .then(dataCountry => {
                        modal.classList.remove('hide');
                        let infoHtml = `
                        <p>País: ${dataCountry[0].name.common}</p>
                        <p>Capital: ${dataCountry[0].capital[0]}</p>
                        <p>População: ${dataCountry[0].population}</p>
                        <p>Google Maps: <a href='${dataCountry[0].maps.googleMaps}' target="_blank">MAPA</a></p>
                        `;
                        info.innerHTML = infoHtml;
                    })
                    .catch(err => {
                        console.log('Promise com erro', err.message);
                    })
            }
        })

        toggleLoader();
    })
    .catch(err => {
        console.log('Promise com erro', err.message);
    })