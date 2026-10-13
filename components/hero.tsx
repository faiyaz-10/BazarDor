import Image from "next/image";
import heroImage from "../assets/bazar-hero.png";
import { banglaDate } from "@/lib/format";

export default function Hero() {
  return (
    <section className="container-page hero-section">
      <div className="hero-card">
        <div className="hero-copy">
          <span className="hero-date">{banglaDate()}</span>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p>
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, আর সঠিক বাজার বেছে নিন সচেতনভাবে।
          </p>
          <a href="#সব-পণ্য" className="hero-button">
            সব পণ্য দেখুন
          </a>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <Image src={heroImage} alt="" priority />
        </div>
      </div>
    </section>
  );
}
