import asyncio
import os
import edge_tts
from media_ids import SITUATION_DATA_MAP

VOICE_CONFIGS = {
    "ammavan": {"voice": "ml-IN-MidhunNeural", "pitch": "-15Hz", "rate": "-10%"},
    "ammayi": {"voice": "ml-IN-SobhanaNeural", "pitch": "+12Hz", "rate": "-5%"},
    "nattukar": {"voice": "ml-IN-SobhanaNeural", "pitch": "-5Hz", "rate": "+10%"},
    "police": {"voice": "ml-IN-MidhunNeural", "pitch": "-25Hz", "rate": "-15%"}
}

async def generate_single_audio(key: str, speech: str, voice_type: str):
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)
    out_path = os.path.join(audio_dir, f"{key}.mp3")
    
    if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
        print(f"⏩ {key}.mp3 already exists ({os.path.getsize(out_path)} bytes), skipping.")
        return

    config = VOICE_CONFIGS.get(voice_type, VOICE_CONFIGS["ammavan"])
    
    for attempt in range(1, 4):
        try:
            print(f"🎙️ Generating [{voice_type}] {key}.mp3 (Attempt {attempt})...")
            communicate = edge_tts.Communicate(
                text=speech,
                voice=config["voice"],
                pitch=config["pitch"],
                rate=config["rate"]
            )
            await communicate.save(out_path)
            print(f"✅ Successfully saved {out_path} ({os.path.getsize(out_path)} bytes)")
            return
        except Exception as e:
            print(f"⚠️ Attempt {attempt} failed for {key}.mp3: {e}")
            await asyncio.sleep(2)

async def generate_all_audios():
    for btn_text, data in SITUATION_DATA_MAP.items():
        key = data["key"]
        speech = data["speech"]
        voice_type = data.get("voice_type", "ammavan")
        await generate_single_audio(key, speech, voice_type)
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(generate_all_audios())
