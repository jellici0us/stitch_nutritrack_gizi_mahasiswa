async function loadComponents(root = document) {
  const placeholders = Array.from(root.querySelectorAll('[data-include]'));
  if (!placeholders.length) return;

  for (const placeholder of placeholders) {
    const src = placeholder.getAttribute('data-include');
    if (!src) continue;

    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      const html = await response.text();
      placeholder.innerHTML = html;
      placeholder.removeAttribute('data-include');
    } catch (error) {
      console.warn('Could not load component', src, error);
    }
  }

  if (root.querySelector('[data-include]')) {
    await loadComponents(root);
  }
  applyNavActive();
}

function applyNavActive() {
  const currentPage = window.location.pathname.split('/').pop();
  if (!currentPage) return;

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.endsWith(currentPage)) {
      link.classList.add('text-green-700', 'dark:text-green-400', 'border-b-2', 'border-green-600', 'pb-1');
      link.classList.remove('text-zinc-600', 'dark:text-zinc-400');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => loadComponents());
