function isValidPhone(value) {
    const filter01X = new RegExp(/^01[1-9]{1}(?:-|)\d{3,4}(?:-|)\d{4}$/);
    const filter010 = new RegExp(/^010(?:-|)\d{4}(?:-|)\d{4}$/);
    return (filter01X.test(value) || filter010.test(value));
}

function is010(value) {
    const filter = new RegExp(/^010\d{8}$/);
    return filter.test(value);
}

function convertTo010(value) {
    if (typeof (value) != 'string') {
        const err = new TypeError("Value '" + value + "' is not String.");
        err.code = "NOT_STRING";
        throw err;
    }
    if (!isValidPhone(value)) {
        const err = new TypeError("Value '" + value + "' is not a valid phone number.");
        err.code = "NOT_PHONE_NUMBER";
        throw err;
    }
    if (is010(value)) {
        const err = new TypeError("Value '" + value + "' not a 01X number.");
        err.code = "NOT_01X";
        throw err;
    }

    value = value.replaceAll('-', '');

    const is10Digit = (value.length == 10) ? true : false;
    const lastSegmentIndex = is10Digit ? 6 : 7;

    const varFirst = value.slice(0, 3);
    const varMiddle = value.slice(3, lastSegmentIndex);
    const varLast = value.slice(lastSegmentIndex);
    const intMiddle = parseInt(varMiddle);
    let newMiddle;

    switch (varFirst) {
        // SKT (011, 017)
        case '011':
            if (intMiddle >= 200 && intMiddle <= 499) {
                newMiddle = (intMiddle + 5000).toString();
            } else if (intMiddle >= 500 && intMiddle <= 899) {
                newMiddle = (intMiddle + 3000).toString();
            } else if (intMiddle >= 1700 && intMiddle <= 1799) {
                newMiddle = (intMiddle + 5400).toString();
            } else if (intMiddle >= 9000 && intMiddle <= 9499) {
                newMiddle = (intMiddle + 0).toString();
            } else if (intMiddle >= 9500 && intMiddle <= 9999) {
                newMiddle = (intMiddle - 1000).toString();
            } else {
                const err = new Error("Unknown area code for given carrier (SKT): '" + varMiddle + "'.");
                err.code = "UNKNOWN_AREACODE_SKT";
                throw err;
            }
            break;

        case '017':
            if (intMiddle >= 200 && intMiddle <= 499) {
                newMiddle = (intMiddle + 6000).toString();
            } else if (intMiddle >= 500 && intMiddle <= 899) {
                newMiddle = (intMiddle + 400).toString();
            } else {
                const err = new Error("Unknown area code for given carrier (SKT): '" + varMiddle + "'.");
                err.code = "UNKNOWN_AREACODE_SKT";
                throw err;
            }
            break;

        // KT (016, 018)
        case '016':
            if (intMiddle >= 200 && intMiddle <= 499) {
                newMiddle = (intMiddle + 3000).toString();
            } else if (intMiddle >= 500 && intMiddle <= 899) {
                newMiddle = (intMiddle + 2000).toString();
            } else if (intMiddle >= 9000 && intMiddle <= 9499) {
                newMiddle = (intMiddle - 2000).toString();
            } else if (intMiddle >= 9500 && intMiddle <= 9999) {
                newMiddle = (intMiddle + 0).toString();
            } else {
                const err = new Error("Unknown area code for given carrier (KT): '" + varMiddle + "'.");
                err.code = "UNKNOWN_AREACODE_KT";
                throw err;
            }
            break;

        case '018':
            if (intMiddle >= 200 && intMiddle <= 499) {
                newMiddle = (intMiddle + 4000).toString();
            } else if (intMiddle >= 500 && intMiddle <= 899) {
                newMiddle = (intMiddle + 6000).toString();
            } else {
                const err = new Error("Unknown area code for given carrier (KT): '" + varMiddle + "'.");
                err.code = "UNKNOWN_AREACODE_KT";
                throw err;
            }
            break;

        // LGU (019)
        case '019':
            if (intMiddle >= 200 && intMiddle <= 499) {
                newMiddle = (intMiddle + 2000).toString();
            } else if (intMiddle >= 500 && intMiddle <= 899) {
                newMiddle = (intMiddle + 5000).toString();
            } else if (intMiddle >= 9000 && intMiddle <= 9499) {
                newMiddle = (intMiddle - 1000).toString();
            } else if (intMiddle >= 9500 && intMiddle <= 9999) {
                newMiddle = (intMiddle - 2000).toString();
            } else {
                const err = new Error("Unknown area code for given carrier (LGT): '" + varMiddle + "'.");
                err.code = "UNKNOWN_AREACODE_LGT";
                throw err;
            }
            break;

        // Not applicable to anything
        default:
            const err = new Error("Unknown carrier code: '" + value + "'.");
            err.code = "UNKNOWN_CARRIER";
            throw err;
    }

    const newPhoneNo = '010' + newMiddle + varLast;
    return newPhoneNo;
}

