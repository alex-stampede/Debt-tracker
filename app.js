document.addEventListener('DOMContentLoaded', function() {
    const totalBalanceEl = document.getElementById('total-balance');
    const conceptInput = document.getElementById('concept');
    const amountInput = document.getElementById('amount');
    const monthsInput = document.getElementById('months');
    const dueDateInput = document.getElementById('due-date');
    const addDebtBtn = document.getElementById('add-debt');
    const debtsList = document.getElementById('debts-list');
    const clearAllBtn = document.getElementById('clear-all');

    let totalBalance = 0;
    let debts = JSON.parse(localStorage.getItem('debts')) || [];

    function updateTotalBalance() {
        totalBalance = debts.reduce((acc, debt) => acc + debt.amount, 0);
        totalBalanceEl.textContent = totalBalance;
    }

    function renderDebts() {
        debtsList.innerHTML = '';
        debts.forEach((debt, index) => {
            const debtEl = document.createElement('div');
            debtEl.className = 'notification';
            debtEl.innerHTML = `
            <div class="concepto">
                <div class="notification-title">${debt.concept}</div>
                <div class="notification-text">Cantidad: $${debt.amount}</div>
                <div class="notification-text">Mensualidades restantes: ${debt.months}</div>
                <div class="notification-text">Fecha de pago: ${debt.dueDate}</div>
            </div>
            <div class="botones">    
                <button class="pay-month" data-index="${index}">Pagar mensualidad</button>
                <button class="delete-debt" data-index="${index}">Eliminar deuda</button>
            </div>    
            `;
            debtsList.appendChild(debtEl);
        });
    }

    function saveDebts() {
        localStorage.setItem('debts', JSON.stringify(debts));
    }

    addDebtBtn.addEventListener('click', () => {
        const concept = conceptInput.value;
        const amount = parseFloat(amountInput.value);
        const months = parseInt(monthsInput.value);
        const dueDate = dueDateInput.value;

        if (concept && !isNaN(amount) && !isNaN(months) && dueDate) {
            debts.push({ concept, amount, months, dueDate });
            updateTotalBalance();
            renderDebts();
            saveDebts();
            conceptInput.value = '';
            amountInput.value = '';
            monthsInput.value = '';
            dueDateInput.value = '';
        }
    });

    debtsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('pay-month')) {
            const index = e.target.dataset.index;
            debts[index].months -= 1;
            debts[index].amount -= debts[index].amount / debts[index].months;
            if (debts[index].months <= 0) {
                debts.splice(index, 1);
            }
            updateTotalBalance();
            renderDebts();
            saveDebts();
        } else if (e.target.classList.contains('delete-debt')) {
            const index = e.target.dataset.index;
            debts.splice(index, 1);
            updateTotalBalance();
            renderDebts();
            saveDebts();
        }
    });

    clearAllBtn.addEventListener('click', () => {
        debts = [];
        updateTotalBalance();
        renderDebts();
        saveDebts();
    });

    updateTotalBalance();
    renderDebts();
});
