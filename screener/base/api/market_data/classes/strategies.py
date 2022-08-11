from typing import Union
from yfinance import download
import numpy as np
import pandas as pd
from numpy import vectorize
from pandas import DataFrame
from base.api.market_data.classes.dataframe import EnhancedDataframe
from base.api.market_data.classes.indicators import Bollinger, MACD, MovingAverages, Stochastic, RSI
from math import log, exp
import scipy.optimize

def download_data(tickers, period: str = "1y", interval: str = "1d") -> DataFrame:
    tickers_data = download(
        tickers=tickers, period=period,
        interval=interval, group_by='ticker', auto_adjust=False,
        prepost=False, threads=True, proxy=None)

    tickers_data = tickers_data.T
    return tickers_data


class TickerStrategy:
    def __init__(self, ticker: str, dataframe: DataFrame) -> None:
        self.ticker = ticker
        self.dataframe = EnhancedDataframe.populate_dataframe(dataframe, ticker=self.ticker)

    def r_ma20_ma50(self) -> bool:
        signal = vectorize(self.r_ma20_ma50_signal)(self.dataframe['RSI'],
                                                    self.dataframe['MA20'], self.dataframe["MA50"])[-1]
        print(f"r_ma20_ma50 returned a {signal} value for {self.ticker}")
        return signal

    def r_sd_m(self) -> bool:
        signal = vectorize(self.r_sd_m_signal)(self.dataframe['RSI'], self.dataframe['STOCH_K'],
                                               self.dataframe["MACD_histogram"])[-1]
        print(f"rsi_stoch_macd returned a {signal} value for {self.ticker} ")
        return signal

    def ma_bol_rsi(self) -> bool:
        signal = vectorize(self.ma_bol_rsi_signal)(self.dataframe['Close'], self.dataframe["MA50"],
                                                   self.dataframe['BB_Lower'], self.dataframe['RSI'])[-1]

        print(f"ma_bol_rsi returned a {signal} value for {self.ticker} ")
        return signal

    @staticmethod
    def ichimoku_entry(span_a: float, span_b: float, rsi: float) -> bool:
        return ((span_b - span_a) / span_b) > 0.15 and rsi < 35

    @staticmethod
    def ma_bol_rsi_signal(close: Union[float, int], ma50: Union[float, int], bollinger_lower: Union[float, int],
                          rsi: Union[float, int]) -> Union[float, int]:
        return rsi <= 35 and close < ma50 and close < bollinger_lower

    @staticmethod
    def r_sd_m_signal(
            rsi: Union[float, int], stoch_d: Union[float, int], macd: Union[float, int]) -> Union[float, int]:
        return rsi <= 35 and macd <= -1 and stoch_d <= 15

    @staticmethod
    def r_ma20_ma50_signal(
            rsi: Union[float, int], ma20: Union[float, int], ma50: Union[float, int]) -> Union[float, int]:
        return rsi < 35 and (ma20 < ma50)

    @staticmethod
    def rsima_signal(close, rsi, ma_rsi, bb_lower):
        return (close < bb_lower) and (rsi < 35) and (ma_rsi < 35)

    @staticmethod
    def good_sefi_oversold(sefi, rsi, bollinger, close):
        return (sefi > 65) and (rsi < 35) and (close < bollinger)


