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
    chrome.storage.sync.get({
        output_format: "{rai} RAI"
    }, (items) => {
        document.getElementById("output_format").value = items.output_format;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
