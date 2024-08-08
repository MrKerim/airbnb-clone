import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image.jsx";
export default function favoritePlaces() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get("/account/favorites").then(({ data }) => {
			setPlaces(data);
		});
	}, []);

	return (
		<div>
			<AccountNav />

			<div className="flex justify-center">
				<div className="mt-8">
					{places.length > 0 &&
						places.map((place, index) => (
							<Link
								key={index}
								to={"../place/" + place._id}
								className="max-w-4xl w-full mt-10 p-5 cursor-pointer bg-gray-100 flex gap-4  rounded-2xl "
							>
								<div className="bg-gray-300 w-40 h-40 grow shrink-0 rounded-2xl">
									{place.photos.length > 0 && (
										<Image
											className="object-cover w-full h-full rounded-2xl"
											src={place.photos[0]}
											alt="place"
										/>
									)}
								</div>
								<div className="grow-0 shrink">
									<h2 className="text-xl ">{place.title}</h2>
									<p className="text-sm mt-2 text-gray-600">
										{place.description}
									</p>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
}
