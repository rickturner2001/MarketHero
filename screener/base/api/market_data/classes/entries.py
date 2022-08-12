
from math import exp, log

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