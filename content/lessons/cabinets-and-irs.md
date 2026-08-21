# Cabinets & IRs — The Final Voice of Your Metal Guitar Tone

You can have an excellent guitar, boost, and high-gain amp—and still have a terrible tone if the **cabinet and microphone stage** is wrong.

For a recorded or modelled guitar tone, think of the chain as:

```text
GUITAR
  ↓
BOOST / DRIVE
  ↓
AMP
  ↓
SPEAKER CABINET
  ↓
MICROPHONE
  ↓
EQ
  ↓
FOH / RECORDING / HEADPHONES
```

In a modeler, the physical **cabinet + speaker + microphone** can be represented by a cab simulation or an **Impulse Response (IR)**.

This stage has an enormous effect on the final tone.

---

## 1. Why guitar speakers matter so much

A guitar speaker is very different from a hi-fi or PA speaker. A PA speaker attempts to reproduce a broad frequency range relatively accurately. A guitar speaker deliberately **colors the sound**.

A distorted amp without a guitar cabinet can sound like harsh buzzing because it contains huge amounts of unpleasant high-frequency information. The guitar speaker reshapes that signal into controlled lows, strong mids, and rolled-off highs.

The cabinet isn't simply reproducing your amp tone. **The cabinet is part of the tone.**

---

## 2. Speaker frequency response

A guitar speaker does not reproduce every frequency equally. There are peaks and dips throughout the spectrum that strongly affect palm-mute weight, midrange character, pick attack, aggression, harshness, and fizz.

This is why two different speakers can make the **same amp settings** sound surprisingly different.

---

## 3. Celestion Vintage 30 and metal

One of the most famous speakers for modern heavy guitar is the **Celestion Vintage 30**, usually called the **V30**.

It is common in metal because it tends to provide strong midrange, aggressive upper mids, good note definition, controlled low end, and the ability to cut through dense mixes.

You'll encounter V30-loaded cabinets constantly when exploring metal IR libraries.

But **V30 does not mean every V30 IR sounds the same**. The cabinet, microphone, microphone position, individual speaker, recording room, preamp, and IR capture process all matter.

---

## 4. Cabinet size: 1×12, 2×12 and 4×12

```text
1×12 = 1 speaker × 12 inches
2×12 = 2 speakers × 12 inches
4×12 = 4 speakers × 12 inches
```

### 1×12

Usually compact, focused, convenient, and with less physical low-end impact in a room. Excellent for home use.

### 2×12

A useful compromise: bigger physical sound, portable, good low-end response, and a common live solution.

### 4×12

The classic metal cabinet. It often feels huge, powerful, deep, and physically impressive. A real 4×12 moves a lot of air.

---

## 5. A 4×12 IR doesn't behave like standing in front of a 4×12

When you're physically standing in front of a 4×12, you experience four speakers, the room, reflections, and a large physical sound field.

A close-mic IR instead represents something closer to one microphone capturing a small area of one speaker.

So loading a Mesa 4×12 IR into a modeler doesn't necessarily create the physical sensation of standing beside a Mesa 4×12. It creates the **mic'd cabinet sound** you'd send to a recording console or FOH.

That's exactly what we usually want for recording and direct live guitar.

---

## 6. What is an IR?

**IR = Impulse Response.**

An IR captures how a system responds to a short test signal. For guitar, it commonly captures the combined response of the speaker, cabinet, microphone, microphone position, and sometimes characteristics of the recording chain.

Conceptually:

```text
AMP MODEL
   ↓
raw distorted signal

        +

CAB IR
   ↓
captured cabinet/mic response

        =

MIC'D GUITAR TONE
```

This allows a digital rig to reproduce the frequency and time-domain behavior of a particular mic'd cabinet setup.

---

## 7. IR vs Cab Simulator

They accomplish similar jobs but aren't necessarily implemented the same way.

### Traditional IR loader

You load a fixed IR file, for example:

```text
Mesa 4×12
V30
SM57
Cap Edge
1 inch
```

That IR is essentially a **snapshot** of that setup. If you want another microphone position, you load another IR.

### Modern cab simulator

Modern modelers can provide a graphical virtual cabinet where you choose the cabinet, speaker, microphone, position, and distance.

Internally the device may interpolate between many captures or use another modeling technique. The advantage is that you can explore cabinet sounds much more intuitively.

---

## 8. Microphones are extremely important

When recording a real guitar cabinet, the final mix normally contains the sound captured by the microphone. Changing the microphone can dramatically change the guitar tone.

---

## 9. Shure SM57 — the metal standard

The **SM57** is probably the most famous guitar-cab microphone.

Its character tends toward aggressive, bright, focused, strong upper mids, and good attack. It works extremely well for metal.

If you don't know which mic to choose in a modeler, an **SM57-style dynamic mic is an excellent starting point**.

---

## 10. Ribbon microphones

A classic example is the **Royer R-121**.

