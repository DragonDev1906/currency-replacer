// Settings
// \d+(?:\.\d+)? catches a number (using this alone won't work)
// (?<usd1>\d+(?:\.\d+)?) catches a number and marks it as currency USD
// (a capture group name can't repeat, therefore numbers in capture group names are ignored!)
const pattern = new RegExp([
    // Catch "1337 USD" and "1337 US Dollar"
    /\b(?<usd1>\d+(?:\.\d+)?)\s*(?:USD|US\s*Dollar|US-Dollar)\b/,
    // Catch "$1337" (There can't be a \b before the "$"!)
    /\$(?<usd2>\d+(?:\.\d+)?)\b/,
    // Catch "1337 RAI"
    /\b(?<rai1>\d+(?:\.\d+)?)\s*RAI\b/,
].map(r => r.source).join("|"), "gi")
const replace_format = "{rai} RAI ({usd} USD)";
const accuracies = {
    "USD": 2,
    "RAI": 4
}

class Replacer {
    pricesInUSD = null;

    async run() {
        this.pricesInUSD = await fetchAllPricesInUSD();
        this.replace();
    }

    // Helper functions
    convertFromUSD(currency, amount_usd) {
        let price = this.pricesInUSD[currency.toUpperCase()];
        if (price !== undefined)
            return amount_usd / price;
    }
    convertToUSD(currency, amount) {
        let price = this.pricesInUSD[currency.toUpperCase()];
        if (price !== undefined)
            return amount * price;
    }
    getReplaceValue(amount_usd) {
        return replace_format.replace(/{(\w+)}/gi, (match, currency) => {
            // Convert to the target currency if possible
            let amount = this.convertFromUSD(currency, amount_usd)
            let accuracy = accuracies[currency.toUpperCase()];
            return (amount === undefined) ? match : amount.toFixed(accuracy);
        });
    }
    extractUSDValueFromCaptureGroups(captureGroups) {
        for (let key in captureGroups) {
            let amount = captureGroups[key];
            if (amount !== undefined) {
                let currency = key.replace(/[^a-zA-Z]/, "");
                return this.convertToUSD(currency, amount);
            }
        }
    }

    replace() {
        // Create an object to walk through all Text nodes
        let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        treeWalker.nextNode();

        // Iterate over all Text nodes and replace the content
        let currentNode = treeWalker.currentNode;
        while(currentNode) {
            // Replace everything matched by the pattern
            currentNode.nodeValue = currentNode.nodeValue.replace(pattern, (...args) => {
                // The information we really need is stored in the last element
                let captureGroups = args[args.length - 1];
                // Take any of the results found and convert it to USD
                let amount_usd = this.extractUSDValueFromCaptureGroups(captureGroups);
                // Convert to the correct string format (can contain multiple currencies)
                return this.getReplaceValue(amount_usd);
            });

            currentNode = treeWalker.nextNode();
        }
    }
}

let replacer = new Replacer();
replacer.run();
