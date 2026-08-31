import Header from "./Header";
import Footer from "./Footer";
import Cursor from "./Cursor";
import Preloader from "./Preloader";

export default function Layout({ children }) {
  return (
    <>
      <Preloader />
      <Cursor />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