function getCarrier(value) {
    value = value.replaceAll('-', '');

    if (!isValidPhone) {
        const err = new TypeError("Value '" + value + "' is not a valid phone number.");
        err.code = "NOT_PHONE_NUMBER";
        throw err;
    }

    if (is010(value)) {
        return getCarrier010(value);
    };
    return getCarrier01X(value);
}

function getCarrier010(value) {
    value = value.toString();

    const strMiddle = value.slice(3, 7);
    const strArea = value.slice(3, 5);

    const intMiddle = parseInt(strMiddle);
    const intArea = parseInt(strArea);

    // 010-2XXX-XXXX
    if (intArea == 20) return 'skt';
    if (intMiddle >= 2100 && intMiddle <= 2179) return 'skt';
    if (intMiddle >= 2180 && intMiddle <= 2199) return 'kt';
    if (intArea >= 22 && intArea <= 24) return 'lgt';
    if (intArea >= 25 && intArea <= 29) return 'kt';

    // 010-3XXX-XXXX
    if (intArea == 30) return 'kt';
    if (intArea == 31) return 'skt';
    if (intArea >= 32 && intArea <= 34) return 'kt';
    if (intArea >= 35 && intArea <= 38) return 'skt';
    if (intArea == 39) return 'lgt';

    // 010-4XXX-XXXX
    if (intArea >= 40 && intArea <= 41) return 'skt';
    if (intArea >= 42 && intArea <= 44) return 'kt';
    if (intArea >= 45 && intArea <= 49) return 'skt';

    // 010-5XXX-XXXX
    if (intArea == 50) return 'skt';
    if (intArea == 51) return 'kt';
    if (intArea >= 52 && intArea <= 54) return 'skt';
    if (intArea >= 55 && intArea <= 58) return 'lgt';
    if (intMiddle >= 5900 && intMiddle <= 5969) return 'skt';

    // 010-6XXX-XXXX
    if (intArea >= 62 && intArea <= 64) return 'skt';
    if (intArea >= 65 && intArea <= 68) return 'kt';

    // 010-7XXX-XXXX
    if (intArea == 71) return 'skt';
    if (intArea >= 72 && intArea <= 74) return 'kt';
    if (intArea >= 75 && intArea <= 77) return 'lgt';
    if (intArea == 79) return 'lgt';

    // 010-8XXX-XXXX
    if (intArea >= 80 && intArea <= 84) return 'lgt';
    if (intArea >= 85 && intArea <= 89) return 'skt';

    // 010-9XXX-XXXX
    if (intArea >= 90 && intArea <= 94) return 'skt';
    if (intArea >= 95 && intArea <= 99) return 'kt';

    // Matches none of above
    return 'unassigned';
}

function getCarrier01X(value) {
    const strFirst = value.toString().slice(0, 3);

    console.log(strFirst);
    console.log(typeof (strFirst));

    if (strFirst == '011' || strFirst == '017') return 'skt';
    else if (strFirst == '016' || strFirst == '018') return 'kt';
    else if (strFirst == '019') return 'lgt';
    else return 'unknown';
}

function getCarrierFriendly(carrier) {
    switch (carrier) {
        case 'skt':
            return 'SK Telecom';
        case 'kt':
            return 'KT';
        case 'lgt':
            return 'LG U+';
        default:
            return 'ERROR'
    }
}

function convertToFriendly(value) {
    if (typeof (value) != 'string') {
        const err = new TypeError("Value '" + value + "' is not String.");
        err.code = "NOT_STRING";
        throw err;
    }
    if (!isValidPhone(value)) {
        const err = new TypeError("Value '" + value + "' is not a valid phone number.");
        err.code = "NOT_PHONE_NUMBER";
        throw err;
    }

    value = value.replaceAll('-', '');

    let is10Digit = (value.length == 10) ? true : false;
    let lastSegmentIndex = is10Digit ? 6 : 7;

    let varFirst = value.slice(0, 3);
    let varMiddle = value.slice(3, lastSegmentIndex);
    let varLast = value.slice(lastSegmentIndex);

    const splittedPhoneNo = varFirst + '-' + varMiddle + '-' + varLast;
    return splittedPhoneNo;
}

function showError(isError, message = "") {
    const inputPhone = document.getElementById('inputPhone');
    const validationText = document.getElementById('validationText');

    if (!isError) {
        inputPhone.classList.remove('is-invalid');
        validationText.classList.add('is-hidden');

        return;
    }

    inputPhone.classList.add('is-invalid');
    validationText.classList.remove('is-hidden');

    validationText.innerText = message;
}

