from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from supabase import create_client
from django.conf import settings
from .serializers import SurveySerializer

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@api_view(["POST"])
def submit_survey(request):
    try:
        serializer = SurveySerializer(data=request.data)
        if serializer.is_valid():
            response = supabase.table("surveys").insert(serializer.validated_data).execute()
            return Response({"message": "Survey submitted successfully!", "data": response.data})
        return Response({"error": serializer.errors}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
def get_surveys(request):
    try:
        response = supabase.table("surveys").select("*").execute()
        serializer = SurveySerializer(data=response.data, many=True)
        if serializer.is_valid():
            return Response({"surveys": serializer.data})
        return Response({"error": serializer.errors}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
def test_api(request):
    return Response({"message": "API is working!"})

