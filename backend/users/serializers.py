from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from .models import User, Profile
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import (
    smart_str,
    force_str,
    DjangoUnicodeDecodeError,
)
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .utils import send_email_reset


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "date_of_birth")


class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

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

    def create(self, validated_data):
        if self.validated_data["password"] != self.validated_data["password2"]:
            raise serializers.ValidationError({"password": "Passwords must match."})

        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
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


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(label="Email", write_only=True)
    password = serializers.CharField(
        label="Password",
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )

    tokens = serializers.SerializerMethodField()

    def get_tokens(self, obj):
        user = User.objects.get(email=obj["email"])

        return {
            "refresh": user.tokens()["refresh"],
            "access": user.tokens()["access"],
        }

    class Meta:
        model = User
        fields = ["email", "password", "tokens"]

    def validate(self, data):
        user = authenticate(**data)
        filtered_user_by_email = User.objects.filter(email=data["email"]).first()
        print(filtered_user_by_email)
        if not user:
            raise AuthenticationFailed("Invalid credentials, try again")
        if not user.is_active:
            raise AuthenticationFailed("Email is not verified")

        return {
            "email": user.email,
            "first_name": user.first_name,
            "tokens": user.tokens,
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    default_error_messages = {"invalid_token": "Token is expired or invalid"}

    def validate(self, attrs):
        self.token = attrs["refresh"]

        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            self.fail("invalid_token")


class ProfileSerializer(UserSerializer):
    class Meta:
        model = Profile
        fields = ("bio",)


class ProfileAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("avatar",)


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ["email"]


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        style={"input_type": "password"}, min_length=6, max_length=68, write_only=True
    )
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ["password", "token", "uidb64"]

    def validate(self, attrs):
        try:
            password = attrs.get("password")
            token = attrs.get("token")
            uidb64 = attrs.get("uidb64")

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("The reset link is invalid", 401)
            user.set_password(password)
            user.save()

        except Exception as e:
            raise AuthenticationFailed("The reset link is invalid", 401)
        return super().validate(attrs=attrs)
