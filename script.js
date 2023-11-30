const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();

// Set circle color to grey:
setIndicator("#ccc");

// Set Password Length:
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
    // Generating random no b/w 0 - 1 and then multiplying
    // with the range and then adding min to get the req. no

    // Math.floor is used for rounding off.
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const ind = getRndInteger(0, symbols.length);
    return symbols[ind];
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }

    catch(e){
        copyMsg.innerText = "Failed";
    }

    // To make Copy span visible using CSS:
    copyMsg.classList.add("active");

    // To make the Copy Span invisible after 2 sec:
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

// Function for handling the status change of checkboxes:

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    })

    // Special Condition:
    if(checkCount > passwordLength){
        passwordLength = checkCount;
    }

    handleSlider();
}

// Adding event listeners on all checkboxes using a loop:
allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// Password Shuffle Function:
function shufflePassword(passArray){
    // Fisher Yates method:
    for (let i = passArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = passArray[i];
        passArray[i] = passArray[j];
        passArray[j] = temp;
      }
    let str = "";
    passArray.forEach((el) => (str += el));
    return str;
}

// Event Listener for Generate Button:

generateBtn.addEventListener('click', () =>{

    if(checkCount == 0) return;

    if(checkCount > passwordLength){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    passwordDisplay.value = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // Putting all the checked characters serially:
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // Handling the rest characters:
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffling the Password(sending the array in the form of an array):
    password = shufflePassword(Array.from(password));

    // Displaying Password:
    passwordDisplay.value = password;

    // Re-calculating Strength:
    calcStrength();
})





