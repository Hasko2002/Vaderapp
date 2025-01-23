document.getElementById('sök-knapp').addEventListener('click', sökKnapp);

function sökKnapp() {
    const apikey = '856224bbc8f089ea0414da6f79f0ffa9';
    const city = document.getElementById('stad').value;
    if (!city) {
        alert('Du måste skriva in en stad');
        return;
    }

    const nutidaväderUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    const prognosUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=metric`;

    fetch(nutidaväderUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Stad ej hittad: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            visaVäder(data);
        })
        .catch((error) => {
            console.error('Error fetching current weather data:', error);
            alert('Kunde inte hämta väderdata. Kontrollera stadens namn eller försök igen senare.');
        });

    fetch(prognosUrl)
        .then((response) => response.json())
        .then(data => {
            visaPrognos(data.list);
        })
        .catch((error) => {
            console.error('Error fetching forecast data:', error);
            alert('Kunde inte hämta väderprognos. Försök igen senare.');
        });
}

function visaVäder(data) {
    const temperaturdivInfo = document.getElementById('temperaturer');
    const väderdivInfo = document.getElementById('väderinformationen');
    const väderIkon = document.getElementById('väder-ikon');
    const väderPrognosdiv = document.getElementById('väderprognos');

    // Ta bort tidigare data
    temperaturdivInfo.innerHTML = '';
    väderdivInfo.innerHTML = '';
    väderPrognosdiv.innerHTML = '';

    if (data.cod === '404') {
        väderdivInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        const stadsnamn = data.name;
        const temperatur = Math.round(data.main.temp);
        const beskrivning = data.weather[0].description;
        const väderikon = data.weather[0].icon;
        const ikonUrl = `http://openweathermap.org/img/wn/${väderikon}@4x.png`;

        const temperaturHtml = `
            <p>${temperatur}°C</p>
        `;
        const väderHtml = `
            <p>${beskrivning}</p>
            <p>${stadsnamn}</p>
        `;

        temperaturdivInfo.innerHTML = temperaturHtml;
        väderdivInfo.innerHTML = väderHtml;
        väderIkon.src = ikonUrl;
        väderIkon.alt = beskrivning;

        visaBild();
    }
}

function visaPrognos(prognosData) {
    const väderPrognosdiv = document.getElementById('väderprognos');
    const next24timmar = prognosData.slice(0, 8);

    next24timmar.forEach(item => {
        const datum = new Date(item.dt * 1000);
        const tid = datum.getHours();
        const temperatur = Math.round(item.main.temp);
        const väderikon = item.weather[0].icon;
        const ikonUrl = `http://openweathermap.org/img/wn/${väderikon}@2x.png`;

        const hourlyitemHtml = `
            <div class="väder-item">
                <span>${tid}:00</span>
                <img src="${ikonUrl}" alt="Väderikon timme">
                <span>${temperatur}°C</span>
            </div>
        `;

        väderPrognosdiv.innerHTML += hourlyitemHtml;
    });
}

function visaBild() {
    const väderIkon = document.getElementById('väder-ikon');
    if (väderIkon.src && väderIkon.alt) {
        väderIkon.style.display = 'block';
    }
}
