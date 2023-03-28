import Header from "../features/header/components/Header";
import Footer from "../features/footer/components/Footer";
import styles from "./Layout.module.scss";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
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
      <div className={styles.content}>
        <MDBCard className={styles.card}>
          <MDBCardHeader className="headerCard-name">
            {title}
          </MDBCardHeader>
          <MDBCardBody className={styles.cardBody}>
            {props.children}
          </MDBCardBody>
        </MDBCard>
      </div>

      <Footer className={styles.mainFooter} />
    </div>
  )
}

export default Layout;