class SPXStrategies:
    def __init__(self, macd_value=-1.5, rsi_value=45):
        self.spx =EnhancedDataframe.populate_dataframe(download("^GSPC", period='2y', interval='1d'), "SPX")
        columns = (
        "Open", "High", "Low", "Close", "Volume", "RSI", 'STOCH_K', "BB_lower", "MACD_histogram", "MA20", "MA50")
        self.spx = self.spx.drop([col for col in self.spx.columns if not col in columns], axis=1)
        self.entries = self.spx[
            (self.spx['MACD_histogram'] < macd_value) & (self.spx['RSI'] < rsi_value) & (self.spx['MA20'] < self.spx["MA50"]) & (
                        self.spx['Close'] < self.spx['BB_lower'])]

    def latest_signal(self, number=1) -> pd.DataFrame:
        return self.entries.tail(number)

    def maximize_returns(self, i):
        log_returns = []
        for date in self.entries.index:
            sub_df = self.spx[self.spx.index.get_loc(date): self.spx.index.get_loc(date) + i]
            log_ret = (np.exp(np.log(sub_df['Close'].iloc[-1] / sub_df['Close'].iloc[0])) - 1) * 100
            log_returns.append(log_ret)
        return log_returns

    def strategy_general_performance(self):
        accuracies = []
        for i in range(2, 22 + 1):
            log_returns = self.maximize_returns(i)

            accuracies.append(len(list(filter(lambda x: x > 0, log_returns))) / len(log_returns) * 100)

        maximized_holding_time = accuracies.index(max(accuracies)) + 2
        print(f"Maximized holding time: {maximized_holding_time}")
        log_returns = self.maximize_returns(maximized_holding_time)

        accuracy = len(list(filter(lambda x: x > 0, log_returns))) / len(log_returns) * 100
        print(f"Accuracy: {accuracy:.2f}")

        log_returns = np.array(log_returns)
        print("Mean: ", log_returns.mean())
        print("Volatility: ", log_returns.std())




class Entry:
    def __init__(self, date, price: float, stop_loss: float, take_profit: float, ticker: str):
        self.date = date
        self.price = price
        self.stop_loss = float(stop_loss)
        self.take_profit = float(take_profit)
        self.is_closed = False
        self.closing_date = None
        self.log_ret = None
        self.ticker = ticker

    def close_position(self, date, log_ret):
        self.is_closed = True
        self.closing_date = date
        self.log_ret = log_ret

    def evaluate(self, pct_return: float, date):

        if self.stop_loss and self.take_profit:
            if pct_return <= self.stop_loss * -1:
                print(self.stop_loss)
                self.close_position(date, pct_return)
                return
            elif pct_return >= self.take_profit:
                self.close_position(date, pct_return)
                return
        elif self.stop_loss and pct_return <= self.stop_loss * -1:
            self.close_position(date, pct_return)
            return
        elif self.take_profit and pct_return <= self.take_profit:
            self.close_position(date, pct_return)
            return




class EntriesCollection:
    def __init__(self):
        self.open_entries: list[Entry] = []
        self.closed_entries: list[Entry] = []

    def organize_entries(self, date, price, ticker):
        if self.open_entries:
            for entry in list(filter(lambda e: e.ticker == ticker, self.open_entries)):
                entry.evaluate((exp(log(price / entry.price)) - 1) * 100, date)

            for i, entry in enumerate(self.open_entries):
                if entry.is_closed:
                    self.closed_entries.append(entry)
                    self.open_entries.pop(i)

    def add(self, entry: Entry):
        self.open_entries.append(entry)

    @property
    def has_open_entries(self):
        return len(self.open_entries)

    def close_all(self, date, closing_price, ticker):
        for i, entry in enumerate(list(filter(lambda x: x.ticker == ticker, self.open_entries))):
            entry.closing_date = date
            entry.log_ret = exp(log(closing_price / entry.price) - 1) * 100
            self.open_entries.remove(entry)
            self.closed_entries.append(entry)

    @property
    def sorted_closes(self):
        return sorted(self.closed_entries, key=lambda entry: entry.closing_date)


class Wallet:
    def __init__(self, capital: float, shares_qty: float, is_boundless: bool, entries: EntriesCollection):
        self.capital = capital
        self.buying_power = True
        self.shares_qty = shares_qty
        self.is_boundless = is_boundless
        self.history = [capital]
        self.entries = entries

    def can_buy(self, price):
        if self.is_boundless:
            self.history.append(self.capital)
            return True

        if self.capital - price >= 0:
            self.capital -= price
            self.history.append(self.capital)
            return True


