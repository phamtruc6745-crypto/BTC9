/**
 * script.js – Bếp Nhà Dâu Landing Page
 * Xử lý:
 *  1. Toggle menu mobile (hamburger) – class hidden/flex
 *  2. Đóng menu khi click vào link
 *  3. Sticky header shadow khi scroll
 *  4. Form submit đơn giản với validation
 *
 * Lưu ý: Tailwind không có sẵn hành vi JS như Bootstrap,
 * nên mọi tương tác cần viết JS riêng – đây là minh chứng
 * cho triết lý utility-first của Tailwind.
 */

/* ============================================================
   1. HAMBURGER MENU TOGGLE
   Toggle class 'hidden' / 'flex' cho #mobile-menu
   và class 'open' cho #hamburger để kích hoạt animation CSS
   ============================================================ */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');

  if (isOpen) {
    // Đóng menu
    mobileMenu.classList.remove('flex');
    mobileMenu.classList.add('hidden');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-label', 'Mở menu');
  } else {
    // Mở menu
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('flex');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-label', 'Đóng menu');
  }
});

/* ============================================================
   2. ĐÓNG MENU KHI CLICK LINK (gọi từ onclick trong HTML)
   ============================================================ */
function closeMobileMenu() {
  mobileMenu.classList.remove('flex');
  mobileMenu.classList.add('hidden');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-label', 'Mở menu');
}

/* ============================================================
   3. STICKY HEADER – thêm class 'scrolled' khi cuộn xuống
   ============================================================ */
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ============================================================
   4. FORM ĐẶT BÁNH – validation đơn giản + thông báo
   ============================================================ */
const orderForm = document.getElementById('order-form');

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name  = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Kiểm tra các trường bắt buộc
    if (!name || !phone) {
      alert('Vui lòng điền đầy đủ Tên và Số điện thoại!');
      return;
    }

    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập lại!');
      return;
    }

    // Hiển thị thông báo thành công
    const submitBtn = orderForm.querySelector('button[type="submit"]');
    submitBtn.textContent = '✅ Đã gửi!';
    submitBtn.disabled = true;
    submitBtn.classList.remove('bg-amber-600', 'hover:bg-amber-700');
    submitBtn.classList.add('bg-green-500', 'cursor-not-allowed');

    // Reset form sau 3 giây
    setTimeout(() => {
      orderForm.reset();
      submitBtn.textContent = 'Send ngay';
      submitBtn.disabled = false;
      submitBtn.classList.remove('bg-green-500', 'cursor-not-allowed');
      submitBtn.classList.add('bg-amber-600', 'hover:bg-amber-700');
    }, 3000);
  });
}

/* ============================================================
   5. SMOOTH SCROLL fallback cho trình duyệt cũ
   (Tailwind không xử lý JS scroll behavior)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
