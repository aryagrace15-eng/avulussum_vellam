import random
from datetime import datetime

# Mathematical Script Unicode mapping for that "girly font" aesthetic
GIRLY_MAP = {
    'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ',
    'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃',
    'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊',
    'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
    'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢',
    'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩',
    'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰',
    'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
}

def to_girly(text: str) -> str:
    """Convert normal text to cursive Mathematical Script (girly font)."""
    return ''.join(GIRLY_MAP.get(ch, ch) for ch in text)


COMPARISON_TARGETS = [
    "Sharmaji's son in Bangalore",
    "Prasanth in the US doing MS",
    "the neighbor's daughter who cracked IAS",
    "your cousin who bought a villa in Dubai",
    "the kid who topped the PSC exam",
    "Georgekutty's daughter who got 95% in 10th",
    "A10's son who is a doctor in London",
    "the NRI who came back with a BMW and 3 cents land",
    "your batchmate who already has 2 kids and a house",
    "the temple elephant who has better job security",
]

def get_comparison_meter() -> str:
    score = random.randint(12, 98)
    target = random.choice(COMPARISON_TARGETS)
    return f"\n\n📊 Current Social Standing: {score}% worse than {target}"


def is_late_night() -> bool:
    now = datetime.now()
    return now.hour >= 22 or now.hour < 5


DRAMATIC_PREFIXES = [
    "🎵 *dramatic Asianet serial BGM intensifies* 🎵\n\n",
    "⚡ *thunder clap + heavy monsoon rain* ⚡\n\n",
    "🎬 *Innocent laughing mockingly in the background* 🎬\n\n",
    "📺 *Asianet News breaking sound effect* 📺\n\n",
    "🚨 *Nattukar collective gasp heard across the paddy field* 🚨\n\n",
    "💅 *Ammayi adjusts mundu with maximum judgment* 💅\n\n",
    "☕ *Tea shop discussion reaches fever pitch* ☕\n\n",
]

def add_drama(text: str) -> str:
    """40% chance to add a dramatic prefix."""
    if random.random() < 0.4:
        return random.choice(DRAMATIC_PREFIXES) + text
    return text


FAKE_NEWS = [
    "UNESCO has declared you the most stressed person in Kerala. Drink hot water with turmeric. 🏆",
    "NASA found that Malayali youths who don't marry before 30 lose 50% brain capacity. Share to 10 groups! 🧠",
    "World Health Organization says crying after 10pm causes permanent hair loss and bad marriage proposals. 💇‍♀️",
    "Facebook is giving free gold coins to everyone who forwards this. Mark Zuckerberg personally confirmed! 📱",
    "Kerala Government announced: People without PSC jobs will not get passport after 2025. Apply now! 📋",
]

def get_fake_news() -> str:
    return "\n\n📰 BREAKING: " + random.choice(FAKE_NEWS)