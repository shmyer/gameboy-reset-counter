// script.js
let buttonStates = {
    'A': false,
    'B': false,
    'Select': false,
    'Start': false
};

let controllers = [
    {
        name: "PS4 Controller",
        vendor: "054c",
        buttonMappings: {
            0: 'A', // X
            1: 'B', // O
            8: 'Select', // Share
            9: 'Start' // Options
        }
    },
    {
        name: "Xbox Controller",
        vendor: "045e",
        buttonMappings: {
            2: 'A', // A
            3: 'B', // B
            6: 'Select', // Back
            7: 'Start' // Start
        }
    }
]

let connectedController;
let gamepadHandlerInterval;

let counter = parseInt(localStorage.getItem('counter')) || 0;
let lastPressTimestamp = 0;
const debounceDuration = 5000; // 5 seconds

function updateCounter() {
    document.getElementById('counter').textContent = counter;
    localStorage.setItem('counter', counter);
}

function incrementCounter() {
    counter++;
    updateCounter();
}

function decrementCounter() {
    counter--;
    updateCounter();
}

function resetApplication() {
    counter = 0;
    updateCounter();
    localStorage.removeItem('counter');
}

function checkButtonCombination() {
    const buttonsPressed = Object.values(buttonStates).every(state => state);
    if (buttonsPressed) {
        const currentTimestamp = Date.now();
        if (currentTimestamp - lastPressTimestamp >= debounceDuration) {
            lastPressTimestamp = currentTimestamp;
            incrementCounter();
        }
    }
}

function gamepadHandler() {
    const gamepad = navigator.getGamepads()[0];

    if (!gamepad) {
        return;
    }

    // Iterate over the specific buttons (X, O, Share, Options)
    Object.entries(connectedController.buttonMappings).forEach(([index, buttonName]) => {
        const button = gamepad.buttons[index];
        if (button && button.pressed) {
            buttonStates[buttonName] = true;
        } else {
            buttonStates[buttonName] = false;
        }
    });

    checkButtonCombination();
}

// Check for gamepad support
if ('getGamepads' in navigator) {
    // Listen for gamepad connection
    window.addEventListener('gamepadconnected', (event) => {
        console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
            event.gamepad.index, event.gamepad.id,
            event.gamepad.buttons.length, event.gamepad.axes.length);

        connectedController = controllers.find(controller => event.gamepad.id.includes(controller.vendor));

        // Check for gamepad input every 100 milliseconds
        gamepadHandlerInterval = setInterval(gamepadHandler, 100);
    });

    // Listen for gamepad disconnection
    window.addEventListener('gamepaddisconnected', (event) => {
        console.log('Gamepad disconnected from index %d: %s',
            event.gamepad.index, event.gamepad.id);

        connectedController = undefined;
        clearInterval(gamepadHandlerInterval);
        gamepadHandlerInterval = undefined;
    });

} else {
    console.error('Gamepad API not supported, please use a modern browser.');
}

// Refresh counter after page load
window.addEventListener('load', () => {
    updateCounter();
});

// Manual increment and decrement functions
function updateCounterManually() {
    counter = parseInt(document.getElementById('manualCounter').value) || 0;
    updateCounter();
}
