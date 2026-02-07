function getName(blockRoot) {
  if (!blockRoot) {
    return undefined;
  }
  const name = blockRoot.querySelector('[class*=__name]');
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
  if (!button.closest('[class*=__sentence]')) {
    return;
  }
  const container = button.closest('[role=menuitem][class*=__sentence]');
  if (!container) {
    return;
  }
  const block = container.closest('[role=presentation][class*=__block]');
  if (!block) {
    return;
  }
  const name = getName(block);
  if (!name) {
    return;
  }
  const textarea = container.querySelector('[class*=__editor]');
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
