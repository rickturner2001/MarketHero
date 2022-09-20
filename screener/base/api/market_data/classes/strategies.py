import warnings
import numpy as np
import pandas as pd
from yfinance import download
import requests

try:
    from base.api.market_data.classes.dataframe import EnhancedDataframe
    from base.api.market_data.classes.utilities import download_data, print_centered_title
except ModuleNotFoundError:
    from dataframe import EnhancedDataframe
    from utilities import download_data, print_centered_title

from typing import Union
from abc import ABC
import math

warnings.filterwarnings("ignore")


class Strategy(ABC):

    def __init__(self):
        self.entries: pd.DataFrame = pd.DataFrame()
        self.df = pd.DataFrame = pd.DataFrame()

    def latest_signal(self, number: int = 1) -> pd.DataFrame:
        return self.entries.tail(number)

    @staticmethod
    def maximize_returns(entries: pd.DataFrame, df: pd.DataFrame, i: int) -> tuple[list[bool | None], list[float]]:
        log_returns: list[float] = []
        entries_movements: list[bool | None] = []
        for date in entries.index:  # type: ignore
            sub_df = df[df.index.get_loc(  # type: ignore
                date): df.index.get_loc(date) + i]  # type: ignore

            entries_movements.append(Strategy.track_position_movements(sub_df))

            log_ret = (
                np.exp(np.log(sub_df['Close'].iloc[-1] / sub_df['Close'].iloc[0])) - 1) * 100  # type: ignore
            log_returns.append(log_ret)
        return entries_movements, log_returns

    @staticmethod
    def strategy_general_performance(entries: pd.DataFrame, df: pd.DataFrame, title: str) -> None:
        accuracies: list[float] = []
        for i in range(2, 22 + 1):
            _, log_returns = Strategy.maximize_returns(entries, df, i)

            if not len(log_returns):
                continue

            accuracies.append(
                len(list(filter(lambda x: x > 0, log_returns))) / len(log_returns) * 100)

        if not len(accuracies):
            return

        maximized_holding_time = accuracies.index(max(accuracies)) + 2
        entries_movements, log_returns = Strategy.maximize_returns(entries, df,
                                                                   maximized_holding_time)

        # Only account for entries that were negative at some point (meaning that track_position_movements  didn't return None)
        entries_movements = list(
            filter(lambda entry: isinstance(entry, bool), entries_movements))

        entries_qty = len(entries_movements)

        entries_movements = (len(list(
            filter(lambda entry: entry, entries_movements))) / len(entries_movements)) * 100

        print_centered_title(title=title, sep='=')
        # print(f"[INFO] Total Entires: {len(log_returns)}")
        # print(f"[INFO] Maximized holding time: {maximized_holding_time}")

        log_returns = [i for i in log_returns if i]

        accuracy = len(list(filter(lambda x: x > 0, log_returns))
                       ) / len(log_returns) * 100

        mean_ret = np.array(log_returns).mean()
        vol_ret = np.array(log_returns).std()

        # print(f"\n[ANALYTICS] Accuracy: {accuracy:.2f}%")

        log_returns = np.array(log_returns)
        # print(f"[ANALYTICS] Mean: {mean_ret:.2f}%")
        # print(f"[ANALYTICS] Volatility: {vol_ret:.2f}%")
        if entries_movements:
            # print(
            #     f"[ANALYTICS] Chance of recovering after a negative dip: {entries_movements:.2f}% ({entries_qty} records)\n\n")
            pass

        return {"returns": len(log_returns), "positive_returns": len(list(filter(lambda x: x > 0, log_returns))), "accuracy": accuracy, "mean_return": mean_ret, "return_volatility": vol_ret, "resilience": entries_movements}

    @staticmethod
    def get_log_return(last_price: float, entry_price: float) -> float:
        return ((np.exp(np.log(last_price / entry_price))) - 1) * 100

    @staticmethod
    def track_position_movements(sub_df: pd.DataFrame) -> bool | None:
        sub_df['log_rets'] = np.vectorize(Strategy.get_log_return)(
            sub_df['Close'], sub_df['Close'].iloc[0])
        negative_returns = sub_df[sub_df['log_rets'] < 0]
        if len(negative_returns):
            for return_ in negative_returns.index:
                sub_sub_df = sub_df[negative_returns.loc[return_].name:]
                if len(sub_sub_df[sub_sub_df['log_rets'] > 0]):
                    return True
            return False


