from base.api.market_data.classes.entries import EntriesCollection


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
