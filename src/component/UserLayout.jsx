// layouts/UserLayout.jsx
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";
import UserQa from "./UserQa";

export default function UserLayout({ children, categories = [] }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader categories={categories} />
      <main className="flex-grow">{children}</main>
      <UserQa />
      <UserFooter />
    </div>
  );
}