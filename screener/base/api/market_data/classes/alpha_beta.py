import yfinance
from scipy.stats import linregress
import pandas as pd
from base.api.market_data.classes.evaluate_watchlist import download_data
import numpy as np
from scipy.optimize import minimize


def calculate_returns(weights, log_returns):
    return np.sum(log_returns.mean() * weights) * 252


def calculate_volatility(weights, log_rets_cov):
    annualized_cov = np.dot(log_rets_cov * 252, weights)
    vol = np.dot(weights.transpose(), annualized_cov)
    return np.sqrt(vol)


def beta_and_alpha(benchmark, df):
    beta, alpha, _, _, _ = linregress(benchmark, df)
    return beta, alpha


def compose_watchlist_data(tickers):

    data = download_data(tickers)
    watchlist_data = []
    for ticker in tickers:
        watchlist_data.append(data.loc[ticker].T['Adj Close'])
    watchlist_data = pd.concat(watchlist_data, axis=1)
    watchlist_data.columns = [tickers]
    return watchlist_data


def watchlist_analysis(watchlist_data):
    # Sharpe Ration
    watchlist_returns = watchlist_data.pct_change(1).dropna()
    N = len(watchlist_returns.columns)
    equal_weights = N * [1 / N]
    log_returns = np.log(watchlist_data / watchlist_data.shift(1))
    log_rets_cov = log_returns.cov()

    def to_minimize(weights):
        return - 1 * (calculate_returns(weights, log_returns) / calculate_volatility(weights, log_rets_cov))

    bounds = tuple((0, 1) for n in range(N))
    sum_constraint = ({"type": "eq", "fun": lambda weights: np.sum(weights) - 1})
    minimized = minimize(fun=to_minimize, x0=equal_weights, bounds=bounds, constraints=sum_constraint)

    # Alpha and Beta Values against SP500
    spx = yfinance.download("^GSPC", inteval='1d', period='1y', threads=False)
    beta_alpha = [beta_and_alpha(spx['Adj Close'].pct_change().dropna(),
                                 watchlist_data[ticker].pct_change().dropna()) for ticker in watchlist_data.columns]

    beta, alpha = zip(*beta_alpha)
    print(beta)

    beta = np.array(beta).mean()
    alpha = np.array(alpha).mean()
    print(beta)
    return {
        "optimal_weights": minimized['x'],
        "alpha": alpha,
        "beta": beta

    }


