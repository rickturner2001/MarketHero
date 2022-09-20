import pandas as pd
from yfinance import download
from pandas import DataFrame
import yfinance as yf

from base.api.market_data.api_requests import get_entries_from_indicators
from base.api.market_data.classes.Backtester import Backtester
from base.api.market_data.classes.dataframe import EnhancedDataframe


def download_data(tickers, period: str = "1y", interval: str = "1d") -> DataFrame:
    tickers_data = download(
        tickers=tickers, period=period,
        interval=interval, group_by='ticker', auto_adjust=False,
        prepost=False, threads=True, proxy=None)

    tickers_data = tickers_data.T
    return tickers_data


def watchlist_analysis(tickers: list, take_profit=None):
    data = download_data(tickers)
    data_collection = {}

    # Run strategies on watchlist
    run_strategies_on_watchlist(tickers, data_collection, data, take_profit)

    return data_collection


def run_strategies_on_watchlist(tickers: list[str], data_collection, data, take_profit):
    for n, ticker in enumerate(tickers):
        data_collection[ticker] = {}
        df = data.loc[ticker].T
        df = EnhancedDataframe.populate_dataframe(df, ticker)
        entries = get_entries_from_indicators(df)

        # Backtesting
        backtester = Backtester(entries=list(entries.index), benchmark=df, include_sell="Cum_change",
                                take_profit=take_profit)
        backtester.evaluate_strategy()
        results = backtester.results
        data_collection[ticker]['entries'] = list(entries.index)
        data_collection[ticker]['returns'] = list(results['returns'])
        data_collection[ticker]['max'] = results['max']
        data_collection[ticker]['min'] = results['min']
        data_collection[ticker]['mean'] = results['mean']
        data_collection[ticker]['std'] = results['std']
        data_collection[ticker]['total'] = results['total']
        data_collection[ticker]['mean_holding_time'] = results['mean_holding_time']
        data_collection[ticker]['mean_holding_time'] = results['mean_holding_time']


def get_returns_data(tickers: list[str]) -> dict[str, pd.DataFrame]:
    # tickers.append("^GSPC")
    df = yf.download(tickers, period='1y', interval='1d')
    df = df.T
    df = df.loc['Adj Close']
    df = df.T
    # df.rename(columns={"^GSPC": "SPX"}, inplace=True)

    data = {"data": {}}
    for ticker in tickers:
        data['data'][ticker] = (
            (1 + df[ticker].pct_change(1).dropna()).cumprod() - 1) * 100

    data['labels'] = list(map(lambda date: str(date.date()), df.index[1:]))

    return data


def run_strategies(indicators: dict):
    for indicator, value in indicators.items():
        ...
