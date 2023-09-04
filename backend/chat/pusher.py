import pusher
from django.conf import settings

pusher_client = pusher.Pusher(
    app_id="1662400",
    key="af6db88506191819a56e",
    secret=settings.PUSHER_SECRET,
    cluster="eu",
    ssl=True,
)
