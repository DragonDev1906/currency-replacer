async function fetchAllPricesInUSD() {
    let [rai, coingecko] = await Promise.all([
        fetchPriceRAI(),
        fetchByMarketCapUsingCoingecko()
    ])
    let out = {
        USD: 1,
        RAI: rai,
        ...coingecko
    };
    console.log("Conversion Rates", out);
    return out;
}

async function fetchByMarketCapUsingCoingecko(amount=100, page=1) {
    const url = (
        "https://api.coingecko.com/api/v3/coins/markets" + 
        "?vs_currency=usd&order=market_cap_desc&per_page=" + amount + 
        "&page=" + page + "&sparkline=false"
    );
    let data = await fetch(url, {
        method: "GET",
        mode: "cors",
    }).then(response => response.json());
    let out = {};
    data.forEach(entry => {
        let key = entry.symbol.toUpperCase() in out ? entry.id.toUpperCase() : entry.symbol.toUpperCase();
        out[key] = entry.current_price;
    });
    return out;
}

function fetchPriceRAI() {
    return graphQL(
        "https://api.thegraph.com/subgraphs/name/reflexer-labs/rai-mainnet",
        `
        {
            systemState(id: "current") {
                currentRedemptionPrice {
                    value
                }
            }
        }
        `
    ).then(response => Number(response.data.systemState.currentRedemptionPrice.value))
}

// Helper
function graphQL(endpoint, query, variables) {
    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "appliction/json"
        },
        body: JSON.stringify({
            query, 
            ...(variables === undefined ? {} : { variables })
        })
    }).then(response => response.json())
}