class TickerStrategy(Strategy):
    def __init__(self, ticker: str, dataframe: pd.DataFrame) -> None:
        self.ticker = ticker
        self.df = EnhancedDataframe.populate_dataframe(
            dataframe, ticker=self.ticker)

    def r_ma20_ma50(self) -> bool:
        signal = np.vectorize(self.r_ma20_ma50_signal)(self.df['RSI'],
                                                       self.df['MA20'], self.df["MA50"])
        self.df['Signals'] = signal
        self.entries = self.df[self.df['Signals'] == True]
        return signal

    def r_sd_m(self) -> bool:
        signal = np.vectorize(self.r_sd_m_signal)(self.df['RSI'], self.df['STOCH_K'],
                                                  self.df["MACD_histogram"])
        self.df['Signals'] = signal
        self.entries = self.df[self.df['Signals'] == True]
        return signal

    def ma_bol_rsi(self) -> bool:
        signal = np.vectorize(self.ma_bol_rsi_signal)(self.df['Close'], self.df["MA50"],
                                                      self.df['BB_lower'], self.df['RSI'])

        self.df['Signals'] = signal
        self.entries = self.df[self.df['Signals'] == True]
        return signal

    @staticmethod
    def ichimoku_entry(span_a: float, span_b: float, rsi: float) -> bool:
        return ((span_b - span_a) / span_b) > 0.15 and rsi < 35

    @staticmethod
    def ma_bol_rsi_signal(close: Union[float, int], ma50: Union[float, int], bollinger_lower: bool,
                          rsi: Union[float, int]) -> Union[float, int]:
        return rsi <= 35 and close < ma50 and close < bollinger_lower

    @staticmethod
    def r_sd_m_signal(
            rsi: Union[float, int], stoch_d: Union[float, int], macd: Union[float, int]) -> bool:
        return rsi <= 35 and macd <= -1 and stoch_d <= 15

    @staticmethod
    def r_ma20_ma50_signal(
            rsi: Union[float, int], ma20: Union[float, int], ma50: Union[float, int]) -> bool:
        return rsi < 35 and (ma20 < ma50)

    @staticmethod
    def rsima_signal(close: Union[float, int], rsi: Union[float, int], ma_rsi: Union[float, int], bb_lower: Union[float, int]) -> bool:
        return (close < bb_lower) and (rsi < 35) and (ma_rsi < 35)

    @staticmethod
    def good_sefi_oversold(sefi: Union[float, int], rsi: Union[float, int], bollinger: Union[float, int], close: Union[float, int]) -> bool:
        return (sefi > 65) and (rsi < 35) and (close < bollinger)


class SPXStrategies(Strategy):
    def __init__(self, macd_value: Union[float, int] = -1.5, rsi_value: Union[float, int] = 45):
        self.df = EnhancedDataframe.populate_dataframe(
            download("^GSPC", period='2y', interval='1d'), "SPX")
        columns = (
            "Open", "High", "Low", "Close", "Volume", "RSI", 'STOCH_K', "BB_lower", "MACD_histogram", "MA20", "MA50")
        self.df = self.df.drop(
            [col for col in self.df.columns if not col in columns], axis=1)
        self.entries = self.df[
            (self.df['MACD_histogram'] < macd_value) & (self.df['RSI'] < rsi_value) & (self.df['MA20'] < self.df["MA50"]) & (
                self.df['Close'] < self.df['BB_lower'])]


if __name__ == "__main__":

    # entries: pd.DataFrame, df: pd.DataFrame, title: str
    def do_once(df):
        df['Strategy Alpha'] = np.vectorize(TickerStrategy.ma_bol_rsi_signal)(
            df['Close'], df['MA50'], df["BB_lower"], df['RSI'])

        df['Strategy Beta'] = np.vectorize(TickerStrategy.r_ma20_ma50_signal)(
            df['RSI'], df['MA20'], df['MA50'])

        df['Strategy Charlie'] = np.vectorize(TickerStrategy.ichimoku_entry)(
            df['senkou_span_a'], df['senkou_span_b'], df['RSI'])

        df['Strategy Delta'] = np.vectorize(
            TickerStrategy.r_sd_m_signal)(df['RSI'], df['STOCH_D'], df['MACD_histogram'])

        entries = df[(df['Strategy Alpha']) | (df['Strategy Beta'])
                     | (df['Strategy Charlie']) | (df['Strategy Delta'])]

        data = Strategy.strategy_general_performance(
            entries=entries, df=df, title="Test Strategy")

        return data
        # n = data['returns']
        # k = data['positive_returns']

        # # \frac{n!}{x! (n-x)!} \times \left(frac{n}{x}\right) ^ x \times \left(1 - \frac{n}{x} \right) ^ {n-x}
        # return (math.comb(n, k)) * ((k / n) ** k) * ((1 - (k / n)) ** (n - k))


# request = requests.get(
#     'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')
# if request.ok:
#     tables = pd.read_html(request.text)[0]
#     tickers = [ticker if not "." in ticker else ticker.replace(
#         ".", "-") for ticker in list(tables['Symbol'])]
#     dfs = download_data(tickers)
#     returns = []
#     positive_returns = []
#     for ticker in tickers:
#         try:
#             print(ticker)

#             data = do_once(EnhancedDataframe.populate_dataframe(
#                 dfs.loc[ticker].T, ticker))
#             returns.append(data['returns'])
#             positive_returns.append(data['positive_returns'])
#         except ZeroDivisionError:
#             print(ticker)
#             print("Zero Division Error...")
#         except ValueError:
#             print(ticker)
#             print("No entries")
#         except Exception as e:
#             print(e)

#     n = int(math.floor(np.array(returns).mean()))
#     k = int(math.floor(np.array(positive_returns).mean()))

#     print((math.comb(n, k)) * ((k / n) ** k) * ((1 - (k / n)) ** (n - k))
#           )
