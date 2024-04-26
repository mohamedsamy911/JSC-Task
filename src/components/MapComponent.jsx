import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Home from "@arcgis/core/widgets/Home";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import CodedValueDomain from "@arcgis/core/layers/support/CodedValueDomain";
import { CodedValue } from "@arcgis/core/layers/support/CodedValue";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import Legend from "@arcgis/core/widgets/Legend";
import { useEffect, useRef, useState } from "react";
import "./MapComponent.css";

function MapComponent({ onMapClick, tableVisible, newData }) {
  const mapRef = useRef(null); //Element Ref for map container
  const tableRef = useRef(null); //Element Ref for table container
  const [fl, setFl] = useState(null); //Global FeatureLayer variable
  const [ft, setFt] = useState(null); //Global FeatureTable variable
  let selectionIdCount = 0; // The filtered selection id count

  //Creating a codedValue list for feedbackType field
  const codedValues = [
    new CodedValue({ code: "complain", name: "Complain" }),
    new CodedValue({
      code: "requestInformation",
      name: "Request Information",
    }),
    new CodedValue({ code: "missedServices", name: "Missed Services" }),
    new CodedValue({ code: "addInformation", name: "Add Information" }),
    new CodedValue({ code: "other", name: "Other" }),
  ];

  //Creating CodedValueDomain for feedbackType field
  const domain = new CodedValueDomain({
    name: "feedbackType",
    codedValues: codedValues,
  });

  //Handling vector data, fetching it from the localstorage and set default value in case if there is no data
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("geoData")) || [
      {
        name: "Client 1",
        email: "client@gmail.com",
        message: "test",
        x: 31.24773025513316,
        y: 30.13270141319825,
        feedbackType: "requestInformation",
      },
    ]
  );
  //This useEffect is responsible for updating the featureLayer and the mapVeiw on new data insert
  useEffect(() => {
    //function handling map update
    const updateMap = async () => {
      //check for new data props
      if (newData) {
        //update the data with the newly added data
        const updatedData = [...data, newData];
        //update the state of the data variable
        setData(updatedData);
        // Mapping all data after update to construct the FeatureLayer
        const newFeatures = updatedData.map((feature, index) => ({
          geometry: {
            type: "point",
            x: feature.x,
            y: feature.y,
          },
          attributes: {
            ObjectId: index,
            name: feature?.name,
            email: feature?.email,
            feedbackType: feature?.feedbackType,
            message: feature?.message,
            x: feature?.x,
            y: feature?.y,
          },
        }));
        // Clear existing features from the FeatureLayer
        await fl.queryFeatures().then((result) => {
          fl.applyEdits({ deleteFeatures: result.features });
        });
        // Apply new features to the FeatureLayer
        try {
          await fl.applyEdits({
            addFeatures: newFeatures,
          });
          // refresh the FeatureTable
          ft.refresh();
        } catch (error) {
          console.error("Error adding features:", error);
        }
      }
    };
    //calling the updatemap function
    updateMap();
    //adding the newData prop as dependency for this useEffect to perform this action every time a new data is sent from the FormComponent
  }, [newData]);
  //This useEffect is responsible for rendering all the components of the map
  useEffect(() => {
    //Check if the map element is rendered
    if (!mapRef.current) return;
    //FeatureLayer points renderer
    const pointRenderer = {
      type: "unique-value",
      field: "feedbackType",
      uniqueValueInfos: [
        {
          label: "Complain",
          value: "complain",
          symbol: {
            type: "simple-marker",
            color: [255, 0, 0], // Red for complaints
          },
        },
        {
          label: "Request Information",
          value: "requestInformation",
          symbol: {
            type: "simple-marker",
            color: [0, 0, 255], // Blue for information requests
          },
        },
        {
          label: "Missed Services",
          value: "missedServices",
          symbol: {
            type: "simple-marker",
            color: [255, 255, 0], // Yellow for missed services
          },
        },
        {
          label: "Add Information",
          value: "addInformation",
          symbol: {
            type: "simple-marker",
            color: [0, 255, 0], // Green for additional information
          },
        },
        {
          label: "Other",
          value: "other",
          symbol: {
            type: "simple-marker",
            color: [128, 128, 128], // Grey for other types
          },
        },
      ],
    };
    //Mapping already existing data to construct the FeatureLayer
    const features = data.map((feature, index) => ({
      geometry: {
        type: "point",
        x: feature.x,
        y: feature.y,
      },
      attributes: {
        ObjectId: index + 1,
        name: feature?.name,
        email: feature?.email,
        feedbackType: feature?.feedbackType,
        message: feature?.message,
        x: feature?.x,
        y: feature?.y,
      },
    }));

    //Creating the FeatureLayer
    let flayer = new FeatureLayer({
      title: "Feedbacks",
      source: features,
      renderer: pointRenderer,
      objectIdField: "ObjectId",
      fields: [
        { name: "ObjectId", alias: "ObjectId", type: "oid" },
        { name: "name", alias: "name", type: "string" },
        { name: "email", alias: "email", type: "string" },
        {
          name: "feedbackType",
          alias: "feedbackType",
          type: "string",
          domain: domain,
        },
        { name: "message", alias: "message", type: "string" },
        { name: "x", alias: "x", type: "double" },
        { name: "y", alias: "y", type: "double" },
      ],
      popupEnabled: true,
      popupTemplate: {
        title: "Feedback-{ObjectId}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "name",
                label: "Name",
              },
              {
                fieldName: "email",
                label: "Email",
              },
              {
                fieldName: "feedbackType",
                label: "Feedback Type",
              },
              {
                fieldName: "message",
                label: "Message",
              },
              {
                fieldName: "x",
                label: "X",
              },
              {
                fieldName: "y",
                label: "Y",
              },
            ],
          },
        ],
      },
    });
    //Updating the state of the FeatureLayer (fl) global variable
    setFl(flayer);

    //Creating the Map with satellite basemap and the FeatureLayer
    const map = new Map({
      basemap: "satellite",
      layers: data.length > 0 ? [flayer] : [],
    });

    //Creating MapView with Cairo in the center of the map
    const view = new MapView({
      map: map,
      container: mapRef.current,
      center: [31.227989196783575, 30.11919027161913],
      popup: {
        dockOptions: {
          buttonEnabled: false,
          breakpoint: false,
        },
      },
      zoom: 12,
    });

    //Creating basemap toggler and adding it to the view
    const basemapToggle = new BasemapToggle({
      view: view, // The view that provides access to the map's "satellite" basemap
      nextBasemap: "dark-gray-vector", // Allows for toggling to the "dark-gray-vector" basemap
    });
    view.ui.add(basemapToggle, {
      position: "bottom-left",
    });

    //Creating ScaleBar and adding it to the view
    const scaleBar = new ScaleBar({
      view: view,
    });
    view.ui.add(scaleBar, {
      position: "bottom-left",
    });

    //Creating Home and adding it to the view
    const homeBtn = new Home({
      view: view,
    });
    view.ui.add(homeBtn, "top-left");

    //Creating Legend and adding it to the view
    const legend = new Legend({
      view: view,
      layerInfos: [
        {
          layer: flayer,
          title: "Feedbacks",
        },
      ],
    });
    view.ui.add(legend, "top-left");

    //Listing to map clicks to update the FormComponent with the Coordinates
    view.on("click", (event) => {
      onMapClick(event.mapPoint.longitude, event.mapPoint.latitude);
    });

    //Creating the FeatureTable
    const featureTable = new FeatureTable({
      view: view,
      layer: flayer,
      visibleElements: {
        // Autocast to VisibleElements
        menuItems: {
          clearSelection: true,
          refreshData: true,
          toggleColumns: true,
          selectedRecordsShowAllToggle: true,
          selectedRecordsShowSelectedToggle: true,
          zoomToSelection: true,
        },
      },
      tableTemplate: {
        // Autocast to TableTemplate
        columnTemplates: [
          // Takes an array of FieldColumnTemplate and GroupColumnTemplate
          {
            // Autocast to FieldColumnTemplate.
            type: "field",
            fieldName: "Name",
            label: "Name",
            direction: "asc",
          },
          {
            type: "field",
            fieldName: "email",
            label: "Email",
          },
          {
            type: "field",
            fieldName: "feedbackType",
            label: "Feedback Type",
          },
          {
            type: "field",
            fieldName: "message",
            label: "Message",
          },
        ],
      },
      container: tableRef.current,
    });
    //Updating FeatureTable global variable state
    setFt(featureTable);

    //Adding featureTable to the View
    view.ui.add(featureTable);

    //Listing on FeatureTable selection change to zoOm to feature whenever a new feature is selected in the table
    featureTable.on("selection-change", () => {
      featureTable.zoomToSelection();
    });

    //Adding highlight option when clicking on table roe checkbox
    reactiveUtils.watch(
      () => featureTable.highlightIds.length,
      (highlightIdsCount) => {
        // Iterate through the filters within the table.
        // If the active filter is "Show selection",
        // changes made to highlightIds (adding/removing)
        // are reflected.

        featureTable.viewModel.activeFilters.forEach((filter) => {
          if (filter.type === "selection") {
            selectionIdCount = filter.objectIds.length; // the filtered selection's id count
            // Check that the filter selection count is equal to the
            // highlightIds collection count. If not, update filter selection.
            if (selectionIdCount !== highlightIdsCount) {
              featureTable.filterBySelection();
            }
          }
        });
      }
    );
  }, []);

  return (
    <>
      <div className="viewDiv" ref={mapRef}></div>
      <div
        className="tableDiv"
        style={{ height: tableVisible ? "40%" : "0%" }}
        ref={tableRef}
      ></div>
    </>
  );
}

export default MapComponent;
