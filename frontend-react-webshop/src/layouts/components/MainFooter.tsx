import styles from './MainFooter.module.css';

const POLICY_LINKS = [
  'Chính sách bảo hành',
  'Chính sách đổi trả',
  'Chính sách vận chuyển',
  'Điều khoản sử dụng',
];

/** Responsive: desktop 3 cột → tablet 1 + 2 cột → mobile 1 cột (xem MainFooter.module.css) */
export function MainFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Branding */}
        <div className={styles.brand}>
          <img src="/logo.png" alt="Hoàng Văn" className={styles.logo} />
          <p className={styles.text}>
            Hoàng Văn — Giải pháp công nghệ toàn diện cho doanh nghiệp và cá nhân.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.heading}>Liên hệ</h4>
          <ul className={styles.list}>
            <li className={styles.contactItem}><span>📞</span><a href="tel:0934666003">0934.666.003</a></li>
            <li className={styles.contactItem}><span>✉️</span><a href="mailto:sales@hoangvan.vn">sales@hoangvan.vn</a></li>
            <li className={styles.contactItem}><span>📍</span><span>Hà Nội &amp; Hồ Chí Minh</span></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className={styles.heading}>Chính sách</h4>
          <ul className={styles.list}>
            {POLICY_LINKS.map((t) => (
              <li key={t}><a href="#">{t}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.copyright}>
        © 2026 Hoàng Văn — Giải pháp công nghệ. All rights reserved.
      </div>
    </footer>
  );
}
