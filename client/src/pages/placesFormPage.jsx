import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";

export default function PlacesFormPage() {
	const { id } = useParams();
	const [title, setTitle] = useState("");
	const [address, setAddress] = useState("");
	const [addedPhotos, setAddedPhotos] = useState([]);
	const [description, setDescription] = useState("");
	const [perks, setPerks] = useState([]);
	const [extraInfo, setExtraInfo] = useState("");
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [maxGuests, setMaxGuests] = useState(1);
	const [pricePerNight, setPricePerNight] = useState(1000);
	const [redirect, setRedirect] = useState(false);
	const [loadingPhoto, setLoadingPhoto] = useState(false);

	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get("/places/" + id).then(({ data }) => {
			setTitle(data.title);
			setAddress(data.address);
			setAddedPhotos(data.photos);
			setDescription(data.description);
			setPerks(data.perks);
			setExtraInfo(data.extraInfo);
			setCheckIn(data.checkIn);
			setCheckOut(data.checkOut);
			setMaxGuests(data.maxGuests);
			setPricePerNight(data.pricePerNight);
			console.log("pricePerNight", data.pricePerNight);
		});
	}, [id]);

	function savePlace(event) {
		event.preventDefault();

		const data = {
			title,
			address,
			addedPhotos,
			description,
			perks,
			extraInfo,
			checkIn,
			checkOut,
			maxGuests,
			pricePerNight,
		};

		if (id) {
			axios.put("/places", { id, ...data }).then((req, res) => {
				console.log("updated the place");
			});
		} else {
			axios.post("/places", data).then((req, res) => {
				setRedirect(true);
			});
		}
	}

	if (redirect) {
		return <Navigate to={"/account/places"} />;
	}

	return (
		<>
			{loadingPhoto && (
				<div className="fixed z-30 left-0 top-0 h-screen w-screen bg-black opacity-50">
					<h1 className="text-6xl text-white font-bold fixed top-1/2 left-1/2">
						. . .
					</h1>
				</div>
			)}
			<AccountNav />
			<div className="flex justify-center w-full ">
				<form onSubmit={savePlace} className="max-w-4xl w-full ">
					<h2 className="text-2xl mt-8">Title</h2>
					<p className="text-gray-500 text-sm">
						Title for your place should be short and catchy
					</p>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						type="text"
						placeholder="for example My lovely apt"
					></input>
					<h2 className="text-2xl mt-8">Adress</h2>
					<p className="text-gray-500 text-sm">
						You must provide a valid address for your place
					</p>
					<input
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						type="text"
						placeholder="Country/State district and street"
					></input>
					<h2 className="text-2xl mt-8">Photos</h2>
					<p className="text-gray-500 text-sm">
						You can provide as many photos as you want
					</p>
					<PhotosUploader
						addedPhotos={addedPhotos}
						onChange={setAddedPhotos}
						setLoadingPhoto={setLoadingPhoto}
					/>
					<h2 className="text-2xl mt-8">Description</h2>
					<p className="text-gray-500 text-sm">
						Tell us about your place and what makes it special
					</p>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						type="text"
						placeholder="What makes someone say that's the one I have been searching for"
					></textarea>
					<h2 className="text-2xl mt-8">Perks</h2>
					<p className="text-gray-500 text-sm">
						Check all the perks that your place offers
					</p>
					<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 ">
						<Perks selected={perks} onChange={setPerks} />
					</div>
					<h2 className="text-2xl mt-8">Extra Info</h2>
					<p className="text-gray-500 text-sm">
						Limitations, warnings, or any other info you want to share
					</p>
					<textarea
						value={extraInfo}
						onChange={(e) => setExtraInfo(e.target.value)}
						type="text"
						placeholder="No smoking, no parties... etc"
					></textarea>
					<h2 className="text-2xl mt-8">CheckIn & CheckOut</h2>
					<p className="text-gray-500 text-sm">
						Please provide the check-in and check-out times alongside with
						maximum-guest can be hold in the household
					</p>
					<div className="grid grid-cols-2 gap-6 mb-10">
						<input
							value={checkIn}
							onChange={(e) => setCheckIn(e.target.value)}
							type="text"
							placeholder="Check-in"
						></input>
						<input
							value={checkOut}
							onChange={(e) => setCheckOut(e.target.value)}
							type="text"
							placeholder="Check-out"
						></input>
						<input
							value={maxGuests}
							onChange={(e) => setMaxGuests(e.target.value)}
							type="number"
							placeholder="Max guests"
						></input>
						<input
							value={pricePerNight}
							onChange={(e) => setPricePerNight(e.target.value)}
							type="number"
							placeholder="Price per night"
						></input>
					</div>
					<div className="w-full flex justify-center">
						<button className="bg-primary text-white my-4  w-full py-4 max-w-xs md:max-w-md rounded-full font-bold text-xl ">
							Save
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
