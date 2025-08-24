import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "leaflet/dist/leaflet.css";
// import { Toaster } from "react-hot-toast";
import { Toaster } from "sonner";
import { store } from "./store";
import { Provider } from "react-redux";
import "./i18n";
import { ScrollToTop } from "./component/ScrollToTop";
import useLanguageStyles from "./hooks/useLanguageStyles";
import Spinner from "./ui/Spinner";

// code splitting pages
const AppLayout = lazy(() => import("./ui/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ListingDetails = lazy(() => import("./pages/ListDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Lists = lazy(() => import("./pages/Lists"));
const Settings = lazy(() => import("./pages/Settings"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const ListBookings = lazy(() => import("./pages/ListBookings"));
const EditList = lazy(() => import("./pages/EditList"));
const AddList = lazy(() => import("./pages/AddList"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));

const EditProfileModal = lazy(() =>
  import("./features/profile/EditProfileModal")
);

const queryClient = new QueryClient();
// 205.56 kB │ gzip:  37.87 kB
// dist/assets/index-CXMAPird.js   1,837.90 kB │ gzip: 556.99 kB

function App() {
  useLanguageStyles();
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
          <BrowserRouter>
            <Suspense fallback={<Spinner />}>
              <ScrollToTop />
              <Routes>
                <Route element={<AppLayout />}>
                  <Route index element={<Navigate replace to="home" />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/ListDetails/:id" element={<ListingDetails />} />
                  <Route path="/editList/:id" element={<EditList />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/addList" element={<AddList />} />
                  <Route path="/listings" element={<Lists />} />
                  <Route path="/bookings/:id" element={<ListBookings />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/PublicProfile/:id"
                    element={<PublicProfile />}
                  />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verifyOtp" element={<VerifyOtp />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/editProfile" element={<EditProfileModal />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster richColors position="top-center" />
          {/* <Toaster
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
          /> */}
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
