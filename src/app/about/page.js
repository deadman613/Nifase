import AboutSection1 from "@/components/About/AboutSection1";
import AboutSection2 from "@/components/About/AboutSection2";
import AboutSection3 from "@/components/About/AboutSection3";
// import "@/styles/blog.css";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main>
      <AboutSection1 />
      <AboutSection2 />
      <AboutSection3 />
    </main>
  );
}
