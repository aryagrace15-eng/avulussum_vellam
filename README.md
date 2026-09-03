<img width="1280" height="640" alt="Nattukar.exe Banner" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# Nattukar.exe: What Will Society Think? 🌴📱

> **The ultimate Malayali anti-therapy Telegram bot powered by Kerala Society Consciousness.**  
> *No empathy here—only judgment, unsolicited advice, dramatic serial BGMs, and constant comparison to the neighbor's kid.*

---

## 🎯 Basic Details

### Team Name: **Avulussum vellam**

### Team Members
- **Team Lead:** Arya K A - *Govt. Model Engineering College*
- **Member 2:** Akshita Sivasankaran - *Govt. Model Engineering College*

---

## 📌 Project Description

**Nattukar.exe** is a story-driven, culturally chaotic Telegram bot built for the **TinkerHub Useless Projects 3.0** hackathon. 

You play as a 20-something Malayali trying to navigate modern life. Looking for a safe space to vent about your startup burnout, love life, or travel dreams? Think again! The bot analyzes your text and summons your worst tormentors—nosy neighbors (*Nattukar*), boomer critics (*Sudhakaran Ammavan*), and gossip matchmakers (*Omana Ammayi*)—to roast you with Malayalam movie sound bytes, moral policing, fake WhatsApp forwards, and brutal comparison metrics.

---

## ❓ The Problem (That Doesn't Exist)

Young adults lack sufficient judgmental commentary in their daily messaging apps. Traditional therapy provides constructive empathy, which fails to prepare users for the brutal reality of Kerala family gatherings and colony WhatsApp groups.

---

## 💡 The Solution (That Nobody Asked For)

An automated 24/7 **Anti-Therapy Bot** that converts every vulnerable emotional confession into a public moral outrage:

1. **Sudhakaran Ammavan (The Boomer Critic):** Roasts career & startup stress. Asks why you aren't writing the PSC exam or attending bank coaching, reminding you how his generation walked 14 km to school in the rain.
2. **Omana Ammayi (The Matchmaker/Gossip):** Monitors your relationship status. Mention being single or lonely and she plays tragic wedding shehnai music while demanding your matrimonial biodata to compare you to her son *"Prasanth in the US"*.
3. **The Nattukar (The Hive Mind):** Chimes in with dramatic Malayalam serial gasps (*DUN DUN DUN*) and breaking news sirens whenever you want to quit your job or travel.
4. **Time-Based Moral Policing:** Try messaging the bot after 10:00 PM and it refuses to answer your prompt, interrogating you on why you are awake so late and who you are chatting with!
5. **The Comparison Meter:** Progress bar attached to every reply showing that your social standing is perpetually 99% worse than Sharmaji's son or Prasanth in the US.
6. **Fake News Comfort:** Unsolicited WhatsApp forwards from Ammavan declaring UNESCO awards for stress and turmeric hot water cures.

---

## 👥 The Cast of Tormentors

| You Type... | Bot Character | Bot's Reaction |
|---|---|---|
| *"I am feeling so burnt out with my startup."* | **Sudhakaran Ammavan** | 🎤 *Innocent Mocking Laugh* <br> *"Startup? What is that? A bakery? In my days we walked 12km in flood water! Write PSC exam!"* |
| *"I just want to be happy and single right now."* | **Omana Ammayi** | 🎤 *Dramatic Serial BGM* <br> *"Ayyayyo! Who will give you kanji when you are 60? Prasanth in US bought a duplex. Give me your biodata!"* |
| *"I'm sad, I feel like crying."* | **The Nattukar** | 🎤 *Breaking News Siren* <br> *"BREAKING NEWS: Local youth found crying! Is it love failure? What will society think?!"* |
| *[Any message after 10:00 PM]* | **Moral Police** | 🚨 *"WHY ARE YOU AWAKE THIS LATE?! Who are you chatting with? Go to sleep!"* |

---

## ⚙️ Technical Details

### Technologies & Frameworks
- **Language:** Python 3.10+
- **Framework:** [aiogram 3.x](https://docs.aiogram.dev/) (Modern Asynchronous Telegram Bot Framework)
- **Environment:** `python-dotenv` for secure token management
- **Deployment Ready:** Configured for Render, Railway, or VPS hosting

---

## 📁 Repository Structure

```text
avulussum_vellam/
├── main.py          # Dispatcher initialization, menu commands, & bot polling
├── config.py        # Environment variables & token loader
├── handlers.py      # Character routing logic, late-night filter, keyboards & callbacks
├── media_ids.py     # Telegram voice note file_ids, comparison meter, fake news pool
├── requirements.txt # Python dependencies (aiogram 3.x, python-dotenv)
├── .env             # Bot token storage (git-ignored)
└── README.md        # Comprehensive documentation
```

---

## 🚀 Installation & Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/aryagrace15-eng/avulussum_vellam.git
cd avulussum_vellam
```

### 2. Set Up Virtual Environment
```bash
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Telegram Bot Token
Create a `.env` file in the root directory:
```env
BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
```
*(Get your token from [@BotFather](https://t.me/BotFather) on Telegram)*

### 5. Run the Bot
```bash
python main.py
```

---

## 🎵 Setting Up Telegram Voice Notes (`media_ids.py`)

To plug in custom Malayalam audio voice clips (e.g. Salim Kumar crying, Jagathy shouting, serial BGMs):
1. Upload your `.ogg` voice notes or `.mp3` audio files to Telegram.
2. Fetch the `file_id` for each clip using a Telegram logger bot or printing `message.voice.file_id`.
3. Open `media_ids.py` and paste the strings into `AUDIO_CLIPS`:
```python
AUDIO_CLIPS = {
    "ammavan_rage": "AwADBAAD...[your_file_id]",
    "ammayi_gasp": "AwADBAAD...[your_file_id]"
}
```
*(Note: If `file_id` is empty, Nattukar.exe automatically falls back to clean, hilarious text transcripts!)*

---

## 📸 Screenshots & Demos

*(Add your screenshots here for hackathon evaluation)*

![Screenshot 1](https://via.placeholder.com/600x400?text=Sudhakaran+Ammavan+Roast)
*Sudhakaran Ammavan roasting IT startup stress & recommending PSC coaching.*

![Screenshot 2](https://via.placeholder.com/600x400?text=Omana+Ammayi+Matchmaker)
*Omana Ammayi demanding matrimonial biodata and flexing Prasanth in the US.*

![Screenshot 3](https://via.placeholder.com/600x400?text=Time-Based+Moral+Policing)
*Time-Based Moral Policing interrogating user after 10:00 PM.*

---

## 🤝 Team Contributions

- **Arya K A:** Team Lead, Telegram Bot Architecture, aiogram Router Implementation, Media Vault setup.
- **Akshita Sivasankaran:** Malayali Character Scripting, Comparison Meter Logic, Moral Policing Filter & UX Design.

---

 Made with ❤️ at **TinkerHub Useless Projects 3.0**

[![TinkerHub](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)](https://www.tinkerhub.org/)
[![Useless Projects 3.0](https://img.shields.io/badge/UselessProjects--3.0-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)](https://tinkerhub.org/)
