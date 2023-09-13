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
  const mobile_name = block.querySelector('[class*=Block_mobileName__]');
  if (!mobile_name) {
    return;
  }
  const textarea = container.querySelector('[class*=SentenceEditor_textarea__]');
  if (!textarea) {
    return;
  }
  const name = mobile_name.innerText;
  const text = textarea.innerText;
  chrome.runtime.sendMessage({ name, text });
}, true);
