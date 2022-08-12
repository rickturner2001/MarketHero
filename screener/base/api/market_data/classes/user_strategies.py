import numpy as np
import pandas as pd
from base.api.market_data.classes.indicators import Bollinger, MACD, MovingAverages, Stochastic, RSI
from base.api.market_data.classes.entries import EntriesCollection, Entry
from base.api.market_data.classes.wallet import Wallet
from base.api.market_data.classes.utilities import download_data


class UserDefinedStrategy:
    def __init__(self, strategy_data: list[dict], entry_constraints: dict, strategy_constraints: dict, collection):
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
        for i, _ in enumerate(self.strategy_data):
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
                df[f"Constraint_{i}"] = np.vectorize(UserDefinedStrategy.dynamic_constraint)(relationship_type,
                                                                                             df[col_1],
                                                                                             float(self.strategy_data[i][
                                                                                                 'selfRelatedValue']))
        return df

    def apply_on_collection(self, constraints: dict[str, str]):

        data = download_data(
            tickers=self.collection, period=constraints['period'], interval=constraints['interval']).T

        dfs = [self.apply(data[ticker])
               for ticker in self.collection]  # type: ignore
        wallet = Wallet(self.capital, self.shares,
                        self.boundless_capital, EntriesCollection())

        def check_for_entries(constraints):
            for constraint in constraints:
                if not constraint:
                    return False
            return True

        for date in dfs[0].index:
            for i, df in enumerate(dfs):
                wallet.entries.organize_entries(
                    date, df.loc[date]['Close'], self.collection[i])

                # If all constraints are true
                if check_for_entries(df[[col for col in df.columns if "Constraint" in col]].loc[date].to_list()):
                    # Register new Entry in entries collection
                    if wallet.can_buy(df.loc[date]['Close']):
                        wallet.entries.add(Entry(date, df.loc[date]['Close'] * self.shares, self.entry_constraints['stopLoss'],
                                                 self.entry_constraints['takeProfit'], self.collection[i]))

        if wallet.entries.has_open_entries:
            for ticker in self.collection:
                wallet.entries.close_all(
                    dfs[0].index[-1], dfs[0].iloc[-1]['Close'], ticker)

        data = {"tickersData": {ticker: {"returns": [], "exits": []}
                                for ticker in self.collection}, "general": {}}
        entries = []
        loc_entries = []
        exits = []
        returns = []

        for entry in wallet.entries.closed_entries:
            data['tickersData'][entry.ticker]['returns'].append(entry.log_ret)
            data['tickersData'][entry.ticker]['exits'].append(
                str(entry.closing_date)[:-9])
            entries.append(entry)
            loc_entries.append(dfs[0].index.get_loc(entry.date))
            exits.append(entry.closing_date)
            returns.append(entry.log_ret)

        for j, ticker in enumerate(self.collection):
            dfs[j].dropna(inplace=True)
            ticker_entries = list(
                filter(lambda entry: entry.ticker == ticker,  wallet.entries.closed_entries))
            if ticker_entries:
                data['tickersData'][ticker]['total_returns'] = sum(
                    entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['max_return'] = max(
                    entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['min_return'] = min(
                    entry.log_ret for entry in ticker_entries)
                data['tickersData'][ticker]['average_return'] = np.array(
                    [entry.log_ret for entry in ticker_entries]).mean()
                data['tickersData'][ticker]['return_volatility'] = np.array(
                    [entry.log_ret for entry in ticker_entries]).std()
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
        data['general']["total_positive_entries"] = len(
            list(filter(lambda return_: return_ > 0, returns)))
        data['general']["total_negative_entries"] = len(
            list(filter(lambda return_: return_ < 0, returns)))
        data['general']['portfolio_movements'] = list(zip(list(map(lambda date: str(date)[:-9], dfs[0].index)), list(
            np.array([returns[exits.index(date)] if date in exits else 0 for i, date in enumerate(dfs[0].index)]).cumsum())))

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
