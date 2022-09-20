from base.api.market_data.classes.utilities import download_data
from base.api.market_data.classes.dataframe import EnhancedDataframe
from base.api.market_data.classes.strategies import TickerStrategy, Strategy
import pandas as pd
import numpy as np


class Simulation:
    def __init__(self, tickers: list[str], is_index: bool = False, period: str = '2y', interval: str = "1d"):
        self.tickers = tickers
        self.is_index = is_index
        self.df = download_data(
            tickers=tickers, period=period, interval=interval)
        self.entries = []

    def run(self):
        for ticker in self.tickers:
            df = EnhancedDataframe.populate_dataframe(
                self.df.T[ticker], ticker)

            df.drop(["Close", "Ticker", "BB_middle",
                     "BB_upper", "Volume_Change", "Change", "tenkan_sen",   "kijun_sen", "Open", "High", "Low"], axis=1, inplace=True)
            df.rename({"Adj_Close": "Close"}, axis=1, inplace=True)

            # Applying strategies to the data frame
            df['Strategy Alpha'] = np.vectorize(TickerStrategy.ma_bol_rsi_signal)(
                df['Close'], df['MA50'], df["BB_lower"], df['RSI'])

            df['Strategy Bravo'] = np.vectorize(TickerStrategy.r_ma20_ma50_signal)(
                df['RSI'], df['MA20'], df['MA50'])

            df['Strategy Charlie'] = np.vectorize(TickerStrategy.ichimoku_entry)(
                df['senkou_span_a'], df['senkou_span_b'], df['RSI'])

            df['Strategy Delta'] = np.vectorize(
                TickerStrategy.r_sd_m_signal)(df['RSI'], df['STOCH_D'], df['MACD_histogram'])

            entries = {}

            for column in df.columns:
                if "Strategy" in column:
                    sub_df = df[df[column]]
                    if not len(sub_df):
                        continue
                    entries[column] = list(sub_df.index)

                    data = Strategy.strategy_general_performance(
                        sub_df, df, column)

                    print(data)

            dates = [d for date in entries.values() for d in date]

            data['Total Entries'] = len(dates)
            data['Unique Entries'] = len(set(dates))


Simulation(['AAPL', 'TSLA', "MSFT"]).run()
