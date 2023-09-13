function textToURL(text) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(new Blob([text], { type: 'text/plain; charset=utf-8' }));
  });
}

chrome.runtime.onMessage.addListener((dlinfo, sender, sendResponse) => {
  const baseName = `${Date.now()}_${dlinfo.name}_${dlinfo.text.substring(0, 10)}`;
  function onDeterminingFilename(item, callback) {
    item.filename = `${baseName}.wav`;
    callback(item);
    chrome.downloads.onDeterminingFilename.removeListener(onDeterminingFilename);
    textToURL(dlinfo.text).then(url => chrome.downloads.download({ url, filename: `${baseName}.txt` }));
  }
  chrome.downloads.onDeterminingFilename.addListener(onDeterminingFilename);
});
