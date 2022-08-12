import json

import yfinance

from base.api.market_data.classes.evaluate_watchlist import run_strategies_on_watchlist, get_returns_data
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.api.market_data.api_requests import general_market_data_request
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, WatchlistSerializer, StrategySerializer
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
import pandas as pd
from base.api.market_data.config import file_path
from base.api.market_data.classes.alpha_beta import watchlist_analysis, compose_watchlist_data
from base.api.market_data.classes.user_strategies import UserDefinedStrategy
import requests


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['POST', "GET"])
@permission_classes([IsAuthenticated])
def test_route(request):
    if request.method == "POST":
        strategy = UserDefinedStrategy(strategy_data=request.data['data'])
        df = strategy.apply(yfinance.download(
            "AAPL", period="1y", interval="1d"))
        df.to_csv("USER_DEFINED")
        return Response({"status": "ok"})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_strategy(request):
    strategy = UserDefinedStrategy(strategy_data=json.loads(request.data['strategyData']['strategy_data']),
                                   entry_constraints=request.data['entryConstraints'],
                                   strategy_constraints=request.data['constraints'],
                                   collection=request.data['collection'])
    data = strategy.apply_on_collection(request.data['constraints'])
    return Response({"data": data})


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
def watchlist_actions(request):
    if request.method == "GET":
        user = request.user
        watchlists = user.watchlist_set.all()
        serializer = WatchlistSerializer(watchlists, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = WatchlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)
            return Response({"Invalid": True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def strategy_actions(request):
    if request.method == 'POST':
        serializer = StrategySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer)
            print(serializer.errors)
            return Response({"Serializer": "bad"})
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_strategies(request):
    user = request.user
    strategies = user.strategy_set.all()
    serializer = StrategySerializer(strategies, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_watchlist(request, watchlist_id):
    if request.method == "PUT":
        user = request.user
        watchlists = user.watchlist_set.all()
        watchlist = watchlists.get(id=watchlist_id)
        serializer = WatchlistSerializer(watchlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist(request, watchlist_id):
    if request.method == "GET":
        user = request.user
        watchlists = user.watchlist_set.all()
        watchlist = watchlists.get(id=watchlist_id)
        serializer = WatchlistSerializer(watchlist)

        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_watchlist_analytics(request, watchlist_id):
    if request.method == "GET":
        user = request.user
        watchlists = user.watchlist_set.all()
        watchlist = watchlists.get(id=watchlist_id)
        tickers = json.loads(watchlist.tickers)
        data = watchlist_analysis(compose_watchlist_data(tickers=tickers))
        return Response({"data": data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_watchlist_returns(request, watchlist_id):
    if request.method == 'GET':
        user = request.user
        watchlists = user.watchlist_set.all()
        watchlist = watchlists.get(id=watchlist_id)
        tickers = json.loads(watchlist.tickers)
        data = get_returns_data(tickers)
        return Response({"data": data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_remove(request, pk):
    if request.method == "DELETE":
        user = request.user
        watchlists = user.watchlist_set.all()
        watchlist = watchlists.get(id=pk)
        watchlist.delete()
        return Response({"status": "success"})


@api_view(["GET"])
def get_general_market_data(request):
    return Response(general_market_data_request())


@api_view(["GET"])
def tickers_info(request):
    df = pd.read_csv(file_path / "sp500.csv")
    tickers = df['Symbol'].values
    securities = df['Security'].values
    sec_filings = df['SEC filings']
    sectors = df['GICS Sector']
    sub_industries = df['GICS Sub-Industry']
    headquarters = df['Headquarters Location']
    return Response({
        ticker: {
            "security": securities[i],
            "sec_filings": sec_filings[i],
            "sector": sectors[i],
            "sub_industry": sub_industries[i],
            "headquarter": headquarters[i]
        } for i, ticker in enumerate(tickers)
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_news(request, watchlist_id):
    user = request.user
    watchlists = user.watchlist_set.all()
    watchlist = watchlists.get(id=watchlist_id)
    data = requests.get(
        f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={','.join(json.loads(watchlist.tickers))}&topics=technology&apikey=SXCOTLYUZRI5VUR9")
    if data.ok:
        return Response(data.json())
    return Response(status=status.HTTP_400_BAD_REQUEST)
