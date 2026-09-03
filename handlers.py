import os
import random
import hashlib
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
    AMMAVAN_DATA,
    AMMAYI_DATA,
    NATTUKAR_DATA,
    FAKE_NEWS_MALAYALAM,
    get_comparison_meter
)

router = Router()

# ==========================================
# MALAYALAM VOICE SYNTHESIZER (gTTS)
# ==========================================

def get_or_generate_malayalam_voice(speech_text: str, audio_key: str) -> str | None:
    """
    1. Checks if user provided custom audio file in audio/<audio_key>.mp3/ogg/wav
    2. Otherwise synthesizes real Malayalam voice note using gTTS with lang='ml'
    """
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    # 1. Custom user audio override
    for ext in [".mp3", ".ogg", ".wav", ".m4a"]:
        custom_file = os.path.join(audio_dir, f"{audio_key}{ext}")
        if os.path.exists(custom_file) and os.path.getsize(custom_file) > 1000 and custom_file != os.path.join(audio_dir, "test_ml.mp3"):
            return custom_file

    # 2. Dynamic gTTS Malayalam Voice Note
    try:
        # Create a unique filename based on speech content
        text_hash = hashlib.md5(speech_text.encode('utf-8')).hexdigest()[:10]
        voice_path = os.path.join(audio_dir, f"ml_voice_{text_hash}.mp3")
        
        if not os.path.exists(voice_path):
            tts = gTTS(text=speech_text, lang='ml')
            tts.save(voice_path)
            
        return voice_path
    except Exception as e:
        print(f"Error synthesizing Malayalam speech: {e}")
        return None

# ==========================================
# KEYBOARD GENERATORS (MALAYALAM)
# ==========================================

def get_main_keyboard() -> ReplyKeyboardMarkup:
    """Generates Malayalam reply keyboard options."""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="💼 ജോലിയും സ്റ്റാർട്ടപ്പും മടുത്തു"),
                KeyboardButton(text="💔 സിംഗിളായി ജീവിച്ചാൽ മതി")
            ],
            [
                KeyboardButton(text="😭 സങ്കടം സഹിക്കാൻ പറ്റുന്നില്ല"),
                KeyboardButton(text="✈️ ജോലി രാജിവെച്ച് യാത്ര പോകണം")
            ],
            [
                KeyboardButton(text="📚 PSC / ബാങ്ക് പരീക്ഷാ ടെൻഷൻ"),
                KeyboardButton(text="📊 എൻ്റെ സോഷ്യൽ സ്റ്റാൻഡിംഗ് നോക്കുക")
            ]
        ],
        resize_keyboard=True,
        persistent=True,
        input_field_placeholder="നാട്ടുകാരോട് പരാതി പറയൂ..."
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
# TIME-BASED MORAL POLICING CHECK
# ==========================================

async def handle_moral_policing(message: Message) -> bool:
    """Late-night moral policing check (10 PM to 5 AM)."""
    current_hour = datetime.now().hour
    if current_hour >= 22 or current_hour < 5:
        speech = "രാത്രി 10 മണി കഴിഞ്ഞ് നീ ആരോടാണ് ചാറ്റ് ചെയ്യുന്നത് മര്യാദയുള്ള കുടുംബത്തിലെ പിള്ളേർ ഈ നേരത്ത് കിടന്നു ഉറങ്ങും ഫോൺ മാറ്റിവെച്ച് പോയി ഉറങ്ങെടാ"
        voice_path = get_or_generate_malayalam_voice(speech, "moral_police")
        
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
            "\"ഈ രാത്രി 10 മണി കഴിഞ്ഞിട്ടും നീ ആർക്കാണ് സന്ദേശം അയക്കുന്നത്?! 🕙\n"
            "മര്യാദയുള്ള കുടുംബത്തിലെ കുട്ടികൾ ഈ നേരത്ത് വിളക്കുവെച്ച് പ്രാർത്ഥിച്ച് ഉറങ്ങും! "
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
        "🌴 *നാട്ടുകാർ.EXE (NATTUKAR.EXE): WHAT WILL SOCIETY THINK?* 🌴\n\n"
        "കേരള നാട്ടുകാരുടെയും അമ്മാവന്മാരുടെയും ഔദ്യോഗിക ട്രോൾ ബോട്ട്!\n\n"
        "❌ *ഇവിടെ സഹതാപം പ്രതീക്ഷിക്കരുത്!* പരിഹാസവും, ഉപദേശവും, പ്രശാന്തിനുമായുള്ള താരതമ്യവും മാത്രം!\n\n"
        "👥 *കഥാപാത്രങ്ങൾ:*\n"
        "• 👴 **സുധാകരൻ അമ്മാവൻ:** PSC പരീക്ഷാ വിദഗ്ദ്ധൻ & ബൂമർ റോസ്റ്റർ\n"
        "• 👵 **ഓമന അമ്മായി:** മാച്ച് മേക്കർ & 'പ്രശാന്ത് ഇൻ യു.എസ്' ഫ്ലെക്സർ\n"
        "• 👀 **നാട്ടുകാർ:** സീരിയൽ സംഗീതവും ബ്രേക്കിംഗ് ന്യൂസുമായി കുറ്റപ്പെടുത്തുന്ന ഹൈവ് മൈൻഡ്\n\n"
        "👇 *താഴെയുള്ള ഓപ്ഷനിൽ നിന്ന് തെരഞ്ഞെടുക്കുക:* "
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
        "നിങ്ങളുടെ പരാതി താഴെ നിന്നും തെരഞ്ഞെടുക്കുക:",
        reply_markup=get_main_keyboard()
    )