Compared with an SM57, a ribbon mic often sounds darker, smoother, fuller, and less aggressive in the highs.

```text
SM57
→ bite
→ attack
→ aggression

R121
→ body
→ warmth
→ smoothness
```

This makes them excellent partners.

---

## 11. Blending microphones

A classic combination is **SM57 + R121**.

The SM57 provides attack, bite, and clarity. The ribbon contributes body, warmth, and weight.

But blending microphones introduces another issue: **phase**. If the two signals are not aligned properly, some frequencies can cancel. Modern modelers often make this easier, but when blending IR files you should still listen carefully for a tone that suddenly becomes thin or hollow.

---

## 12. Microphone position

This is one of the most important concepts in the entire lesson.

A guitar speaker has a central **dust cap** surrounded by the cone. Moving the microphone across the speaker radically changes the tone.

---

## 13. Mic at the center

A microphone toward the center usually produces more brightness, attack, presence, and aggression. But it can become harsh, fizzy, and piercing.

For high-gain metal, dead center is often too bright.

---

## 14. Moving toward the edge

As you move the microphone outward, the tone generally becomes darker and smoother.

```text
CENTER ─────────────→ EDGE

bright                 dark
aggressive             warm
sharp                   smooth
```

This gives you one of the most useful tone controls imaginable: **before reaching for EQ, try moving the virtual microphone**.

If your guitar sounds harsh around 3–5 kHz, moving the mic slightly outward may sound more natural than making a large EQ cut.

---

## 15. Cap edge — a great starting point

A very common position is around the boundary between the dust cap and cone. This often provides a useful balance of attack, brightness, body, and smoothness.

For modern metal, **SM57 around the cap edge** is an excellent starting point.

---

## 16. Mic distance

### Very close

Usually direct, focused, punchy, and tight. Excellent for metal rhythm.

### Further away

Introduces more room character, ambience, and natural complexity, but can reduce the immediate, tight character.

For modern high-gain rhythm guitar, close-mic sounds are extremely common.

---

## 17. Mic angle

### On-axis

Usually brighter, more direct, and more aggressive.

### Off-axis

Usually smoother, darker, and less harsh.

If your tone is almost correct but slightly too aggressive, changing the angle can sometimes solve the problem without EQ.

---

## 18. Why IR choice matters more than many EQ adjustments

Imagine your tone is too harsh. You could make several large EQ cuts, but maybe the actual problem is simply an SM57 placed dead center.

Move the mic from the center toward the cap edge and the tone may naturally become balanced.

A good principle is: **Fix the source before fixing the EQ.**

For modelers:

```text
AMP
↓
CAB / IR
↓
MIC POSITION
↓
THEN EQ
```

---

## 19. High-pass filtering

After choosing the cabinet, remove unnecessary low frequencies. A common metal starting point is approximately **70–90 Hz**.

This creates space for the bass guitar and kick drum.

Don't automatically use exactly 80 Hz. Move the cutoff upward until you hear the guitar starting to lose useful weight, then move slightly back.

---

## 20. Low-pass filtering

High-gain amps can generate unpleasant high-frequency fizz. A common starting point is approximately **6–8 kHz**.

This can remove fizz while keeping the chug, crunch, and pick attack.

Again, don't blindly use 6.5 kHz because somebody online told you to. Listen.

---

## 21. Don't cut too aggressively

If you use something like HPF at 120 Hz and LPF at 5 kHz, the result might be very controlled and clean but also very small.

Instead, start conservatively, for example HPF around 70–80 Hz and LPF around 8 kHz, then move inward while listening.

---

## 22. Single IR vs blended IR

### Single IR

Example: Mesa 4×12, V30, SM57, cap edge.

Advantages: simple, predictable, easy to EQ, and less phase complexity.

For learning, **start with one IR**.

### Blended IR

Example: SM57 70% + R121 30%.

Potential advantages include more body, more complexity, and smoother highs, but it introduces more variables.

Don't use two microphones simply because two sounds more professional. If one mic sounds great, use one.

---

## 23. Stereo cabinets don't automatically make rhythm guitars wider

You normally get huge metal rhythm guitars through **double tracking**:

```text
Guitar Take 1 → LEFT
Guitar Take 2 → RIGHT
```

Not by taking one guitar and putting it through a stereo cab.

Two separately performed takes contain tiny timing and articulation differences. Those differences create width.

For rhythm guitar, a strong mono amp/cab sound is completely normal before double tracking.

---

## 24. How to choose an IR without getting lost

IR packs may contain hundreds or thousands of files. Don't audition 700 IRs.

Use a systematic approach. Start with:

```text
Cab: 4×12 V30
Mic: SM57
Position: Cap edge
```

Find something approximately correct, then compare only a few variations such as bright, balanced, and dark. Pick the balanced one and continue building the tone.

---

## 25. Don't compare IRs at different loudness

Our ears tend to interpret **louder = better**.