function updateResult(carrier, number, numFriendly) {
    const resultCarrier = document.getElementById("resultCarrier");
    const resultNumber = document.getElementById("resultNumber");
    const resultFriendly = document.getElementById("resultFriendly");

    resultCarrier.innerText = carrier;
    resultNumber.innerText = number;
    resultFriendly.innerText = numFriendly;
}

function submitData(isManual = false) {
    const value = document.getElementById('inputPhone').value;

    // Simple input value validation
    let valueValidationResult = "";
    valueValidationResult = !is010(value) ? valueValidationResult : "NOT_01X"
    valueValidationResult = isValidPhone(value) ? valueValidationResult : "NOT_PHONENO"

    switch (valueValidationResult) {
        case 'NOT_01X':
            isManual ? showError(true, "010 형식의 전화번호입니다.") : null;
            return;
        case 'NOT_PHONENO':
            isManual ? showError(true, "올바르지 않은 전화번호입니다.") : null;
            return;
        case "ERR_CARRIER":
            isManual ? showError(true, "올바르지 않은 통신사 식별번호입니다.") : null;
            updateResult("ERROR", "ERROR", "ERROR");
            return;
    }

    let newPhone;

    try {
        newPhone = convertTo010(value);
    } catch (error) {
        switch (error.code) {
            case "NOT_PHONE_NUMBER":
                console.error(error);
                isManual ? showError(true, "010 형식의 전화번호입니다.") : null;
                //isManual ? updateResult("ERROR", "ERROR", "ERROR") : null;
                return

            case "NOT_01X":
                console.error(error);
                isManual ? showError(true, "올바르지 않은 전화번호입니다.") : null;
                //isManual ? updateResult("ERROR", "ERROR", "ERROR") : null;
                return

            case "UNKNOWN_AREACODE_SKT":
                console.error(error);
                isManual ? showError(true, "변환에 실패했습니다. (데이터베이스에 등록되지 않음)") : null;
                isManual ? updateResult(getCarrierFriendly('skt'), "ERROR", "ERROR") : null;
                return

            case "UNKNOWN_AREACODE_KT":
                console.error(error);
                isManual ? showError(true, "변환에 실패했습니다. (데이터베이스에 등록되지 않음)") : null;
                isManual ? updateResult(getCarrierFriendly('kt'), "ERROR", "ERROR") : null;
                return

            case "UNKNOWN_AREACODE_LGT":
                console.error(error);
                isManual ? showError(true, "변환에 실패했습니다. (데이터베이스에 등록되지 않음)") : null;
                isManual ? updateResult(getCarrierFriendly('lgt'), "ERROR", "ERROR") : null;
                return

            case "UNKNOWN_CARRIER":
                console.error(error);
                isManual ? showError(true, "올바르지 않은 통신사 식별번호입니다.") : null;
                isManual ? updateResult("ERROR", "ERROR", "ERROR") : null;
                return

            default:
                console.error(error);
                isManual ? showError(true, "알 수 없는 오류가 발생했습니다.") : null;
                isManual ? updateResult("ERROR", "ERROR", "ERROR") : null;
                return
        }
    }

    let carrier = getCarrierFriendly(getCarrier(value));
    let newFriendly = convertToFriendly(newPhone);

    updateResult(carrier, newPhone, newFriendly);
}

// https://stackoverflow.com/questions/71873824/copy-text-to-clipboard-cannot-read-properties-of-undefined-reading-writetext
function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', () => {
    const valueInput = document.getElementById('inputPhone');
    const btnCopyList = document.querySelectorAll('.link-copy');

    valueInput.addEventListener('change', (event) => {
        console.log('change');
        console.log(event);
    })

    valueInput.addEventListener('input', () => {
        showError(false);
        updateResult('', '', '');
        submitData(isManual = false);
    })

    valueInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            updateResult('', '', '');
            submitData(isManual = true);
        }
    })

    btnCopyList.forEach((elem) => {

        const toolip = new bootstrap.Tooltip(elem, {'trigger': 'manual', 'html': true, 'customClass': 'custom-tooltip', 'title': '<div><i class="bi bi-check-lg"></i> <span>복!사</span></div>'});

        elem.addEventListener('click', () => {
            copyTargetId = elem.getAttribute('copy-target');
            copyTarget = document.getElementById(copyTargetId);
            unsecuredCopyToClipboard(copyTarget.innerText)

            toolip.show();
            setTimeout(() => {
                toolip.hide()
            }, 2000);
        });
    });
})