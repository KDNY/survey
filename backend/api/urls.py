from django.urls import path
from .views import test_api, submit_survey, get_surveys

urlpatterns = [
    path("test/", test_api, name="test_api"),
    path("surveys/submit/", submit_survey, name="submit_survey"),
    path("surveys/", get_surveys, name="get_surveys"),
]