If IR A is 2 dB louder than IR B, you may incorrectly decide that A has more punch, better clarity, and more detail.

Level-match them before making serious comparisons.

---

## 26. Practical metal cab starting point

```text
AMP
5150 / 6505 style

CAB
4×12 V30

MIC
SM57

POSITION
Cap edge

DISTANCE
Close

HPF
~75–85 Hz

LPF
~7–8 kHz
```

Then adjust based on what you hear.

If it's too harsh: move the mic outward, reduce Presence slightly, then consider EQ.

If it's too dark: move the mic toward center, then increase Presence slightly if necessary.

If it's too boomy: reduce Resonance, adjust the HPF, and check 100–250 Hz.

If it's too thin: reconsider the cab/mic position, lower the HPF, and check amp Bass/Resonance.

---

## 27. Practical exercise — hear what the cabinet does

Choose one high-gain amp. **Do not change the amp settings during the exercise.**

Use something approximately like:

```text
Gain       5
Bass       5
Mid        5
Treble     5
Presence   5
Resonance  5
```

Play the same riff every time.

### Exercise A — change cabinets

Try a 1×12, 2×12, 4×12 V30, and another 4×12. Ask: **What changed?**

Listen for low-end size, midrange, attack, harshness, and fizz. Don't ask which one is best yet. Learn to identify the differences.

### Exercise B — change microphones

Keep the same cabinet. Try an SM57, R121, and MD421. Write one or two adjectives for each.

For example:

```text
SM57
aggressive / focused

R121
dark / full

421
big / punchy
```

Your descriptions don't need to match anyone else's. You're training **your ears**.

### Exercise C — move the microphone

Use a 4×12 V30 with an SM57. Move gradually from center to cap, cap edge, cone, and edge.

Listen for the progression:

```text
BRIGHT
  ↓
AGGRESSIVE
  ↓
BALANCED
  ↓
WARM
  ↓
DARK
```

This is one of the most useful ear-training exercises for guitar tone.

---

## 28. Advanced exercise — EQ vs mic position

Find a deliberately harsh mic position, such as an SM57 near the center.

First try to repair it using EQ. Then reset the EQ and instead move the microphone toward the cone edge.

Compare the results.

Frequently you'll discover:

```text
GOOD SOURCE
+
SMALL EQ
```

sounds more natural than:

```text
BAD SOURCE
+
MASSIVE EQ
```

This is an extremely important mixing principle.

---

## 29. A practical troubleshooting map

### Too harsh

Mic position → Cab / IR → Presence / Treble → EQ

### Too boomy

Amp Bass / Resonance → Cab / IR → HPF → EQ

### Too dark

Mic position → Cab / IR → Treble / Presence → EQ

### Too fizzy

Cab / IR → Mic position → LPF → EQ

### Too thin

Cab / IR → Mic position → Bass / Resonance → HPF

Notice how often **Cab / IR / microphone** appears before EQ.

---

## 30. Metal cab cheat sheet

```text
CABINET
Major part of the final guitar voice

V30
Aggressive mids
Great metal starting point

SM57
Attack
Bite
Aggression

R121
Body
Warmth
Smooth highs

MD421
Punch
Body
Definition

MIC CENTER
Bright / aggressive / potentially harsh

MIC EDGE
Dark / warm / potentially dull

CAP EDGE
Excellent balanced starting point

CLOSE MIC
Tight / direct / focused

OFF-AXIS
Smoother / less harsh

HPF
Removes unnecessary lows
Start around 70–90 Hz

LPF
Controls high-frequency fizz
Start around 6–8 kHz

SINGLE IR
Simple and predictable

BLENDED IR
Potentially fuller but more complex
```

---

## The most important idea

When creating a metal tone, don't think:

```text
I HAVE A 5150
THEREFORE I HAVE A 5150 TONE
```

Think:

```text
GUITAR
   ↓
BOOST
   ↓
AMP
   ↓
CABINET
   ↓
SPEAKER
   ↓
MICROPHONE
   ↓
MIC POSITION
   ↓
EQ
   ↓
FINAL TONE
```

The amp creates the distortion and dynamic character. The **cabinet, speaker, and microphone give that distortion its final voice**.

So when your amp sounds close but something still feels wrong, don't immediately start moving Bass, Mid, Treble, and Presence.

Try the cabinet first. Then the microphone. Then the microphone position. **Then reach for EQ.**

## Homework

Take one high-gain amp and create **three versions without changing the amp settings**:

1. **Bright/aggressive** — SM57 closer to the center.
2. **Balanced metal rhythm** — SM57 around the cap edge.
3. **Dark/heavy** — move the mic farther toward the cone edge or try a ribbon mic.

Save all three.

Then play the **same riff** through each preset and describe each tone using three words.

The goal isn't to create the perfect preset. The goal is to hear **what the cabinet and microphone are doing to the amp**.

That skill will make choosing IRs—and building metal tones in general—much faster.
