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
  // 画面幅がモバイル用のとき
  const mobile_name = blockHeader.querySelector('[class*=Block_mobileName__]');
  if (mobile_name) {
    return mobile_name.innerText;
  }
  return undefined;
}

document.body.addEventListener('click', e => {
  const button = e.target.closest('[class*=IconButton_button__]:nth-of-type(2)');
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
  const textarea = container.querySelector('[class*=SentenceEditor_textarea__]');
  if (!textarea) {
    return;
  }
  const text = textarea.innerText;
  chrome.runtime.sendMessage({ name, text });
}, true);
