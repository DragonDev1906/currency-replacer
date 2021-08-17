function save_options() {
    let output_format = document.getElementById("output_format").value;
    
    chrome.storage.sync.set({
        output_format: output_format, 
    }, () => {
        let status_div = document.getElementById("status");
        status_div.textContent = "Options saved.";
        setTimeout(() => {
            status_div.textContent = "";
        }, 2000);
    });
}

function restore_options() {
    chrome.storage.sync.get(default_options, (items) => {
        // Output format
        document.getElementById("output_format").value = items.output_format;

        //Patterns
        let patternContainer = document.getElementById("patterns");
        patternContainer.innerHTML= "";
        console.log(patternContainer);
        items.patterns.forEach(([enabled, pattern]) => {
            appendPattern(patternContainer, enabled, pattern);
        });
    });
}

function appendPattern(patternContainer, enabled, pattern) {
    let item = document.createElement("div");
    item.setAttribute("class", "row");

    let enableCheckbox = document.createElement("input");
    enableCheckbox.setAttribute("type", "checkbox");
    if (enabled)
        enableCheckbox.setAttribute("checked", true);
    item.appendChild(enableCheckbox);

    let patternInput = document.createElement("input");
    patternInput.setAttribute("type", "text");
    patternInput.setAttribute("value", pattern);
    patternInput.setAttribute("class", "pattern-input");
    item.appendChild(patternInput);

    let removeButton = document.createElement("button");
    removeButton.setAttribute("class", "remove-button");
    removeButton.addEventListener("click", () => {
        patternContainer.removeChild(item);
    });
    removeButton.innerText = "-"
    item.appendChild(removeButton);

    patternContainer.appendChild(item);
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("add_pattern").addEventListener("click", () => {
    appendPattern(document.getElementById("patterns"), true, "");
})