import React, { useEffect, useState } from "react";
import axios from "axios";

const Step3Preferences = ({ formData, updateField, nextStep, prevStep }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const API_HOST = "country-state-city-search-rest-api.p.rapidapi.com";
  const API_KEY = "b1ee960271mshfd317654bc0a6b9p160ff6jsnfc83e7eeca34";

  const headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": API_HOST,
  };

  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`https://${API_HOST}/allcountries`, { headers });
        setCountries(res.data || []);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      try {
        const res = await axios.get(`https://${API_HOST}/states-by-countrycode`, {
          headers,
          params: { countrycode: selectedCountry.isoCode },
        });
        setStates(res.data || []);
        setCities([]); // Reset cities on country change
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `https://${API_HOST}/cities-by-countrycode-and-statecode`,
          {
            headers,
            params: {
              countrycode: selectedCountry.isoCode,
              statecode: selectedState.isoCode,
            },
          }
        );
        setCities(res.data || []);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, [selectedState]);

  // Country Change
  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    const selected = countries.find((c) => c.name === selectedName);
    if (!selected) return;

    setSelectedCountry(selected);
    updateField("country", selected.name);
    updateField("state", "");
    updateField("city", "");
    setStates([]);
    setCities([]);
    setSelectedState(null); // Reset state selection
  };

  // State Change
  const handleStateChange = (e) => {
    const selectedName = e.target.value;
    const selected = states.find((s) => s.name === selectedName);
    if (!selected) return;

    setSelectedState(selected);
    updateField("state", selected.name);
    updateField("city", "");
    setCities([]);
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>

      {/* Country */}
      <select
        value={formData.country}
        onChange={handleCountryChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c.isoCode} value={c.name}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>

      {/* State */}
      <select
        value={formData.state}
        onChange={handleStateChange}
        className="w-full p-2 border rounded mt-2"
        disabled={!states.length}
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s.isoCode} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {/* City */}
      <select
        value={formData.city}
        onChange={(e) => updateField("city", e.target.value)}
        className="w-full p-2 border rounded mt-2"
        disabled={!cities.length}
      >
        <option value="">Select City</option>
        {cities.map((c, idx) => (
          <option key={idx} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Subscription Plan */}
      <div className="mt-4">
        <label className="font-medium mr-4">Subscription:</label>
        {["Basic", "Pro", "Enterprise"].map((plan) => (
          <label key={plan} className="mr-4">
            <input
              type="radio"
              name="subscription"
              value={plan}
              checked={formData.subscriptionPlan === plan}
              onChange={() => updateField("subscriptionPlan", plan)}
              className="mr-1"
            />
            {plan}
          </label>
        ))}
      </div>

      {/* Newsletter */}
      <div className="mt-4">
        <label>
          <input
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => updateField("newsletter", e.target.checked)}
            className="mr-2"
          />
          Subscribe to Newsletter
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded">
          Back
        </button>
        <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">
          Review
        </button>
      </div>
    </div>
  );
};

export default Step3Preferences;
