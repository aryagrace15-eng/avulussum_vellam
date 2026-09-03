import os
from dotenv import load_dotenv

# Load environment variables if .env exists
try:
    load_dotenv()
except Exception:
    pass

BOT_TOKEN = os.getenv("BOT_TOKEN", "8702603119:AAHOO7sjhYNYbSiRYoTkPwHSbHAICwMn4C4")
