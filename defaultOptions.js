default_options = {
    output_format: "{rai:2} RAI",

    // \d+(?:\.\d+)? catches a number (using this alone won't work)
    // (?<usd1>\d+(?:\.\d+)?) catches a number and marks it as currency USD
    // (a capture group name can't repeat, but numbers in capture group names are ignored!)
    patterns: [
        // Catch "1337 USD" and "1337 US Dollar"
        [true, /\b(?<usd1>\d+(?:\.\d+)?)\s*(?:USD|US\s*Dollar|US-Dollar)\b/],
        // Catch "$1337" (There can't be a \b before the "$"!)
        [true, /\$(?<usd2>\d+(?:\.\d+)?)\b/],
        // Catch "1337 RAI" (showing that the reverse is possible, too)
        [false, /\b(?<rai1>\d+(?:\.\d+)?)\s*RAI\b/],
    ].map(x => [x[0], x[1].source])
}