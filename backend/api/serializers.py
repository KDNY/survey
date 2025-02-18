from rest_framework import serializers

class SurveySerializer(serializers.Serializer):
    question = serializers.CharField(max_length=255)
    answer = serializers.CharField()
    created_at = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        return validated_data 