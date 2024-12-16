document.addEventListener("DOMContentLoaded", () => {
    const folderName = document.getElementById("downloadFolder");
    const saveButton = document.getElementById("saveButton");

    saveButton.addEventListener("click", () =>{
        const name = folderName.value;
        chrome.storage.sync.set({downloadFolder: name}, () => {
            window.close();
        });
    })

    chrome.storage.sync.get(["downloadFolder"], (result) => {
        if (result.downloadFolder) {
            folderName.value = result.downloadFolder;
        }
    });
  }
);