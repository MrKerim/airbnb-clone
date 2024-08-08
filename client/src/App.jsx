import { Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { UserContextProvider } from "./UserContext.jsx";
import Layout from "./Layout.jsx";
import IndexPage from "./pages/indexPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import PlacesPage from "./pages/placesPage.jsx";
import PlacesFormPage from "./pages/placesFormPage.jsx";
import PlacePage from "./pages/placePage.jsx";
import FavoritesPage from "./pages/favoritesPage.jsx";
import BookingsPage from "./pages/bookingsPage.jsx";
import UserPage from "./pages/userPage.jsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
	return (
		<UserContextProvider>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<IndexPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/user/:id" element={<UserPage />} />
					<Route path="/account" element={<ProfilePage />} />
					<Route path="/account/places" element={<PlacesPage />} />
					<Route path="/account/places/new" element={<PlacesFormPage />} />
					<Route path="/account/places/:id" element={<PlacesFormPage />} />
					<Route path="/place/:id" element={<PlacePage />} />
					<Route path="/account/favorites" element={<FavoritesPage />} />
					<Route path="/account/bookings" element={<BookingsPage />} />
				</Route>
			</Routes>
		</UserContextProvider>
	);
}

export default App;
