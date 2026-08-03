# Sound Frequencies and EQ for Metal Guitar

## What frequency means

Frequency describes how quickly a sound wave vibrates. It is measured in hertz (Hz).

- **Low frequencies** sound deep, heavy, and powerful.
- **Mid frequencies** carry most of the guitar's body and identity.
- **High frequencies** provide attack, brightness, and detail.

A complete guitar tone is made from many frequencies at the same time. EQ lets you raise or lower selected parts of that spectrum.

A useful way to imagine the spectrum is:

- **Bass** = foundation
- **Mids** = the walls and main structure
- **Treble and presence** = edges, detail, and definition

---

## The metal guitar frequency map

```text
20 Hz                                                   20 kHz
| Sub | Bass | Low mids | Mids | High mids | Treble | Air |
   60    120      250      500      1k       2k  4k  8k
```

Electric guitar does not need to fill the entire audible spectrum. In a full band mix, the bass guitar and kick drum occupy the deepest frequencies, while cymbals occupy much of the highest range.

The most important metal-guitar information is usually between roughly **80 Hz and 6–8 kHz**.

---

## 20–60 Hz: sub-bass and rumble

This range is felt more than heard.

It contains:

- Stage and handling rumble
- Very deep kick-drum energy
- The lowest bass-guitar information

There is almost nothing useful here for a normal electric-guitar tone. Leaving too much sub-bass in a guitar signal can make the entire mix feel loose and muddy.

### Typical treatment

Use a **high-pass filter** to remove these unnecessary frequencies.

For metal guitar, a common starting point is somewhere around **70–90 Hz**, but the exact value depends on tuning, arrangement, cabinet IR, and the other instruments.

Do not automatically cut as high as possible. Raise the filter until the unnecessary rumble disappears, then stop before the guitar loses weight.

---

## 60–120 Hz: weight and palm-mute punch

This range gives the guitar low-end impact.

A healthy amount can make palm mutes feel powerful and physical.

Too much causes:

- Boominess
- Flubby palm mutes
- Competition with the bass and kick
- Poor note definition

Too little makes the guitar sound thin and weak.

For tight modern metal, the useful low end is usually controlled rather than heavily boosted.

---

## 120–250 Hz: warmth, thickness, and mud

This range adds warmth and thickness.

It can make a guitar sound full when playing alone, but it quickly becomes crowded in a full mix.

Too much can sound:

- Muddy
- Woolly
- Like a blanket is covering the speaker
- Undefined during fast riffs

A small cut around **180–250 Hz** can sometimes clean up a dense high-gain tone. Do not cut this area automatically, because removing too much can make the guitar sterile and small.

---

## 250–500 Hz: low mids, body, and boxiness

This range strongly affects the shape and character of the guitar.

Too much may sound:

- Boxy
- Cardboard-like
- Congested

Too little may sound:

- Hollow
- Scooped
- Weak in a band mix

Modern metal tones are sometimes reduced here, but this does not mean that all mids should be removed. A moderate cut can create space; an extreme cut can make the guitar disappear.

---

## 500 Hz–1 kHz: the core of the guitar

This is one of the most important regions for electric guitar.

It contributes:

- Body
- Note identity
- Midrange presence
- The ability to remain audible beside bass, drums, and vocals

A guitar tone that sounds huge alone but disappears in a rehearsal often lacks useful midrange.

Boosting this range can improve audibility, but too much may create a honky or nasal character depending on the exact frequency.

---

## 1–2 kHz: articulation and pick attack

This range helps the listener hear the start of each note.

It is especially useful for:

- Fast alternate picking
- Tight palm-muted riffs
- Complex chord voicings
- Modern metalcore and djent-style articulation

Too much can sound nasal, hard, or tiring.

Too little can make the guitar feel slow and blurred, even when the low end is controlled.

---

## 2–4 kHz: bite, aggression, and clarity

This is a critical range for distorted guitar.

It provides:

- Bite
- Crunch
- Aggression
- Forward presence
- Riff clarity

A controlled boost around **2–3 kHz** can help a metal guitar cut through a mix.

Too much becomes:

- Harsh
- Painful
- Ice-pick-like
- Fatiguing at stage volume

Always judge this range at realistic listening volume. Harshness is often less obvious when playing quietly at home.

---

## 4–6 kHz: brightness, edge, and string noise

This range contains:

- Pick scrape
- String noise
- Bright distortion texture
- The sharp edge of the attack

A little can add excitement and definition. Too much creates a scratchy or sizzling tone.

Cabinet speakers and IRs shape this region dramatically, so selecting the correct cab or IR is often better than trying to repair a poor choice with extreme EQ.

---

## 6–8 kHz: fizz

This is where unpleasant high-gain fizz often lives.

It may sound like:

```text
fzzzzzzzzzz
```

A **low-pass filter** can remove excessive fizz. A common starting range for modern metal guitar is around **6–8 kHz**.

The correct cutoff depends on the amp model, microphone position, IR, and context. Cutting too low can make the guitar dark and lifeless.

---

## 8–12 kHz: air and ambience

There is usually little essential close-miked electric-guitar information here.

This region may still contain:

- Room ambience
- Reverb detail
- Noise
- Pick and string artifacts

For a dry rhythm guitar, much of this range can often be removed. Reverbs and delays may benefit from keeping more high-frequency information than the main distorted guitar signal.

---

## High-pass and low-pass filters

These are the two most useful filters for cleaning a metal-guitar tone.

### High-pass filter

A high-pass filter allows frequencies above its cutoff to pass and reduces frequencies below it.

Use it to remove:

- Sub-bass
- Rumble
- Excessive low-end resonance

