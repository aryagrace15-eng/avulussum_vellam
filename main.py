import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from aiogram.types import BotCommand

from config import BOT_TOKEN
from handlers import router as character_router


async def set_bot_commands(bot: Bot):
    """Configures the default Telegram menu commands."""
    commands = [
        BotCommand(command="start", description="🚀 Launch Nattukar.exe"),
        BotCommand(command="standing", description="📊 Check Social Standing Meter"),
        BotCommand(command="forward", description="📜 Receive Fake WhatsApp Forward"),
        BotCommand(command="menu", description="📋 Show Venting Menu Options"),
        BotCommand(command="help", description="❓ Bot Instructions & Cast")
    ]
    await bot.set_my_commands(commands)


async def main():
    if not BOT_TOKEN:
        logging.error("❌ BOT_TOKEN is missing! Please set BOT_TOKEN in your .env file.")
        print("--------------------------------------------------")
        print("Error: BOT_TOKEN not found in environment!")
        print("1. Create a file named '.env' in this directory.")
        print("2. Add your token: BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ")
        print("--------------------------------------------------")
        sys.exit(1)

    logging.info("Starting Nattukar.exe Bot...")

    bot = Bot(token=BOT_TOKEN)
    dp = Dispatcher()

    # Include character routing logic from handlers.py
    dp.include_router(character_router)

    # Set Telegram bot menu shortcuts
    try:
        await set_bot_commands(bot)
    except Exception as e:
        logging.warning(f"Could not set bot commands menu: {e}")

    print("✅ Nattukar.exe is ONLINE and ready to judgmentally roast users!")
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Nattukar.exe shut down. Society will remember your absence!")