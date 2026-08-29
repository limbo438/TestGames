let balance = 100;
let bet = 10;

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️", "💎"];

const reel1 = document.getElementById("reel1");
const reel2 = document.getElementById("reel2");
const reel3 = document.getElementById("reel3");

const balanceText = document.getElementById("balance");
const betText = document.getElementById("bet");
const message = document.getElementById("message");

const spinButton = document.getElementById("spinButton");
const restartButton = document.getElementById("restartButton");
const minusBetButton = document.getElementById("minusBetButton");
const plusBetButton = document.getElementById("plusBetButton");

const symbolHeight = 80;

let spinning = false;

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function createReel(reel) {
    reel.innerHTML = "";

    for (let i = 0; i < 50; i++) {
        const symbol = document.createElement("div");

        symbol.className = "symbol";
        symbol.textContent = randomSymbol();

        reel.appendChild(symbol);
    }
}

function spinReel(reel, duration) {
    return new Promise(function (resolve) {
        const startIndex = 35 + Math.floor(Math.random() * 5);
        const startPosition = -(startIndex * symbolHeight);
        const spins = 12 + Math.floor(Math.random() * 6);
        const endPosition = startPosition + spins * symbolHeight;

        reel.style.transform = `translateY(${startPosition}px)`;

        const startTime = performance.now();

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const position = startPosition + (endPosition - startPosition) * eased;

            reel.style.transform = `translateY(${position}px)`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
            else {
                reel.style.transform = `translateY(${endPosition}px)`;
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}

function getCenterSymbol(reel) {
    const reelWindow = reel.parentElement;
    const windowRect = reelWindow.getBoundingClientRect();
    const centerY = windowRect.top + windowRect.height / 2;
    const reelSymbols = reel.querySelectorAll(".symbol");

    for (const symbol of reelSymbols) {
        const rect = symbol.getBoundingClientRect();

        if (centerY >= rect.top && centerY < rect.bottom)
            return symbol.textContent;
    }

    return null;
}

function updateBet() {
    betText.textContent = bet;

    minusBetButton.disabled = bet <= 10;
    plusBetButton.disabled = bet >= balance;
}

async function spin() {
    if (spinning)
        return;

    if (balance < bet) {
        message.textContent = "Not enough credits!";
        spinButton.style.display = "none";
        restartButton.style.display = "inline-block";
        return;
    }

    spinning = true;

    balance -= bet;

    balanceText.textContent = balance;

    updateBet();

    spinButton.disabled = true;
    minusBetButton.disabled = true;
    plusBetButton.disabled = true;

    message.textContent = "";

    const spin1 = spinReel(reel1, 2000);
    const spin2 = spinReel(reel2, 2500);
    const spin3 = spinReel(reel3, 3000);

    await Promise.all([spin1, spin2, spin3]);

    const result1 = getCenterSymbol(reel1);
    const result2 = getCenterSymbol(reel2);
    const result3 = getCenterSymbol(reel3);

    let win = 0;

    if (result1 === result2 && result2 === result3) {
        win = bet * 10;
        message.textContent = "JACKPOT!";
    }
    else if (result1 === result2 || result2 === result3 || result1 === result3) {
        win = bet * 2;
        message.textContent = "WIN!";
    }
    else {
        message.textContent = "Try again!";
    }

    balance += win;

    balanceText.textContent = balance;

    spinning = false;
    spinButton.disabled = false;

    updateBet();

    if (balance < 10) {
        spinButton.style.display = "none";
        restartButton.style.display = "inline-block";
    }
}

function restart() {
    balance = 100;
    bet = 10;

    balanceText.textContent = balance;

    message.textContent = "";

    spinButton.style.display = "inline-block";
    restartButton.style.display = "none";

    spinButton.disabled = false;

    spinning = false;

    createReel(reel1);
    createReel(reel2);
    createReel(reel3);

    updateBet();
}

minusBetButton.addEventListener("click", function () {
    if (spinning)
        return;

    bet = Math.max(10, bet - 10);
    updateBet();
});

plusBetButton.addEventListener("click", function () {
    if (spinning)
        return;

    bet = Math.min(balance, bet + 10);
    updateBet();
});

spinButton.addEventListener("click", spin);

restartButton.addEventListener("click", restart);

createReel(reel1);
createReel(reel2);
createReel(reel3);

updateBet();