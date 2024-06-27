import os
import pandas as pd
from pathlib import Path
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response

class ExcelData:
    """
    Class to handle reading Excel data and storing it in a structured format.

    Attributes:
        file_path (str): Path to the Excel file.
        data (list or None): Processed data from the Excel file, stored as a list of dictionaries.

    Methods:
        read_excel():
            Reads the Excel file specified by file_path, processes the rows into a list of dictionaries,
            and stores it in self.data.
    """
    def __init__(self, file_path):
        self.file_path = file_path
        self.data = None

    def read_excel(self):
        """
        Reads the Excel file and converts the rows into a list of dictionaries.

        Uses pandas to read the Excel file and stores the processed data in self.data.
        """
        df = pd.read_excel(self.file_path, engine='openpyxl')
        self.data = df.to_dict(orient='records')
        
BASE_DIR = Path(__file__).resolve().parent.parent
file_path = os.path.join(BASE_DIR, 'assignment_bcknd_project/Full_Stack_Developer_Task_Data.xlsx')
excel_data = ExcelData(file_path)
excel_data.read_excel()



class DatasetAPIView(APIView):
    """
    API view to fetch the entire dataset from an Excel file.

    Endpoint: /api/dataset/
    Method: GET
    Response:
        - JSON response containing the records from the Excel file.
    """
    def get(self, request, format=None):
        return Response(excel_data.data)



class GraphDataAPIView(APIView):
    """
    API view to prepare data for D3.js network graph from an Excel file.

    Endpoint: /api/graph-data/
    Method: GET
    Response:
        - JSON response containing nodes and edges formatted for D3.js network graph:
            {
                'nodes': [list of unique nodes],
                'edges': [list of edges with 'source' and 'target' nodes]
            }
    """
    def get(self, request, format=None):

        df = pd.DataFrame(excel_data.data)
        
        # Collect unique nodes
        nodes = pd.unique(df[['Entity1_Parent', 'Entity2_Parent']].values.ravel('K'))
        
        # Collect edges
        edges = df[['Entity1_Parent', 'Entity2_Parent']].rename(columns={
            'Entity1_Parent': 'source', 
            'Entity2_Parent': 'target'
        }).to_dict('records')
        
        # Format data as required by D3.js for a network graph
        data = {'nodes': nodes.tolist(), 'edges': edges}
        return JsonResponse(data)



class ChildNodesAPIView(APIView):
    """
    API view to fetch child nodes for a given parent node from an Excel file.

    Endpoint: /api/child-nodes/<parent_node>/
    Method: GET
    Parameters:
        - parent_node (str): The parent node for which child nodes are to be fetched.
    Response:
        - JSON response containing a list of child nodes related to the parent node.
    """
    def get(self, request, parent_node, format=None):

        df = pd.DataFrame(excel_data.data)
        
        # Filter rows where either Entity1_Parent or Entity2_Parent matches the given parent_node
        filtered_df = df[(df['Entity1_Parent'] == parent_node) | (df['Entity2_Parent'] == parent_node)]
        
        # Create a list of child nodes from the filtered rows
        child_nodes = (
            filtered_df.apply(lambda row: [f"{row['Entity1']}/{row['Entity1_Type']}", 
                                           f"{row['Entity2']}/{row['Entity2_Type']}"], axis=1)
                       .explode().unique().tolist()
        )

        return JsonResponse(child_nodes, safe=False)



class ParentConnectedNodesAPIView(APIView):
    """
    API view to fetch parent directly connected nodes for a given parent node from an Excel file.

    Endpoint: /api/parent-connected-nodes/<parent_node>/
    Method: GET
    Parameters:
        - parent_node (str): The parent node for which directly connected parent nodes are to be fetched.
    Response:
        - JSON response containing a list of directly connected parent nodes related to the given parent node.
    """
    def get(self, request, parent_node, format=None):
        parent_directly_connected_nodes = []
        
        # Find directly connected parent nodes related to the parent node
        for entry in excel_data.data:
            if entry['Entity1_Parent'] == parent_node and parent_node != entry['Entity2_Parent']:
                parent_directly_connected_nodes.append(entry['Entity2_Parent'])
            if entry['Entity2_Parent'] == parent_node and parent_node != entry['Entity1_Parent']:
                parent_directly_connected_nodes.append(entry['Entity1_Parent'])
        
        return JsonResponse(list(set(parent_directly_connected_nodes)), safe=False)

