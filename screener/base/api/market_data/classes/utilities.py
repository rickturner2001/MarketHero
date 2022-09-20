from pandas import DataFrame
from yfinance import download
import subprocess
import math


def download_data(tickers: list[str], period: str = "1y", interval: str = "1d") -> DataFrame:
    tickers_data = download(
        tickers=tickers, period=period,
        interval=interval, group_by='ticker', auto_adjust=False,
        prepost=False, threads=True, proxy=None)

    tickers_data = tickers_data.T
    return tickers_data


def print_centered_title(title: str, sep: str) -> None:
    tput = subprocess.Popen(['tput', 'cols'], stdout=subprocess.PIPE)
    MAX_CHAR_PER_LINE = int(tput.communicate()[0].strip())
    DIVISOR = MAX_CHAR_PER_LINE // 2
    left_side = len(title) / \
        2 if len(title) % 2 == 0 else math.ceil(len(title) / 2)
    right_side = len(title) / \
        2 if len(title) % 2 == 0 else math.floor(len(title) / 2)
    print(
        f"{f'{sep}' * int(DIVISOR - 1 - left_side)} {title} {'=' * int(DIVISOR - right_side)}\n\n")
