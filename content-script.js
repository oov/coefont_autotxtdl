function getName(blockRoot) {
  if (!blockRoot) {
    return undefined;
  }
  const blockHeader = blockRoot.querySelector('[class*=Block_blockHeaderRoot__]');
  if (!blockHeader) {
    return undefined;
  }
  const name = blockHeader.querySelector('[class*=SelectCoefont_name__]');
  if (name) {
    return name.innerText;
  }
  return undefined;
}

const processed = new WeakSet();

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
  if (text == '\n') {
    return;
  }
  if (processed.has(button)) {
    // Prevent double sending
    processed.delete(button);
    return;
  }
  // Cancel to ensure that the download process starts after sendMessage is completed
  e.preventDefault();
  e.stopPropagation();
  processed.add(button);
  chrome.runtime.sendMessage({ name, text }, () => button.click());
}, true);
