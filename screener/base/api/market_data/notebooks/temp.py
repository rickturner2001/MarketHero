from base.api.market_data.classes.databases import SP500Database
from base.api.market_data.classes.analysis import SP500Analysis
from base.api.market_data.config import db_path

sp500_database = SP500Database()
sp500_database.connect_existing_database(db_path / "sp500.sqlite")
market_analysis = SP500Analysis(sp500_database)
market_analysis.sefi()
