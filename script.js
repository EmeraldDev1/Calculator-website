// --- Core Data and Logic ---

let people = {};
const TAX_RATE = 0.05; // 5%

function calculatePersonTotal(personName) {
    const person = people[personName];
    if (!person) return null;

    // 1. Calculate the subtotal before tax (Total of all items)
    const subtotalBeforeTax = person.items.reduce((sum, item) => sum + item.cost, 0);

    // 2. Calculate the tax (5% of Item Total)
    const taxAmount = subtotalBeforeTax * TAX_RATE;

    // 3. Subtotal after tax
    const subtotalAfterTax = subtotalBeforeTax + taxAmount;

    // 4. Calculate the sum of custom fees (Fees are not taxed)
    const totalFees = person.fees.reduce((sum, fee) => sum + fee.cost, 0);

    // 5. Final Total (Subtotal after tax + Fees)
    const totalWithFees = subtotalAfterTax + totalFees;

    return {
        subtotalBeforeTax: subtotalBeforeTax,
        taxAmount: taxAmount,
        subtotalAfterTax: subtotalAfterTax,
        totalFees: totalFees,
        totalWithFees: totalWithFees
    };
}

// --- UI Interaction Functions ---

function updateUI() {
    const peopleListDiv = document.getElementById('peopleList');
    peopleListDiv.innerHTML = ''; // Clear existing content

    const personNames = Object.keys(people);
    
    if (personNames.length === 0) {
        peopleListDiv.innerHTML = '<p class="placeholder-text">Add a person to begin tracking items and fees.</p>';
        return;
    }

    personNames.forEach(name => {
        const breakdown = calculatePersonTotal(name);
        const card = document.createElement('div');
        card.className = 'person-card';
        
        // Inputs for Items and Fees
        const itemInput = `
            <div class="input-row">
                <input type="text" id="${name}-itemName" placeholder="Item Name" size="12">
                <input type="number" id="${name}-itemCost" placeholder="Cost" min="0" step="0.01" size="5">
                <button onclick="addItemToPerson('${name}')">Add Item</button>
            </div>`;
        const feeInput = `
            <div class="input-row" style="margin-top: 10px;">
                <input type="text" id="${name}-feeName" placeholder="Fee Name" size="12">
                <input type="number" id="${name}-feeCost" placeholder="Cost" min="0" step="0.01" size="5">
                <button onclick="addFeeToPerson('${name}')">Add Fee</button>
            </div>`;

        // Breakdown Display
        const totalsDisplay = `
            <div class="totals">
                <h3>Calculations for ${name}:</h3>
                <p>Items: ${person.items.map(i => `${i.name} ($${i.cost.toFixed(2)})`).join(', ')}</p>
                <p>Fees: ${person.fees.map(f => `${f.name} ($${f.cost.toFixed(2)})`).join(', ')}</p>
                <hr>
                <div>Subtotal (Before Tax): $${breakdown.subtotalBeforeTax.toFixed(2)}</div>
                <div>Tax (5%): $${breakdown.taxAmount.toFixed(2)}</div>
                <div>Subtotal (After Tax): $${breakdown.subtotalAfterTax.toFixed(2)}</div>
                <div>Custom Fees: $${breakdown.totalFees.toFixed(2)}</div>
                <div class="final-total">TOTAL DUE: $${breakdown.totalWithFees.toFixed(2)}</div>
            </div>`;

        card.innerHTML = `
            <h3>${name}</h3>
            ${itemInput}
            ${feeInput}
            ${totalsDisplay}
        `;
        peopleListDiv.appendChild(card);
    });
}

// Handlers for Input Buttons
function addPersonFromInput() {
    const nameInput = document.getElementById('personNameInput');
    const name = nameInput.value.trim();
    if (name && !people[name]) {
        people[name] = { items: [], fees: [] };
        nameInput.value = ''; // Clear input
        updateUI();
    }
}

function addItemToPerson(personName) {
    const itemName = document.getElementById(`${personName}-itemName`).value.trim();
    const itemCost = parseFloat(document.getElementById(`${personName}-itemCost`).value);

    if (itemName && !isNaN(itemCost) && itemCost >= 0) {
        people[personName].items.push({ name: itemName, cost: itemCost });
        document.getElementById(`${personName}-itemName`).value = '';
        document.getElementById(`${personName}-itemCost`).value = '';
        updateUI();
    }
}

function addFeeToPerson(personName) {
    const feeName = document.getElementById(`${personName}-feeName`).value.trim();
    const feeCost = parseFloat(document.getElementById(`${personName}-feeCost`).value);

    if (feeName && !isNaN(feeCost) && feeCost >= 0) {
        people[personName].fees.push({ name: feeName, cost: feeCost });
        document.getElementById(`${personName}-feeName`).value = '';
        document.getElementById(`${personName}-feeCost`).value = '';
        updateUI();
    }
}

// Initial UI setup (if needed, though updateUI handles the initial state)
document.addEventListener('DOMContentLoaded', updateUI);
