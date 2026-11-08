import Nav from "@/components/business/Nav";
import Footer from "@/components/business/Footer";
import Arrival from "@/components/shared/Arrival";
import Reveal from "@/components/shared/Reveal";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import b from "@/components/business/b.module.css";

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`exp-business ${b.exp}`}>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat exp="business" />
      <Arrival exp="business" />
      <Reveal />
    </div>
  );
}
