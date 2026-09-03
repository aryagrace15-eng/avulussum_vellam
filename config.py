import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")

if not BOT_TOKEN:
    print("⚠️ WARNING: BOT_TOKEN is not set in your .env file!")
    print("Please create a .env file with: BOT_TOKEN=your_telegram_bot_token_here")
