import asyncio
import os
import edge_tts
from media_ids import SITUATION_LIST

VOICE_CONFIGS = {
    "ammavan": {"voice": "ml-IN-MidhunNeural", "pitch": "-10Hz", "rate": "+25%"},
    "ammayi": {"voice": "ml-IN-SobhanaNeural", "pitch": "+15Hz", "rate": "+30%"},
    "nattukar": {"voice": "ml-IN-SobhanaNeural", "pitch": "-5Hz", "rate": "+25%"},
    "police": {"voice": "ml-IN-MidhunNeural", "pitch": "-20Hz", "rate": "+20%"}
}

async def generate_all_audios():
    audio_dir = "audio"
    os.makedirs(audio_dir, exist_ok=True)

    print("🎙️ Force re-generating all 18 Malayalam audio files with faster speaking speed & distinct voices...")
    
    for idx, data in enumerate(SITUATION_LIST):
        key = data["key"]
        speech = data["speech"]
        voice_type = data.get("voice_type", "ammavan")
        config = VOICE_CONFIGS.get(voice_type, VOICE_CONFIGS["ammavan"])

        out_path = os.path.join(audio_dir, f"{key}.mp3")
        
        # Remove old file if exists to force fresh fast voice generation
        if os.path.exists(out_path):
            os.remove(out_path)

        for attempt in range(1, 4):
            try:
                print(f"[{idx+1}/18] Generating [{voice_type} | fast {config['rate']}] {key}.mp3 ...")
                communicate = edge_tts.Communicate(
                    text=speech,
                    voice=config["voice"],
                    pitch=config["pitch"],
                    rate=config["rate"]
                )
                await communicate.save(out_path)
                print(f"✅ Generated {out_path} ({os.path.getsize(out_path)} bytes)")
                break
            except Exception as e:
                print(f"⚠️ Attempt {attempt} failed for {key}.mp3: {e}")
                await asyncio.sleep(1.5)
        
        await asyncio.sleep(0.5)

if __name__ == "__main__":
    asyncio.run(generate_all_audios())
