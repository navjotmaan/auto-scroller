document.getElementById('startBtn').addEventListener('click', async () => {
  const sec = document.getElementById('time').value;
  const ms = sec * 1000;

  // If you want to set in minutes
  // const min = document.getElementById('time').value;
  // const ms = min * 60 * 1000;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (interval) => {
      if (window.autoScrollTimer) {
        clearInterval(window.autoScrollTimer);
        console.log("Cleared previous timer.");
      }

      function getScrollableTarget() {
        // Target the exact Substack scrollable container, you can change it according to which website you are using
        const substackContainer = document.querySelector('.post-mS6ZNe');
        if (substackContainer && substackContainer.scrollHeight > substackContainer.clientHeight) {
          return substackContainer;
        }

        // Fallback: dynamically find any scrollable element
        const dynamic = [...document.querySelectorAll('*')].find(el => {
          const oy = window.getComputedStyle(el).overflowY;
          return (oy === 'scroll' || oy === 'auto') && el.scrollHeight > el.clientHeight;
        });

        if (dynamic) {
          console.log("Found dynamic container:", dynamic.tagName, dynamic.className);
          return dynamic;
        }

        // Last resort
        console.log("Falling back to window scroll");
        return null;
      }

      console.log(`Starting fresh timer for ${interval / 1000} seconds.`);

      window.autoScrollTimer = setInterval(() => {
        const target = getScrollableTarget();

        // Change the top (how much screen you want to scroll) accroding to your preference
        if (target) {
          target.scrollBy({ top: 500, behavior: 'smooth' });
        } else {
          window.scrollBy({ top: 500, behavior: 'smooth' });
        }
        console.log("Tick... Scrolled!");
      }, interval);
    },
    args: [ms],
  });
  window.close();
});

document.getElementById('stopBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      clearInterval(window.autoScrollTimer);
      window.autoScrollTimer = null;
      console.log("Auto-scroll stopped.");
    },
  });
  window.close();
});





