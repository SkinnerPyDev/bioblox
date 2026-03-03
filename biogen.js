/* ═══════════════════════════════════════════
   BioBlox - Bio Generator Engine v2
   ═══════════════════════════════════════════ */

const WORKER_URL = 'https://robox.skinnerdev.workers.dev/';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

function pickPronoun(btn) {
    document.querySelectorAll('.pronoun-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const customInput = document.getElementById('inp-custom-pronouns');
    if (btn.getAttribute('data-pronouns') === 'custom') {
        customInput.style.display = '';
        customInput.focus();
    } else {
        customInput.style.display = 'none';
    }
}

function pickLength(btn) {
    document.querySelectorAll('.length-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function getSelectedLength() {
    const active = document.querySelector('.length-btn.active');
    return active ? active.getAttribute('data-length') : 'short';
}

function getSelectedPronouns() {
    const activeBtn = document.querySelector('.pronoun-btn.active');
    if (!activeBtn) return '';
    const val = activeBtn.getAttribute('data-pronouns');
    if (val === 'custom') return document.getElementById('inp-custom-pronouns').value.trim();
    return val;
}

function detectGender(pronouns) {
    const p = pronouns.toLowerCase().trim();
    if (p.includes('she') || p.includes('her')) return 'f';
    if (p.includes('he') || p.includes('him') || p.includes('his')) return 'm';
    return 'n';
}

function genderize(text, g) {
    if (g === 'f') {
        return text
            .replace(/\{royal\}/g, 'queen').replace(/\{Royal\}/g, 'Queen')
            .replace(/\{child\}/g, 'girl').replace(/\{Child\}/g, 'Girl')
            .replace(/\{prince\}/g, 'princess').replace(/\{Prince\}/g, 'Princess')
            .replace(/\{king\}/g, 'queen').replace(/\{King\}/g, 'Queen')
            .replace(/\{boi\}/g, 'girl').replace(/\{Boi\}/g, 'Girl')
            .replace(/\{dude\}/g, 'babe').replace(/\{Dude\}/g, 'Babe')
            .replace(/\{sibling\}/g, 'sis').replace(/\{Sibling\}/g, 'Sis')
            .replace(/\{hero\}/g, 'heroine').replace(/\{Hero\}/g, 'Heroine');
    }
    if (g === 'm') {
        return text
            .replace(/\{royal\}/g, 'king').replace(/\{Royal\}/g, 'King')
            .replace(/\{child\}/g, 'boy').replace(/\{Child\}/g, 'Boy')
            .replace(/\{prince\}/g, 'prince').replace(/\{Prince\}/g, 'Prince')
            .replace(/\{king\}/g, 'king').replace(/\{King\}/g, 'King')
            .replace(/\{boi\}/g, 'bro').replace(/\{Boi\}/g, 'Bro')
            .replace(/\{dude\}/g, 'dude').replace(/\{Dude\}/g, 'Dude')
            .replace(/\{sibling\}/g, 'bro').replace(/\{Sibling\}/g, 'Bro')
            .replace(/\{hero\}/g, 'hero').replace(/\{Hero\}/g, 'Hero');
    }
    return text
        .replace(/\{royal\}/g, 'royal').replace(/\{Royal\}/g, 'Royal')
        .replace(/\{child\}/g, 'kid').replace(/\{Child\}/g, 'Kid')
        .replace(/\{prince\}/g, 'royalty').replace(/\{Prince\}/g, 'Royalty')
        .replace(/\{king\}/g, 'ruler').replace(/\{King\}/g, 'Ruler')
        .replace(/\{boi\}/g, 'bestie').replace(/\{Boi\}/g, 'Bestie')
        .replace(/\{dude\}/g, 'bestie').replace(/\{Dude\}/g, 'Bestie')
        .replace(/\{sibling\}/g, 'bestie').replace(/\{Sibling\}/g, 'Bestie')
        .replace(/\{hero\}/g, 'hero').replace(/\{Hero\}/g, 'Hero');
}

function masculinizeEmojis(text, g) {
    if (g !== 'm') return text;
    return text
        .replace(/🌸/g, '⚡').replace(/🎀/g, '🔥').replace(/🌷/g, '🗡️')
        .replace(/💕/g, '🤝').replace(/💗/g, '🔥').replace(/🦋/g, '🦅')
        .replace(/🥀/g, '💀').replace(/💖/g, '⚔️').replace(/🛍️/g, '🎯')
        .replace(/💅/g, '👑').replace(/💋/g, '🔥').replace(/💌/g, '📩')
        .replace(/🌻/g, '☀️').replace(/🌼/g, '⭐').replace(/🐝/g, '🐺')
        .replace(/🧣/g, '🧢').replace(/♡/g, '◆').replace(/꒰/g, '【').replace(/꒱/g, '】');
}

const TITLES = {
    Cute: ["꒰ 🌸 ꒱ soft {child} era ˚₊·", "♡ cute {boi} ♡", "🌷 quiet cutie 🌷", "˚₊· flower {child} ·₊˚", "🎀 too shy to say hi 🎀", "💕 lil {prince} 💕", "🌸 sweet like honey 🌸", "♡₊˚ precious {child} ₊˚♡", "🎀 cotton candy dreams 🎀", "🌷 {prince} of softness 🌷", "✨ cute & i know it ✨", "💗 baby face {royal} 💗", "🌸 sugar plum {child} 🌸", "♡ soft era activated ♡", "🎀 certified cutie 🎀", "🌷 angel {child} 🌷", "💕 sweetest {boi} alive 💕", "✨ kawaii {child} ✨", "🌸 bubblegum {prince} 🌸", "♡ strawberry milk vibes ♡"],
    Emo: ["⛓️ broken {child} ⛓️", "🖤 don't talk to me 🖤", "💀 {prince} of darkness 💀", "🥀 fading away 🥀", "⛓️ shadow {child} ⛓️", "🖤 dead inside ☠️", "💀 chaos {royal} 💀", "🥀 pain is my aesthetic 🥀", "⛓️ lost soul ⛓️", "🖤 catch these hands 🖤", "💀 savage mode: ON 💀", "🥀 too cold for you 🥀", "⛓️ dark {prince} ⛓️", "🖤 emotionally unavailable 🖤", "💀 {child} of the void 💀", "🥀 broken crayons 🥀", "⛓️ midnight {royal} ⛓️", "🖤 screaming silently 🖤", "💀 emo {boi} energy 💀", "🥀 wilted rose 🥀"],
    Anime: ["♡₊˚ anime {child} ₊˚♡", "🌸 shy weeb ₊˚", "✧ uwu energy ✧", "🎀 baka {dude} 🎀", "⚔️ anime villain arc ⚔️", "🔥 main character energy 🔥", "💥 plus ultra! 💥", "⚡ {hero} arc ⚡", "🌸 kawaii desu~ 🌸", "♡ neko {child} ♡", "🗡️ final boss form 🗡️", "✧ senpai noticed me ✧", "🎀 slice of life {hero} 🎀", "💜 dark side protagonist 💜", "⚡ hidden power unlocked ⚡", "🌙 lone wolf ✧", "🌸 anime {prince} 🌸", "⚔️ {Royal} of the arena ⚔️", "♡ otaku {boi} ♡", "✧ chosen one ✧"],
    Aesthetic: ["✧˚ · soft aesthetic ·˚✧", "🤍 {prince} of vibes 🤍", "☁️ daydream believer ☁️", "🕊️ ethereal {child} 🕊️", "✧ pastel {royal} ✧", "🤍 cloud nine ✧", "☁️ floating in pastels ☁️", "🕊️ peaceful soul 🕊️", "✧˚ · dark academia ·˚✧", "🤍 unbothered {royal} 🤍", "☁️ vintage {child} ☁️", "🕊️ golden hour vibes 🕊️", "✧ old money aesthetic ✧", "🤍 art {child} era 🤍", "☁️ moonlit {prince} ☁️", "🕊️ lost in thought 🕊️", "✧˚ · {Royal} of aesthetics ·˚✧", "🤍 journal {child} 🤍", "☁️ café & rain vibes ☁️", "🕊️ minimalist soul 🕊️"],
    Preppy: ["💖 slay all day 💖", "🛍️ it {child} era 🛍️", "✨ born to slay ✨", "💅 main character 💅", "🎀 certified icon 🎀", "💖 preppy {prince} 💖", "🛍️ pink everything 🛍️", "✨ that {child} ✨", "💅 {Royal} of slay 💅", "🎀 sugar & spice 🎀", "💖 {child} boss 💖", "🛍️ shopping {royal} 🛍️", "✨ glamorous {boi} ✨", "💅 styled & profiled 💅", "🎀 preppy {prince} vibes 🎀", "💖 fashion {hero} 💖", "🛍️ effortlessly iconic 🛍️", "✨ trendsetter {child} ✨", "💅 slay queen slay 💅", "🎀 {Royal} of drip 🎀"],
    Gamer: ["🎮 pro gamer {child} 🎮", "🕹️ GG EZ 🕹️", "🔥 {Royal} of the lobby 🔥", "💀 rage quit {hero} 💀", "🎮 sweaty {boi} 🎮", "🕹️ clutch {prince} 🕹️", "⚡ cracked at games ⚡", "🏆 W {child} 🏆", "🎮 controller {royal} 🎮", "🕹️ respawn & retry 🕹️", "🔥 built different 🔥", "💀 1v1 me {dude} 💀", "🎮 gaming is life 🎮", "🕹️ camping {royal} 🕹️", "⚡ lag is my enemy ⚡", "🏆 MVP {child} 🏆", "🎮 AFK in real life 🎮", "🕹️ noob slayer 🕹️", "🔥 {prince} of pixels 🔥", "💀 game over? never 💀"],
    Cottagecore: ["🌿 forest {child} 🌿", "🍄 mushroom {prince} 🍄", "🌻 sunflower soul 🌻", "🦋 butterfly {child} 🦋", "🌿 cottage {royal} 🌿", "🍞 bread-baking {boi} 🍞", "🌻 wildflower {child} 🌻", "🐝 honey & herbs 🐝", "🌿 frog {prince} 🌿", "🍄 woodland creature 🍄", "🌻 garden fairy 🌻", "🦋 nature's {child} 🦋", "🌿 tea & rain vibes 🌿", "🍄 fairy ring wanderer 🍄", "🌻 {Royal} of the meadow 🌻", "🐝 cozy {child} 🐝", "🌿 barefoot {prince} 🌿", "🍄 enchanted {child} 🍄", "🌻 golden fields {boi} 🌻", "🦋 daisy chain dreamer 🦋"],
    Y2K: ["💿 Y2K {child} 💿", "📱 flip phone era 📱", "💎 bling {royal} 💎", "🦋 2000s {prince} 🦋", "💿 chrome hearts {boi} 💿", "📱 AIM me later 📱", "💎 bedazzled {child} 💎", "🦋 butterfly clips era 🦋", "💿 retro futurism 💿", "📱 {Royal} of Y2K 📱", "💎 baby phat {child} 💎", "🦋 juicy couture vibes 🦋", "💿 space age {prince} 💿", "📱 texting {royal} 📱", "💎 glitter & chrome 💎", "🦋 sparkle {child} 🦋", "💿 lowrise legend 💿", "📱 razr phone {boi} 📱", "💎 rhinestone {prince} 💎", "🦋 iconic 2000s {child} 🦋"],
    Grunge: ["🔗 grunge {child} 🔗", "🖤 ripped jeans & rage 🖤", "🎸 flannel {royal} 🎸", "💀 {prince} of grunge 💀", "🔗 anti-everything 🔗", "🖤 coffee & chaos 🖤", "🎸 garage band {hero} 🎸", "💀 messy hair don't care 💀", "🔗 thrift store {royal} 🔗", "🖤 rain & headphones 🖤", "🎸 90s {child} 🎸", "💀 mosh pit {boi} 💀", "🔗 {Royal} of noise 🔗", "🖤 punk but pretty 🖤", "🎸 distortion {prince} 🎸", "💀 angst era 💀", "🔗 too cool to care 🔗", "🖤 vinyl & venom 🖤", "🎸 rebel {child} 🎸", "💀 smells like teen spirit 💀"],
    Baddie: ["👑 baddie {child} 👑", "💋 too hot to handle 💋", "🔥 {Royal} of bad 🔥", "💅 untouchable {prince} 💅", "👑 villain {child} energy 👑", "💋 eat or be eaten 💋", "🔥 boss {boi} 🔥", "💅 built to slay 💅", "👑 {prince} of flex 👑", "💋 savage & classy 💋", "🔥 on fire {child} 🔥", "💅 unbothered {royal} 💅", "👑 cold-hearted {hero} 👑", "💋 main villain era 💋", "🔥 baddie by birth 🔥", "💅 certified menace 💅", "👑 {Royal} of the game 👑", "💋 they wish, i slay 💋", "🔥 no apologies {child} 🔥", "💅 ice in my veins 💅"]
};

const QUOTES = {
    Shy: ["not looking for drama, just peace", "shy doesn't mean weak", "quietly living my best life", "too shy to start convos but friendly i promise", "i don't bite... usually", "silence is my superpower", "the quiet ones notice everything", "small talk scares me more than horror games", "i'm nice once you get to know me", "sorry if i seem quiet, i'm just overthinking", "my chat game is weak but my heart is strong", "i watch from a distance, it's safer that way", "introvert with a big heart", "i said hi once, that's my social limit for the week", "i'm shy but i'll protect my friends with my life", "soft voice, loud thoughts", "nervous but here", "i promise i'm cool once i open up", "behind every shy {child} is a wild mind", "please don't put me on the spot", "i blush at everything", "i'm an open book... that's glued shut", "my comfort zone is very small and very cozy", "the wallflower era", "silently judging but in a nice way", "i smile more than i talk", "i'll wave but probably won't say hi", "shy {child} with a secret fun side", "don't mistake my silence for weakness", "i'm just a lil anxious", "observing from the corner", "i wrote this bio instead of talking to people", "text me, don't call", "shy but make it adorable", "social battery: 2%", "i peak in small groups", "awkwardly existing", "quietly iconic", "i stare at the floor a lot but i'm cool", "i'll laugh at your jokes from across the room", "i don't ghost, i'm just scared to reply", "shy {boi} loading...", "my personality unlocks after friendship level 5", "too shy to order food, too bold to let anyone disrespect me", "i rehearse conversations in my head", "the less i talk the more interesting i am", "i'm friendly once you befriend me first", "existing quietly and that's okay", "introverted but loyal", "don't worry, i'm just thinking"],
    Savage: ["sweet face but i bite", "cute outside, savage inside", "underestimate me, that'll be fun", "sweet until you cross me", "i didn't come to play, i came to slay", "built different, no apologies", "if you can't handle me at my worst, good riddance", "i'm the main character and you're an extra", "talk behind my back because you can't face me", "i ate and left no crumbs", "be careful, this {child} plays to win", "too real for fake people", "my attitude is based on how you treat me", "i'm not rude, i'm honest - you're just sensitive", "legends don't compete, they dominate", "i don't chase anymore, i attract", "the audacity? couldn't be me", "sorry not sorry", "catch me if you can, {dude}", "crossed me once? no second chances", "if you're looking for nice, wrong profile", "karma's lazy so i handle it myself", "unbothered, moisturized, in my lane", "i don't start drama, i finish it", "this is not a democracy, it's a monarchy and i'm {royal}", "sit down, the {royal} is speaking", "confidence isn't arrogance, it's self-awareness", "i'm the plot twist they didn't see coming", "my energy is not free - earn it", "be the villain of their story, it means you won", "too busy winning to worry about haters", "the {royal} doesn't beg", "i shine so bright even the sun squints", "don't follow me, you won't make it", "you either love me or pretend you don't", "i didn't choose savage life, it chose me", "built to lead, not to follow", "i don't explain myself to people who don't matter", "i'm the exception to every rule", "they tried to bury me but forgot i'm a seed", "level up or stay down, your choice", "read the room - i am the room", "this {child} doesn't lose, i just learn new ways to win", "jealousy is a disease, get well soon", "i'm not competition, i'm the whole category", "soft heart, savage mind", "the lion doesn't concern itself with the opinion of sheep", "i came, i saw, i conquered - next?", "don't get it twisted, kindness isn't weakness", "your opinion of me is none of my business"],
    Soft: ["kindness is free, spread it", "soft hearts are brave hearts", "be the reason someone smiles today", "love you all 💗", "gentle soul in a chaotic world", "soft but never weak", "spreading love wherever i go", "my heart is my strength", "everyone deserves a second chance", "sending virtual hugs", "the world needs more kindness", "treat people how you want to be treated", "soft {child}, strong spirit", "i believe in the good in people", "empathy is my superpower", "my love language is quality time", "healing others heals me too", "cozy vibes and warm hearts", "life's too short to be mean", "sunshine mixed with a little rain", "i cry at movies and i'm proud of it", "soft doesn't mean pushover", "caring is cool, actually", "the world is heavy, be someone's rest", "protect soft hearts at all costs", "i'd rather be kind than right", "every {child} deserves love", "wholesome energy only", "sensitive and proud of it", "my friends are my treasure", "hugs heal more than words", "i'll be your safe space", "tears are just feelings overflowing", "born to love, built to care", "find beauty in the small things", "the softest {child} in the lobby", "love wins always", "coffee, blankets, and good company", "quiet love is the loudest", "i root for everyone", "your worth isn't measured by likes", "it's okay to not be okay", "rest is productive too", "healing at my own pace", "i choose peace over pride every time", "blooming slowly is still blooming", "soft era unlocked", "i lead with my heart", "love is the answer to everything", "let's be friends, the world needs more of those"],
    Mysterious: ["you don't know me", "still figuring myself out", "not everything needs an explanation", "some questions are better unanswered", "silence speaks louder", "the less you know, the better", "i have layers you'll never peel", "not lost, just exploring the void", "the moon understands me", "read between the lines", "some souls speak a different language", "don't try to figure me out, i haven't either", "i'm a riddle wrapped in a mystery", "the quiet ones are the most dangerous", "behind this smile is a world you'll never see", "my story isn't over, you just can't read it yet", "depth over surface, always", "the deepest rivers flow the quietest", "i'm an open book written in a dead language", "you think you know? you have no idea", "mystery is my armor", "i keep my circle small for a reason", "the shadows know my name", "everybody sees what i allow them to see", "i'm the question marks in your sentences", "unknown, undefined, unapologetic", "enigma {child} era", "i walk alone but never lonely", "what you see is not what you get", "my silence is louder than your words", "deeper than the ocean, darker than the night", "mysterious {boi} with a backstory", "i'm the plot twist", "some paths are meant to be walked alone", "i disappeared once and nobody noticed - that's freedom", "layers upon layers upon layers", "if i told you, it wouldn't be a mystery", "the fog is where i feel at home", "trust is earned, never given", "i see everything, say very little", "behind the mask is another mask", "the answer is always hidden in plain sight", "i'm the footnote nobody reads but everyone should", "old soul trapped in a new world", "there's a storm inside me that i haven't named yet", "curiosity built my kingdom", "you'll understand when the time is right", "my past is a locked door", "i'd tell you but then it wouldn't be interesting", "the universe knows things about me that i don't"],
    Chill: ["no stress, just vibes", "keeping it simple & sweet", "go with the flow", "life's too short for drama", "chillin' is a full-time job", "zero drama, all karma", "laid-back and loving it", "easy breezy, no pressure", "good vibes only, seriously", "i'm too chill to care about haters", "music, snacks, sleep - that's the plan", "relaxed {child} energy", "the vibe is immaculate", "coasting through life peacefully", "i woke up and chose peace today", "nothing bothers me and i love that about myself", "my stress levels are nonexistent", "just a chill {boi} in a chaotic world", "calm is a superpower", "the universe takes care of it", "worry less, smile more", "honestly, whatever happens happens", "no rush, no stress, no worries", "floating through life", "i'm where i'm supposed to be", "low key living, high key happy", "zen mode activated", "my alarm clock is the sun", "live slow, die old", "peaceful {child} with zero enemies", "naps are my therapy", "soft breeze energy", "i don't do urgency", "every day is a good day", "nothing is that serious", "chilling until further notice", "my only plan is no plan", "calm mind, happy heart", "relaxation is an art form", "cozy corner {royal}", "i move at my own pace", "good times only", "chill beyond repair", "the calm in the chaos", "serenity now", "i peaked at relaxation", "nothing phases me anymore", "vibes > everything", "living slow and loving it", "peace is the ultimate flex"],
    Funny: ["i'm not lazy, i'm energy efficient", "my brain has too many tabs open", "professional overthinker", "i told a joke once... crickets", "do i look like i know what's going on?", "born to lose, forced to try", "running on caffeine and bad decisions", "i put the 'fun' in dysfunctional", "my life is a meme and i'm okay with it", "adult supervision needed", "error 404: cool personality not found", "i'm 10% talent, 90% WiFi", "life gave me lemons, i lost them", "if sarcasm burned calories, i'd be a model", "currently pretending to be a functioning member of society", "my middle name is 'questionable choices'", "i speak fluent sarcasm", "plot twist: i still don't know what i'm doing", "i tried being normal once, worst two minutes of my life", "i'm not weird, i'm limited edition", "my diet is 80% snacks and 20% regret", "allergic to mornings", "i'm basically a houseplant with emotions", "i peaked at age 7", "certified clown 🤡 but make it fashion", "npc {child} energy", "my attention span left the chat", "i was cool once, well almost", "if confusion had a face it'd be mine", "do not disturb (i'm doing nothing)", "i'm an influencer - i influence people to leave me alone", "my therapist says i'm 'a lot'", "professional time waster", "i'm the comic relief of this server", "born to nap, forced to rp", "laughing at my own jokes since forever", "the human version of a typo", "if being confused was a sport i'd be olympic champion", "i'm not ignoring you, i'm just on airplane mode irl", "brain.exe has stopped working", "one braincell and it's on vacation", "built different (and not in a good way)", "i don't have a plan and that IS the plan", "professionally goofy", "chaos {child} but make it cute", "sarcasm is my love language", "i don't know what's going on either", "the WiFi is stronger than my will to live", "i'm the friend your mom warned you about (just kidding)", "oops, i exist"],
    Flirty: ["come say hi, i don't bite... much", "your crush's crush", "catch feelings not L's", "flirty by nature, loyal by choice", "i have a charming {child} smile, don't test it", "heartbreaker in training", "the one they tell stories about", "i make friends jealous, not people", "love letters welcome 💌", "rizz {child} era", "too pretty to be single, too picky to settle", "my DMs are open but my standards are higher", "lowkey flirty, highkey selective", "if you're cute, i already noticed", "stolen hearts, zero regrets", "the {prince} everyone wants but nobody gets", "catch me blushing", "love me or miss me", "i flirt by accident, i swear", "hopeless romantic disguised as a player", "smooth {boi} with a soft center", "the rizz is natural", "eye contact is my weapon", "warning: i give butterflies", "you can look but you can't touch", "charming and i can't help it", "love is a game and i'm the MVP", "emotionally available (sometimes)", "i wink at strangers, sue me", "too cute for just one admirer", "heart on my sleeve but make it fashion", "i'm the butterflies people talk about", "relationship status: accepting applications", "not looking but if you're cute i'm suddenly interested", "rizz is my middle name", "i fell for you - jk, i tripped", "casually stealing hearts since birth", "love isn't blind, it just has good taste (me)", "sweet talk is my cardio", "{prince} charming but cooler", "i didn't choose the flirty life, it winks back", "my smile? it's free. my attention? earn it", "love me at my worst and i'll still be cute", "catch me smiling at nothing (i'm thinking about you)", "flirting is an art and i'm Picasso", "if cute was a crime i'd be serving life", "first date idea: just vibing in rp", "emotional damage and good looks", "casually gorgeous", "wink 😉"],
    Toxic: ["toxic but you love it", "warning: hazardous material inside", "i ruin everything and i look good doing it", "you've been warned", "red flags are my aesthetic", "poison never looked so sweet", "i'm the lesson everyone learns the hard way", "don't fall for me, you won't recover", "i play games and i always win", "emotionally chaotic", "i'm the villain, deal with it", "catch feelings and prepare for chaos", "toxicity is my brand", "i break hearts like promises", "love me at your own risk", "too toxic to quit, too pretty to be mad at", "i'm everybody's worst decision", "the red flag walked in, everybody clap", "i said sorry once, it was sarcasm", "villain arc is permanent here", "don't start what you can't finish with me", "i'll ruin your rp and your day", "i ghost better than casper", "not heartless, just using my heart less", "your favorite mistake", "i'm the worst thing that ever happened to this server", "trust issues? no, just experience", "i keep receipts", "blocked before you even spoke", "my loyalty got me nothing, so now i choose violence", "drama? i AM the drama", "jealousy looks bad on you but it's natural around me", "toxic {royal} era 👑", "expect nothing, deliver chaos", "i left a trail of destruction and it's aesthetic", "manipulate, motivate, {child}-boss", "if you can't handle me, scroll along", "they hate me because they can't be me", "gaslighting is my cardio", "i'm not the problem, i'm the upgrade you can't afford", "professional heart collector", "they warned you about me and you still came", "plot twist: you needed me more", "villain music plays when i enter the room", "i raise red flags like it's a parade", "broken hearts club president", "emotionally dangerous", "situationship {royal}", "too cold to love, too pretty to ignore", "toxically honest", "chaos is a ladder and i'm climbing"],
    Wholesome: ["you're doing great, keep going!", "everyone deserves a good day", "i believe in you even when you don't", "the world is better with you in it", "sending good vibes your way", "you matter more than you know", "today is a gift, that's why it's called the present", "wholesome {child} energy", "let's be friends!", "your smile makes the server brighter", "kindness is never wasted", "have you eaten today? drink some water!", "good morning to everyone, even the lurkers", "every {child} deserves kindness", "i'm your biggest fan", "let's make someone's day better today", "you're not alone, i promise", "group hug energy", "protecting your peace is valid", "gentle reminder that you're amazing", "no one is too cool to be kind", "being nice is underrated", "wholesome era and proud of it", "i'll compliment strangers, no shame", "the world needs more love, starting with this server", "it's okay to take breaks", "your feelings are valid", "i collect friends, not enemies", "let's eliminate hate and replace it with cake", "cheerleader for everyone", "you've survived 100% of your worst days", "good energy is contagious", "let's be the reason someone smiles", "everything will be okay eventually", "you're allowed to start over", "bloom at your own pace", "cozy {child} who loves everyone", "comfort character irl", "warm hugs and good intentions", "sunshine {child} era ☀️", "love is not a limited resource", "cheering you on from the sidelines", "making the world kinder, one rp at a time", "everyone's doing their best", "virtual high-five!", "your vibe attracts your tribe", "happiness looks good on you", "real {royal}s lift others up", "let's heal together", "if you need a friend, i'm right here"],
    Edgy: ["reality is overrated", "normality is a prison", "society is a scam, i opted out", "too real for this fake world", "built different, wired wrong", "my brain runs on dark mode", "reality.exe has crashed", "i see through the illusions", "existence is strange and so am i", "the edge is where the view is best", "philosopher by day, disaster by night", "questioning everything since birth", "i'm the glitch in the matrix", "rules are just suggestions i ignore", "my thoughts are darker than my outfit", "conformity is boring", "the system wasn't built for {child}s like me", "rebel without a pause", "thinking too deep for a roblox bio", "awakened to the truth", "labels are for products, not people", "break the mold or be the mold", "i didn't ask to be born but here i am, being iconic", "the void stared back and i waved", "existing on the edge of something", "society said be normal, i said no", "my aesthetic is controlled chaos", "too evolved for small talk", "some {child}s just want to watch the world learn", "edgy but self-aware about it", "the dark side has better music", "comfort zone? i burned it down", "i collect unpopular opinions", "mainstream is a disease i'm immune to", "wake up, {dude}. we're in a simulation", "the coolest people are the weirdest ones", "my personality is a paradox", "too smart to be happy, too stubborn to be sad", "i peaked at existential crisis", "nihilism with a cute face", "the universe gave me lore and it's heavy", "i'm a side quest nobody chose but everyone needs", "chaos theory is my life story", "born in the wrong timeline", "deconstructing reality one thought at a time", "normal is an illusion", "the abyss is cozy once you get used to it", "edgy {child} with a heart of gold", "black coffee, dark thoughts, bright future", "consciousness is a curse and a gift"]
};

const TAGS = {
    Cute: { e: ["dm for rp ✨", "no toxic 🌷", "rp open 🌸", "be nice 💗", "friend me 🎀", "kind vibes only 🌈", "sweet {child} 🍬", "luv u 💕", "soft era 🧸", "add me 💌"], n: ["dm for rp", "no toxic", "rp open", "be nice", "friend me", "kind vibes only", "stay sweet", "luv u", "soft era", "add me"] },
    Emo: { e: ["stay away 💀", "don't message 🖤", "rp maybe ⛓️", "loner vibes 🥀", "music lover 🎵", "edgy ✖️", "pain is art 🩸", "scream into void 🌑", "dark soul ☠️", "broken 🥀"], n: ["stay away", "don't message", "rp maybe", "loner vibes", "music lover", "edgy", "pain is art", "scream into void", "dark soul", "broken"] },
    Anime: { e: ["anime rp 🌸", "weeb life ✧", "dm for anime talk 🎀", "cosplay fan 🗡️", "manga reader 📖", "otaku 🎌", "neko vibes 🐱", "senpai notice me ✨", "anime lover 💜", "kawaii 🌙"], n: ["anime rp", "weeb life", "dm for anime talk", "cosplay fan", "manga reader", "otaku", "neko vibes", "senpai notice me", "anime lover", "kawaii"] },
    Aesthetic: { e: ["aesthetic rp ☁️", "art lover 🎨", "photography vibes 📷", "journal life ✨", "dreamer 🕊️", "vintage soul 🤍", "film photos 📸", "golden hour 🌅", "minimalist ✧", "poetry {child} 📝"], n: ["aesthetic rp", "art lover", "photography vibes", "journal life", "dreamer", "vintage soul", "film photos", "golden hour", "minimalist", "poetry lover"] },
    Preppy: { e: ["slay bestie 💅", "shopping {royal} 🛍️", "follow me 💖", "icon energy ✨", "trendsetter 🎀", "that {child} 💕", "drip check 👗", "style {royal} 👑", "fashion icon 💎", "glam 💄"], n: ["slay bestie", "shopping lover", "follow me", "icon energy", "trendsetter", "that one", "drip check", "style royalty", "fashion icon", "glam"] },
    Gamer: { e: ["1v1 me 🎮", "pro gamer 🕹️", "gg ez 🏆", "sweaty lobbies 🔥", "clutch {child} ⚡", "respawn 💀", "carries only 🎯", "lag hates me 📶", "tryhard 💪", "gamer rp 🎮"], n: ["1v1 me", "pro gamer", "gg ez", "sweaty lobbies", "clutch player", "respawn", "carries only", "lag enemy", "tryhard", "gamer rp"] },
    Cottagecore: { e: ["nature {child} 🌿", "flower crown 🌻", "cottage vibes 🍄", "forest rp 🦋", "tea time 🍵", "garden fairy 🐝", "touch grass 🌱", "frog lover 🐸", "cozy {child} 🧣", "wildflower 🌼"], n: ["nature lover", "flower crown", "cottage vibes", "forest rp", "tea time", "garden fairy", "touch grass", "frog lover", "cozy vibes", "wildflower"] },
    Y2K: { e: ["Y2K {child} 💿", "retro vibes 📱", "bling era 💎", "butterfly 🦋", "chrome hearts 🖤", "flip phone 📞", "sparkle {child} ✨", "2000s baby 💖", "bedazzled 💎", "juicy 👄"], n: ["Y2K era", "retro vibes", "bling era", "butterfly vibes", "chrome hearts", "flip phone", "sparkle era", "2000s baby", "bedazzled", "juicy"] },
    Grunge: { e: ["grunge rp 🔗", "thrift store 🖤", "flannel vibes 🎸", "90s {child} 💀", "mosh pit ⚡", "punk era 🔥", "rebel 🏴", "noise lover 🔊", "distorted 🖤", "skater {child} 🛹"], n: ["grunge rp", "thrift store", "flannel vibes", "90s kid", "mosh pit", "punk era", "rebel", "noise lover", "distorted", "skater"] },
    Baddie: { e: ["baddie era 👑", "slay {royal} 💋", "boss {child} 🔥", "ice cold 💅", "flex only 💎", "no cap 🧢", "drip god 💧", "unbothered 😎", "main villain 🖤", "certified 🏆"], n: ["baddie era", "slay", "boss mode", "ice cold", "flex only", "no cap", "drip god", "unbothered", "main villain", "certified"] }
};

const DECORATORS = {
    none: { pre: '', suf: '' },
    sparkle: { pre: '✧˚ · ', suf: ' ·˚✧' },
    flower: { pre: '꒰ 🌸 ꒱ ', suf: '' },
    stars: { pre: '★ ', suf: ' ★' },
    hearts: { pre: '♡₊˚ ', suf: ' ₊˚♡' },
    chains: { pre: '⛓️ ', suf: ' ⛓️' },
    clouds: { pre: '☁️ ', suf: ' ☁️' }
};

function pickDeco(btn) {
    document.querySelectorAll('.deco-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function getSelectedDeco() {
    const active = document.querySelector('.deco-btn.active');
    return active ? active.getAttribute('data-deco') : 'none';
}

function applyDecorator(text, decoKey) {
    if (decoKey === 'none') return text;
    const d = DECORATORS[decoKey];
    const clean = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
    return d.pre + clean + d.suf;
}

// --- Gender-Priority Bio Pool Builder ---
function getGenderPriorityPool(gender) {
    // Returns bios in priority order: gender-specific first, then neutral, then mixed
    let primary, secondary;
    if (gender === 'f') {
        primary = [...BIO_LINES.girl];
        secondary = [...BIO_LINES.boy];
    } else if (gender === 'm') {
        primary = [...BIO_LINES.boy];
        secondary = [...BIO_LINES.girl];
    } else {
        primary = [];
        secondary = [...BIO_LINES.girl, ...BIO_LINES.boy];
    }
    const neutral = [...BIO_LINES.neutral];
    shuffle(primary);
    shuffle(neutral);
    shuffle(secondary);
    return [...primary, ...neutral, ...secondary];
}

function stripEmojis(text) {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
}

function generateBios() {
    const style = document.getElementById('sel-style').value;
    const personality = document.getElementById('sel-personality').value;
    const game = document.getElementById('sel-game').value;
    const name = document.getElementById('inp-name').value.trim() || 'Player';
    const age = document.getElementById('inp-age').value.trim();
    const pronouns = getSelectedPronouns();
    const useEmoji = document.getElementById('chk-emoji').classList.contains('checked');
    const decoKey = getSelectedDeco();
    const length = getSelectedLength();

    const gender = detectGender(pronouns);
    const container = document.getElementById('bio-cards');
    container.innerHTML = '';

    // Build gender-priority bio pool
    const bioPool = getGenderPriorityPool(gender);

    // Also get style titles and personality quotes for short/long modes
    const titlePool = [...TITLES[style]];
    const quotePool = [...QUOTES[personality]];
    shuffle(titlePool);
    shuffle(quotePool);

    let firstBioText = '';

    // Build meta (shared across all lengths)
    const metaParts = [];
    if (pronouns) metaParts.push(pronouns);
    if (age) metaParts.push(age);
    metaParts.push(name);
    if (game !== 'Any RP Game') metaParts.push(game.toLowerCase() + ' rp');
    else metaParts.push('rp lover');
    const meta = metaParts.join(' • ');

    for (let i = 0; i < 4; i++) {
        let bioCopyText = '';
        let displayHTML = '';

        if (length === 'oneliner') {
            // ONE LINER: bio line + meta info
            let line = bioPool[i % bioPool.length];
            if (!useEmoji) line = stripEmojis(line);
            if (decoKey !== 'none') line = applyDecorator(line, decoKey);

            bioCopyText = line + '\n' + meta;
            displayHTML = `
                <div class="bio-title">${line}</div>
                <div class="bio-meta">${meta}</div>
            `;

        } else if (length === 'short') {
            // SHORT: title + meta + quote + tags (same as old Long)
            let rawTitle = titlePool[i % titlePool.length];
            let rawQuote = quotePool[i % quotePool.length];
            let title = genderize(rawTitle, gender);
            let quote = '"' + genderize(rawQuote, gender) + '"';

            const rawTagPool = useEmoji ? TAGS[style].e : TAGS[style].n;
            let tagPool = rawTagPool.map(t => genderize(t, gender));
            tagPool = tagPool.map(t => masculinizeEmojis(t, gender));
            const tags = shuffle([...tagPool]).slice(0, 2).join(' • ');

            title = masculinizeEmojis(title, gender);
            quote = masculinizeEmojis(quote, gender);

            let displayTitle = useEmoji ? title : stripEmojis(title);
            if (decoKey !== 'none') displayTitle = applyDecorator(displayTitle, decoKey);

            bioCopyText = displayTitle + '\n' + meta + '\n' + quote + '\n' + tags;
            displayHTML = `
                <div class="bio-title">${displayTitle}</div>
                <div class="bio-meta">${meta}</div>
                <div class="bio-quote">${quote}</div>
                <div class="bio-tags">${tags}</div>
            `;

        } else {
            // LONG: title + meta + extra bio line + quote + more tags (richer format)
            let rawTitle = titlePool[i % titlePool.length];
            let rawQuote = quotePool[i % quotePool.length];
            let title = genderize(rawTitle, gender);
            let quote = '"' + genderize(rawQuote, gender) + '"';

            // Extra bio line from gender pool for richness
            let extraLine = bioPool[i % bioPool.length];
            if (!useEmoji) extraLine = stripEmojis(extraLine);

            // Get a second quote for extra depth
            let rawQuote2 = quotePool[(i + 2) % quotePool.length];
            let quote2 = '"' + genderize(rawQuote2, gender) + '"';
            quote2 = masculinizeEmojis(quote2, gender);

            const rawTagPool = useEmoji ? TAGS[style].e : TAGS[style].n;
            let tagPool = rawTagPool.map(t => genderize(t, gender));
            tagPool = tagPool.map(t => masculinizeEmojis(t, gender));
            const tags = shuffle([...tagPool]).slice(0, 3).join(' • ');

            title = masculinizeEmojis(title, gender);
            quote = masculinizeEmojis(quote, gender);

            let displayTitle = useEmoji ? title : stripEmojis(title);
            if (decoKey !== 'none') displayTitle = applyDecorator(displayTitle, decoKey);

            bioCopyText = displayTitle + '\n' + meta + '\n' + extraLine + '\n' + quote + '\n' + quote2 + '\n' + tags;
            displayHTML = `
                <div class="bio-title">${displayTitle}</div>
                <div class="bio-meta">${meta}</div>
                <div class="bio-quote">${extraLine}</div>
                <div class="bio-quote">${quote}</div>
                <div class="bio-quote">${quote2}</div>
                <div class="bio-tags">${tags}</div>
            `;
        }

        if (i === 0) firstBioText = bioCopyText;

        const card = document.createElement('div');
        card.className = 'bio-card';

        const accentDiv = document.createElement('div');
        accentDiv.className = 'bio-accent';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'bio-content';
        contentDiv.innerHTML = displayHTML;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'bio-actions';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy';
        copyBtn.innerHTML = '📋 COPY';
        copyBtn.addEventListener('click', function () { copyBio(this, bioCopyText); });

        actionsDiv.appendChild(copyBtn);
        card.appendChild(accentDiv);
        card.appendChild(contentDiv);
        card.appendChild(actionsDiv);
        container.appendChild(card);
    }

    document.getElementById('results-section').style.display = '';
    document.getElementById('real-preview-prompt').style.display = '';
    updatePreview(name, firstBioText);
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updatePreview(name, bioText) {
    document.getElementById('preview-section').style.display = '';
    document.getElementById('preview-username').textContent = '@' + name;
    document.getElementById('preview-bio').textContent = bioText;
}

async function loadRealPreview() {
    const username = document.getElementById('inp-roblox-username').value.trim();
    if (!username) return;

    const btn = document.querySelector('.preview-username-row button');
    const originalBtn = btn.innerHTML;
    btn.innerHTML = '⏳ Loading...';
    btn.disabled = true;

    try {
        // 1. Resolve username to userId via search API
        const searchRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://users.roblox.com/v1/users/search?keyword=' + username + '&limit=10')}`);
        const searchData = await searchRes.json();
        const userMatch = searchData.data?.find(u => u.name.toLowerCase() === username.toLowerCase());
        if (!userMatch) {
            btn.innerHTML = '❌ Not Found';
            setTimeout(() => { btn.innerHTML = originalBtn; btn.disabled = false; }, 2000);
            return;
        }
        const userId = userMatch.id;

        // 2. Fetch avatar headshot
        try {
            const thumbRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=' + userId + '&size=150x150&format=Png')}`);
            const thumbData = await thumbRes.json();
            const avatarUrl = thumbData.data?.[0]?.imageUrl;
            if (avatarUrl) {
                document.querySelector('.roblox-avatar-placeholder').innerHTML =
                    `<img src="${avatarUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            }
        } catch (e) { console.warn('Avatar fetch failed', e); }

        // 3. Fetch friends count
        let friendsCount = 0;
        try {
            const friendsRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://friends.roblox.com/v1/users/' + userId + '/friends/count')}`);
            const friendsData = await friendsRes.json();
            friendsCount = friendsData.count || 0;
        } catch (e) { console.warn('Friends fetch failed', e); }

        // 4. Fetch followers count
        let followersCount = 0;
        try {
            const followersRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://friends.roblox.com/v1/users/' + userId + '/followers/count')}`);
            const followersData = await followersRes.json();
            followersCount = followersData.count || 0;
        } catch (e) { console.warn('Followers fetch failed', e); }

        // 5. Fetch following count
        let followingCount = 0;
        try {
            const followingRes = await fetch(`${WORKER_URL}proxy?url=${encodeURIComponent('https://friends.roblox.com/v1/users/' + userId + '/followings/count')}`);
            const followingData = await followingRes.json();
            followingCount = followingData.count || 0;
        } catch (e) { console.warn('Following fetch failed', e); }

        // 6. Update preview card
        document.getElementById('preview-username').textContent = '@' + username;
        document.getElementById('preview-friends').textContent = formatCount(friendsCount);
        document.getElementById('preview-followers').textContent = formatCount(followersCount);
        document.getElementById('preview-following').textContent = formatCount(followingCount);

        btn.innerHTML = '✅ Loaded!';
        setTimeout(() => { btn.innerHTML = originalBtn; btn.disabled = false; }, 2000);

    } catch (e) {
        console.error('Preview load error:', e);
        btn.innerHTML = '❌ Error';
        setTimeout(() => { btn.innerHTML = originalBtn; btn.disabled = false; }, 2000);
    }
}

function formatCount(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function copyBio(btn, text) {
    navigator.clipboard.writeText(text).then(function () {
        const original = btn.innerHTML;
        btn.innerHTML = '✅ COPIED!';
        btn.style.background = 'var(--mint)';
        btn.style.color = 'white';
        setTimeout(function () {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    });
}
