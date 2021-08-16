async function fetchAllPricesInUSD() {
    return {
        USD: 1,
        RAI: await fetchPriceRAI()
    }
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