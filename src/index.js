import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

countryListEl.style.paddingLeft = '0';

inputEl.addEventListener(
  'input',
  debounce(() => {
    handleSearch();
  }, DEBOUNCE_DELAY)
);

function handleSearch() {
  if (inputEl.value.trim() !== '') {
    fetchCountries(inputEl.value)
      .then(fetchedCountries => {
        console.log(fetchedCountries);

        if (fetchedCountries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          clearMarkup();
          return;
        }

        if (fetchedCountries.length > 2 && fetchedCountries.length <= 10) {
          renderCountryList(fetchedCountries);
          clearCountryInfo();
          return;
        }

        if (fetchedCountries.length === 1) {
          renderCountryInfo(fetchedCountries[0]);
          clearCountryList();
          return;
        }

        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearMarkup();
      })
      .catch(() => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearMarkup();
      });
  } else {
    clearMarkup();
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      const { name, flags } = country;
      return `
        <li style="list-style: none; display: flex; gap: 20px; align-items: center;">
          <img src="${flags.svg}" style="width: 30px; height: 20px;">
          <p style="font-size: 18px;"><b>${name.common}</b></p>
        </li>
      `;
    })
    .join('');

  countryListEl.innerHTML = markup;
}

function renderCountryInfo(country) {
  const { name, capital, population, flags, languages } = country;

  const markup = `
    <div>
      <div style="display: flex; gap: 20px; align-items: center;">
        <img src="${flags.svg}"style="max-width: 4%; max-height: 200px;">
        <h2 style="font-size: 32px;">${name.common}</h2>
      </div>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
    </div>
  `;

  countryInfoEl.innerHTML = markup;
}

function clearCountryList() {
  countryListEl.innerHTML = '';
}

function clearCountryInfo() {
  countryInfoEl.innerHTML = '';
}

function clearMarkup() {
  clearCountryList();
  clearCountryInfo();
}