A practical starting point for metal rhythm guitar is **70–90 Hz**.

### Low-pass filter

A low-pass filter allows frequencies below its cutoff to pass and reduces frequencies above it.

Use it to remove:

- Fizz
- Unnatural digital brightness
- Excessive pick noise

A practical starting point is **6–8 kHz**.

These are starting points, not universal rules.

---

## Parametric EQ controls

A parametric EQ usually gives you three main controls.

### Frequency

Selects the center of the area you want to change.

### Gain

Controls how much you boost or cut that area.

- Positive gain boosts it.
- Negative gain cuts it.

### Q

Controls how wide or narrow the adjustment is.

- **Low Q** = broad and smooth adjustment
- **High Q** = narrow and surgical adjustment

Broad moves are useful for shaping the overall tone. Narrow moves are useful for finding resonances or unpleasant whistles.

---

## A practical modern-metal starting EQ

This is an example, not a preset that will work for every guitar or IR.

```text
High-pass:  80 Hz
180–220 Hz: -1 to -3 dB if muddy
300–450 Hz: -1 to -3 dB if boxy
800 Hz–1 kHz: +1 dB if the guitar lacks body
2–3 kHz:    +1 to +2 dB if more bite is needed
Low-pass:   6.5–8 kHz
```

Make small changes first. A 1–2 dB adjustment can be significant in a full mix.

---

## Why heavily scooped tones disappear

A common beginner setting is:

```text
Bass:   very high
Mids:   very low
Treble: very high
```

This can sound impressive while playing alone because it feels wide and powerful.

In a band:

- Bass guitar occupies the low frequencies.
- Kick drum occupies part of the low-frequency punch.
- Cymbals occupy the high frequencies.
- Vocals and guitars compete through the mids.

When the guitar's mids are removed, little remains that can be clearly heard.

Professional metal tones often contain much more midrange than they appear to contain when heard inside a finished mix.

---

## EQ characteristics of several metal styles

### Metallica-style rhythm tone

Often associated with:

- Large low end
- Scooped lower mids
- Bright upper range
- Tight double-tracked rhythm guitars

The finished sound also depends heavily on layering, bass guitar, drums, and studio production.

### Slipknot-style modern aggression

Often uses:

- Controlled but powerful lows
- Strong upper-mid aggression
- Clear pick attack
- Carefully managed fizz

### Trivium-style clarity

Typically benefits from more usable mids than a heavily scooped bedroom tone.

This helps harmonized parts, fast picking, and layered guitars remain clear.

### Lamb of God-style punch

Often feels strong in the lower mids while retaining enough upper-mid attack for definition.

### Modern metalcore

Usually emphasizes:

- Tight low end
- Reduced mud
- Strong 1–3 kHz articulation
- Controlled 4–8 kHz fizz

---

## Where to place EQ in a guitar signal chain

EQ behaves differently depending on its position.

### Before the amp

EQ before distortion changes how the amp reacts.

Examples:

- Cutting lows before the amp makes distortion tighter.
- Boosting mids before the amp makes the response more focused.
- A Tube Screamer-style pedal performs a similar job by reducing low end and pushing the mids before the amp.

### After the amp, before the cab

This can shape the amplified tone before the speaker simulation. It is useful, but large changes may interact strongly with the cab or IR.

### After the cab or IR

This is usually the best place for surgical corrections because you are shaping the final recorded or FOH-ready guitar sound.

Use post-cab EQ for:

- High-pass and low-pass filtering
- Mud reduction
- Boxiness cuts
- Harsh-frequency control
- Small presence adjustments

### Global EQ

Use global EQ to adapt the entire rig to a room, PA, monitor, or amplifier.

Do not use global EQ to repair a fundamentally bad preset, because it affects every preset and output assigned to it.

---

## Ear-training exercise: sweep and identify

This exercise is one of the fastest ways to learn EQ.

1. Place a parametric EQ after the amp and cab.
2. Select one bell band.
3. Set a fairly narrow Q, around **3–5**.
4. Boost it by approximately **+8 to +10 dB** temporarily.
5. Play the same riff repeatedly.
6. Slowly sweep the frequency from about **80 Hz to 8 kHz**.
7. Listen for the character of each area.
8. After identifying an unpleasant frequency, remove the temporary boost.
9. Apply a small cut, usually around **1–3 dB**.

Useful landmarks:

- **100 Hz**: thump and weight
- **200 Hz**: warmth or mud
- **400 Hz**: body or boxiness
- **800 Hz**: guitar body
- **1.5 kHz**: articulation and pick attack
- **2.5 kHz**: bite and aggression
- **4 kHz**: brightness and sharpness
- **6–8 kHz**: fizz

The temporary large boost is only for locating the frequency. The final correction should usually be much smaller.

---

## A reliable tone-building workflow

1. Choose the amp and cab or IR first.
2. Set the amp controls near neutral rather than using extreme settings.
3. Tighten the signal before the amp if necessary.
4. Add a high-pass filter after the cab.
5. Add a low-pass filter after the cab.
6. Identify one specific problem at a time.
7. Use small, targeted EQ moves.
8. Compare the edited tone with the bypassed version at equal loudness.
9. Check the tone inside a backing track or full-band mix.
10. Recheck it at rehearsal or stage volume.

---

## Key principles to remember

- EQ cannot fully repair the wrong amp, cab, IR, microphone, or gain setting.
- Use less gain than you think when double-tracking rhythm guitars.
- Remove unnecessary low end instead of trying to overpower the bass guitar.
- Preserve enough mids for the guitar to be heard.
- Control harshness without removing all attack.
- Judge guitar tone in a mix, not only when playing alone.
- Small EQ changes are usually more musical than extreme ones.
