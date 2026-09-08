let count = 0;

function addToCart() {
    count++;
    document.getElementById("cart-count").innerText = count;
    alert("Item added to cart!");
}
const totalStorageGB = 1000; // Total 1TB (1000 GB)
let currentUsedGB = 0;

function toggleGame(cardElement, sizeGB) {
    if (cardElement.classList.contains('selected')) {
        // Deselect Game
        cardElement.classList.remove('selected');
        currentUsedGB -= sizeGB;
    } else {
        // Check Space Capacity
        if (currentUsedGB + sizeGB > totalStorageGB) {
            alert('Storage Full! Remove a game to install this one.');
            return;
        }
        // Select Game
        cardElement.classList.add('selected');
        currentUsedGB += sizeGB;
    }

    updateStorageBar();
}

function updateStorageBar() {
    const freeStorageGB = totalStorageGB - currentUsedGB;
    const percentage = (currentUsedGB / totalStorageGB) * 100;

    // Update UI Elements
    document.getElementById('used-space').innerText = currentUsedGB;
    document.getElementById('free-space').innerText = freeStorageGB;
    
    const progressBar = document.getElementById('storage-bar');
    progressBar.style.width = percentage + '%';

    // Change color if storage gets too high (> 85%)
    if (percentage > 85) {
        progressBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4d4d 100%)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, var(--primary) 0%, #ff6b6b 100%)';
    }
}let totalStorageGB = 1000; // Default capacity 1000 GB
let currentUsedGB = 0;

// Drive Capacity වෙනස් වෙනකොට Run වෙන Function එක
function changeDriveCapacity() {
    const selectElement = document.getElementById('drive-capacity');
    totalStorageGB = parseInt(selectElement.value);

    // Selected Games Capacity එක අලුත් Drive එකට වඩා වැඩිනම් warning දීලා reset කරනවා
    if (currentUsedGB > totalStorageGB) {
        alert("Selected games exceed new storage limit! Resetting selections.");
        resetGameSelections();
    } else {
        updateStorageBar();
    }
}

// Game එක මත Click කරද්දී Select / Deselect වෙන Function එක
function toggleGame(cardElement, sizeGB) {
    if (cardElement.classList.contains('selected')) {
        // Deselect Game
        cardElement.classList.remove('selected');
        currentUsedGB -= sizeGB;
    } else {
        // Check Space Availability
        if (currentUsedGB + sizeGB > totalStorageGB) {
            alert('Storage Full! Remove a game or choose a larger drive capacity.');
            return;
        }
        // Select Game
        cardElement.classList.add('selected');
        currentUsedGB += sizeGB;
    }

    updateStorageBar();
}

// All Selected Games Reset කරන Function එක
function resetGameSelections() {
    currentUsedGB = 0;
    const cards = document.querySelectorAll('.game-select-card');
    cards.forEach(card => card.classList.remove('selected'));
    updateStorageBar();
}

// Live UI update කරන Function එක
function updateStorageBar() {
    const freeStorageGB = totalStorageGB - currentUsedGB;
    const percentage = (currentUsedGB / totalStorageGB) * 100;

    // UI Updates
    document.getElementById('total-capacity').innerText = totalStorageGB + " GB";
    document.getElementById('used-space').innerText = currentUsedGB;
    document.getElementById('free-space').innerText = freeStorageGB;
    
    const progressBar = document.getElementById('storage-bar');
    progressBar.style.width = percentage + '%';


    // Space එක 85% කට වඩා පිරුනොත් Bar එක රතු පාට වෙනවා
    if (percentage > 85) {
        progressBar.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4d4d 100%)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, var(--primary) 0%, #ff6b6b 100%)';
    }
}// Storage System State
let ssdCapacity = 1000;
let hddCapacity = 2000;

let ssdUsed = 0;
let hddUsed = 0;

// Track Installed Games: { 'game-card-1': 'SSD', 'game-card-2': 'HDD' }
let installedGames = {}; 

function updateStorageSystem() {
    // Read Capacity
    ssdCapacity = parseInt(document.getElementById('ssd-capacity').value);
    hddCapacity = parseInt(document.getElementById('hdd-capacity').value);

    // Read Brands
    const ssdBrand = document.getElementById('ssd-brand').value;
    const hddBrand = document.getElementById('hdd-brand').value;

    // Update Labels
    document.getElementById('ssd-brand-lbl').innerText = ssdBrand;
    document.getElementById('ssd-total-lbl').innerText = ssdCapacity + "GB";
    document.getElementById('hdd-brand-lbl').innerText = hddBrand;
    document.getElementById('hdd-total-lbl').innerText = hddCapacity + "GB";

    renderUI();
}

function installGame(gameName, sizeGB, driveType, cardId) {
    const currentDrive = installedGames[cardId];

    // If clicking same drive, Uninstall it
    if (currentDrive === driveType) {
        if (driveType === 'SSD') ssdUsed -= sizeGB;
        if (driveType === 'HDD') hddUsed -= sizeGB;
        delete installedGames[cardId];
    } else {
        // If moving from other drive first, remove from old drive
        if (currentDrive === 'SSD') ssdUsed -= sizeGB;
        if (currentDrive === 'HDD') hddUsed -= sizeGB;

        // Try installing to new Drive
        if (driveType === 'SSD') {
            if (ssdUsed + sizeGB > ssdCapacity) {
                alert(`Not enough space on SSD for ${gameName}!`);
                return;
            }
            ssdUsed += sizeGB;
            installedGames[cardId] = 'SSD';
        } else if (driveType === 'HDD') {
            if (hddCapacity === 0) {
                alert("No HDD configured! Select HDD Capacity above.");
                return;
            }
            if (hddUsed + sizeGB > hddCapacity) {
                alert(`Not enough space on HDD for ${gameName}!`);
                return;
            }
            hddUsed += sizeGB;
            installedGames[cardId] = 'HDD';
        }
    }

    renderUI();
}

function renderUI() {
    // SSD Bar Update
    const ssdFree = ssdCapacity - ssdUsed;
    const ssdPct = ssdCapacity > 0 ? (ssdUsed / ssdCapacity) * 100 : 0;
    document.getElementById('ssd-used-lbl').innerText = ssdUsed;
    document.getElementById('ssd-free-lbl').innerText = ssdFree;
    document.getElementById('ssd-bar').style.width = ssdPct + '%';

    // HDD Bar Update
    const hddFree = hddCapacity - hddUsed;
    const hddPct = hddCapacity > 0 ? (hddUsed / hddCapacity) * 100 : 0;
    document.getElementById('hdd-used-lbl').innerText = hddUsed;
    document.getElementById('hdd-free-lbl').innerText = hddFree;
    document.getElementById('hdd-bar').style.width = hddPct + '%';

    // Update Card Borders based on status
    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`game-card-${i}`);
        const status = installedGames[`game-card-${i}`];
        if (status === 'SSD') {
            card.style.borderColor = '#ff2a2a';
        } else if (status === 'HDD') {
            card.style.borderColor = '#0072ff';
        } else {
            card.style.borderColor = '#1a1c22';
        }
    }
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    updateStorageSystem();
});