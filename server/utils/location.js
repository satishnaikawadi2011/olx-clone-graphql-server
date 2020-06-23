const geo = require('mapbox-geocoding');
const config = require('config');
const MAPBOX_API_KEY = config.get('MAPBOX_API_KEY');
geo.setAccessToken(MAPBOX_API_KEY);

function myGeocoder(address, callback) {
	const cords = geo.geocode('mapbox.places', address, function(err, geoData) {
		if (err) {
			callback('Unable to coonnect geocoding', undefined);
		}
		else if (geoData.features.length === 0) {
			callback('Unale to found location.Try another search.', undefined);
		}
		else {
			const coordinates = geoData.features[0].geometry.coordinates;
			callback(undefined, { longitude: coordinates[0], latitude: coordinates[1] });
		}
	});
}

module.exports = myGeocoder;
