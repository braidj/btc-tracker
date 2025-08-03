const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,gbp';

async function getBTCPrices() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const btcUsd = data.bitcoin.usd;
    const btcGbp = data.bitcoin.gbp;

    // Calculate exchange rate USD → GBP
    const usdToGbp = (btcGbp / btcUsd).toFixed(4);
    const gbpToUsd = (btcUsd / btcGbp).toFixed(4);

    const formattedUsd = btcUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const formattedGbp = btcGbp.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

    console.log(`🪙 BTC Price:
  • USD: ${formattedUsd}
  • GBP: ${formattedGbp}
  • USD → GBP Exchange Rate: ${usdToGbp}
  • GBP → USD Exchange Rate: ${gbpToUsd}`);
    
  } catch (error) {
    console.error("Error fetching BTC prices:", error);
  }
}

getBTCPrices();