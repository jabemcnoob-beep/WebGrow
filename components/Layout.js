import Header from "./Header";
import Footer from "./Footer";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import ScrollProgress from "./ScrollProgress";
import Grain from "./Grain";

export default function Layout({ children }) {
  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Grain />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
