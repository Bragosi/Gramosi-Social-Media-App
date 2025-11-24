import { mobileNavigation } from '../constants/Navigation'
import { NavLink } from "react-router-dom";

const MobileNavigation = () => {
  const nav = mobileNavigation();

  return (
<section className="md:hidden fixed bottom-0 left-0 w-full h-14 z-50 border-t border-n-6 backdrop-blur-2xl bg-n-8 bg-opacity-70 overflow-x-hidden">
  <div className="flex justify-around items-center h-full px-2 max-w-full overflow-hidden">
        {nav.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              isActive
                ? "flex flex-col items-center text-blue-600 text-n-14 font-bold"
                : "flex flex-col items-center text-gray-700  hover:text-gray-600"
            }
          >
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              {item.icon}
            </div>
          </NavLink>
        ))}
      </div>
    </section>
  );
};

export default MobileNavigation;
