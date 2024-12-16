function getName(blockRoot) {
  if (!blockRoot) {
    return undefined;
  }
  const blockHeader = blockRoot.querySelector('[class*=Block_blockHeaderRoot__]');
  if (!blockHeader) {
    return undefined;
  }
  // 画面幅がPC用のとき
  const name = blockHeader.querySelector('[class*=SelectCoefont_name__]');
  if (name) {
    return name.innerText;
  }
  return undefined;
}

folderName = "";
chrome.storage.sync.get(["downloadFolder"], (result) => {
  if (result.downloadFolder) {
      folderName = result.downloadFolder;
  }
});

document.body.addEventListener('click', e => {
  const button = e.target.closest('#editor_sentence_download_btn');
  if (!button) {
    return;
  }
  if (!button.closest('[class*=Sentence_action__]')) {
    return;
  }
  const container = button.closest('[role=menuitem][class*=Sentence_sentence__]');
  if (!container) {
    return;
  }
  const block = container.closest('[role=presentation][class*=Block_block__]');
  if (!block) {
    return;
  }
  const name = getName(block);
  if (!name) {
    return;
  }
  const textarea = container.querySelector('[class*=SentenceEditor_editor__]');
  if (!textarea) {
    return;
  }
  const text = textarea.innerText;
  if(text == '\n'){
    return;
  }
  chrome.runtime.sendMessage({ name, text, folderName });
}, true);
