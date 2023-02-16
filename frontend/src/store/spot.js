import { csrfFetch } from "./crsf";

const LOAD_ALL_SPOTS = 'spots/LOAD_ALL_SPOTS';
const LOAD_HOSTING_SPOTS = 'spots/LOAD_HOSTING_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const CLEAR_SINGLE_SPOT = 'spots/CLEAR_SINGLE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';


const loadAllSpots = (spots) => {
    return { type: LOAD_ALL_SPOTS, spots };
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots', {
    });

    const data = await response.json();
    const spots = data.Spots.reduce((spotsObj, spot) => {
        spotsObj[spot.id] = spot
        return spotsObj;
    }, {});
    dispatch(loadAllSpots(spots));
    return spots;
};


const loadHostingSpots = (spots) => {
    return { type: LOAD_HOSTING_SPOTS, spots };
};

export const getHostingSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current', {
    });

    const data = await response.json();
    const spots = data.Spots.reduce((spotsObj, spot) => {
        spotsObj[spot.id] = spot
        return spotsObj;
    }, {});
    dispatch(loadHostingSpots(spots));
    return spots;
};

export const createSpotImage = (spotId, imgFile, position) => async () => {
    const formData = new FormData();
    formData.append('spotId', spotId);
    formData.append('position', position);
    formData.append("image", imgFile);

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            "Content-Type": "multipart/form-data",
        },
        body: formData
    });
    const image = await response.json();
    return image;
}


export const createSpot = spotData => async () => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spotData)
    });

    const spot = await response.json();
    return spot.id;
};

export const updateSpot = (spotId, spotData) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(spotData)
    });
    await dispatch(getSpotDetail(spotId));
    return response.json();
};

const loadSingleSpot = (spot) => {
    return { type: LOAD_SINGLE_SPOT, spot };
};

export const getSpotDetail = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    const spot = await response.json();
    const imagesNormalized = {}
    spot.SpotImages.forEach(image => {
        imagesNormalized[image.position] = image;
    });
    spot.SpotImages = imagesNormalized;
    dispatch(loadSingleSpot(spot));
};

export const clearSingleSpot = () => {
    return { type: CLEAR_SINGLE_SPOT };
}

export const deleteSpot = (spotId) => async dispatch => {
    await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });

    dispatch({ type: DELETE_SPOT, spotId });
};

const initialState = {
    allSpots: null,
    hostingSpots: null,
    singleSpot: null
};

const spotReducer = (state = initialState, action) => {
    const newState = { ...state };
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            newState.allSpots = action.spots;
            return newState;
        case LOAD_HOSTING_SPOTS:
            newState.hostingSpots = action.spots;
            return newState;
        case LOAD_SINGLE_SPOT:
            newState.singleSpot = action.spot;
            return newState;
        case CLEAR_SINGLE_SPOT:
            newState.singleSpot = null;
            return newState;
        case DELETE_SPOT:
            delete newState.hostingSpots[action.spotId];
            return newState;
        default:
            return state;
    }
};

export default spotReducer;
