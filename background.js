function textToURL(text) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(new Blob([text], { type: 'text/plain; charset=utf-8' }));
  });
}

// フォルダ名にできない文字列を全角文字列に置き換え
function sanitizeText(path){
  return path
      .replace(/[\x00-\x1f]/g, '') // 削除する文字
      .replace(/[/\\<>:"|?*]/g, char => ({ // 全角に置き換える文字
        '/': '／',
        '\\': '￥',
        '<': '＜', '>': '＞', // <>(半角)はCoeFontStudioでは読み上げられない
        ':': '：',
        '"': '”',
        '|': '｜',
        '?': '？',
        '*': '＊',
      }[char]))
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
  const text = sanitizeText(dlinfo.text)
  const basePath = `${getDownloadFolderPath()}${Date.now()}_${dlinfo.name}_${text.substring(0, 10)}`;
  function onDeterminingFilename(item, callback) {
      item.filename = `${basePath}.wav`;
      callback(item);
      chrome.downloads.onDeterminingFilename.removeListener(onDeterminingFilename);
      textToURL(dlinfo.text).then(url => chrome.downloads.download({ url, filename: `${basePath}.txt` }));    
  }
  chrome.downloads.onDeterminingFilename.addListener(onDeterminingFilename);
});
