import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "../component/chatbot";


export default function AppLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] max-w-[1600px] mx-auto bg-gray-100 text-gray-900">
      <Header />
      <main className="mx-4 md:mx-24 lg:mx-36">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
