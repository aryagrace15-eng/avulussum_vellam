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
    CallbackQuery,
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    FSInputFile
)

from media_ids import (
    AUDIO_CLIPS,
    AMMAVAN_COLLEGE_DATA,
    AMMAYI_COLLEGE_DATA,
    NATTUKAR_COLLEGE_DATA,
    FAKE_NEWS_MALAYALAM,
    get_comparison_meter
)

router = Router()

# ==========================================
# DISTINCT VOICE PROFILES & ASYNC TTS ENGINE
# ==========================================

# Voice profile top-level domains (tld) for different character tones in gTTS
VOICE_PROFILES = {
    "ammavan": {"tld": "co.in", "slow": False},  # Stern Kerala boomer tone
    "ammayi": {"tld": "com", "slow": True},     # High-pitched gossip aunt tone (slow/expressive)
    "nattukar": {"tld": "ca", "slow": False},   # Dramatic news reporter tone
    "police": {"tld": "co.uk", "slow": False}   # Deep moral police tone
}


def _generate_tts_file(speech_text: str, voice_type: str, file_path: str):
    """Synchronous gTTS generation worker to be run in a worker thread."""
    profile = VOICE_PROFILES.get(voice_type, {"tld": "co.in", "slow": False})
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
    2. Otherwise uses asyncio.to_thread so gTTS network IO NEVER blocks concurrent users!
    """
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    # 1. Custom user audio override in audio/ directory
    for ext in [".mp3", ".ogg", ".wav", ".m4a"]:
        custom_file = os.path.join(audio_dir, f"{audio_key}{ext}")
        if os.path.exists(custom_file) and os.path.getsize(custom_file) > 1000 and custom_file != os.path.join(audio_dir, "test_ml.mp3"):
            return custom_file

    # 2. Asynchronous gTTS Voice Generation (Non-blocking for multi-user chat)
    try:
        text_hash = hashlib.md5(f"{speech_text}_{voice_type}".encode('utf-8')).hexdigest()[:12]
        voice_path = os.path.join(audio_dir, f"ml_{voice_type}_{text_hash}.mp3")
        
        if not os.path.exists(voice_path):
            # Run blocking TTS network write in thread pool to prevent event loop freeze
            await asyncio.to_thread(_generate_tts_file, speech_text, voice_type, voice_path)
            
        return voice_path
    except Exception as e:
        print(f"Error in async voice synthesis: {e}")
        return None

# ==========================================
# KEYBOARD GENERATORS (MALAYALAM COLLEGE EDITION)
# ==========================================

def get_main_keyboard() -> ReplyKeyboardMarkup:
    """Generates Malayalam college life reply keyboard options."""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="📚 4 സപ്ലി ഉണ്ട്, വീട്ടിൽ അറിഞ്ഞാൽ കൊല്ലും"),
                KeyboardButton(text="😭 60% അറ്റൻഡൻസ്, കൊണ്ടോണേഷൻ ഫീ അടക്കണം")
            ],
            [
                KeyboardButton(text="💼 പ്ലേസ്മെന്റ് കിട്ടിയില്ല, വീട്ടുകാർ ട്രോളുന്നു"),
                KeyboardButton(text="💔 സിംഗിളായി ജീവിച്ചാൽ മതി എന്ന് തോന്നുന്മൂ")
            ],
            [
                KeyboardButton(text="✈️ കോളേജ് നിർത്തി യാത്ര പോകണം"),
                KeyboardButton(text="📊 എൻ്റെ കോളേജ് സ്റ്റാൻഡിംഗ് നോക്കുക")
            ]
        ],
        resize_keyboard=True,
        persistent=True,
        input_field_placeholder="നിങ്ങളുടെ കോളേജ് വിഷമം പറയൂ..."
    )
    return keyboard


def get_action_inline_keyboard() -> InlineKeyboardMarkup:
    """Generates interactive Malayalam action buttons."""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🙇‍♂️ നാട്ടുകാരുടെ വിധി അംഗീകരിക്കുന്നു",
                    callback_data="accept_judgment"
                ),
                InlineKeyboardButton(
                    text="😭 മൂലയിൽ പോയി കരയുക",
                    callback_data="cry_corner"
                )
            ],
            [
                InlineKeyboardButton(
                    text="📋 അമ്മായിക്ക് ബയോഡാറ്റ അയക്കുക",
                    callback_data="send_biodata"
                ),
                InlineKeyboardButton(
                    text="📜 അമ്മാവന്റെ വാട്സാപ്പ് സന്ദേശം",
                    callback_data="whatsapp_forward"
                )
            ]
        ]
    )
    return keyboard

# ==========================================
# TIME-BASED MORAL POLICING CHECK (LATE NIGHT)
# ==========================================

async def handle_moral_policing(message: Message) -> bool:
    """Late-night moral policing check (10 PM to 5 AM)."""
    current_hour = datetime.now().hour
    if current_hour >= 22 or current_hour < 5:
        speech = "രാത്രി 10 മണി കഴിഞ്ഞിട്ടും നീ കോളേജ് ഗ്രൂപ്പിൽ സന്ദേശം അയക്കുകയാണോ മര്യാദയുള്ള പിള്ളേർ ഈ നേരത്ത് കിടന്നു ഉറങ്ങും പോയി ഉറങ്ങെടാ"
        voice_path = await get_or_generate_malayalam_voice_async(speech, "moral_police", voice_type="police")
        
        try:
            await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
            if voice_path and os.path.exists(voice_path):
                await message.answer_audio(audio=FSInputFile(voice_path))
        except Exception as e:
            print(f"Moral policing audio error: {e}")

        standing = get_comparison_meter()
        police_text = (
            "🚨 *രാത്രികാല മോറൽ പൊലീസിംഗ് അലർട്ട്!* 🚨\n\n"
            "👴👵 *സുധാകരൻ അമ്മാവനും ഓമന അമ്മായിയും ഒന്നിച്ചു:*\n"
            "\"ഈ രാത്രി 10 മണി കഴിഞ്ഞിട്ടും നീ കോളേജ് ഗ്രൂപ്പിൽ എന്തെടുക്കുകയാണ്?! 🕙\n"
            "പരീക്ഷയ്ക്ക് പഠിക്കാതെ ഫോണും നോക്കി ഇരിക്കുന്നു! "
            "ഫോൺ മാറ്റി വെച്ച് പോയി ഉറങ്ങെടാ!\"\n\n"
            f"{standing}"
        )
        await message.answer(police_text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")
        return True
    return False

# ==========================================
# COMMAND HANDLERS
# ==========================================

@router.message(CommandStart())
async def cmd_start(message: Message):
    welcome_text = (
        "🌴 *നാട്ടുകാർ.EXE: COLLEGE STUDENT EDITION* 🌴\n\n"
        "കോളേജ് വിദ്യാർത്ഥികൾക്ക് വേണ്ടിയുള്ള ഔദ്യോഗിക ട്രോൾ ബോട്ട്!\n\n"
        "❌ *ഇവിടെ സഹതാപം പ്രതീക്ഷിക്കരുത്!* സപ്ലിയും, അറ്റൻഡൻസ് ക്ഷാമവും, പ്ലേസ്മെന്റ് ഇല്ലായ്മയും കേട്ട് അമ്മാവന്മാരും നാട്ടുകാരും നിങ്ങളെ വറുത്തെടുക്കും!\n\n"
        "👥 *കഥാപാത്രങ്ങൾ:*\n"
        "• 👴 **സുധാകരൻ അമ്മാവൻ:** PSC & സപ്ലി റോസ്റ്റർ (Stern Voice)\n"
        "• 👵 **ഓമന അമ്മായി:** പ്ലേസ്മെന്റ് & പ്രശാന്ത് ഫ്ലെക്സർ (Gossip Voice)\n"
        "• 👀 **നാട്ടുകാർ:** ബ്രേക്കിംഗ് ന്യൂസ് & അറ്റൻഡൻസ് ഡ്രോപ്പർ (News Voice)\n\n"
        "👇 *താഴെയുള്ള ഓപ്ഷനിൽ നിന്ന് നിങ്ങളുടെ കോളേജ് വിഷമം തെരഞ്ഞെടുക്കുക:* "
    )
    await message.answer(
        welcome_text,
        reply_markup=get_main_keyboard(),
        parse_mode="Markdown"
    )


@router.message(Command("help"))
@router.message(Command("menu"))
async def cmd_menu(message: Message):
    await message.answer(
        "നിങ്ങളുടെ കോളേജ് പ്രശ്നം താഴെ നിന്നും തെരഞ്ഞെടുക്കുക:",
        reply_markup=get_main_keyboard()
    )


@router.message(Command("standing"))
@router.message(F.text.contains("സ്റ്റാൻഡിംഗ്"))
async def cmd_standing(message: Message):
    meter = get_comparison_meter()
    await message.answer(
        f"📊 *ഔദ്യോഗിക കോളേജ് വിദ്യാർത്ഥി സോഷ്യൽ ഓഡിറ്റ്*\n\n{meter}",
        reply_markup=get_action_inline_keyboard(),
        parse_mode="Markdown"
    )


@router.message(Command("forward"))
async def cmd_forward(message: Message):
    forward = random.choice(FAKE_NEWS_MALAYALAM)
    await message.answer(forward, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")

# ==========================================
# CHARACTER RESPONSE SENDER (AUDIO ONLY - NO TEXT TRANSCRIPT)
# ==========================================

async def send_character_response(message: Message, data: dict):
    """
    Sends actual Malayalam voice note audio ONLY (no audio text transcript)
    followed by roast text & comparison meter underneath.
    """
    text_roast = data["text"]
    speech_text = data["speech"]
    audio_key = data["key"]
    voice_type = data.get("voice_type", "ammavan")

    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
    except Exception:
        pass

    # Non-blocking async generation of distinct Malayalam voice note
    voice_path = await get_or_generate_malayalam_voice_async(speech_text, audio_key, voice_type)
    
    # 1. Send Audio Voice Note directly (No text transcript of speech)
    if voice_path and os.path.exists(voice_path):
        try:
            await message.answer_audio(audio=FSInputFile(voice_path))
        except Exception as e:
            print(f"Error sending voice note audio: {e}")

    # 2. Send Roast Text with Comparison Meter & Interactive Buttons underneath
    standing = get_comparison_meter()
    full_response = f"{text_roast}\n\n{standing}"

    await message.answer(
        full_response,
        reply_markup=get_action_inline_keyboard(),
        parse_mode="Markdown"
    )

# ==========================================
# COLLEGE STUDENT ROUTING HANDLERS (20+ SITUATIONS)
# ==========================================

@router.message(
    F.text.lower().contains("supply") |
    F.text.lower().contains("backlog") |
    F.text.lower().contains("exam") |
    F.text.lower().contains("ktu") |
    F.text.lower().contains("viva") |
    F.text.lower().contains("mark") |
    F.text.lower().contains("psc") |
    F.text.lower().contains("gate") |
    F.text.contains("സപ്ലി") |
    F.text.contains("പരീക്ഷ") |
    F.text.contains("മാർക്ക്") |
    F.text.contains("സെമിനാർ") |
    F.text.contains("അസൈൻമെന്റ്")
)
async def college_exam_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(AMMAVAN_COLLEGE_DATA)
    await send_character_response(message, data)


@router.message(
    F.text.lower().contains("placement") |
    F.text.lower().contains("job") |
    F.text.lower().contains("single") |
    F.text.lower().contains("love") |
    F.text.lower().contains("crush") |
    F.text.contains("പ്ലേസ്മെന്റ്") |
    F.text.contains("ജോലി") |
    F.text.contains("സിംഗിൾ") |
    F.text.contains("പ്രണയം") |
    F.text.contains("പ്രോജക്ട്")
)
async def college_career_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(AMMAYI_COLLEGE_DATA)
    await send_character_response(message, data)


@router.message(
    F.text.lower().contains("attendance") |
    F.text.lower().contains("condonation") |
    F.text.lower().contains("bunk") |
    F.text.lower().contains("canteen") |
    F.text.lower().contains("fest") |
    F.text.lower().contains("hostel") |
    F.text.contains("അറ്റൻഡൻസ്") |
    F.text.contains("കാന്റീൻ") |
    F.text.contains("ഹോസ്റ്റൽ") |
    F.text.contains("യാത്ര") |
    F.text.contains("ഫെസ്റ്റ്")
)
async def college_life_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(NATTUKAR_COLLEGE_DATA)
    await send_character_response(message, data)


@router.message()
async def default_college_handler(message: Message):
    if await handle_moral_policing(message):
        return
    all_data = AMMAVAN_COLLEGE_DATA + AMMAYI_COLLEGE_DATA + NATTUKAR_COLLEGE_DATA
    data = random.choice(all_data)
    await send_character_response(message, data)

# ==========================================
# CALLBACK HANDLERS (MALAYALAM INLINE BUTTONS)
# ==========================================

@router.callback_query(F.data == "accept_judgment")
async def cb_accept_judgment(callback: CallbackQuery):
    await callback.answer("നാട്ടുകാരുടെ വിധി അംഗീകരിച്ചു!")
    text = (
        "🙏 *നാട്ടുകാർ നിങ്ങളുടെ കീഴടങ്ങൽ അംഗീകരിച്ചു.*\n\n"
        "👴 **സുധാകരൻ അമ്മാവൻ:** നല്ലത്! നാളെ രാവിലെ 8 മണിക്ക് ബാങ്ക് കോച്ചിംഗ് സെന്ററിൽ പോയി പഠിക്കാൻ തുടങ്ങിക്കോ!\n\n"
        "👵 **ഓമന അമ്മായി:** ബ്രോക്കർക്ക് കൊടുക്കാൻ 2 പാസ്‌പോർട്ട് സൈസ് ഫോട്ടോയും ഇങ്ങോട്ട് തന്നേക്ക്!"
    )
    await callback.message.reply(text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")


@router.callback_query(F.data == "cry_corner")
async def cb_cry_corner(callback: CallbackQuery):
    await callback.answer("കരച്ചിൽ കണ്ടെത്തി! ബ്രേക്കിംഗ് ന്യൂസ് ഒൺ എയർ!")
    text = (
        "🚨 *കോളേജ് ക്യാമ്പസിലെ ബ്രേക്കിംഗ് ന്യൂസ്!* 🚨\n\n"
        "👀 **നാട്ടുകാർ:** ബ്രേക്കിംഗ്: പയ്യൻ മുറിയിൽ പോയി കരയുന്നു! "
        "സപ്ലി അടിച്ചതാണോ അറ്റൻഡൻസ് പോയതാണോ എന്ന് നാട്ടുകാർ സംശയിക്കുന്നു!"
    )
    await callback.message.reply(text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")


@router.callback_query(F.data == "send_biodata")
async def cb_send_biodata(callback: CallbackQuery):
    await callback.answer("ബയോഡാറ്റ ലഭിച്ചു!")
    text = (
        "📋 *വിവാഹ ആലോചന രജിസ്റ്റർ ചെയ്തു*\n\n"
        "👵 **ഓമന അമ്മായി:** നിന്റെ ബയോഡാറ്റ കിട്ടി! സപ്ലി ഇല്ലാത്ത ആലോചന കിട്ടുമോ എന്ന് ഞാൻ നോക്കട്ടെ!"
    )
    await callback.message.reply(text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")


@router.callback_query(F.data == "whatsapp_forward")
async def cb_whatsapp_forward(callback: CallbackQuery):
    await callback.answer("അമ്മാവന്റെ സന്ദേശം അയക്കുന്നു...")
    forward = random.choice(FAKE_NEWS_MALAYALAM)
    await callback.message.reply(forward, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")
