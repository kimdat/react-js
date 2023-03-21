import Header from "../features/header/components/Header";
import Footer from "../features/footer/components/Footer";

function Layout(props) {
  const header = {
    logo: {
      url: "https://ctin.vn",
      title: "CTIN",
      logoUrl: "/ctin-logo-1.png",
    },
    navigations: [
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
        text: "Manage Device",
        url: "/device-management",
        hasSubMenu: false,
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
    <>
      {/* Include footer or any other common elements */}
      <Header
        logo={header.logo}
        navigations={header.navigations}
        profile={header.profile}
      />
      {props.children}
      <Footer />
    </>
  );
}

export default Layout;
