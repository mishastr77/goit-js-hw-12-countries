import countriesCards from '../templates/countries_cards.hbs';
import listCountry from '../templates/list_country.hbs';
import debounce from 'lodash.debounce';
import { alert, error } from '@pnotify/core';
const cardsConteiner = document.querySelector('.js-card-container');
const searchForm = document.querySelector('.js-search-form');

searchForm.addEventListener(
  'input',
  debounce(e => onSearch(e.target.value), 500),
);

function onSearch(e) {
  if (e.length >= 1) {
    fetchCountries(e)
      .then(country => {
        if (country.length > 2 && country.length <= 10) {
          return renderListCountry(country);
        } else if (country.length === 1) {
          return renderCountryCard(country);
        }
        error({
          text: 'Too many matches found. Please enter a more specific query',
        });
      })
      .catch(onFetchError);
  }
}

const BASE_URL = 'https://restcountries.eu/rest/v2/name/';

export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}${searchQuery}`).then(res => {
    if (!res.ok) {
      throw res;
    }

    return res.json();
  });
}

function renderCountryCard(countries) {
  const markup = countriesCards(countries);
  cardsConteiner.innerHTML = markup;
}

function renderListCountry(countries) {
  const markup = listCountry(countries);
  cardsConteiner.innerHTML = markup;
}

function onFetchError() {
  alert('Something wrong we have some problem');
}
