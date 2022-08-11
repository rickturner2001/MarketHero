from base.api.market_data.classes.evaluate_watchlist import download_data
import numpy as np
from scipy.optimize import minimize


class Portfolio:
    def __init__(self, tickers, data=None, timeframe="1y"):
        if not data:
            data = download_data(period=timeframe, tickers=tickers).T

        self.tickers = tickers
        self.data = data.swaplevel(axis=1)['Adj Close']
        self.N = len(self.data.columns)
        self.weights = np.random.random(self.N)
        self.log_returns = np.log(self.data / self.data.shift(1))
        self.log_rets_cov = self.log_returns.cov()
        self.volatility = None
        self.returns = None

    @staticmethod
    def generate_weights(n: int):
        weights = np.random.random(n)
        return weights / np.sum(weights)

    def calculate_returns(self, weights, log_returns):
        self.returns = np.sum(log_returns.mean() * weights) * 252
        return self.returns

    def calculate_volatility(self, weights, log_rets_cov):
        annualized_cov = np.dot(log_rets_cov * 252, weights)
        vol = np.dot(weights.transpose(), annualized_cov)
        self.volatility = np.sqrt(vol)
        return self.volatility

    def get_best_distribution(self):
        def to_minimize(weights):
            return - 1 * (self.calculate_returns(weights, self.log_returns) / self.calculate_volatility(weights,
                                                                                                        self.log_rets_cov))

        equal_weights = self.N * [1 / self.N]
        bounds = tuple((0, 1) for n in range(self.N))
        sum_constraint= ({"type": "eq", "fun": lambda weights: np.sum(weights) - 1})
        optimal_distribution = minimize(fun=to_minimize, x0=np.array(equal_weights), bounds=bounds, constraints=sum_constraint)['x']
        return {self.tickers[i]: val * 100 for i, val in enumerate(optimal_distribution)}


portfolio = Portfolio(tickers=["AAPL", "TSLA", "NIO", "GM", "GME", "PLTR"])
print(portfolio.get_best_distribution())
