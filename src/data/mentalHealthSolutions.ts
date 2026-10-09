export interface MentalProblemSolution {
  id: string;
  title: string;
  category: string;
  emoji: string;
  tagline: string;
  neuroscience: string;
  symptoms: string[];
  sosProtocol: {
    name: string;
    duration: string;
    steps: string[];
  };
  cognitiveRestructuring: {
    toxicBelief: string;
    clinicalReframe: string;
    evidenceQuestion: string;
  };
  lifestylePrescription: string[];
  clinicalRedFlags: string[];
}

export const MENTAL_PROBLEMS_SOLUTIONS: MentalProblemSolution[] = [
  {
    id: 'panic-anxiety',
    title: 'Acute Panic Attacks & Severe Anxiety Spikes',
    category: 'Acute Distress',
    emoji: '🌀',
    tagline: 'Defusing the amygdala alarm and rapid hyperventilation in under 90 seconds.',
    neuroscience:
      'A panic attack is a neurochemical false alarm. The amygdala misinterprets adrenaline for mortal peril, causing tachycardia, dizziness from carbon dioxide depletion, and depersonalization. Your body is trying to save your life—it is not dying.',
    symptoms: [
      'Pounding heart or racing pulse',
      'Shortness of breath or choking sensation',
      'Dizziness, lightheadedness, or tingling fingertips',
      'Sudden dread of losing control or passing out',
    ],
    sosProtocol: {
      name: 'The DBT T.I.P.P. Dive & Cold Vagal Reflex',
      duration: '90 Seconds',
      steps: [
        'Temperature: Submerge your face in a bowl of ice-cold water (or press an ice cube or cold can to your cheekbones and eyes) for 20 seconds while holding your breath. This triggers the mammalian dive reflex, instantaneously dropping heart rate by 15-25 bpm.',
        'Paced Breathing: Inhale through the nose for 4 seconds, exhale smoothly through pursed lips like cooling soup for 7 seconds. Long exhales stimulate acetylcholine release.',
        'Paired Muscle Release: Clench your fists tight as hard as you can for 5 seconds, then forcefully let go with an audible exhale.',
        'Grounding Mantra: Say aloud: “This is adrenaline, not danger. Adrenaline peaks in 3 minutes and metabolizes away.”',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“I am having a heart attack or going crazy right now.”',
      clinicalReframe:
        '“My heart is beating strongly because my sympathetic nervous system tested its fire alarm. No one has ever died from a panic attack; this wave will crest and recede.”',
      evidenceQuestion: 'Has this physiological sensation ever actually resulted in medical catastrophe in the past?',
    },
    lifestylePrescription: [
      'Eliminate caffeine or high-sugar energy drinks on high-stress days',
      'Daily 15-minute brisk aerobic walk to metabolize residual circulating cortisol',
      'Practice 20-minute daily diaphragm breathing to raise baseline carbon dioxide tolerance',
    ],
    clinicalRedFlags: [
      'Panic episodes lasting continuously over 30 minutes without abatement',
      'Unexplained chest pain radiating to left arm or jaw (always seek immediate medical evaluation)',
      'Severe avoidance of leaving home (Agoraphobia)',
    ],
  },
  {
    id: 'burnout-paralysis',
    title: 'Academic & Career Burnout / Executive Dysfunction',
    category: 'Performance & Work',
    emoji: '🎓',
    tagline: 'Breaking the vicious cycle of overwhelm, chronic fatigue, and task paralysis.',
    neuroscience:
      'Burnout is prefrontal cortex exhaustion. Prolonged cognitive overload depletes dopamine transporters in the striatum. Task paralysis is not “laziness”—it is dorsal vagal freeze when the nervous system perceives demands as hopelessly exceeding capacity.',
    symptoms: [
      'Profound morning dread before looking at your inbox or syllabus',
      'Executive dysfunction: staring at a blank screen unable to begin',
      'Cynicism, detachment, and feeling like an impostor',
      'Unrefreshing sleep and physical brain fog',
    ],
    sosProtocol: {
      name: 'The 2-Minute Micro-Action & Low-Friction Entry',
      duration: '2 Minutes',
      steps: [
        'Radical Task Shrinking: Break your project down until the next step is laughably tiny. Not “Write essay”, but “Open laptop and type one sentence—even a terrible one.”',
        'Physical Disconnection: Step away from your chair, do 10 gentle torso twists, and wash your hands in warm water to disrupt postural freeze.',
        'The 10-Minute Immunity Timer: Commit to working for only 10 minutes with permission to stop when the timer rings. In 85% of cases, breaking initial friction unlocks sustained momentum.',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“If I cannot do this perfectly and immediately, I am incompetent and falling behind.”',
      clinicalReframe:
        '“Perfectionism is fear wearing a disguise. Done is better than perfect, and my worth as a human being is completely independent of today’s output.”',
      evidenceQuestion: 'Would I hold a close friend to this brutal standard of uninterrupted performance?',
    },
    lifestylePrescription: [
      'Institute non-negotiable “Digital Sunset” 60 minutes before bedtime',
      'Work in strict 25-minute Pomodoro sprints followed by 5 minutes of true physical disengagement',
      'Take lunch away from computer screens without reading study material',
    ],
    clinicalRedFlags: [
      'Complete inability to fulfill basic self-care (bathing, eating, laundry) for over two weeks',
      'Persistent feelings of profound hopelessness or worthlessness',
    ],
  },
  {
    id: 'depressive-inertia',
    title: 'Depressive Inertia & Apathy (“Can’t Get Out of Bed”)',
    category: 'Mood & Energy',
    emoji: '🕳️',
    tagline: 'Neuro-behavioral activation when motivation and energy feel completely flat.',
    neuroscience:
      'Depression dampens dopamine reward signaling. The brain falsely tells you: “Wait until you feel motivated before you take action.” But neurobiology proves the reverse: action produces dopamine, which then generates motivation.',
    symptoms: [
      'Heavy limb sensation (“lead paralysis”) making rising feel impossible',
      'Anhedonia: things you usually love feel flat, gray, and pointless',
      'Overwhelming desire to stay curled in blankets with curtains drawn',
      'Intense self-blame and rumination about lost time',
    ],
    sosProtocol: {
      name: 'Opposite Action & The 10% Somatic Shift',
      duration: '3 Minutes',
      steps: [
        'Do Not Negotiate With Your Thoughts: Recognize that your depressed brain is a biased narrator right now. Do not wait for motivation.',
        'The 10% Movement: Just roll your legs to the edge of the mattress and touch the floor with your feet. Rest there for 30 seconds.',
        'Sensory Shock: Drink a full glass of cool water and open one window blind to let natural photons hit your retinas. Morning sunlight starts cortisol awakening rhythm.',
        'One Low-Stakes Win: Complete one trivial task (brushing teeth, making bed) to establish a baseline behavioral victory.',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“What is the point? Nothing will make me feel any better anyway.”',
      clinicalReframe:
        '“My brain’s reward circuitry is temporarily muted, but small physical movements still register in my nervous system. I do not have to feel happy to take one gentle step.”',
      evidenceQuestion: 'Has staying in bed all day ever genuinely relieved my emotional pain in the past?',
    },
    lifestylePrescription: [
      'Behavioral Activation: Schedule one small mastery activity and one pleasure activity daily',
      'Get 15 minutes of outdoor sunlight within 30 minutes of waking',
      'Walk briskly for 20 minutes even when feeling zero enthusiasm',
    ],
    clinicalRedFlags: [
      'Persistent severe low mood lasting longer than 14 consecutive days',
      'Active thoughts of self-harm or suicidal ideation (Immediately dial 14416 / 988)',
    ],
  },
  {
    id: 'rumination-insomnia',
    title: 'Intrusive Rumination & 3 AM Insomnia',
    category: 'Sleep & Night',
    emoji: '🛑',
    tagline: 'Quieting Default Mode Network hyper-connectivity and racing bedtime thoughts.',
    neuroscience:
      'At night, with environmental sensory inputs removed, the brain’s Default Mode Network (DMN) goes into overdrive. Cortisol levels elevate if you stay in bed tossing and turning, conditioning your brain to associate the mattress with frustration.',
    symptoms: [
      'Staring at the ceiling with racing replays of past embarrassing conversations',
      'Anticipatory anxiety: calculating how many hours of sleep are left',
      'Clenched jaw, restless legs, and heightened hearing sensitivity',
      'Heart fluttering when looking at the bedroom clock',
    ],
    sosProtocol: {
      name: 'Paradoxical Intention & The 20-Minute Bed Rule',
      duration: '10 Minutes',
      steps: [
        'The 20-Minute Rule: If awake for more than 20 minutes, get out of bed immediately. Go to a dimly lit chair in another room.',
        'Externalized Brain Dump: Grab a physical notebook and pen. Write down every single circling worry without formatting until your mind feels emptied onto the paper.',
        'Paradoxical Intention: Lie back down and tell yourself: “I am not trying to sleep. I am simply giving my body restful horizontal relaxation with my eyes gently open in the dark.” Removing sleep effort removes the performance anxiety that prevents sleep.',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“If I do not sleep 8 hours tonight, tomorrow will be a total disaster.”',
      clinicalReframe:
        '“Human bodies are resilient. Even resting quietly with closed eyes provides 70% of the physical restorative value of sleep. I have functioned successfully on low sleep before.”',
      evidenceQuestion: 'Did catastrophizing about tomorrow ever help someone fall asleep faster?',
    },
    lifestylePrescription: [
      'Zero screens 60 minutes before bedtime (turn off notifications and charge phone outside bedroom)',
      'Keep bedroom temperature cool (around 19°C / 66°F)',
      'Wake up at the identical time seven days a week, regardless of when you fell asleep',
    ],
    clinicalRedFlags: [
      'Chronic severe insomnia lasting over 3 months causing severe daytime impairment',
      'Sleep apnea (choking/gasping for air during sleep)',
    ],
  },
  {
    id: 'digital-envy',
    title: 'Digital Comparison, Social Media Envy & Doomscrolling',
    category: 'Modern Digital Life',
    emoji: '📱',
    tagline: 'Reclaiming attention sovereignty from algorithmic slot machines and status anxiety.',
    neuroscience:
      'Social media feeds exploit evolutionary status anxiety. Observing peers’ highlight reels triggers the dorsal anterior cingulate cortex (dACC)—the identical brain region that registers physical burns and fractures. Endless scrolling provides variable micro-dopamine hits without fulfillment.',
    symptoms: [
      'Losing 2+ hours lost in short-form video reels or photo feeds without conscious memory',
      'Creeping sensations of inadequacy, FOMO, and unworthiness after opening apps',
      'Compulsive phone checking during every micro-pause (elevators, red lights, walking)',
      'Phantom phone vibration sensations in your pocket',
    ],
    sosProtocol: {
      name: 'The Friction Protocol & 20-Foot Gaze Divert',
      duration: '60 Seconds',
      steps: [
        'Screen Grayscale: Turn your phone display to black-and-white (grayscale mode in Accessibility settings). Stripping saturated red and neon colors removes 80% of algorithmic dopamine hook.',
        '20-Foot Horizon Gaze: Look out of a window at the furthest distant horizon for 30 seconds. Expanding panoramic vision relaxes optic nerves and shuts down focal stress tunnels.',
        'Physical Distance: Place your phone in a drawer or backpack across the room.',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“Everyone my age is achieving massive milestones while I am falling behind.”',
      clinicalReframe:
        '“I am comparing my messy, authentic behind-the-scenes reality with someone else’s heavily edited, curated public marketing campaign.”',
      evidenceQuestion: 'Do social media algorithms prioritize truthful mental health, or attention capture for ad revenue?',
    },
    lifestylePrescription: [
      'Delete social feed apps from your phone during study/work weeks; access only via desktop browser',
      'Designate all meals and bathroom breaks as phone-free sanctuary zones',
      'Engage in 1 tangible tactile analog hobby (sketching, gardening, cooking, instrument)',
    ],
    clinicalRedFlags: [
      'Inability to stop compulsive device use even when severely compromising sleep or studies',
    ],
  },
  {
    id: 'social-anxiety',
    title: 'Social Anxiety & Rejection Sensitivity Dysphoria (RSD)',
    category: 'Relational Health',
    emoji: '💔',
    tagline: 'Untangling hyper-vigilance, post-event rumination, and fear of judgment.',
    neuroscience:
      'In ancestral tribes, social exile was a death sentence. Social anxiety is an overactive tribal safety mechanism that treats a classroom presentation or party silence as an existential threat. The spotlight effect causes us to believe everyone is scrutinizing us 10x more than they actually are.',
    symptoms: [
      'Heart racing and dry mouth before speaking in front of peers',
      'Post-Event Rumination: re-analyzing conversations for hours looking for mistakes',
      'Assuming brief text replies mean someone is secretely angry with you',
      'Sweaty palms and intense self-consciousness walking into crowded rooms',
    ],
    sosProtocol: {
      name: 'The Spotlight Shift & External Attention Anchoring',
      duration: '2 Minutes',
      steps: [
        'Shift Spotlight Outward: Social anxiety focuses 95% of attention inward on your sensations (heartbeat, voice tremble). Deliberately shift your attention 100% onto the room: What color is the wall? What shoes is someone wearing? What is the speaker saying?',
        'The 10-Second Compassion Pause: Put a warm palm over your chest and whisper: “It is normal to feel nervous. Other people in this room feel awkward too.”',
        'Drop the Safety Behaviors: Stop rehearsing your next sentence in your head; listen naturally.',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“Everyone saw that I was awkward, and now they think less of me.”',
      clinicalReframe:
        '“People are not thinking about me—they are busy worrying about what other people think of them. Even if I felt awkward, vulnerability builds human connection.”',
      evidenceQuestion: 'Can I remember an awkward sentence someone else said three days ago? No, because people forget almost immediately.',
    },
    lifestylePrescription: [
      'Practice micro-exposures: say “Good morning” to one barista or peer daily without expectations',
      'Send one warm message of encouragement to someone you admire',
      'Join low-pressure interest groups or sports clubs centered on activity rather than performance',
    ],
    clinicalRedFlags: [
      'Severe social withdrawal leading to complete inability to attend classes or work',
      'Relying on alcohol or drugs to socialize',
    ],
  },
  {
    id: 'anger-dysregulation',
    title: 'Chronic Anger, Irritability & Vagal Reactivity',
    category: 'Emotional Balance',
    emoji: '💥',
    tagline: 'Halting explosive fight-flight reactions and mastering the 90-second chemical surge.',
    neuroscience:
      'According to Harvard neuroscientist Dr. Jill Bolte Taylor, an anger surge lasts only 90 seconds from initial trigger to metabolic clearance. If anger persists longer than 90 seconds, it is because cognitive thoughts (“How dare they! This is unfair!”) are actively restoking the adrenaline furnace.',
    symptoms: [
      'Sudden boiling rage over minor friction (dropped pen, slow internet, traffic)',
      'Clenched fists, jaw tightness, and heat flushing across face and neck',
      'Urge to send an impulsive fiery text or slam objects',
      'Lingering sour irritability poisoning the entire day',
    ],
    sosProtocol: {
      name: 'The 90-Second Wash & Primary Emotion Excavation',
      duration: '90 Seconds',
      steps: [
        'The 90-Second Freeze Rule: Put your phone down and close your mouth. Do not speak or type a single word for 90 seconds while the adrenaline clears your liver.',
        'Cold Wrist Rinse: Walk to the sink and run cold water over your inner wrists for 30 seconds.',
        'Identify the Primary Vulnerability: Anger is almost always a secondary bodyguard emotion. Ask yourself: “What am I really feeling beneath this anger? Am I exhausted? Am I hurt? Am I scared? Did someone cross a boundary?”',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“They did this intentionally to disrespect me, and I must retaliate immediately.”',
      clinicalReframe:
        '“Hanlon’s Razor: Never attribute to malice that which is adequately explained by thoughtlessness or stress. Their behavior reflects their own chaotic inner state, not my value.”',
      evidenceQuestion: 'Has sending an angry text ever improved a situation in the long run?',
    },
    lifestylePrescription: [
      'Cardiovascular outlet: Run, lift weights, or cycle to discharge fight-or-flight energy safely',
      'Check HALT status when irritable: Am I Hungry, Angry, Lonely, or Tired?',
      'Establish clear, firm verbal boundaries early before resentment accumulates',
    ],
    clinicalRedFlags: [
      'Physical aggression or violence toward self, others, or property',
      'Blackout rage episodes with memory gaps',
    ],
  },
  {
    id: 'grief-heartbreak',
    title: 'Grief, Emotional Heartbreak & Major Transitions',
    category: 'Grief & Healing',
    emoji: '🌪️',
    tagline: 'Navigating devastating loss and emotional waves with compassionate neuroplasticity.',
    neuroscience:
      'Grief is not a mental disorder; it is the price of deep human bonding. The brain has physical neural maps of attachment figures. When someone is gone, the brain continues seeking them, producing visceral pain similar to withdrawal. Healing requires rebuilding new neural pathways over time.',
    symptoms: [
      'Sudden debilitating grief bursts triggered by a song, scent, or memory',
      'Heavy physical ache in the center of the chest',
      'Disorientation about identity (“Who am I without this person or role?”)',
      'Alternating between numbness and intense weeping',
    ],
    sosProtocol: {
      name: 'Wave Surfing & The Self-Compassion Hold',
      duration: '3 Minutes',
      steps: [
        'Do Not Suppress the Tear Surge: Weeping releases cortisol and prolactin in tears. Allow the wave to roll over you for 2 to 3 minutes without telling yourself you are weak.',
        'The Dual Palm Hold: Place your right hand over your heart and left hand over your abdomen. Feel the physical warmth of your own hands.',
        'Befriend the Grief: Say silently: “This pain exists because there was immense love and caring. I honor this feeling without letting it drown me.”',
      ],
    },
    cognitiveRestructuring: {
      toxicBelief: '“I will never recover from this loss. My life is permanently ruined.”',
      clinicalReframe:
        '“Grief does not shrink over time; rather, my life and capacity to hold joy will gradually expand around it. I am in the acute storm right now, and surviving day by day is enough.”',
      evidenceQuestion: 'Can I grant myself the same gentle patience I would give a grieving child?',
    },
    lifestylePrescription: [
      'The Dual Process Model: Spend time grieving, but also deliberately give yourself permission to laugh or focus on everyday tasks without guilt',
      'Connect with 1 trusted friend and talk honestly about the person or chapter you miss',
      'Maintain regular meals and gentle physical movement even when appetite is minimal',
    ],
    clinicalRedFlags: [
      'Persistent inability to function or care for self lasting longer than 6 months without gradual improvement',
      'Profound suicidal ideation or wishing not to wake up',
    ],
  },
];
