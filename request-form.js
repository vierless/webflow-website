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

// on page load
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

    // Intl-tel-input
    var intlInput = form.querySelector('input[data-intl-phone="true"]'),
    	dialCode = form.querySelector('.dialCode'),
     	errorMsg = form.querySelector('#error-msg'),
        validMsg = form.querySelector('#valid-msg');
    
    var iti = window.intlTelInput(intlInput, {
        initialCountry: "de",
        placeholderNumberType: 'FIXED_LINE',
        utilsScript: "https://cdn.jsdelivr.net/gh/jackocnr/intl-tel-input/build/js/utils.js"
    });
    
    var updateInputValue = function (event) {
        dialCode.value = "+" + iti.getSelectedCountryData().dialCode;
    };
    intlInput.addEventListener('input', updateInputValue, false);
    intlInput.addEventListener('countrychange', updateInputValue, false);
    
    var errorMap = ['Invalid number', 'Invalid country code', 'Too short', 'Too long', 'Invalid number'];
    
    var reset = function() {
        intlInput.classList.remove('error');
        errorMsg.innerHTML = '';
        errorMsg.classList.add('hide');
        validMsg.classList.add('hide');
    };
    
    intlInput.addEventListener('blur', function() {
    reset();
    if (intlInput.value.trim()) {
        if (iti.isValidNumber()) {
            validMsg.classList.remove('hide');
        } else {
            intlInput.classList.add('error');
            var errorCode = iti.getValidationError();
            errorMsg.innerHTML = errorMap[errorCode];
            errorMsg.classList.remove('hide');
        }
    }
    });
    
    intlInput.addEventListener('change', reset);
    intlInput.addEventListener('keyup', reset);
});
console.log('request-form.js');
