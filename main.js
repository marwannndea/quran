
function loadSurahs() {
    let container = document.getElementById('surah-container');

    container.innerHTML = ''; 

    fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {



        data.data.forEach((surah) => {

            let div = document.createElement('div');
            div.classList.add('content_surah');

            div.innerHTML = `
                <div class="icon">
                    <div class="div1"></div>
                    <div class="div2"></div>
                    <p>${surah.number}</p>
                </div>

                <div class="surah_name">
                    <h3>${surah.englishName} <span>(${surah.name})</span></h3>
                    <p>${surah.englishNameTranslation || ''}</p>
                </div>

                <div class="verse_number">
                    <h2>${surah.numberOfAyahs}</h2>
                    <h3>Verse</h3>
                </div>
            `;


            container.appendChild(div);

            div.addEventListener('click', () => {
                showSurah(surah.number, surah.name);
            })
        });

    })
    .catch(err => console.log(err));
}
loadSurahs()

function clearAllContent() {

    document.getElementById('surah-container').innerHTML = '';

    document.getElementById('single-surah').innerHTML = '';

}

function clearContainer() {
    document.getElementById('surah-container').innerHTML = '';
}


let tabs = document.querySelectorAll('.tab')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {

        tabs.forEach(t => t.classList.remove('active_tab'));
        tab.classList.add('active_tab');

        clearAllContent();

        // ❌ خبي كلشي أولاً
        document.getElementById('surah-container').style.display = 'none';
        document.getElementById('reciters-container').style.display = 'none';
        document.getElementById('qarie-audio').style.display = 'none';
        document.getElementById('single-surah').style.display = 'none';

        let id = tab.id;

        // ✅ SURAH TAB
        if (id === 'surah-tab') {
            document.getElementById('surah-container').style.display = 'block';
            loadSurahs();
        }

        // ✅ LISTEN TAB
        if (id === 'juz-tab') {
            document.getElementById('reciters-container').style.display = 'block';
            loadReciters();
        }

        // ✅ PAGE TAB
        if (id === 'page-tab') {
            document.getElementById('surah-container').style.display = 'block';
            document.getElementById('surah-container').innerHTML =
                "<h2>Page section coming soon...</h2>";
        }

    });
});

function showSurah(number, name) {

      document.getElementById('reciters-container').style.display = 'none';
    document.getElementById('qarie-audio').style.display = 'none';

    let container = document.getElementById('surah-container');
    let singleSurah = document.getElementById('single-surah');

    container.style.display = 'none';

    singleSurah.innerHTML = '';

    fetch(`https://api.alquran.cloud/v1/surah/${number}`)
    .then(res => res.json())
    .then(data => {
        let surah = data.data;

        localStorage.setItem('lastSurah', surah.name);
        localStorage.setItem('lastAyah', surah.ayahs[0].numberInSurah);
        loadLastRead();

        let html = `
           <div class="al-faatiha">
           <h1>${surah.name}</h1>
        `;

        surah.ayahs.forEach(ayah => {
            html += `
                <p
                class="ayah"
                data-ayah="${ayah.numberInSurah}"
                id="ayah-${ayah.numberInSurah}"
                >
                ${ayah.text
                    .replace(/ٱللَّه/g, `<span class="allah-name">$&</span>`)} (${ayah.numberInSurah})
                </p>
            `;
        });

        document.getElementById('reciters-container')
        .style.display = 'none';
        document.getElementById('qarie-audio')
        .style.display = 'none';

        html += `</div>`;

        singleSurah.innerHTML = html;

        let ayahs = document.querySelectorAll('.ayah');
        window.addEventListener('scroll' , () => {
            ayahs.forEach((ayah) => {
                let rect = ayah.getBoundingClientRect();

                if(rect.top >= 0 && rect.top <= 150){
                    let ayahNumber = ayah.dataset.ayah;
                    localStorage.setItem('lastAyah' , ayahNumber);

                    loadLastRead();
                }
            })
        })
    });
}

function loadLastRead(){
    let surahName = localStorage.getItem('lastSurah');
    let ayah = localStorage.getItem('lastAyah');

    if(surahName){
        document.getElementById('last-surah-name').textContent = surahName;

        document.getElementById('last-ayah').textContent = `Ayah No. ${ayah}`;
    }
}
loadLastRead();

let menu = document.getElementById('menu');
let openMenu = document.querySelector('.logo_menu')
let closeMenu = document.getElementById('close-menu')

openMenu.addEventListener('click', () => {
    menu.classList.add('active_menu');
})

closeMenu.addEventListener('click', () => {
    menu.classList.remove('active_menu');
})


let searchBtn = document.querySelector('.logo_search i');

let headerTop = document.getElementById('header_top');

searchBtn.addEventListener('click', () => {
    headerTop.classList.toggle('active_search')
});

let searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', () => {
    let value = searchInput.value.toLowerCase();

    let surahs = document.querySelectorAll('.content_surah')

    surahs.forEach((surah) => {

        let title = surah.querySelector('.surah_name')
        .textContent
        .toLowerCase();

        if(title.includes(value)){
            surah.style.display = 'flex';
        }else{
            surah.style.display = 'none';
        }
    })
})


let selectedReciter = "";

let audio = document.getElementById('audio-player');

function getReciterCode(name){

    const map = {
        "Mishary Rashid Alafasy": "afs",
        "Abdul Basit": "basit",
        "Abdur-Rahman as-Sudais": "sds",
        "Saud ash-Shuraym": "shuraym"
    };

    return map[name] || "afs";
}

function loadReciters(){

    let container = document.getElementById('reciters-container');
    container.innerHTML = '';

    fetch('https://api.quran.com/api/v4/resources/recitations')
    .then(res => res.json())
    .then(data => {

        data.recitations.forEach((reciter) => {

            let div = document.createElement('div');
            div.classList.add('qarie_container');

            div.innerHTML = `
                <img src="imgs/app_logo.png">

                <div class="qarie_name">
                    <h2>${reciter.reciter_name}</h2>
                </div>

                <div class="qarie_options">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
            `;

            div.addEventListener('click', () => {

                selectedReciter = reciter.reciter_name;

                document.getElementById('reciters-container').style.display = 'none';
                document.getElementById('qarie-audio').style.display = 'flex';

                document.getElementById('reciter-name').textContent = reciter.reciter_name;

                loadSurahSelect();
            });

            container.appendChild(div);
        });

    });
}
loadReciters();

function loadSurahSelect(){

    let select = document.getElementById('select-surah');
    select.innerHTML = '';

    fetch('https://api.alquran.cloud/v1/surah')
    .then(res => res.json())
    .then(data => {

        data.data.forEach((surah) => {

            let option = document.createElement('option');
            option.value = surah.number;
            option.textContent = surah.englishName;

            select.appendChild(option);
        });

    });
}

let selectSurah =
document.getElementById('select-surah');

let audioPlayer =
document.getElementById('audio-player');

fetch('https://api.alquran.cloud/v1/surah')

.then(res => res.json())

.then(data => {

    data.data.forEach((surah) => {

        let option =
        document.createElement('option');

        option.value = surah.number;

        option.textContent =
        surah.englishName;

        selectSurah.appendChild(option);

    });

});

document.getElementById('select-surah')
.addEventListener('change', (e) => {

    let surahNumber = String(e.target.value).padStart(3, '0');

    let reciterCode = getReciterCode(selectedReciter);

    audio.src = `https://server8.mp3quran.net/${reciterCode}/${surahNumber}.mp3`;

    audio.play();

});
