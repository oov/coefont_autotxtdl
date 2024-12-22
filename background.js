function textToURL(text) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(new Blob([text], { type: 'text/plain; charset=utf-8' }));
  });
}

// ファイル名にできない文字列を消去する
function sanitizeFileName(fileName) {
  return fileName.replace(/[\x00-\x1f/\\<>:"|?*]/g, '');
}

const getDownloadFolderPath = (() => {
  let folder = "";
  function setFolder(v) {
    folder = v ? v : "";
  }
  chrome.storage.sync.get(["downloadFolder"], r => {
    setFolder(r.downloadFolder);
  });
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'sync' && "downloadFolder" in changes) {
      setFolder(changes.downloadFolder.newValue);
    }
  });
  return () => folder ? `${folder}\\` : "";
})();

chrome.runtime.onMessage.addListener((dlinfo, sender, sendResponse) => {
  const fileName = sanitizeFileName(`${Date.now()}_${dlinfo.name}_${dlinfo.text.substring(0, 10)}`);
  const basePath = `${getDownloadFolderPath()}${fileName}`;
  function onDeterminingFilename(item, callback) {
    item.filename = `${basePath}.wav`;
    callback(item);
    chrome.downloads.onDeterminingFilename.removeListener(onDeterminingFilename);
    textToURL(dlinfo.text).then(url => chrome.downloads.download({ url, filename: `${basePath}.txt` }));
  }
  chrome.downloads.onDeterminingFilename.addListener(onDeterminingFilename);
});
