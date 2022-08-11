import numpy as np
import pandas as pd
import warnings

warnings.filterwarnings("ignore")


class Backtester:
    def __init__(self, entries: list, benchmark: pd.DataFrame, include_sell: str = None, limit: dict = None,
                 take_profit: float = None):
        """
        :param entries: List of entry points (dates)
        :param benchmark: main dataframe
        :param include_sell: colum name for sell points (optional)
        :param limit: {func: callable, colname: str} where func is a function that defines the sell points and
                       colname is the parameter to be passed to the function
        """
        self.results = None
        self.entries = entries
        self.benchmark = benchmark
        self.benchmark['Change'] = self.benchmark['Close'].pct_change() * 100
        self.benchmark['Cum_change'] = self.benchmark['Change'].cumsum()
        self.limit = limit
        self.take_profit = take_profit
        self._sell_points = []
        self.include_sell = include_sell

    @property
    def sell_points(self):
        return self._sell_points

    @staticmethod
    def meet_limit_expectation(change, limit):
        """

        :param change:
        :param limit: {func: callable, colname: str, sell_colname, sell_func}
        :return:
        """
        return change >= limit

    def eval_position(self, position: str):

        entry_price = self.benchmark['Close'].loc[position]

        negative_changes = list(filter(lambda x: x >= 100, self.benchmark['Cum_change']))
        # First we check if the cumulative sum of the percent change is 100 or higher
        if any(negative_changes):
            exit = [i for i, _ in enumerate(negative_changes) if i >= 100][0]
            self._sell_points.append(self.benchmark.index[exit])
            exit_price = self.benchmark['Close'].iloc[exit]

        elif self.include_sell:
            #TODO redo logic (>=self.take_profit)
            exits = self.benchmark[self.benchmark[self.include_sell] >= self.take_profit].loc[position:].index
            if len(exits) > 0:
                if self.take_profit:
                    benchmark_start = self.benchmark.loc[position:]
                    take_profit = benchmark_start[benchmark_start['Cum_change'] >= self.take_profit]
                    if len(take_profit) == 0:
                        self.sell_points.append(exits[0])
                        exit_price = self.benchmark['Close'].loc[exits[0]]
                    else:
                        if take_profit.index[0] <= exits[0]:
                            self.sell_points.append(take_profit.index[0])
                            exit_price = self.benchmark['Close'].loc[take_profit.index[0]]
                        else:
                            self.sell_points.append(exits[0])
                            exit_price = self.benchmark['Close'].loc[exits[0]]

                else:
                    exit_price = self.benchmark['Close'].loc[exits[0]]
                    self.sell_points.append(exits[0])
            else:
                self.sell_points.append(self.benchmark.index[-1])
                exit_price = self.benchmark['Close'].iloc[-1]

        elif not self.limit:
            exit_price = self.benchmark['Close'].iloc[-1]
            self._sell_points.append(self.benchmark.index[-1])
        else:

            df = self.benchmark[position:]
            df['Cum_change'] = (df['Close'].pct_change() * 100).cumsum()
            df['exit_points'] = np.vectorize(self.limit['func'])(df[self.limit["colname"]])
            exits = df[df['exit_points']]

            if len(exits) > 0:
                exit_price = self.benchmark['Close'].loc[exits.index[0]]
                self._sell_points.append(exits.index[0])
            else:
                exit_price = self.benchmark['Close'].iloc[-1]
                self._sell_points.append(self.benchmark.index[-1])

        return ((exit_price - entry_price) / exit_price) * 100

    def get_holding_times(self):
        trades = list(zip(self.entries, self.sell_points))

        holding_times = []
        for entry, exits in trades:
            holding_times.append(len(self.benchmark[entry:exits]))

        holding_times = np.array(holding_times)
        maxim = np.max(holding_times)
        minim = np.min(holding_times)
        mean = holding_times.mean()
        return maxim, minim, mean

    def evaluate_strategy(self):

        results = list(map(self.eval_position, self.entries))
        results = np.array(results, dtype=np.dtype("float32"))
        maxim, minim, mean = self.get_holding_times()

        self.results = {
            "returns": results,
            "max": np.max(results),
            "min": np.min(results),
            "mean": results.mean(),
            "std": results.std(),
            "total": results.sum(),
            "entries": len(self.entries),
            "mean_holding_time": mean,
            "max_holding_time": maxim,
            "min_holding_time": minim,
        }

    def pretty_print_results(self):
        print(f"Total Entries: {len(self.entries)}\n")
        for key, value in self.results.items():
            print(f"\t{key.capitalize()}: {value}")
