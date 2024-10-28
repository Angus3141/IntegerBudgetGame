// Variables
let balance = 5; // Start with an initial balance of $5
let score = 0;
let initialNegativeScenarios = [
    { text: "You spend $15 on a new game.", change: -15 },
    { text: "You donate $5 to charity.", change: -5 },
    { text: "Unexpected expense: car repairs cost $35.", change: -35 },
];
let availableScenarios = [
    { text: "You find $12 on the ground.", change: 12 },
    { text: "You lose $8 from your wallet.", change: -8 },
    { text: "You win a $25 prize in a competition.", change: 25 },
    { text: "You buy lunch for $7.", change: -7 },
    { text: "You get $20 for your birthday.", change: 20 },
    { text: "You earn $10 doing chores.", change: 10 },
    { text: "You have to pay $40 to fix a broken window.", change: -40 },
    { text: "You lend $10 to a friend.", change: -10 },
    { text: "You receive $50 from a family member.", change: 50 },
    { text: "You pay a $20 fine.", change: -20 },
    { text: "You earn $18 babysitting.", change: 18 },
    { text: "You buy a book for $12.", change: -12 },
    { text: "You receive a refund of $15.", change: 15 },
];
let usedScenarios = []; // Tracks used scenarios

// DOM Elements
const scenarioEl = document.getElementById('scenario');
const balanceEl = document.getElementById('balance');
const newBalanceInput = document.getElementById('new-balance');
const submitBtn = document.getElementById('submit-btn');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const numberLineEl = document.getElementById('number-line');

// Functions
function generateScenario() {
    let scenario;

    // First three scenarios must be from initialNegativeScenarios
    if (initialNegativeScenarios.length > 0) {
        scenario = initialNegativeScenarios.shift(); // Get and remove the first negative scenario
    } else {
        // Reset scenarios if all have been used
        if (availableScenarios.length === 0) {
            availableScenarios = usedScenarios;
            usedScenarios = [];
        }

        // Select a random scenario from availableScenarios
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        scenario = availableScenarios[randomIndex];

        // Move selected scenario to usedScenarios and remove from availableScenarios
        usedScenarios.push(scenario);
        availableScenarios.splice(randomIndex, 1);
    }

    // Update scenario text
    scenarioEl.textContent = scenario.text;
    return scenario;
}

function updateNumberLine() {
    numberLineEl.innerHTML = ''; // Clear previous number line
    const start = balance - 10;
    const end = balance + 10;

    for (let i = start; i <= end; i++) {
        const position = ((i - start) / (end - start)) * 100;
        
        // Create tick
        const tick = document.createElement('div');
        tick.classList.add('tick');
        tick.style.left = `${position}%`;
        numberLineEl.appendChild(tick);

        // Create label
        const label = document.createElement('div');
        label.classList.add('tick-label');
        label.style.left = `${position}%`;
        label.textContent = i;
        if (i === balance) {
            label.classList.add('current-balance');
        }
        numberLineEl.appendChild(label);
    }
}

function checkAnswer(scenario) {
    const userAnswer = parseInt(newBalanceInput.value);
    const correctAnswer = balance + scenario.change;

    if (userAnswer === correctAnswer) {
        feedbackEl.textContent = "Correct!";
        score++;
    } else {
        feedbackEl.textContent = `Incorrect. The correct balance is $${correctAnswer}.`;
    }

    // Update balance and score
    balance = correctAnswer;
    balanceEl.textContent = `$${balance}`;
    scoreEl.textContent = score;

    // Clear input
    newBalanceInput.value = '';

    // Update number line and present new scenario
    updateNumberLine();
    const newScenario = generateScenario();
    submitBtn.onclick = () => checkAnswer(newScenario);
}

// Initialize Game
balanceEl.textContent = `$${balance}`; // Display initial balance
updateNumberLine();
const initialScenario = generateScenario();
submitBtn.onclick = () => checkAnswer(initialScenario);

// Allow submission with the Enter key
newBalanceInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitBtn.click();
    }
});
