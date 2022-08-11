from django.db import models
from django.contrib.auth.models import User


class WatchList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.TextField(unique=True)
    # JSON | is JSON list and is parsed into Python list | -> "[AAPL, TSLA]" = ["AAPL", "TSLA]
    tickers = models.TextField(default="")


class Strategy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.TextField(unique=True)
    # JSON {n: {firstIndicator: str, secondIndicator: str...}}
    strategy_data = models.TextField(default="")
    efficiency = models.FloatField(default=0)
