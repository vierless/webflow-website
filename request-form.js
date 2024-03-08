// Find data-value and set value attribute
var checkboxesWithDataValue = document.querySelectorAll('input[type="checkbox"][data-value]');
checkboxesWithDataValue.forEach(function (checkbox) {
    var dataValue = checkbox.getAttribute('data-value');
    checkbox.value = dataValue;
});

// Check checkboxes and radio buttons on page load if data exists in localStorage
let localStorageData = JSON.parse(localStorage.getItem('filledInput'));
if (Array.isArray(localStorageData)) {
    localStorageData.forEach(function (element) {
        let value = element.value;
        let input;
        if (element.inputName.includes('checkbox_')) {
            input = document.querySelector('[data-value="' + value + '"]');
        } else if (element.inputName.includes('radio_')) {
            input = document.querySelector('input[type="radio"][value="' + value + '"]');
        }
        if (input) {
            let inputGroup = input.closest('.form_checkboxes-wrapper');
            let checkboxButton = input.closest('.form_checkbox-button');
            let visibleCheckbox = checkboxButton.querySelector('.form_checkbox-icon, .form_radio-icon');
            if (!inputGroup.hasAttribute('data-radio-skip')) {
                if (!input.checked) {
                    input.checked = true;
                }
                if (checkboxButton) {
                    checkboxButton.classList.add('checked');
                }
                if (visibleCheckbox) {
                    visibleCheckbox.classList.add('w--redirected-checked');
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // custom disabled states
    const nextBtns = document.querySelectorAll("[data-form='next-btn']");
    const backBtns = document.querySelectorAll("[data-form='back-btn']");
    nextBtns.forEach(function (btn) {
        btn.style.opacity = "1";
    });
    backBtns.forEach(function (btn) {
        btn.style.opacity = "1";
        btn.addEventListener("click", function () {
            fixAutoSkipInputs();
        });
    });
    nextBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            nextBtns.forEach(function (btn) {
                btn.style.opacity = "1";
            });
        });
    });

    // Hidden fields functionality
    let formID = 'requestForm';
    let form = document.getElementById(formID);
    let urlField = form.querySelector('input[name="url"]');
    let referrerField = form.querySelector('input[name="referrer"]');
    let formIdField = form.querySelector('input[name="form_id"]');
    let sourceField = form.querySelector('input[name="utm_source"]');
    let mediumField = form.querySelector('input[name="utm_medium"]');
    let campaignField = form.querySelector('input[name="utm_campaign"]');
    let startTimeField = form.querySelector('input[name="start_time"]');
    let faviconField = form.querySelector('input[name="favicon"]');

    // Get UTM parameters from the URL
    function getUrlParameter(name) {
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    let utmSource = getUrlParameter('utm_source');
    let utmMedium = getUrlParameter('utm_medium');
    let utmCampaign = getUrlParameter('utm_campaign');

    // Get current time
    let startTime = Date.now();

    // Strip Queries from URL
    function stripAllQueryParameters(url) {
        let parsedUrl = new URL(url);
        parsedUrl.search = '';
        return parsedUrl.href;
    }
    let currentURL = window.location.href;
    let strippedURL = stripAllQueryParameters(currentURL);
    let strippedReferrer;
    if (document.referrer) {
        strippedReferrer = stripAllQueryParameters(document.referrer);
    } else {
        strippedReferrer = '';
    }
    // Set values of hidden fields
    if (urlField) {
        urlField.value = strippedURL;
    }
    if (referrerField) {
        referrerField.value = strippedReferrer;
    }
    formIdField.value = formID;
    if (utmSource) {
        if (sourceField) {
            sourceField.value = utmSource;
        }
    }
    if (utmMedium) {
        if (mediumField) {
            mediumField.value = utmMedium;
        }
    }
    if (utmCampaign) {
        if (campaignField) {
            campaignField.value = utmCampaign;
        }
    }
    if (startTimeField) {
        startTimeField.value = startTime;
    }

    // custom input buttons
    let inputs = document.querySelectorAll('.form_checkbox-button input[type="checkbox"], .form_checkbox-button input[type="radio"]');
    inputs.forEach(function (input) {
        input.addEventListener('change', function () {
            if (input.type === 'radio') {
                let radioGroup = document.querySelectorAll('input[name="' + input.name + '"]');
                radioGroup.forEach(function (radio) {
                    let checkboxButton = radio.closest('.form_checkbox-button');
                    if (radio.checked) {
                        checkboxButton.classList.add('checked');
                    } else {
                        checkboxButton.classList.remove('checked');
                    }
                });
            } else {
                let checkboxButton = input.closest('.form_checkbox-button');
                if (input.checked) {
                    checkboxButton.classList.add('checked');
                } else {
                    checkboxButton.classList.remove('checked');
                }
            }
        });
    });

    function fixAutoSkipInputs() {
        let autoSkipSteps = form.querySelectorAll('.form_checkboxes-wrapper[data-radio-skip="true"]');
        if (autoSkipSteps.length >= 1) {
            autoSkipSteps.forEach(function (step) {
                let checkedStep = step.querySelector('.form_checkbox-button.checked');
                if (checkedStep) {
                    checkedStep.classList.remove('checked');
                }
            });
        }
    }

    // Load website favicon
    let localStorageData = JSON.parse(localStorage.getItem('filledInput'));
    let websiteField = form.querySelector('input[name="website"]');
    let faviconContainer = form.querySelector('.form_favicon-wrapper');
    let faviconUrl = '';

    if (localStorageData && Array.isArray(localStorageData)) {
        localStorageData.forEach(function (element) {
            if (element.inputName === 'favicon') {
                faviconUrl = element.value;
            }
        });
        if (faviconUrl) {
            loadFavicon(faviconUrl);
        }
    }
    if (websiteField) {
        websiteField.addEventListener('blur', function () {
            const url = websiteField.value;
            faviconUrl = 'https://www.google.com/s2/favicons?domain=' + url + '&sz=128';
            loadFavicon(faviconUrl);
        });
    }

    function loadFavicon(url) {
        if (faviconContainer) {
            faviconContainer.style.backgroundImage = 'url("' + url + '")';
            faviconContainer.style.opacity = 1;
            faviconField.value = url;
        }
    }
    let buttons = form.querySelectorAll('button:not([type="submit"])');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (faviconUrl) {
                let localStorageData = JSON.parse(localStorage.getItem('filledInput')) || [];
                let faviconDataIndex = -1;
                for (let i = 0; i < localStorageData.length; i++) {
                    if (localStorageData[i].inputName === 'favicon') {
                        faviconDataIndex = i;
                        break;
                    }
                }
                if (faviconDataIndex !== -1) {
                    localStorageData[faviconDataIndex].value = faviconUrl;
                } else {
                    let faviconData = {
                        inputName: 'favicon',
                        value: faviconUrl
                    };
                    localStorageData.push(faviconData);
                }
                localStorage.setItem('filledInput', JSON.stringify(localStorageData));
            }
        });
    });

    // international phone input
    let input = document.querySelector('#phone'),
        dialCode = document.querySelector('.dialCode'),
        errorMsg = document.querySelector('#error-msg'),
        validMsg = document.querySelector('#valid-msg');

    const iti = window.intlTelInput(input, {
        allowDropdown: true,
        autoInsertDialCode: false,
        containerClass: 'phone-input-container',
        countrySearch: true,
        fixDropdownWidth: false,
        geoIpLookup: function (callback) {
            fetch('https://ipapi.co/json')
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    callback(data.country_code);
                })
                .catch(function () {
                    callback();
                });
        },
        hiddenInput: () => 'phone_full',
        i18n: {
            'af': 'Afghanistan',
            'ax': 'Ålandinseln',
            'al': 'Albanien',
            'dz': 'Algerien',
            'as': 'Amerikanisch-Samoa',
            'ad': 'Andorra',
            'ao': 'Angola',
            'ai': 'Anguilla',
            'aq': 'Antarktika',
            'ag': 'Antigua und Barbuda',
            'ar': 'Argentinien',
            'am': 'Armenien',
            'aw': 'Aruba',
            'au': 'Australien',
            'at': 'Österreich',
            'az': 'Aserbaidschan',
            'bs': 'Bahamas',
            'bh': 'Bahrain',
            'bd': 'Bangladesch',
            'bb': 'Barbados',
            'by': 'Weißrussland',
            'be': 'Belgien',
            'bz': 'Belize',
            'bj': 'Benin',
            'bm': 'Bermuda',
            'bt': 'Bhutan',
            'bo': 'Bolivien',
            'ba': 'Bosnien und Herzegowina',
            'bw': 'Botswana',
            'bv': 'Bouvetinsel',
            'br': 'Brasilien',
            'io': 'Britisches Territorium im Indischen Ozean',
            'vg': 'Britische Jungferninseln',
            'bn': 'Brunei Darussalam',
            'bg': 'Bulgarien',
            'bf': 'Burkina Faso',
            'bi': 'Burundi',
            'kh': 'Kambodscha',
            'cm': 'Kamerun',
            'ca': 'Kanada',
            'cv': 'Kap Verde',
            'ky': 'Kaimaninseln',
            'cf': 'Zentralafrikanische Republik',
            'td': 'Tschad',
            'cl': 'Chile',
            'cn': 'China',
            'cx': 'Weihnachtsinsel',
            'cc': 'Kokosinseln',
            'co': 'Kolumbien',
            'km': 'Komoren',
            'cg': 'Kongo',
            'cd': 'Demokratische Republik Kongo',
            'ck': 'Cookinseln',
            'cr': 'Costa Rica',
            'hr': 'Kroatien',
            'cu': 'Kuba',
            'cw': 'Curaçao',
            'cy': 'Zypern',
            'cz': 'Tschechische Republik',
            'dk': 'Dänemark',
            'dj': 'Dschibuti',
            'dm': 'Dominica',
            'do': 'Dominikanische Republik',
            'ec': 'Ecuador',
            'eg': 'Ägypten',
            'sv': 'El Salvador',
            'gq': 'Äquatorialguinea',
            'er': 'Eritrea',
            'ee': 'Estland',
            'et': 'Äthiopien',
            'fk': 'Falklandinseln',
            'fo': 'Färöer-Inseln',
            'fj': 'Fidschi',
            'fi': 'Finnland',
            'fr': 'Frankreich',
            'gf': 'Französisch-Guayana',
            'pf': 'Französisch-Polynesien',
            'tf': 'Französische Südgebiete',
            'ga': 'Gabun',
            'gm': 'Gambia',
            'ge': 'Georgien',
            'de': 'Deutschland',
            'gh': 'Ghana',
            'gi': 'Gibraltar',
            'gr': 'Griechenland',
            'gl': 'Grönland',
            'gd': 'Grenada',
            'gp': 'Guadeloupe',
            'gu': 'Guam',
            'gt': 'Guatemala',
            'gg': 'Guernsey',
            'gn': 'Guinea',
            'gw': 'Guinea-Bissau',
            'gy': 'Guyana',
            'ht': 'Haiti',
            'hm': 'Heard und McDonaldinseln',
            'va': 'Heiliger Stuhl (Vatikanstadt)',
            'hn': 'Honduras',
            'hk': 'Hongkong',
            'hu': 'Ungarn',
            'is': 'Island',
            'in': 'Indien',
            'id': 'Indonesien',
            'ir': 'Iran',
            'iq': 'Irak',
            'ie': 'Irland',
            'im': 'Isle of Man',
            'il': 'Israel',
            'it': 'Italien',
            'ci': 'Elfenbeinküste',
            'jm': 'Jamaika',
            'jp': 'Japan',
            'je': 'Jersey',
            'jo': 'Jordanien',
            'kz': 'Kasachstan',
            'ke': 'Kenia',
            'ki': 'Kiribati',
            'kw': 'Kuwait',
            'kg': 'Kirgisistan',
            'la': 'Laos',
            'lv': 'Lettland',
            'lb': 'Libanon',
            'ls': 'Lesotho',
            'lr': 'Liberia',
            'ly': 'Libyen',
            'li': 'Liechtenstein',
            'lt': 'Litauen',
            'lu': 'Luxemburg',
            'mo': 'Macao',
            'mk': 'Nordmazedonien',
            'mg': 'Madagaskar',
            'mw': 'Malawi',
            'my': 'Malaysia',
            'mv': 'Malediven',
            'ml': 'Mali',
            'mt': 'Malta',
            'mh': 'Marshallinseln',
            'mq': 'Martinique',
            'mr': 'Mauretanien',
            'mu': 'Mauritius',
            'yt': 'Mayotte',
            'mx': 'Mexiko',
            'fm': 'Mikronesien',
            'md': 'Republik Moldau',
            'mc': 'Monaco',
            'mn': 'Mongolei',
            'me': 'Montenegro',
            'ms': 'Montserrat',
            'ma': 'Marokko',
            'mz': 'Mosambik',
            'mm': 'Myanmar',
            'na': 'Namibia',
            'nr': 'Nauru',
            'np': 'Nepal',
            'nl': 'Niederlande',
            'nc': 'Neukaledonien',
            'nz': 'Neuseeland',
            'ni': 'Nicaragua',
            'ne': 'Niger',
            'ng': 'Nigeria',
            'nu': 'Niue',
            'nf': 'Norfolkinsel',
            'mp': 'Nördliche Marianen',
            'kp': 'Nordkorea',
            'no': 'Norwegen',
            'om': 'Oman',
            'pk': 'Pakistan',
            'pw': 'Palau',
            'ps': 'Palästinensische Autonomiegebiete',
            'pa': 'Panama',
            'pg': 'Papua-Neuguinea',
            'py': 'Paraguay',
            'pe': 'Peru',
            'ph': 'Philippinen',
            'pn': 'Pitcairn',
            'pl': 'Polen',
            'pt': 'Portugal',
            'pr': 'Puerto Rico',
            'qa': 'Katar',
            're': 'Réunion',
            'ro': 'Rumänien',
            'ru': 'Russland',
            'rw': 'Ruanda',
            'bl': 'St. Barthélemy',
            'sh': 'St. Helena',
            'kn': 'St. Kitts und Nevis',
            'lc': 'St. Lucia',
            'mf': 'St. Martin',
            'pm': 'St. Pierre und Miquelon',
            'vc': 'St. Vincent und die Grenadinen',
            'ws': 'Samoa',
            'sm': 'San Marino',
            'st': 'São Tomé und Príncipe',
            'sa': 'Saudi-Arabien',
            'sn': 'Senegal',
            'rs': 'Serbien',
            'sc': 'Seychellen',
            'sl': 'Sierra Leone',
            'sg': 'Singapur',
            'sx': 'Sint Maarten',
            'sk': 'Slowakei',
            'si': 'Slowenien',
            'sb': 'Salomonen',
            'so': 'Somalia',
            'za': 'Südafrika',
            'gs': 'Südgeorgien und die Südlichen Sandwichinseln',
            'kr': 'Südkorea',
            'ss': 'Südsudan',
            'es': 'Spanien',
            'lk': 'Sri Lanka',
            'sd': 'Sudan',
            'sr': 'Suriname',
            'sj': 'Svalbard und Jan Mayen',
            'sz': 'Eswatini',
            'se': 'Schweden',
            'ch': 'Schweiz',
            'sy': 'Syrien',
            'tw': 'Taiwan',
            'tj': 'Tadschikistan',
            'tz': 'Tansania',
            'th': 'Thailand',
            'tl': 'Osttimor',
            'tg': 'Togo',
            'tk': 'Tokelau',
            'to': 'Tonga',
            'tt': 'Trinidad und Tobago',
            'tn': 'Tunesien',
            'tr': 'Türkei',
            'tm': 'Turkmenistan',
            'tc': 'Turks- und Caicosinseln',
            'tv': 'Tuvalu',
            'ug': 'Uganda',
            'ua': 'Ukraine',
            'ae': 'Vereinigte Arabische Emirate',
            'gb': 'Vereinigtes Königreich',
            'us': 'Vereinigte Staaten von Amerika',
            'um': 'Amerikanisch-Ozeanien',
            'uy': 'Uruguay',
            'uz': 'Usbekistan',
            'vu': 'Vanuatu',
            've': 'Venezuela',
            'vn': 'Vietnam',
            'wf': 'Wallis und Futuna',
            'eh': 'Westsahara',
            'ye': 'Jemen',
            'zm': 'Sambia',
            'zw': 'Simbabwe'
        },
        // initialCountry: "de",
        initialCountry: 'auto',
        geoIpLookup: callback => {
            fetch('https://ipapi.co/json')
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback('de'));
        },
        nationalMode: true,
        // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
        placeholderNumberType: 'MOBILE',
        // preferredCountries: ['de', 'gb', 'ch'],
        showFlags: true,
        showSelectedDialCode: true,
        useFullscreenPopup: false,
        utilsScript: 'build/js/utils.js'
    });


    // Webflow Code start
    var updateInputValue = function (event) {
        dialCode.value = "+" + iti.getSelectedCountryData().dialCode;
    };
    input.addEventListener('input', updateInputValue, false);
    input.addEventListener('countrychange', updateInputValue, false);

    const errorMap = ["Ungültige Nummer", "Ungültige Ländervorwahl", "Telefonnummer ist zu kurz", "Telefonnummer ist zu lang", "Ungültige Nummer"];
    const reset = () => {
        input.classList.remove("error");
        errorMsg.innerHTML = "";
        errorMsg.classList.add("hide");
        validMsg.classList.add("hide");
    };
    input.addEventListener('blur', function () {
        reset();
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                validMsg.classList.remove('hide');
            } else {
                input.classList.add('error');
                var errorCode = iti.getValidationError();
                errorMsg.innerHTML = errorMap[errorCode];
                errorMsg.classList.remove('hide');
            }
        }
    });

    input.addEventListener('change', reset);
    input.addEventListener('keyup', reset);
});
console.log('request-form.js');
