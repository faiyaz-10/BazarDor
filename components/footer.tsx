import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-page footer-inner">
        <Link href="/" className="footer-brand">
          <strong>বাজার দর</strong>
          <span>— প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
        </Link>
        <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
