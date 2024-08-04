// API key for Amdoren Currency API
const API_KEY = 'gBTGSNmPf8GvwYfjLDTr4VMy9vUEX9';

// Function to convert currency
async function convertCurrency(amount, from, to) {
    const url = `https://www.amdoren.com/api/currency.php?api_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`;

    try {
        // Log the URL being fetched (remove in production)
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        
        // Log the raw response
        console.log('Raw response:', response);

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log the parsed data
        console.log('API Response:', data);

        if (data.error > 0) {
            throw new Error(`API Error ${data.error}: ${data.error_message}`);
        }

        return data.amount;
    } catch (error) {
        console.error('Error converting currency:', error);
        
        // Use fallback conversion if API call fails
        return amount * (fallbackRates[to] / fallbackRates[from]);
    }
}

// Function to update prices on the page
async function updatePrices(toCurrency) {
    const priceElements = document.querySelectorAll('.price');
    
    for (const element of priceElements) {
        const originalPrice = element.getAttribute('data-price');
        console.log('Converting:', originalPrice, 'USD', 'to', toCurrency);
        
        try {
            const convertedPrice = await convertCurrency(originalPrice, 'USD', toCurrency);
            console.log('Converted price:', convertedPrice);
            
            let currencySymbol = '$';
            if (toCurrency === 'EUR') currencySymbol = '€';
            if (toCurrency === 'GBP') currencySymbol = '£';
            
            element.textContent = `${currencySymbol}${Number(convertedPrice).toFixed(2)}`;
        } catch (error) {
            console.error('Error updating price:', error);
            element.textContent = 'Price unavailable';
            displayErrorMessage(`Error updating price: ${error.message}`);
        }
    }
}

// Function to display error message
function displayErrorMessage(message) {
    console.error(message); // Log the error to console
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
            displayErrorMessage(`Error updating prices: ${error.message}`);
            console.error(error);
        });
    });

    // Initial currency conversion
    updatePrices('USD');
});