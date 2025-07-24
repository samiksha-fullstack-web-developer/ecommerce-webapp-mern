// Layout for the Shopping (user-facing) section of the app
import { Outlet } from 'react-router-dom';
import Shoppingheader from './Shoppingheader';
import Footer from './Footer';

export default function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* Header/Navbar for user pages */}
      <Shoppingheader />

      {/* Main content area (injects child routes here) */}
      <main className="flex flex-col w-full">
        <Outlet />
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
}
