import os
import random
import hashlib
import asyncio
from datetime import datetime
from gtts import gTTS
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
# DISTINCT ELDERLY VOICE PROFILES & ASYNC TTS ENGINE
# ==========================================

# Customized voice parameters to simulate elderly Ammavan, Ammayi, Nattukar, and Moral Police
VOICE_PROFILES = {
    "ammavan": {"tld": "co.in", "slow": True},   # Stern elderly Malayali boomer uncle (slow, authoritative)
    "ammayi": {"tld": "com", "slow": True},      # High-pitched elderly gossip aunt (slow, expressive)
    "nattukar": {"tld": "ca", "slow": False},    # Dramatic news reporter / colony gossip
    "police": {"tld": "co.uk", "slow": True}     # Deep stern moral policing voice
}


def _generate_tts_file(speech_text: str, voice_type: str, file_path: str):
    """Synchronous gTTS worker running in thread pool to prevent async loop freezing."""
    profile = VOICE_PROFILES.get(voice_type, {"tld": "co.in", "slow": True})
    tts = gTTS(
        text=speech_text,
        lang='ml',
        tld=profile["tld"],
        slow=profile["slow"]
    )
    tts.save(file_path)


async def get_or_generate_malayalam_voice_async(speech_text: str, audio_key: str, voice_type: str = "ammavan") -> str | None:
    """
    Non-blocking async voice generator:
    1. Checks for local custom audio override file in audio/<audio_key>.mp3/ogg/wav
    2. Uses asyncio.to_thread so gTTS network IO NEVER blocks concurrent users!
    """
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    # 1. Check for custom recorded audio file override in audio/ directory
    for ext in [".mp3", ".ogg", ".wav", ".m4a"]:
        custom_file = os.path.join(audio_dir, f"{audio_key}{ext}")
        if os.path.exists(custom_file) and os.path.getsize(custom_file) > 1000 and custom_file != os.path.join(audio_dir, "test_ml.mp3"):
            return custom_file

    # 2. Asynchronous gTTS Voice Generation
    try:
        text_hash = hashlib.md5(f"{speech_text}_{voice_type}".encode('utf-8')).hexdigest()[:12]
        voice_path = os.path.join(audio_dir, f"ml_{voice_type}_{text_hash}.mp3")
        
        if not os.path.exists(voice_path):
            await asyncio.to_thread(_generate_tts_file, speech_text, voice_type, voice_path)
            
        return voice_path
    except Exception as e:
        print(f"Error in async voice synthesis: {e}")
        return None

# ==========================================
# 18 CLICKABLE MENU BUTTONS (NO TEXT SUBOPTIONS)
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
        speech = "രാത്രി 10 മണി കഴിഞ്ഞിട്ടും നീ കോളേജ് ഗ്രൂപ്പിൽ സന്ദേശം അയക്കുകയാണോ മര്യാദയുള്ള പിള്ളേർ ഈ നേരത്ത് കിടന്നു ഉറങ്ങും ഫോൺ മാറ്റിവെച്ച് പോയി ഉറങ്ങെടാ"
        voice_path = await get_or_generate_malayalam_voice_async(speech, "moral_police", voice_type="police")
        
        try:
            await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
            if voice_path and os.path.exists(voice_path):
                # AUDIO ONLY - NO TEXT MESSAGE AT ALL
                await message.answer_audio(audio=FSInputFile(voice_path))
        except Exception as e:
            print(f"Moral policing audio error: {e}")
        return True
    return False

# ==========================================
# COMMAND HANDLERS
# ==========================================

@router.message(CommandStart())
async def cmd_start(message: Message):
    # Set up the menu keyboard and send initial welcoming audio note (AUDIO ONLY)
    welcome_speech = "കേരള നാട്ടുകാരുടെയും അമ്മാവന്മാരുടെയും ഔദ്യോഗിക ട്രോൾ ബോട്ട് സ്വാഗതം ചെയ്യുന്നു നിങ്ങളുടെ കോളേജ് പ്രശ്നം താഴെ നിന്നും തെരഞ്ഞെടുക്കുക"
    voice_path = await get_or_generate_malayalam_voice_async(welcome_speech, "welcome", voice_type="ammavan")
    
    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
        if voice_path and os.path.exists(voice_path):
            await message.answer_audio(
                audio=FSInputFile(voice_path),
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
# AUDIO ONLY RESPONSE SENDER (NO TEXT MESSAGES)
# ==========================================

async def send_audio_only_response(message: Message, data: dict):
    """
    Sends ONLY the Malayalam voice note audio file (.mp3).
    ZERO text messages sent to user!
    """
    speech_text = data["speech"]
    audio_key = data["key"]
    voice_type = data.get("voice_type", "ammavan")

    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
    except Exception:
        pass

    # Non-blocking async generation of Malayalam elderly voice note
    voice_path = await get_or_generate_malayalam_voice_async(speech_text, audio_key, voice_type)
    
    # Send AUDIO NOTE ONLY - NO TEXT MESSAGES
    if voice_path and os.path.exists(voice_path):
        try:
            await message.answer_audio(
                audio=FSInputFile(voice_path),
                reply_markup=get_main_keyboard()
            )
        except Exception as e:
            print(f"Error sending voice note audio: {e}")

# ==========================================
# SITUATION ROUTING HANDLER (MATCHES ALL 18 BUTTONS & TEXT)
# ==========================================

@router.message()
async def situation_handler(message: Message):
    if await handle_moral_policing(message):
        return

    user_text = message.text.strip() if message.text else ""

    # Check for exact button match
    if user_text in SITUATION_DATA_MAP:
        data = SITUATION_DATA_MAP[user_text]
        await send_audio_only_response(message, data)
        return

    # Partial keyword matching for arbitrary typed messages
    for btn_text, data in SITUATION_DATA_MAP.items():
        if any(word in user_text for word in ["സപ്ലി", "supply", "backlog"]) and "സപ്ലി" in btn_text:
            await send_audio_only_response(message, data)
            return
        if any(word in user_text for word in ["അറ്റൻഡൻസ്", "attendance"]) and "അറ്റൻഡൻസ്" in btn_text:
            await send_audio_only_response(message, data)
            return
        if any(word in user_text for word in ["പ്ലേസ്മെന്റ്", "placement", "job", "ജോലി"]) and "പ്ലേസ്മെന്റ്" in btn_text:
            await send_audio_only_response(message, data)
            return

    # Random fallback audio from situation map
    data = random.choice(list(SITUATION_DATA_MAP.values()))
    await send_audio_only_response(message, data)
