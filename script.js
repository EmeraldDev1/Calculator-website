// --- script.js ---

// Ensure the code runs only after the full HTML document is loaded
document.addEventListener('DOMContentLoaded', function() {

    let people = {};
    const TAX_RATE = 0.05; // 5%

    // --- Core Logic (Unchanged) ---

    function calculatePersonTotal(personName) {
        const person = people[personName];
        if (!person) return null;

        const subtotalBeforeTax = person.items.reduce((sum, item) => sum + item.cost, 0);
        const taxAmount = subtotalBeforeTax * TAX_RATE;
        const subtotalAfterTax = subtotalBeforeTax + taxAmount;
        const totalFees = person.fees.reduce((sum, fee) => sum + fee.cost, 0);
        const totalWithFees = subtotalAfterTax + totalFees;

        return {
            subtotalBeforeTax: subtotalBeforeTax,
            taxAmount: taxAmount,
            subtotalAfterTax: subtotalAfterTax,
            totalFees: totalFees,
            totalWithFees: totalWithFees
        };
    }

    // --- UI Interaction Functions (Modified for Robustness) ---

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
            const person = people[name]; 
            
            const card = document.createElement('div');
            card.className = 'person-card';

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

            const totalsDisplay = `
                <div class="totals">
                    <h3>Calculations:</h3>
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

    // Making these functions globally accessible since they are called from HTML 'onclick'
    window.addPersonFromInput = function() {
        const nameInput = document.getElementById('personNameInput');
        const name = nameInput.value.trim();

        if (name && !people[name]) {
            people[name] = { 
                items: [], 
                fees: [] 
            };
            nameInput.value = ''; 
            updateUI();
        } else if (people[name]) {
            alert(`Person "${name}" is already added!`); 
        }
    }

    window.addItemToPerson = function(personName) {
        const itemName = document.getElementById(`${personName}-itemName`).value.trim();
        const itemCostElement = document.getElementById(`${personName}-itemCost`);
        const itemCost = parseFloat(itemCostElement.value);

        if (itemName && !isNaN(itemCost) && itemCost > 0) {
            people[personName].items.push({ name: itemName, cost: itemCost });
            document.getElementById(`${personName}-itemName`).value = '';
            itemCostElement.value = '';
            updateUI();
        } else {
            alert("Please enter a name and a valid cost greater than zero.");
        }
    }

    window.addFeeToPerson = function(personName) {
        const feeName = document.getElementById(`${personName}-feeName`).value.trim();
        const feeCostElement = document.getElementById(`${personName}-feeCost`);
        const feeCost = parseFloat(feeCostElement.value);

        if (feeName && !isNaN(feeCost) && feeCost >= 0) {
            people[personName].fees.push({ name: feeName, cost: feeCost });
            document.getElementById(`${personName}-feeName`).value = '';
            feeCostElement.value = '';
            updateUI();
        } else {
            alert("Please enter a name and a valid cost.");
        }
    }

    // Initial call to set up the empty state
    updateUI();

}); // End of DOMContentLoaded wrapper
