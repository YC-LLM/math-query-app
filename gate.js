/**
 * ⚠️ 這是「擋路人用」的前端密碼閘門，不是真正的存取控制。
 * 這個網站是純前端靜態網頁（GitHub Pages），沒有後端伺服器可以驗證密碼，
 * 任何看得懂瀏覽器開發者工具的人都能繞過這一層（直接看原始碼、或直接打開
 * data.js / real_data.js / mathsys_data.js 的網址）。這裡只是不想讓網址被
 * 隨手轉傳、隨便點進來的人可以「正常使用」而已，不是機密資料保護機制。
 *
 * 密碼比對用 SHA-256 雜湊，避免明文密碼直接印在原始碼裡，但雜湊本身仍是
 * 公開可見的，懂的人一樣可以離線暴力破解，所以請不要用其他地方也在用的
 * 重要密碼。
 */
(function () {
  const PASSWORD_HASH = '9ae77ed2eb248167b94949a54257775d884195243d28cf3e9623c0892f33ef6d';
  const STORAGE_KEY = 'math-app-unlocked-v1';

  const overlay = document.getElementById('gate-overlay');
  const appContent = document.getElementById('app-content');
  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-password');
  const errorEl = document.getElementById('gate-error');

  function unlock() {
    overlay.style.display = 'none';
    appContent.style.display = 'block';
  }

  async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    unlock();
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hash = await sha256Hex(input.value);
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(STORAGE_KEY, '1');
      errorEl.hidden = true;
      unlock();
    } else {
      errorEl.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();
