import Header from "../features/header/components/Header";
import Footer from "../features/footer/components/Footer";
import { MDBCard, MDBCardHeader, MDBContainer } from "mdb-react-ui-kit";

function Layout(props) {
  const header = {
    logo: {
      url: "https://ctin.vn",
      title: "CTIN",
      logoUrl: "/ctin-logo-1.png",
    },
    navigations: [
      {
        text: "Manage Device",
        url: "/device-management",
        hasSubMenu: false,
      },
      {
        text: "Manage Inventories",
        navigations: [
          {
            text: "Online",
            url: "/managementDeviceInventories",
          },
          {
            text: "Offline",
            url: "/Inventories",
          },
        ],
        hasSubMenu: true,
      },

      {
        text: "Instantaneous check",
        url: "/InventoriesOnline",
        hasSubMenu: false,
      },
    ],
    profile: {
      profileGreeting: (username) => `Hello ${username}`,
      signOut: "Logout",
      manageProfile: "Manage account",
    },
  };
  return (
    <div>
      {/* Include footer or any other common elements */}
      <Header
        logo={header.logo}
        navigations={header.navigations}
        profile={header.profile}
      />
      <div style={{ marginTop: "3rem", padding: "1rem" }}>
        <MDBContainer fluid>
          <MDBCard className="bg-white mx-auto card-name">
            <MDBCardHeader className="headerCard-name" style={{}}>
              DEVICE INVENTORY
            </MDBCardHeader>
          </MDBCard>
          <div style={{ marginTop: "10px" }}></div>
          <div>{props.children}</div>
        </MDBContainer>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
