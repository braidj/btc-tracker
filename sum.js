import fs from 'fs';
import csv from 'csv-parser';

// pairs to track (normalize to exact form you expect in CSV)
const pairsToTrack = ['ETH/GBP', 'BTC/GBP', 'ETH/BTC', 'USDT/GBP'];

// initialise totals object with sub-keys for buy/sell/all
const totals = {};
pairsToTrack.forEach(pair => {
  totals[pair] = { buy: 0, sell: 0, all: 0 };
});

fs.createReadStream('kraken sample.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Normalise fields (adjust if your CSV uses different case/spacing)
    const pair = (row.pair || '').trim();
    const type = (row.type || '').trim().toLowerCase(); // 'buy' or 'sell'
    const amount = parseFloat(row.fee) || 0;

    // Only process rows for pairs we care about
    if (!pairsToTrack.includes(pair)) return;

    // Add to overall total for the pair
    totals[pair].all += amount;

    // Add to type-specific total if it's buy or sell (otherwise ignore)
    if (type === 'buy') {
      totals[pair].buy += amount;
    } else if (type === 'sell') {
      totals[pair].sell += amount;
    }
    // if you want to treat unknown types, you could log or handle here
  })
  .on('end', () => {
    console.log('Totals per pair:');
    for (const pair of pairsToTrack) {
      const t = totals[pair];
      console.log(`${pair}  — all: ${t.all.toFixed(4)} GBP  | buy: ${t.buy.toFixed(4)}  | sell: ${t.sell.toFixed(4)}`);
    }
  })
  .on('error', (err) => {
    console.error('Error reading CSV:', err);
  });