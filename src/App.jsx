import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import MapComponent from "./components/MapComponent";
import "./App.css";
import "./App.scss";
import ActionButton from "./components/ActionButton";
import FormComponent from "./components/FormComponent";

function App() {
  // State for controlling visibility of form, table, and storing form data
  const [formVisible, setFormVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: null, y: null });
  const [formData, setFormData] = useState(null);

  // Local storage hook to store and retrieve data
  const [dataArray, setData, removeData] = useLocalStorage("geoData", []);

  // Function to handle form submission
  const onSubmit = (data) => {
    setFormData(data); // Set form data
    setData([...dataArray, data]); // Store form data in local storage
  };

  // Function to handle map click event
  const handleMapClick = (x, y) => {
    setCoordinates({ x, y }); // Update coordinates when clicked on map
  };

  // Function to toggle form visibility
  const toggleForm = (e) => {
    setFormVisible(!formVisible); // Toggle form visibility
  };

  // Function to toggle table visibility
  const toggleTable = (e) => {
    setTableVisible(!tableVisible); // Toggle table visibility
  };

  return (
    <>
      {/* Map component to display map and handle map click */}
      <MapComponent
        newData={formData} // Pass new form data to update the map
        onMapClick={handleMapClick} // Pass map click handler function
        tableVisible={tableVisible} // Pass table visibility status
      />
      {/* Action buttons component to toggle form and table visibility */}
      <ActionButton
        onClick={toggleForm} // Pass toggle form visibility function
        onTableButtonClick={toggleTable} // Pass toggle table visibility function
        tableVisible={tableVisible} // Pass table visibility status
        formVisible={formVisible} // Pass form visibility status
      />
      {/* Form component for submitting feedback */}
      <FormComponent
        onSubmit={onSubmit} // Pass form submission handler function
        onClick={toggleForm} // Pass form toggle function
        formVisible={formVisible} // Pass form visibility status
        x={coordinates.x} // Pass X coordinate
        y={coordinates.y} // Pass Y coordinate
      />
    </>
  );
}

export default App;
