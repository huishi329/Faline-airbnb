import React, { useState } from 'react';
import { getSpotDetail, getAllSpots, updateSpot } from '../../store/spot';
import { useDispatch } from 'react-redux';


function EditSpotForm({ setShowModal, spot }) {
    const dispatch = useDispatch();
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(updateSpot({
            id: spot.id,
            address, city, state, country, lat, lng, name, description, price
        }))
            .then(() => setShowModal(false))
            .then(()=> dispatch(getSpotDetail(spot.id)))
            .then(()=> dispatch(getAllSpots()))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
    }

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <label>
                Address
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </label>
            <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                />
            </label>
            <label>
                State
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                />
            </label>
            <label>
                Country
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                />
            </label>
            <label>
                Latitude
                <input
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                />
            </label>
            <label>
                Longitude
                <input
                    type="number"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                />
            </label>
            <label>
                Name
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            <label>
                Description
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </label>
            <label>
                Price
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default EditSpotForm;
