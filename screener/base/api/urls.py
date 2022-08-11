from django.urls import path
from . import views
from .views import MyTokenObtainPairView, RegisterView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("watchlists/", views.watchlist_actions),
    path("test/", views.test_route),
    path("run-analysis/", views.run_strategy),
    path("get-news/<watchlist_id>/", views.get_news),
    path("add_watchlists/", views.watchlist_actions),
    path("get-watchlist/<watchlist_id>", views.get_watchlist),
    path("get-watchlist-analytics/<watchlist_id>/", views.get_watchlist_analytics),
    path("get-watchlist-returns/<watchlist_id>/", views.get_watchlist_returns),
    path("watchlist-analysis/<watchlist_id>/", views.watchlist_analysis),
    path("update-watchlist/<watchlist_id>/", views.update_watchlist),
    path("remove-watchlist/<pk>/", views.watchlist_remove),
    path("save-strategy/", views.strategy_actions),
    path("get-strategies/", views.get_user_strategies),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('market-data/general', views.get_general_market_data),
    path('register/', RegisterView.as_view(), name='register'),
    path('tickers-info/', views.tickers_info),
]