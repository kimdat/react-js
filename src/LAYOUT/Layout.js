import Header from "../features/header/components/Header";
import Footer from "../features/footer/components/Footer";
import { MDBCard, MDBCardHeader, MDBContainer } from "mdb-react-ui-kit";
import styles from "./Layout.module.scss";
import "./Layout.css";
function Layout(props) {
  const { header } = props;
  return (
    <div className={styles.pageWrapper}>
      {/* Include footer or any other common elements */}

      <Header
        logo={header.logo}
        navigations={header.navigations}
        profile={header.profile}
        className={styles.mainHead}
      />
      <div>
        <MDBContainer fluid style={{ padding: "1rem" }}>
          <MDBCard className="bg-white mx-auto card-header">
            <MDBCardHeader className="headerCard-name">
              DEVICE INVENTORY
            </MDBCardHeader>
          </MDBCard>
          <div style={{ marginTop: "10px" }}></div>
          <div className="bodyChildren">{props.children}</div>
        </MDBContainer>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