class UserDefinedStrategy:
    def __init__(self, strategy_data: dict[str, dict], entry_constraints: dict, strategy_constraints: dict, collection):
        self.collection = collection
        self.boundless_capital = strategy_constraints['boundlessCapital']
        self.capital = float(strategy_constraints['capital'])
        self.strategy_data = strategy_data
        self.entry_constraints = entry_constraints
        self.strategy_constraints = strategy_constraints
        self.shares = entry_constraints["shares"]
        self.exits = []
        self.returns = []
        self.buying_power = True

    def __repr__(self):
        return f"Strategy Description: \n\t Boundless Capital: {self.boundless_capital}\n\tCapital: {self.capital}\n\tStop Loss: {self.entry_constraints['stopLoss']}\n\tTake Profit: {self.entry_constraints['takeProfit']}"

    @staticmethod
    def dynamic_constraint(relationship_type, col_1, col_2):
        if relationship_type == "Greater Than":
            return col_1 > col_2
        elif relationship_type == "Less Than":
            return col_1 < col_2
        else:
            return col_1 == col_2

    def apply(self, df: pd.DataFrame):
        for i, relationship in enumerate(self.strategy_data):
            related_to = self.strategy_data[i]['relateTo']
            UserDefinedStrategy.apply_indicator_by_name(df=df,
                                                        name=self.strategy_data[i]['firstIndicator'],
                                                        description=self.strategy_data[i][
                                                            'firstDescription'],
                                                        subIndicator=self.strategy_data[i]['subIndicator'],
                                                        params=self.strategy_data[i]['params'])

            col_1 = self.strategy_data[i]['firstIndicator']
            relationship_type = self.strategy_data[i]['relationshipType']

            if related_to == 'Indicator':

                UserDefinedStrategy.apply_indicator_by_name(df=df,
                                                            name=self.strategy_data[i]['secondIndicator'],
                                                            description=self.strategy_data[i][
                                                                'secondDescription'],
                                                            subIndicator=self.strategy_data[i][
                                                                'secondSubIndicator'],
                                                            params=self.strategy_data[i]['paramsSecondary'])

                col_2 = self.strategy_data[i]['secondIndicator']
                if col_2 == "Price":
                    col_2 = "Close"

                df[f"Constraint_{i}"] = np.vectorize(UserDefinedStrategy.dynamic_constraint)(relationship_type,
                                                                                             df[col_1], df[col_2])

            elif related_to == 'Value':
                # print(f"Relating to value: \n\trelationship type: {relationship_type}\n\tcol1_: {col_1}\n\tSelf related: {self.strategy_data[relationship]['selfRelatedValue']}")
                df[f"Constraint_{i}"] = np.vectorize(UserDefinedStrategy.dynamic_constraint)(relationship_type,
                                                                                             df[col_1],
                                                                                             float(self.strategy_data[
                                                                                                       i][
                                                                                                       'selfRelatedValue']))
        return df

    def apply_on_collection(self, constraints: dict[str, str]):

        data = download_data(tickers=self.collection, period=constraints['period'], interval=constraints['interval']).T

        dfs = [self.apply(data[ticker]) for ticker in self.collection]
        wallet = Wallet(self.capital, self.shares, self.boundless_capital, EntriesCollection())

        def check_for_entries(constraints):
            for constraint in constraints:
                if not constraint:
                    return False
            return True

        for date in dfs[0].index:
            for i, df in enumerate(dfs):
                wallet.entries.organize_entries(date, df.loc[date]['Close'], self.collection[i])

                # If all constraints are true
                if check_for_entries(df[[col for col in df.columns if "Constraint" in col]].loc[date].to_list()):
                    # Register new Entry in entries collection
                    if wallet.can_buy(df.loc[date]['Close']):
                        wallet.entries.add(Entry(date, df.loc[date]['Close'] * self.shares, self.entry_constraints['stopLoss'],
                                          self.entry_constraints['takeProfit'], self.collection[i]))


        if wallet.entries.has_open_entries:
            for ticker in self.collection:
                wallet.entries.close_all(dfs[0].index[-1], dfs[0].iloc[-1]['Close'], ticker)

        data = {"tickersData": {ticker: {"returns": [], "exits": []} for ticker in self.collection}, "general": {}}
        entries = []
        loc_entries = []
        exits = []
        returns = []

        for entry in wallet.entries.closed_entries:
            data['tickersData'][entry.ticker]['returns'].append(entry.log_ret)
            data['tickersData'][entry.ticker]['exits'].append(str(entry.closing_date)[:-9])
            entries.append(entry)
            loc_entries.append(dfs[0].index.get_loc(entry.date))
            exits.append(entry.closing_date)
            returns.append(entry.log_ret)

        for j, ticker in enumerate(self.collection):
            dfs[j].dropna(inplace=True)
            ticker_entries = list(filter(lambda entry: entry.ticker == ticker,  wallet.entries.closed_entries))
            if ticker_entries:
                data['tickersData'][ticker]['total_returns'] = sum(entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['max_return'] = max(entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['min_return'] = min(entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['average_return'] = np.array([entry.log_ret for entry in ticker_entries]).mean()
                data['tickersData'][ticker]['return_volatility'] = np.array([entry.log_ret for entry in ticker_entries]).std()
                data['tickersData'][ticker]['plotting'] = {
                    "entryIndex": [dfs[j].index.get_loc(entry.date) for entry in ticker_entries],
                    "closes": list(dfs[j]['Close'].values),
                    "index": list(map(lambda x: str(x)[:-9], list(dfs[j].index)))
                }

        data['general']['total_returns'] = sum(returns)
        data['general']['average_total_returns'] = np.array(returns).mean()
        data['general']['max_return'] = max(returns)
        data['general']['min_return'] = min(returns)
        data['general']["average_average_return"] = np.array(returns).mean()
        data['general']['average_return_volatility'] = np.array(returns).std()
        data['general']["total_entries"] = len(returns)
        data['general']["total_positive_entries"] = len(list(filter(lambda return_: return_ > 0, returns)))
        data['general']["total_negative_entries"] = len(list(filter(lambda return_: return_ < 0, returns)))
        data['general']['portfolio_movements'] = list(zip(list(map(lambda date: str(date)[:-9], dfs[0].index)), list(np.array([returns[exits.index(date)] if date in exits else 0 for i, date in enumerate(dfs[0].index)]).cumsum())))

        print(data)
        return data


    @staticmethod
    def apply_indicator_by_name(name: str, description: str, df: pd.DataFrame, params: list, subIndicator):
        params = list(map(lambda param: int(param), params))
        closes = df['Close']
        highs = df['High']
        lows = df['Low']

        match description:
            case "Bollinger Bands":
                lower, middle, upper = Bollinger(closes=closes,
                                                 lows=lows,
                                                 highs=highs,
                                                 period=params[0],
                                                 std_dev=params[1],
                                                 offset=params[2]).data
                match subIndicator:
                    case "Lower Band":
                        df[name] = lower
                    case "Middle Band":
                        df[name] = middle
                    case "Upper Band":
                        df[name] = upper

            case 'Stochastic Oscillator':
                stoch_k, stoch_d = Stochastic(closes=closes,
                                              highs=highs,
                                              lows=lows,
                                              k_period=params[0],
                                              d_period=params[1]).data

                match subIndicator:
                    case "Stochastic K":
                        df[name] = stoch_k
                    case "Stochastic D":
                        df[name] = stoch_d

            case "Moving average convergence divergence":
                macd, macd_signal, macd_histogram = MACD(adj_closes=closes,
                                                         slow_length=params[0],
                                                         fast_length=params[1],
                                                         signal_smoothing=params[2]).data
                match subIndicator:
                    case "MACD":
                        df[name] = macd
                    case "Signal":
                        df[name] = macd_signal
                    case "Historgram":
                        df[name] = macd_histogram

            case "Moving Average":
                df[name] = MovingAverages(closes=closes,
                                          window=params[0]).self_defined_ma

            case "Relative Strength Index":
                df[name] = RSI(closes=closes,
                               period=params[0]).data