@router.message(Command("standing"))
@router.message(F.text.contains("സോഷ്യൽ സ്റ്റാൻഡിംഗ്"))
async def cmd_standing(message: Message):
    meter = get_comparison_meter()
    await message.answer(
        f"📊 *ഔദ്യോഗിക കേരള നാട്ടുകാരുടെ സോഷ്യൽ ഓഡിറ്റ്*\n\n{meter}",
        reply_markup=get_action_inline_keyboard(),
        parse_mode="Markdown"
    )


@router.message(Command("forward"))
async def cmd_forward(message: Message):
    forward = random.choice(FAKE_NEWS_MALAYALAM)
    await message.answer(forward, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")

# ==========================================
# CHARACTER RESPONSE SENDER
# ==========================================

async def send_character_response(message: Message, data: dict):
    """Sends text roast and real Malayalam audio voice note using gTTS."""
    text_roast = data["text"]
    speech_text = data["speech"]
    audio_key = data["key"]

    try:
        await message.bot.send_chat_action(chat_id=message.chat.id, action="record_voice")
    except Exception:
        pass

    # Generate/Get Real Malayalam Audio Note
    voice_path = get_or_generate_malayalam_voice(speech_text, audio_key)
    
    if voice_path and os.path.exists(voice_path):
        try:
            await message.answer_audio(audio=FSInputFile(voice_path))
        except Exception as e:
            print(f"Error sending audio: {e}")

    standing = get_comparison_meter()
    full_response = f"{text_roast}\n\n{standing}"

    await message.answer(
        full_response,
        reply_markup=get_action_inline_keyboard(),
        parse_mode="Markdown"
    )

# ==========================================
# ROUTING HANDLERS
# ==========================================

@router.message(
    F.text.lower().contains("stress") |
    F.text.lower().contains("tired") |
    F.text.lower().contains("startup") |
    F.text.lower().contains("job") |
    F.text.lower().contains("work") |
    F.text.lower().contains("psc") |
    F.text.lower().contains(" exam") |
    F.text.contains("ജോലി") |
    F.text.contains("സ്റ്റാർട്ടപ്പ്") |
    F.text.contains("പരീക്ഷ")
)
async def ammavan_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(AMMAVAN_DATA)
    await send_character_response(message, data)


@router.message(
    F.text.lower().contains("single") |
    F.text.lower().contains("lonely") |
    F.text.lower().contains("love") |
    F.text.lower().contains("marry") |
    F.text.lower().contains("marriage") |
    F.text.contains("സിംഗിൾ") |
    F.text.contains("കല്യാണം") |
    F.text.contains("പ്രണയം")
)
async def ammayi_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(AMMAYI_DATA)
    await send_character_response(message, data)


@router.message()
async def nattukar_handler(message: Message):
    if await handle_moral_policing(message):
        return
    data = random.choice(NATTUKAR_DATA)
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
        "🚨 *കോളനിയിലെ ബ്രേക്കിംഗ് ന്യൂസ്!* 🚨\n\n"
        "👀 **നാട്ടുകാർ:** ബ്രേക്കിംഗ്: ചെറുപ്പക്കാരൻ മുറിയിൽ പോയി കരയുന്നു! "
        "പി.എസ്.സി തോറ്റതാണോ പ്രണയ നൈരാശ്യമാണോ എന്ന് നാട്ടുകാർ സംശയിക്കുന്നു! "
        "എതിർവശത്തെ അമ്മായി ജനലിലൂടെ ഫോട്ടോ എടുക്കുന്നുണ്ട്!"
    )
    await callback.message.reply(text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")


@router.callback_query(F.data == "send_biodata")
async def cb_send_biodata(callback: CallbackQuery):
    await callback.answer("ബയോഡാറ്റ ലഭിച്ചു!")
    text = (
        "📋 *വിവാഹ ആലോചന രജിസ്റ്റർ ചെയ്തു*\n\n"
        "👵 **ഓമന അമ്മായി:** നിന്റെ ബയോഡാറ്റ കിട്ടി! ഗൾഫിൽ നിന്നുള്ള ഒരു ആലോചന ഞാൻ നോക്കുന്നുണ്ട്. "
        "ചൂട് ഇഡ്ഡലി ഉണ്ടാക്കാൻ അറിയണം, അമ്മാവനെ ബഹുമാനിക്കണം!"
    )
    await callback.message.reply(text, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")


@router.callback_query(F.data == "whatsapp_forward")
async def cb_whatsapp_forward(callback: CallbackQuery):
    await callback.answer("അമ്മാവന്റെ സന്ദേശം അയക്കുന്നു...")
    forward = random.choice(FAKE_NEWS_MALAYALAM)
    await callback.message.reply(forward, reply_markup=get_action_inline_keyboard(), parse_mode="Markdown")
