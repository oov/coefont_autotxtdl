// フォルダパスの整形
function sanitizePath(path) {
  return path.split(/[\/\\]+/)
    .filter(s => s != '' && s != '.' && s != '..')
    .join("/")
    .replace(/[\x00-\x1f<>:"|?*]/g, '');
}

document.addEventListener("DOMContentLoaded", () => {
  const folderName = document.getElementById("downloadFolder");
  const saveButton = document.getElementById("saveButton");

  // 設定を保存する
  saveButton.addEventListener("click", () => {
    const name = sanitizePath(folderName.value);
    if (name == "") {
      chrome.storage.sync.remove("downloadFolder", () => {
        window.close();
      })
    }
    else {
      chrome.storage.sync.set({ downloadFolder: name }, () => {
        window.close();
      });
    }
  })

  // folderNameのテキストボックスに現在の設定を入れる
  chrome.storage.sync.get(["downloadFolder"], (result) => {
    if (result.downloadFolder) {
      folderName.value = result.downloadFolder;
    }
  });
});
