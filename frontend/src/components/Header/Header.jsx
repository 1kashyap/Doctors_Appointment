
import { useRef, useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { NavLink, Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { app } from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const auth = getAuth(app);
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // State to store user data
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // Fetch user data from Firestore
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show_menu");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout");
      navigate("/"); // Use navigate to redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="" />
          </div>

          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className="text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor hover:font-bold"
                    activeClassName="text-primaryColor text-[16px] leading-7 font-[600]"
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-8">
            {user && userData ? ( // Check if user and user data exist
              <div className="relative">
              <button
                onClick={toggleDropdown}
                className="focus:outline-none bg-teal-50 py-2 px-6 text-black font-[600] h-[44px] flex items-center justify-center rounded-[50px] border-2 border-primaryColor"
              >
                <div className="w-[35px] h-[35px] rounded-full overflow-hidden border-emerald-400 border-2">
                  <div className="w-full h-full object-cover" style={{ backgroundImage: `url(${userData.photo})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>
                </div>
                <div className="ml-2">{userData.name}</div>
              </button>
                {showDropdown && (
                  <ul className="absolute top-full right-0 bg-white border border-gray-200 shadow-md py-4 rounded-md">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-12 py-2 text-headingColor hover:bg-emerald-50 text-lg font-medium"
                      >
                        Profile
                      </Link>
                    </li>
                    {userData.role === "doctor" && ( // Check user role
                      <li>
                        <Link
                          to="/addclinic"
                          className="block px-12 py-2 text-headingColor hover:bg-emerald-50 text-lg font-medium"
                        >
                          Add Clinic
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-12 py-2 text-headingColor hover:bg-emerald-50 w-full text-left text-lg font-medium"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

