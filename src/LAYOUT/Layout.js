import Header from '../features/header/components/Header';
import Footer from '../features/footer/components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
function Layout(props) {
  const header = {
    logo: {
      url: "https://ctin.vn",
      title: "CTIN",
      logoUrl: "/ctin-logo-1.png"
    },
    navigations: [
      {
        text: 'Quản lý thiết bị offline',
        navigations: [
          {
            text: 'Danh sách thiết bị',
            url: '/',
          },
          {
            text: 'Inventory',
            url: '/',
          }
        ],
        hasSubMenu: true,
      },
      {
        text: 'Quản lý thiết bị online',
        url: '/',
        hasSubMenu: false,
      }
    ],
    profile: {
      profileGreeting: (username) => `Xin chào, ${username}`,
      signOut: "Đăng xuất",
      manageProfile: "Quản lý thông tin tài khoản",
      icon: <FontAwesomeIcon icon={faUser}/>
    }
  }
    return (
      <>
        {/* Include footer or any other common elements */}
        <Header {...header} />
        {props.children}
        <Footer/>
      </>
    );
  }
  
  export default Layout;
  