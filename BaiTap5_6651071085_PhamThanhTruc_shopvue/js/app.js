/**
 * ====================================================================
 * SHOP PHỤ KIỆN ĐIỆN THOẠI MINI — Vue.js 3 (CDN)
 * ====================================================================
 * So sánh với Vanilla JS:
 *   - Nếu dùng Vanilla JS, mỗi lần thêm/xóa giỏ hàng phải tự querySelector
 *     + cập nhật DOM thủ công (innerHTML, createElement, appendChild...).
 *   - Vue tự động làm điều này nhờ reactivity — chỉ cần thay đổi data,
 *     UI tự cập nhật mà không cần thao tác DOM.
 * ====================================================================
 */

const app = Vue.createApp({

  // ── data(): trả về object chứa toàn bộ reactive state ──
  // Tương tự "state" của ứng dụng. Khi bất kỳ property nào thay đổi,
  // Vue sẽ tự render lại phần template liên quan.
  data() {
    return {

      // Tên shop
      shopName: 'PhoneGear Shop',

      // Từ khoá tìm kiếm — liên kết 2 chiều với <input> qua v-model
      // Vanilla JS: phải addEventListener('input') rồi tự lọc + render lại
      tuKhoa: '',

      // Mảng sản phẩm phụ kiện (tối thiểu 8 sản phẩm)
      products: [
        {
          id: 1,
          ten: 'Ốp Lưng iPhone 15 Pro Max',
          anh: 'https://vuaphukien.com.vn/wp-content/uploads/2023/10/op-lung-iphone-15-pro-max-magsefe-nham-vien-mau-chong-bam-van-tay-chinh-hang-wiwu-1.jpg',
          gia: 199000,
          moTa: 'Ốp lưng silicon cao cấp, chống sốc, bảo vệ camera'
        },
        {
          id: 2,
          ten: 'Tai Nghe Bluetooth TWS',
          anh: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lpg2uilmqt7f0f',
          gia: 350000,
          moTa: 'Tai nghe không dây, âm bass mạnh, pin 24h'
        },
        {
          id: 3,
          ten: 'Sạc Nhanh 65W GaN',
          anh: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
          gia: 450000,
          moTa: 'Sạc nhanh GaN 65W, 3 cổng, nhỏ gọn'
        },
        {
          id: 4,
          ten: 'Cáp Type-C Bện Dù 2m',
          anh: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mdnd1xbu2hpr70',
          gia: 89000,
          moTa: 'Cáp sạc nhanh bọc dù, chống đứt, dài 2m'
        },
        {
          id: 5,
          ten: 'Kính Cường Lực 9D',
          anh: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
          gia: 59000,
          moTa: 'Kính cường lực full màn, chống vân tay, độ cứng 9H'
        },
        {
          id: 6,
          ten: 'Giá Đỡ Điện Thoại Ô Tô',
          anh: 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lsz1f86c7jjh67',
          gia: 159000,
          moTa: 'Giá đỡ kẹp cửa gió, xoay 360°, chắc chắn'
        },
        {
          id: 7,
          ten: 'Pin Sạc Dự Phòng 20000mAh',
          anh: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
          gia: 399000,
          moTa: 'Sạc dự phòng 20000mAh, sạc nhanh PD 22.5W'
        },
        {
          id: 8,
          ten: 'Đế Sạc Không Dây 15W',
          anh: 'https://energizer.dtr.vn/upload/editor/MTSP_ENG04.png.png',
          gia: 259000,
          moTa: 'Sạc không dây Qi 15W, tương thích mọi điện thoại'
        }
      ],

      // Mảng giỏ hàng — mỗi phần tử là 1 sản phẩm đã thêm
      // Vanilla JS: phải tự quản lý array + re-render DOM mỗi lần thay đổi
      cart: [],

      // Trạng thái hiển thị giỏ hàng (dùng cho v-show)
      showCart: false
    };
  },

  // ── computed: các property được tính toán tự động từ data ──
  // Khi data thay đổi, computed tự tính lại — không cần gọi hàm thủ công.
  // Vanilla JS: phải tự gọi hàm tính + cập nhật DOM mỗi lần data thay đổi.
  computed: {

    /**
     * cartCount — Đếm tổng số sản phẩm trong giỏ hàng.
     * Hiển thị trên icon giỏ hàng ở header.
     * Vanilla JS: mỗi lần thêm/xóa phải document.querySelector('.cart-count')
     *             rồi gán textContent = cart.length
     */
    cartCount() {
      return this.cart.length;
    },

    /**
     * tongTien — Tính tổng tiền giỏ hàng.
     * Dùng Array.reduce để cộng dồn giá của tất cả sản phẩm trong cart.
     * Vanilla JS: phải tự tính lại + querySelector('.tong-tien').textContent = ...
     */
    tongTien() {
      return this.cart.reduce((tong, sp) => tong + sp.gia, 0);
    },

    /**
     * danhSachLoc — Lọc danh sách sản phẩm theo từ khoá tìm kiếm.
     * So sánh không phân biệt hoa thường (toLowerCase).
     * Vanilla JS: phải addEventListener('input') trên ô search,
     *             rồi filter mảng + xoá DOM cũ + render DOM mới.
     * Vue: chỉ cần thay đổi tuKhoa (qua v-model), computed tự tính lại,
     *       template tự render danh sách mới.
     */
    danhSachLoc() {
      const keyword = this.tuKhoa.toLowerCase().trim();
      if (!keyword) return this.products;
      return this.products.filter(sp =>
        sp.ten.toLowerCase().includes(keyword) ||
        sp.moTa.toLowerCase().includes(keyword)
      );
    }
  },

  // ── methods: các hàm xử lý sự kiện, tương tác người dùng ──
  methods: {

    /**
     * themVaoGio(sanPham) — Thêm 1 sản phẩm vào mảng cart.
     * @param {Object} sanPham - Object sản phẩm cần thêm
     *
     * Vanilla JS: phải push vào array, rồi tự tạo element mới
     *   (document.createElement), gán nội dung, appendChild vào container giỏ hàng,
     *   đồng thời cập nhật số lượng trên header và tổng tiền.
     * Vue: chỉ cần push — UI tự cập nhật ở header (cartCount),
     *   aside (danh sách cart), và tổng tiền (tongTien) nhờ reactivity.
     */
    themVaoGio(sanPham) {
      this.cart.push({ ...sanPham });
      this.showCart = true; // Tự động mở giỏ hàng khi thêm sản phẩm
    },

    /**
     * xoaKhoiGio(index) — Xoá 1 sản phẩm khỏi giỏ hàng theo index.
     * @param {Number} index - Vị trí sản phẩm trong mảng cart
     *
     * Vanilla JS: phải splice mảng, rồi querySelector phần tử DOM tương ứng,
     *   removeChild, cập nhật lại số lượng + tổng tiền thủ công.
     * Vue: chỉ cần splice — tất cả UI liên quan tự cập nhật.
     */
    xoaKhoiGio(index) {
      this.cart.splice(index, 1);
    },

    /**
     * toggleCart() — Bật/tắt hiển thị panel giỏ hàng.
     * Dùng kết hợp với v-show trong template.
     */
    toggleCart() {
      this.showCart = !this.showCart;
    },

    /**
     * formatGia(gia) — Định dạng giá tiền sang dạng VNĐ.
     * @param {Number} gia - Giá tiền (số nguyên)
     * @returns {String} - Chuỗi giá đã format, ví dụ: "199.000₫"
     */
    formatGia(gia) {
      return gia.toLocaleString('vi-VN') + '₫';
    }
  }

}).mount('#app');
// mount('#app') — Gắn Vue app vào phần tử có id="app" trong index.html
// Mọi cú pháp Vue (v-for, v-if, {{ }}, @click...) bên trong #app sẽ hoạt động.
