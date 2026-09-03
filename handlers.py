import os
import random
import asyncio
from datetime import datetime
from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message,
    ReplyKeyboardMarkup,
    KeyboardButton,
    FSInputFile
)

from media_ids import SITUATION_DATA_MAP

router = Router()

# ==========================================
# 18 CLICKABLE MENU BUTTONS (NO TEXT MESSAGES)
# ==========================================

def get_main_keyboard() -> ReplyKeyboardMarkup:
    """Generates 18 distinct clickable Malayalam youth & college situation menu buttons."""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="📚 4 സപ്ലി ഉണ്ട്, വീട്ടിൽ അറിഞ്ഞാൽ കൊല്ലും"),
                KeyboardButton(text="😭 60% അറ്റൻഡൻസ്, കൊണ്ടോണേഷൻ ഫീ")
            ],
            [
                KeyboardButton(text="💼 പ്ലേസ്മെന്റ് കിട്ടിയില്ല, കമ്പനി മടങ്ങി"),
                KeyboardButton(text="🧪 ലാബ് വൈവക്ക് ഒന്നും പറയാൻ പറ്റിയില്ല")
            ],
            [
                KeyboardButton(text="💻 മെക്കാനിക്കൽ എടുത്തിട്ട് കോഡിംഗ് പഠിക്കുന്നു"),
                KeyboardButton(text="🏠 ഹോസ്റ്റൽ ഇൻ-ടൈം 8 PM, പുറത്തുപോയി")
            ],
            [
                KeyboardButton(text="🍜 കാന്റീനിലും ചായക്കടയിലും 1500 കടം"),
                KeyboardButton(text="📝 2 AM അസൈൻമെന്റ് കോപ്പി അടിക്കുന്നു")
            ],
            [
                KeyboardButton(text="🎉 കോളേജ് ഫെസ്റ്റ് കോർഡിനേറ്റർ ടെൻഷൻ"),
                KeyboardButton(text="🎬 ക്ലാസ്സ് കട്ട് ചെയ്ത് ഫസ്റ്റ് ഷോ പോയി")
            ],
            [
                KeyboardButton(text="💔 സിംഗിളായി ജീവിച്ചാൽ മതി എന്ന് തോന്നുന്മൂ"),
                KeyboardButton(text="✈️ ജോലി രാജിവെച്ച് യാത്ര പോകണം")
            ],
            [
                KeyboardButton(text="📊 സോഷ്യൽ സ്റ്റാൻഡിംഗ് മീറ്റർ നോക്കുക"),
                KeyboardButton(text="📜 അമ്മാവന്റെ വാട്സാപ്പ് സന്ദേശം")
            ],
            [
                KeyboardButton(text="🗣️ സെമിനാർ PPT സ്ലൈഡ് വാசித்து തീർത്തു"),
                KeyboardButton(text="🚌 9 AM കോളേജ് ബസ് മിസ്സായി ഓട്ടോ വിളിച്ചു")
            ],
            [
                KeyboardButton(text="🚨 സീരീസ് പരീക്ഷയ്ക്ക് ബിറ്റ് അടിച്ചപ്പോൾ സ്ക്വാഡ് പിടിച്ചു"),
                KeyboardButton(text="✈️ GRE എഴുതി വിദേശത്ത് പോകാൻ പദ്ധതി")
            ]
        ],
        resize_keyboard=True,
        persistent=True,
        input_field_placeholder="വിഷമം തെരഞ്ഞെടുക്കുക..."
    )
    return keyboard

# ==========================================
# TIME-BASED MORAL POLICING CHECK (LATE NIGHT)
# ==========================================

async def handle_moral_policing(message: Message) -> bool:
    """Late-night moral policing check (10 PM to 5 AM) - AUDIO ONLY."""
    current_hour = datetime.now().hour
    if current_hour >= 22 or current_hour < 5:
        police_audio = os.path.join("audio", "hostel.mp3")
        try:
            await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
            if os.path.exists(police_audio):
                await message.answer_audio(audio=FSInputFile(police_audio))
        except Exception as e:
            print(f"Moral policing audio error: {e}")
        return True
    return False

# ==========================================
# COMMAND HANDLERS
# ==========================================

@router.message(CommandStart())
async def cmd_start(message: Message):
    welcome_audio = os.path.join("audio", "supplies.mp3")
    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
        if os.path.exists(welcome_audio):
            await message.answer_audio(
                audio=FSInputFile(welcome_audio),
                reply_markup=get_main_keyboard()
            )
        else:
            await message.answer("🌴 *നാട്ടുകാർ.EXE*", reply_markup=get_main_keyboard(), parse_mode="Markdown")
    except Exception:
        await message.answer("🌴 *നാട്ടുകാർ.EXE*", reply_markup=get_main_keyboard(), parse_mode="Markdown")


@router.message(Command("help"))
@router.message(Command("menu"))
@router.message(Command("standing"))
@router.message(Command("forward"))
async def cmd_menu(message: Message):
    await cmd_start(message)

# ==========================================
# AUDIO ONLY RESPONSE SENDER (NO TEXT MESSAGES AT ALL)
# ==========================================

async def send_audio_only_response(message: Message, data: dict):
    """
    Sends ONLY the distinct Malayalam voice note audio file (.mp3) for the specific situation.
    ZERO text messages sent to user!
    """
    audio_key = data["key"]
    audio_path = os.path.join("audio", f"{audio_key}.mp3")

    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
    except Exception:
        pass

    if os.path.exists(audio_path):
        try:
            await message.answer_audio(
                audio=FSInputFile(audio_path),
                reply_markup=get_main_keyboard()
            )
            return
        except Exception as e:
            print(f"Error sending audio {audio_path}: {e}")

    # Fallback to any available audio file if specific key missing
    all_files = [os.path.join("audio", f) for f in os.listdir("audio") if f.endswith(".mp3")]
    if all_files:
        try:
            await message.answer_audio(
                audio=FSInputFile(random.choice(all_files)),
                reply_markup=get_main_keyboard()
            )
        except Exception as e:
            print(f"Fallback audio send error: {e}")

# ==========================================
# SITUATION ROUTING HANDLER (MATCHES ALL 18 SITUATIONS)
# ==========================================

@router.message()
async def situation_handler(message: Message):
    if await handle_moral_policing(message):
        return

    user_text = message.text.strip() if message.text else ""

    # 1. Exact button text match
    if user_text in SITUATION_DATA_MAP:
        data = SITUATION_DATA_MAP[user_text]
        await send_audio_only_response(message, data)
        return

    # 2. Keyword fuzzy matching
    for btn_text, data in SITUATION_DATA_MAP.items():
        key = data["key"]
        if key in user_text.lower() or any(k in user_text for k in ["സപ്ലി", "അറ്റൻഡൻസ്", "പ്ലേസ്മെന്റ്", "വൈവ", "ഹോസ്റ്റൽ", "കാന്റീൻ", "സിംഗിൾ"]):
            if data["key"] in user_text.lower() or btn_text in user_text:
                await send_audio_only_response(message, data)
                return

    # 3. Default random situation audio
    data = random.choice(list(SITUATION_DATA_MAP.values()))
    await send_audio_only_response(message, data)
