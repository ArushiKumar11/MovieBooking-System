import Footer from "../components/Footer";

import Navbar from "../components/Navbar";

const DefaultlayoutHoc =
  (Component) =>
  ({ ...props }) => {
    return (
      <div>
        <Navbar />
        <Component {...props} />
        <Footer />
      </div>
    );
  };

export default DefaultlayoutHoc;