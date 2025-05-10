// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['categories'], (result) => {
      if (!result.categories) {
        chrome.storage.local.set({
          categories: []
        });
      }
    });
  });
  