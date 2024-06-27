from django.urls import path
from .views import (
    DatasetAPIView,
    GraphDataAPIView,
    ChildNodesAPIView,
    ParentConnectedNodesAPIView,
)
from django.views.generic import TemplateView

urlpatterns = [
    # Data fetch API
    path('api/dataset/', DatasetAPIView.as_view(), name='dataset'),
    path('api/graph/', GraphDataAPIView.as_view(), name='graph-data'),
    path('api/child-nodes/<str:parent_node>/', ChildNodesAPIView.as_view(),
          name='child-nodes'),
    path('api/parent-connected-nodes/<str:parent_node>/', 
         ParentConnectedNodesAPIView.as_view(), 
         name='parent-connected-nodes'),

    # Data render API
    path('graph/', TemplateView.as_view(template_name='graph/graph.html'), 
         name='graph'),
]
