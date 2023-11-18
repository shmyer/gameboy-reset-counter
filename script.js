// script.js
let buttonStates = {
    'X': false,
    'O': false,
    'Share': false,
    'Options': false
};

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

    // Detect the controller type based on the vendor ID
    const isXboxController = gamepad.vendor === 0x045E;

    // Map button indices to button names
    const ps4ButtonMap = {
        '0': 'X',
        '1': 'O',
        '8': 'Share',
        '9': 'Options'
    };

    const xboxButtonMap = {
        '2': 'A', // Xbox A button
        '3': 'B', // Xbox B button
        '6': 'Back', // Xbox Back button
        '7': 'Start' // Xbox Start button
    };

    // Use the correct button map based on the controller type
    const buttonMap = isXboxController ? xboxButtonMap : ps4ButtonMap;

    // Iterate over the specific buttons (X, O, Share, Options)
    Object.entries(buttonMap).forEach(([index, buttonName]) => {
        const button = gamepad.buttons[index];
        if (button && button.pressed) {
            if (!isXboxController) {
                // Only update the button states if it's not an Xbox controller
                buttonStates[buttonName] = true;
            }
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
    });

    // Listen for gamepad disconnection
    window.addEventListener('gamepaddisconnected', (event) => {
        console.log('Gamepad disconnected from index %d: %s',
            event.gamepad.index, event.gamepad.id);
    });

    // Check for gamepad input every 100 milliseconds
    setInterval(gamepadHandler, 100);
} else {
    console.error('Gamepad API not supported, please use a modern browser.');
}

// Refresh counter after page load
window.addEventListener('load', () => {
    updateCounter();
});

// Manual increment and decrement functions
function updateCounterManually() {
    const manualCounterValue = parseInt(document.getElementById('manualCounter').value) || 0;
    counter = manualCounterValue;
    updateCounter();
}
