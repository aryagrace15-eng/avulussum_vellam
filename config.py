
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("Bimport osOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN not found! Add it to your .env file.")