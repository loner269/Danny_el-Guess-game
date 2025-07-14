const betButton = document.getElementById('placeBet');
const select = document.getElementsByTagName('p');
const addStake = document.getElementsByClassName('amountInput');
const selection = document.getElementsByName('number');
let guess = document.getElementById('guessInput').value;
const buttons = document.getElementsByTagName('button')
const clickSound = new Audio('img/clickSound.mp3')
const winSound = new Audio('img/winSound.mp3')
const lostSound = new Audio('img/lostSound.mp3')
let gameSound;
let hasInteracted = false;
const startGameSound = () => {
    if (hasInteracted) return;
    hasInteracted = true;

    gameSound = new Audio('img/gameSound.mp3');
    gameSound.loop = true;
    gameSound.volume = 0.5;
    gameSound.play().catch(err => console.warn('Autoplay blocked:', err));
};
['click', 'keydown', 'touchstart'].forEach(event => {
    window.addEventListener(event, startGameSound, { once: true });
});
document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('pastResults').addEventListener('click', pastResults);
document.addEventListener('click', function () {
    updateDisplay();
});
document.getElementById('myBets').addEventListener('click', () => {
    let hl = document.getElementById('historyList')
    hl.classList.toggle('show')
    document.getElementById('pastResultsDisplay').classList.toggle('show')
    if (!localStorage.getItem('betHistory')) {
        let div = document.createElement('div')
        div.style.height = '100%'
        div.style.display = 'flex'
        div.style.justifyContent = 'center'
        div.style.alignItems = 'center'
        div.innerHTML = 'No bets yet'
        hl.append(div)
        setTimeout(() => {
            hl.innerHTML = '';
            hl.classList.remove('show')
        }, 2000);
    }
})
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play()
        setTimeout(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
        }, 1000);
    });
}
for (let i = 0; i < select.length; i++) {
    select[i].addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('guessInput').value = select[i].innerText;
        let selection = document.getElementsByName('number');
        for (let i = 0; i < selection.length; i++) {
            selection[i].checked = false;
            clickSound.currentTime = 0;
            clickSound.play()
            setTimeout(() => {
                clickSound.pause();
                clickSound.currentTime = 0;
            }, 1000);
        }

    });
};
for (let i = 0; i < selection.length; i++) {
    selection[i].addEventListener('click', function () {
        document.getElementById('guessInput').value = selection[i].value;
        clickSound.currentTime = 0;
        clickSound.play()
        setTimeout(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
        }, 1000);
    })
}
for (let i = 0; i < addStake.length; i++) {
    let add = addStake[i].innerHTML;
    addStake[i].addEventListener('click', function () {
        switch (add) {
            case "+50":
                increase(50);
                break;
            case "+100":
                increase(100);
                break;
            case "+200":
                increase(200);
                break;
            case "+500":
                increase(500);
                break;
            case "All in":
                document.getElementById('stakeInput').value = parseFloat(document.getElementById('balanceInput').textContent);
                break;
            case "Clear":
                document.getElementById('stakeInput').value = 0;
        }
    })
}
betButton.addEventListener('click', function (event) {
    event.preventDefault();
    let stake = parseFloat(document.getElementById('stakeInput').value);
    let bal = parseFloat(document.getElementById('balanceInput').textContent);
    saveBalance();
    if (stake < 50) {
        showAlert2('Minimum stake is 50!');
        return;
    }
    else if (bal < stake) {
        showAlert2('Insufficient Balance!');
        return;
    } else if (document.getElementById('guessInput').value == '') {
        showAlert2('Pick Your Guess!')
        return;
    }
    else {
        document.getElementById('balanceInput').textContent = bal - stake;
        saveBalance();
        let guess = document.getElementById('guessInput').value;
        let result = Math.floor(Math.random() * 50) + 1;
        document.getElementById('resultInput').value = result;
        updateHistory(result);
        updateBetHistory();

        if (parseFloat(guess) == result) {
            play(6);
            return;
        }
        else if (guess === '1-10' && result > 0 && result < 11) {
            play(2.5);
            return;
        }
        else if (guess === '11-20' && result > 10 && result < 21) {
            play(2.5);
            return;
        }
        else if (guess === '21-30' && result > 20 && result < 31) {
            play(2.5);
            return;
        }
        else if (guess === '31-40' && result > 30 && result < 41) {
            play(2.5);
            return;
        }
        else if (guess === '41-50' && result > 40 && result < 51) {
            play(2.5);
            return;
        }
        else if (guess == 'odd' && document.getElementById('resultInput').value % 2 == 1) {
            play(1.75);
            return;
        }

        else if (guess == 'even' && document.getElementById('resultInput').value % 2 == 0) {
            play(1.75);
            return;
        }
        else {
            lostSound.play()
            let select = document.getElementsByTagName('p');
            for (let i = 0; i < select.length; i++) {
                if (select[i].innerText == document.getElementById('resultInput').value) {
                    select[i].style.backgroundColor = 'red';
                    select[i].classList.add('lose')
                    setTimeout(() => {
                        select[i].style.backgroundColor = '';
                        select[i].classList.remove('lose')
                    }, 2000);
                }
            }
            showAlert("You Lost! ", "red", "");
            return;
        };
    };
});
function increase(adder) {
    let stake = parseFloat(document.getElementById('stakeInput').value);
    document.getElementById('stakeInput').value = stake + adder;
}
function resetResult() {
    document.getElementById('resultInput').value = '';
}
function showAlert(message, color, amount) {
    const alertBox = document.getElementById('alert1');
    alertBox.value = message + amount;
    alertBox.style.display = 'block';
    alertBox.style.color = color;


    setTimeout(() => {
        alertBox.style.display = 'none';
        document.getElementById('resultInput').value = '';
        document.getElementById('guessInput').value = '';
        let selection = document.getElementsByName('number');
        for (let i = 0; i < selection.length; i++) {
            selection[i].checked = false;
        }
    }, 2000);
}
function animation() {
    let select = document.getElementsByTagName('p');
    for (let i = 0; i < select.length; i++) {
        if (select[i].innerText == document.getElementById('resultInput').value) {
            select[i].style.backgroundColor = 'green';
            select[i].classList.add('win')
            setTimeout(() => {
                select[i].style.backgroundColor = '';
                select[i].classList.remove('win')
            }, 2000);
        }
    }
}
function showAlert2(error) {
    document.getElementById('alert').innerText = error;
    document.getElementById('alert').style.display = 'block';
    document.getElementById('alert').style.color = 'red';
    setTimeout(() => {
        document.getElementById('alert').style.display = 'none';
    }, 1500);
    resetResult()
}
function play(multiplier) {
    let stake = parseFloat(document.getElementById('stakeInput').value);
    let profit = stake * multiplier;
    let bal = parseFloat(document.getElementById('balanceInput').textContent);
    document.getElementById('balanceInput').textContent = bal + profit;
    saveBalance()
    winSound.currentTime = 0.5;
    winSound.play();
    animation();
    setTimeout(() => {
        winSound.pause();
        winSound.currentTime = 0.5;
    }, 3500);
    showAlert("You won! ", "green", profit);
}
function resetGame() {
    localStorage.clear();
    document.getElementById('historyList').textContent = ""
    document.getElementById('balanceInput').textContent = 2000;
    document.getElementById('stakeInput').value = 50;
    document.getElementById('guessInput').value = '';
    document.getElementById('resultInput').value = '';
    document.getElementById('pastResultsDisplay').innerHTML = 'NO HISTORY YET!!'
    let selection = document.getElementsByName('number');
    for (let i = 0; i < selection.length; i++) {
        selection[i].checked = false;
    }
}
function updateHistory(result) {
    let resultHistory = JSON.parse(localStorage.getItem('resultHistory')) || [];
    resultHistory.unshift(result);
    if (resultHistory.length > 50) {
        resultHistory.pop();
    }
    localStorage.setItem('resultHistory', JSON.stringify(resultHistory));
}
function updateDisplay() {
    const pastResult = document.getElementById('pastResultsDisplay');
    let history = JSON.parse(localStorage.getItem('resultHistory')) || [];
    if (history.length === 0) {
        pastResult.innerHTML = 'NO HISTORY YET!!'
    } else {
        pastResult.innerHTML = history.map((r, i) => {
            return `${r}${((i + 1) % 10 === 0) ? '<br>' : ',  '}`;
        }).join('');
    }

}
function saveBalance() {
    let bal = document.getElementById('balanceInput').textContent;
    localStorage.setItem('balance', bal)
}
function pastResults() {
    document.getElementById('pastResultsDisplay').classList.toggle('show')
    document.getElementById('historyList').classList.remove('show')
}
function updateBetHistory() {
    let stake = parseFloat(document.getElementById('stakeInput').value);
    let guess = document.getElementById('guessInput').value;
    let result = document.getElementById('resultInput').value;
    const time = new Date().toLocaleTimeString();
    let status;
    let profit;
    if (parseFloat(guess) == result) {
        status = 'Won';
        profit = stake * 6;
    }
    else if (guess === '1-10' && result > 0 && result < 11) {
        status = 'Won';
        profit = stake * 2.5;
    }
    else if (guess === '11-20' && result > 10 && result < 21) {
        status = 'Won';
        profit = stake * 2.5;
    }
    else if (guess === '21-30' && result > 20 && result < 31) {
        status = 'Won';
        profit = stake * 2.5;
    }
    else if (guess === '31-40' && result > 30 && result < 41) {
        status = 'Won';
        profit = stake * 2.5;
    }
    else if (guess == 'odd' && document.getElementById('resultInput').value % 2 == 1) {
        status = 'Won';
        profit = stake * 1.75;
    }

    else if (guess == 'even' && document.getElementById('resultInput').value % 2 == 0) {
        status = 'Won';
        profit = stake * 1.75;
    }
    else {
        status = 'Lost';
        profit = ''
    }

    const entryData = {
        stake,
        guess,
        result,
        status,
        profit,
        time
    };

    let history = JSON.parse(localStorage.getItem('betHistory')) || [];
    history.unshift(entryData);
    localStorage.setItem('betHistory', JSON.stringify(history));
    updateBetHistoryDisplay(entryData);
}
function updateBetHistoryDisplay(entry) {
    const historyList = document.getElementById('historyList');
    const last = entry.status === 'Won' ? "color:green;" : "color: red;";
    const div = document.createElement('div');
    div.classList = 'div'
    div.innerHTML = `
      <div>
        <strong>Bet:</strong> ₦${entry.stake} |
        <strong>Guess:</strong> ${entry.guess} |
        <strong>Result:</strong> ${entry.result} |
        <strong style="${last}">${entry.status + entry.profit}</strong> |
     </div>
        <span>${entry.time}</span>
        <br><br>
  `;
    historyList.prepend(div);
}
function loadBetHistory() {
    const saved = JSON.parse(localStorage.getItem('betHistory')) || [];
    saved.reverse().forEach(updateBetHistoryDisplay);
}
if (localStorage.getItem('balance')) {
    document.getElementById('balanceInput').textContent = localStorage.getItem('balance');
} else {
    document.getElementById('balanceInput').textContent = 2000;
}
updateDisplay()
loadBetHistory()