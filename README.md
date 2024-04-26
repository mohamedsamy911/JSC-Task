# GIS Data Submission and Visualization Web App

This web application allows users to submit Feedbacks with geographic location data via a form and visualize it on a map and a table. It is built with React and integrates with various GIS libraries for map visualization.

## Features
- Form Submission: Users can submit geographic data including coordinates, name, email, feedback type, and message through a form.
- Map Visualization: Submitted data is displayed on an interactive map, providing users with a visual representation of the geographic information.
- Table View: Data submitted via the form is also displayed in a tabular format for easy reference.

## Technologies Used
- React: Frontend framework for building the user interface.
- react-hook-form: Used for managing form state and validation.
- Ant Design: Provides UI components, including the Select dropdown for feedback types.
- CSS: Custom styling for the application.
- calcite-web: Provides Icons and Custom Styling for application
- ArcGIS API for JavaScript (ArcGIS Core): Used for GIS functionalities and mapping.
- Vite: Next-generation frontend tooling for React applications.
- usehooks-ts: Collection of reusable React hooks for various functionalities.
- Sass: CSS preprocessor for styling, offering more features and flexibility.

## Installation
1. Clone the repository:

```bash
git clone https://github.com/mohamedsamy911/JSC-Task.git
```
2. Navigate into the project directory:

```bash
cd JSC-Task
```
3. Install dependencies:

```bash
npm install
```
4. Build the application:

```bash
npm rub build
```
4. Run the production server:

```bash
npm run preview
```

## Usage
1. Fill out the form with the required information, including
name, email, feedback type, and message.
2. Click on feedback location on the map to set the coordinates (X and Y).
3. Submit the form.
4. View the submitted data on the map and in the table below.
5. Interact with the map to explore the submitted data further.

## Contributing
Contributions are welcome! If you have any ideas, enhancements, or bug fixes, feel free to open an issue or submit a pull request.