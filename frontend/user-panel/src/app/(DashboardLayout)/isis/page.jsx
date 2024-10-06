'use client';
import React, { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const ISSTracker = () => {
  const [issData, setIssData] = useState({});
  const [userLocation, setUserLocation] = useState({});
  const [map, setMap] = useState(null);
  const [issMarker, setIssMarker] = useState(null);
  const [nextPassMinutes, setNextPassMinutes] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyBnwJ8WGKD2IIchAhHJM7Vx21Dw_cOPLHU', // Replace with your Google Maps API key
      version: 'weekly',
    });

    loader.load().then(() => {
      initMap();
      updateISSInfo();
      const intervalId = setInterval(updateISSInfo, 5000);
      return () => clearInterval(intervalId);
    });
  }, []);

  const initMap = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const mapInstance = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: { lat: userLat, lng: userLng },
      });

      new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      setMap(mapInstance);
      setUserLocation({ latitude: userLat, longitude: userLng });
    });
  };

  const getISSPosition = async () => {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    return data;
  };

  const calculateETA = (issLat, issLng, userLat, userLng) => {
    const distance = Math.sqrt(Math.pow(issLat - userLat, 2) + Math.pow(issLng - userLng, 2));
    const velocity = 27600; // ISS velocity in km/h
    const time = (distance * 111) / velocity; // Distance in km and time in hours
    return Math.round(time * 60); // Convert to minutes
  };

  const updateISSInfo = async () => {
    try {
      const issData = await getISSPosition();
      setIssData(issData);

      const nextPass = calculateETA(
        issData.latitude,
        issData.longitude,
        userLocation.latitude,
        userLocation.longitude,
      );
      setNextPassMinutes(nextPass);

      if (map) {
        const issPosition = { lat: issData.latitude, lng: issData.longitude };

        if (!issMarker) {
          const newMarker = new google.maps.Marker({
            position: issPosition,
            map: map,
            icon: {
              url: 'https://e7.pngegg.com/pngimages/639/589/png-clipart-international-space-station-computer-icons-sts-118-others-miscellaneous-spacecraft.png',
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(25, 25),
            },
            title: 'International Space Station (ISS)',
          });
          setIssMarker(newMarker);
        } else {
          issMarker.setPosition(issPosition);
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(issPosition);
        bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Roboto, sans-serif',
        padding: '20px',
        backgroundColor: '#f0f8ff',
        color: '#333',
      }}
    >
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>Where is the ISS Right Now?</h1>
      <div
        className="info"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <p>
          <strong>Current ISS Position:</strong> Latitude:{' '}
          <span>{issData.latitude?.toFixed(2)}</span>, Longitude:{' '}
          <span>{issData.longitude?.toFixed(2)}</span>
        </p>
        <p>
          <strong>Altitude:</strong> <span>{issData.altitude?.toFixed(2)}</span> km
        </p>
        <p>
          <strong>Velocity:</strong> <span>{issData.velocity?.toFixed(2)}</span> km/h
        </p>
        <p>
          <strong>Your Location:</strong> Latitude: <span>{userLocation.latitude?.toFixed(2)}</span>
          , Longitude: <span>{userLocation.longitude?.toFixed(2)}</span>
        </p>
        <p>
          <strong>ETA of ISS over your location:</strong>
          <span>
            {nextPassMinutes !== null
              ? nextPassMinutes > 0
                ? `${nextPassMinutes} minutes`
                : "It's above you now!"
              : 'Calculating...'}
          </span>
        </p>
      </div>
      <div
        id="map"
        style={{
          height: '500px',
          width: '100%',
          maxWidth: '800px',
          marginTop: '20px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      ></div>
      <div
        id="scene"
        style={{
          height: '320px',
          width: '100%',
          marginTop: '20px',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <clooned-object
          features="lsc;dt;fs"
          oid="6429b0d97f824c52947b2e5196fb7462"
        ></clooned-object>
      </div>
      <div className="footer" style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}>
        © 2024 ISS Tracker
      </div>
    </div>
  );
};

export default ISSTracker;
