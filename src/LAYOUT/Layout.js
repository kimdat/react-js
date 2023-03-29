import Header from "../features/header/components/Header";
import Footer from "../features/footer/components/Footer";
import styles from "./Layout.module.scss";
import { MDBCard, MDBContainer, MDBCardHeader } from "mdb-react-ui-kit";
import './Layout.css'
function Layout(props) {
  const { header, title } = props;
  return (
    <div className={styles.pageWrapper}>
      {/* Include footer or any other common elements */}
      <Header
        logo={header.logo}
        navigations={header.navigations}
        profile={header.profile}
        className={styles.mainHead}
      />
      {title && (
        <div className="main">
          <div className={styles.content}>
            <MDBContainer fluid style={{ padding: "1rem" }}>
              <MDBCard className="bg-white mx-auto card-name">
                <MDBCardHeader className="headerCard-name">
                  {title}
                </MDBCardHeader>
              </MDBCard>
              <div style={{ marginTop: "10px" }}></div>
              <div>{props.children}</div>
            </MDBContainer>
          </div>
        </div>
      )}

      <Footer className={styles.mainFooter} />
    </div>
  )
}

export default Layout;
