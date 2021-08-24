[![License: MIT](https://img.shields.io/apm/l/atomic-design-ui.svg?)](LICENSE)

# A Chrome Extension to convert and replaces currencies
This Chrome Extension allows you to convert Currencies displayed on any website by replacing them with another currency.

The output format as well as the regex used for searching can be modified using the chrome-extension's options.

## Disclaimer
This extension will not work for all occurances. Replacing the string in a text/input field might break the website, for example. And some other situations are too problematic to find (for example `100 <span>USD</span>`). It might also not work if the website is dynamically modified using javascript.

## Installation
Clone the repository or download it as a zip file and extract the content into a folder (in the following called currency-replacer)
```
# Cloning the repository
git clone https://github.com/DragonDev1906/currency-replacer.git
cd currency-replacer

# Download and extract zip file (example bash commands)
wget https://github.com/DragonDev1906/currency-replacer/archive/refs/heads/main.zip
unzip main.zip -d currency-replacer
```

Next open google chrome and go to `chrome://extensions` (URL), then enable the "Developer mode" in the top right. This shows a new button in the top left called "Load unpacked". Click that button and select the currency-replacer folder containing the source code downloaded from github. After clicking on "Open" the extension should be installed and the "Developer mode" can be disabled again.

## Usage
The following describes how to customize the extension to use a different output format or search for different patterns. These settings can be found in the extension's options.

### Output format
Any occurance of `{supported_currency}` (e.g. `{usd}`) will be replaced by the amount in this currency. The amount of decimal points to be shown can be changed by specifying `{supported_currency:decimal_points}` (e.g. `{usd:4}`). The output format may contain multiple entries, even with different currencies.

Example: `{rai:4} RAI ({usd} USD)`

### Regex search patterns
Multiple regex patterns can be specified and enabled/disabled in the options. They are then combined into a single query. It is possible to specify multiple currencies to search for and they will all be converted as specified, but they will all be converted to the same output_format. The pattern is case-insensitive.

The regex should always contain a number specified as follows: `(?<usd1>\d+(?:\.\d+)?)`.
`usd1`specifies the input currency USD (numbers are ignored) and the pattern above catches a decimal number. It is important that there are no duplicate group names `<usd1>`, which is why you can add arbitrary numbers to the group name without changing the behaviour.

#### Example search patterns
- `\b(?<usd1>\d+(?:\.\d+)?)\s*(?:USD|US\s*Dollar|US-Dollar)\b` Finds all occurances of "1337 USD", "133.7 USD", "1337 US Dollar" and "1337 US-Dollar"
- `\$(?<usd2>\d+(?:\.\d+)?)\b` Finds all occurances of "$1337" and "$13.37"
- `\b(?<rai1>\d+(?:\.\d+)?)\s*RAI\b` Finds all occurances of "1336 RAI", allowing you to convert in both directions.

## Currently supported currencies
- USD
- RAI
