'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
let country = '';
///////////////////////////////////////

function renderError(msg) {
  countriesContainer.style.opacity = 1;
  countriesContainer.insertAdjacentText('beforeend', msg);
}

function renderCountry(data, className = '') {
  console.log(data);
  const html = `
        <article class="country ${className}">
          <img class="country__img" src='${data.flags.svg}' />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span style="font-size:large padding-left:1vh">Capital</span>${data.capital}</p>
            <p class="country__row"><span>💰</span>${data.timezones[0]}</p>
        </div>
        </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}

function getJSON(url, errMsg = 'something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(errMsg);
    }
    return response.json();
  });
}

// function getCountryData(country) {
//   getJSON(
//     `https://restcountries.com/v3.1/name/${country}`,
//     'Something went wrong'
//   )
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbour = data[0].borders?.[0];

//       if (!neighbour) throw new Error('No neighbour found');

//       return getJSON(
//         `https://restcountries.com/v3.1/alpha/${neighbour}`,
//         'Neighbour not found'
//       );
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       renderError(`something went wrong bancho. ${err.message}`);
//     });
// }

// function whereAmI() {
//   getPosition()
//     .then(res => {
//       const { latitude: lat, longitude: lng } = res.coords;
//       return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Cool down bruh...!');
//       }
//       return response.json();
//     })
//     .then(data => {
//       country = data.country;
//       console.log(`You are in ${data.city}, ${data.country}.`);
//     })
//     .then(() => getCountryData(country))
//     .catch(err => console.log(err.message));
// }

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

// function getLocation() {
//   navigator.geolocation.getCurrentPosition(pos => {
//     whereAmI(pos.coords.latitude, pos.coords.longitude);
//   });
// }

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error)
    );
  });
};

async function whereAmI() {
  try {
    const loc = await getPosition();
    const { latitude: lat, longitude: lng } = loc.coords;

    const geoRes = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    if (!geoRes.ok) throw new Error('Cannot get location');
    const geoData = await geoRes.json();

    const res = await fetch(
      `https://restcountries.com/v3.1/name/${geoData.country}`
    );
    if (!res.ok) throw new Error('Cannot get country');
    const data = await res.json();
    renderCountry(data[0]);
  } catch (err) {
    console.log(err);
    renderError('Something went wrong');
  }
}

btn.addEventListener('click', whereAmI);

async function getCapital(c1, c2, c3) {
  try {
    const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    console.log([...data1.capital, ...data2.capital, ...data3.capital]);
  } catch (err) {
    console.log(err);
  }
}

// getPosition().then(res => console.log(res));
// function getCountryData(country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     renderCountry(data);
//     const [borders] = data.borders;
//     if (!data.borders) return;

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${borders}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// }
// getCountryData('bharat');

// console.log('Test start');
// setTimeout(() => console.log('0 sec timer'), 0);
// Promise.resolve('Resolved promise 1').then(res => console.log(res));
// Promise.resolve('Resolved promise 2').then(res => {
//   for (let i = 0; i < 1000000; i++) {}
//   console.log(res);
// });
// console.log('Test end');

// const lottery = new Promise(function (resolve, reject) {
//   console.log('Lottery is being conducted');
//   setTimeout(() => {
//     if (Math.random() >= 0.5) {
//       resolve('you won');
//     } else {
//       reject('You lose');
//     }
//   }, 3000);
// });

// lottery.then(res => console.log(res)).catch(err => console.log(err));

// function wait(seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// }

// wait(2)
//   .then(() => {
//     console.log('1 sec passed');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('2 seconds passed');
//     return wait(1);
//   })
//   .then(() => {
//     console.log('3 seconds passed');
//     return wait(1);
//   })
//   .then(() => console.log('4 seconds passed'));
