import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";

export default function indexPage() {
	const [places, setPlaces] = useState([]);
	useEffect(() => {
		axios.get("/places").then((res) => {
			setPlaces(res.data);
			console.log(res.data);
		});
	}, []);

	return (
		<div className="mt-10 mb-10 mx-8 gap-10 grid grid-cols-2 md:grid-col-3 lg:grid-cols-4">
			{places.length > 0 &&
				places.map((place, index) => (
					<Link to={"/place/" + place._id} className=" relative" key={index}>
						{
							<Image
								className="cursor-pointer rounded-2xl w-full object-cover aspect-square transition duration-300 hover:brightness-75"
								src={place.photos[0]}
								alt="photo"
							/>
						}
						<div className="mt-3 mx-2 ">
							<h2 className="font-bold text-lg truncate">{place.title}</h2>
							<h3 className="text-gray-500 text-lg truncate">
								{place.address}
							</h3>
							<h4 className="font-bold text-lg">
								{place.pricePerNight.toLocaleString("tr-TR")} ₺{" "}
								<span className="font-normal text-gray-500">gece</span>{" "}
							</h4>
						</div>
					</Link>
				))}
		</div>
	);
}
