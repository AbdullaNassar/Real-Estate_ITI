import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ListingDetails from "./pages/ListDetails";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import VerifyOtp from "./pages/VerifyOtp";
import { store } from "./store";
import { Provider } from "react-redux";

import EditProfileModal from "./component/EditProfileModal";

import { ScrollToTop } from "./component/ScrollToTop";
import AddList from "./pages/AddList";
import Lists from "./pages/Lists";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate replace to="home" />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/ListDetails/:id" element={<ListingDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/Booking" element={<Booking />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/addList" element={<AddList />} />
                <Route path="/listings" element={<Lists />} />
                <Route path="/settings  " element={<Settings />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verifyOtp" element={<VerifyOtp />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/editProfile" element={<EditProfileModal />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
              },
            }}
          />
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
