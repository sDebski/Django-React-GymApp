from rest_framework import serializers
from .models import Exercise, User
from rest_framework.validators import UniqueValidator


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "date_of_birth",
            "password",
            "password2",
        ]

    def save(self):
        user = User(
            email=self.validated_data["email"],
            first_name=self.validated_data["first_name"],
            last_name=self.validated_data["last_name"],
            date_of_birth=self.validated_data["date_of_birth"],
        )
        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]
        if password != password2:
            raise serializers.ValidationError({"password": "Passwords must match."})
        user.set_password(password)
        user.save()
        return user


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        style={"input_type": "password"}, required=True
    )
    new_password = serializers.CharField(
        style={"input_type": "password"}, required=True
    )

    def validate_current_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError({"current_password": "Does not match"})
        return value


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=512)

    class Meta:
        model = User
        fields = ["token"]
