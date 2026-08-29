let balance = 100;
let bet = 10;

const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "7️", "🍇", "💎", "🔔"];

function spin()
{
    if (balance < bet)
    {
        document.getElementById("message").textContent = "Not enough credits!";
        return;
    }

    balance -= bet;

    let reel1 = symbols[Math.floor(Math.random() * symbols.length)];
    let reel2 = symbols[Math.floor(Math.random() * symbols.length)];
    let reel3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById("reel1").textContent = reel1;
    document.getElementById("reel2").textContent = reel2;
    document.getElementById("reel3").textContent = reel3;

    let win = 0;

    if (reel1 === reel2 && reel2 === reel3)
    {
        win = bet * 10;
        document.getElementById("message").textContent = "JACKPOT!";
    }
    else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3)
    {
        win = bet * 2;
        document.getElementById("message").textContent = "WIN!";
    }
    else
    {
        document.getElementById("message").textContent = "Try again!";
    }

    balance += win;

    document.getElementById("balance").textContent = balance;
}