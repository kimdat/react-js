function Layout(props) {
  const header = {
    logo: {
      url: "https://ctin.vn",
      title: "CTIN",
      logoUrl: "/ctin-logo-1.png",
    },
    navigations: [
      {
        text: "Quản lý thiết bị offline",
        navigations: [
          {
            text: "Danh sách thiết bị",
            url: "/",
          },
          {
            text: "Inventory",
            url: "/",
          },
        ],
        hasSubMenu: true,
      },
      {
        text: "Quản lý thiết bị online",
        url: "/",
        hasSubMenu: false,
      },
    ],
    profile: {
      profileGreeting: (username) => `Xin chào, ${username}`,
      signOut: "Đăng xuất",
      manageProfile: "Quản lý thông tin tài khoản",
    },
  };
  return (
    <div>
      {/* Include footer or any other common elements */}
      asds
      <div>{props.children}</div>
    </div>
  );
}

export default Layout;
