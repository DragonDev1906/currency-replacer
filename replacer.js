class Replacer {
    pricesInUSD = null;
    options = null;
    pattern = null;

    async run() {
        [this.pricesInUSD, this.options] = await Promise.all([
            fetchAllPricesInUSD(),
            new Promise((resolve, reject) => {
                try {
                    chrome.storage.sync.get(default_options, resolve);
                }
                catch (ex) {
                    reject(ex);
                }
            })
        ]);
        // Filter for enabled patterns and combine them
        let patterns_source = this.options.patterns
            .filter(x => x[0])
            .map(x => x[1])
        if (patterns_source.length == 0)
            return;     // Don't do anything if there are no patterns enabled
        this.pattern = new RegExp(patterns_source.join("|"), "gi");
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
        return this.options.output_format.replace(/{(\w+)(?:\:(\d+))?}/gi, (match, currency, decimals) => {
            if (decimals === undefined)
                decimals = 2;
            // Convert to the target currency if possible
            let amount = this.convertFromUSD(currency, amount_usd)
            return (amount === undefined) ? match : amount.toFixed(decimals);
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
            currentNode.nodeValue = currentNode.nodeValue.replace(this.pattern, (...args) => {
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
