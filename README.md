# Network Graph Visualization: Summary

## Backend (Django)

- **Data Handling:** Reads data from an Excel file using the `ExcelData` class.
- **API Views:**
  - `DatasetAPIView`: Returns the full dataset.
  - `GraphDataAPIView`: Returns nodes and edges for the graph.
  - `ChildNodesAPIView`: Returns child nodes for a parent node.
  - `ParentConnectedNodesAPIView`: Returns connected parent nodes for a parent node.
- **URL Configuration:** Sets up API endpoints and a template view for the graph.

---

## Frontend

- **HTML:** Sets up a webpage with a sidebar for node information and a main area for a D3.js network graph.
- **CSS:** Custom styles for nodes, links, and lists.
- **JavaScript (D3.js):**
  - Fetches graph data from the backend.
  - Initializes a D3 force simulation for the network graph.
  - Handles node interactions (clicking, dragging).
  - Dynamically updates the graph with related nodes.
  - Implements search functionality for parent nodes.

---

## Workflow

- Frontend initializes the graph by fetching data from the backend.
- Clicking a node fetches related child and parent nodes, updating the graph and sidebar.
- Search functionality filters and highlights parent nodes.

---

# Guide To Start Backend & Frontend Servers

## Start the Django Backend Server (on Linux)

1. Check if Python is installed on the system.

2. Navigate to your Django app directory:
   - `cd assignment_bcknd_project`

3. Create a virtual environment and activate it:
   - `pip install venv`
   - `python -m venv env` or `python3 -m venv env`
   - `source env/bin/activate`

4. Install Django and other dependencies:
   - `pip install -r requirements.txt`

5. Run the Django development server:
   - `python manage.py runserver 127.0.0.1:8000` or `python3 manage.py runserver 127.0.0.1:8000`

6. Access APIs in the browser at:
   - `DatasetAPIView`: http://127.0.0.1:8000/api/dataset/
   - `GraphDataAPIView`: http://127.0.0.1:8000/api/graph/
   - `ChildNodesAPIView`: http://127.0.0.1:8000/api/child-nodes/<str:parent_node>/
   - `ParentConnectedNodesAPIView`: http://127.0.0.1:8000/api/parent-connected-nodes/<str:parent_node>/

---

## Start the React Server (on Linux)

1. Check if Node.js is installed:
   - `node -v` (Install if not already installed)

2. Verify npm installation:
   - `npm -v` (Install if not already installed)

3. Navigate to your React app directory:
   - `cd assignment_frntnd_ui`

4. Install dependencies for your React app:
   - `npm install`

5. Start the React development server:
   - `npm start`

6. Access your React app in the browser at:
   - http://localhost:3000

---

