// API key for Amdoren Currency API
const API_KEY = 'gBTGSNmPf8GvwYfjLDTr4VMy9vUEX9';

// Function to convert currency
async function convertCurrency(amount, from, to) {
    const url = `https://www.amdoren.com/api/currency.php?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error > 0) {
            throw new Error(data.error_message);
        }

        return data.amount;
    } catch (error) {
        console.error('Error converting currency:', error);
        return null;
    }
}

// Function to update prices on the page
function updatePrices(toCurrency) {
    const priceElements = document.querySelectorAll('.price');
    
    priceElements.forEach(async (element) => {
        const originalPrice = element.getAttribute('data-price');
        const convertedPrice = await convertCurrency(originalPrice, 'USD', toCurrency);
        
        if (convertedPrice !== null) {
            let currencySymbol = '$';
            if (toCurrency === 'EUR') currencySymbol = '€';
            if (toCurrency === 'GBP') currencySymbol = '£';
            element.textContent = `${currencySymbol}${convertedPrice.toFixed(2)}`;
        } else {
            element.textContent = 'Price unavailable';
        }
    });
}

// Function to display error message
function displayErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Event listener for currency selector
document.addEventListener('DOMContentLoaded', () => {
    const currencySelect = document.getElementById('currency-select');
    
    currencySelect.addEventListener('change', (event) => {
        const selectedCurrency = event.target.value;
        updatePrices(selectedCurrency).catch(error => {
            displayErrorMessage('Error updating prices. Please try again later.');
            console.error(error);
        });
    });
});