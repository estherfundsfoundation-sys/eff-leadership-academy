import fs from 'node:fs';

const file = new URL('./data/courses.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const quiz = (question, correct, other1, other2) => [{
  id: `ecosystem-${question.slice(0, 22).replace(/[^a-z0-9]/gi, '')}`,
  type: 'Quiz',
  questions: [{ question, question_type: 'single', answers: [correct, other1, other2], correct_answers: [correct], graded: true }]
}];
const lesson = (id, title, sectionId, position, markdown, question, correct, other1, other2) => ({
  id, title, sectionId, position, markdown, quizzes: quiz(question, correct, other1, other2), activities: ['open_response_question'], assets: []
});

const course = {
  id: 'eff-ecosystem-board-excellence',
  title: 'EFF Ecosystem & Board Excellence',
  description: 'A required practical pathway for leaders who need to confidently use every major EFF resource, guide students to the right support, run organized board meetings, and respond to conflict with care and accountability.',
  published: true,
  image: 'assets/academy-visual-board.png',
  modules: [
    { id: 'ecosystem-map', title: 'Module 1 — The EFF Ecosystem', position: 1 },
    { id: 'chapter-hub', title: 'Module 2 — Mastering the Chapter Hub', position: 2 },
    { id: 'board-excellence', title: 'Module 3 — Board Meetings, Communication & Conflict', position: 3 }
  ],
  lessons: [
    lesson('eco-01', 'Welcome: You Are a Resource Guide', 'ecosystem-map', 1,
`# Welcome: You Are a Resource Guide

EFF leaders do more than host events. You are often the first person a student trusts when they need help staying enrolled, finding community, asking for prayer, or getting connected to an opportunity.

This pathway teaches you how to navigate the full EFF ecosystem with confidence. Your job is not to promise every answer. Your job is to listen carefully, protect privacy, and make the right next connection.

Before you continue, open the official [EFF website](https://estherfundsfoundation.org/) in a new tab. Notice the programs, REACH Action Hub, EFF Chapter Hub, ministry, and Pretty Girls Who Serve links.`,
'What is an EFF leader’s first responsibility when a student needs help?', 'Listen, protect privacy, and connect them to an appropriate next step', 'Promise that EFF can solve every problem immediately', 'Send every student to the same resource without asking questions'),
    lesson('eco-02', 'The EFF Website: Know the Front Door', 'ecosystem-map', 2,
`# The EFF Website: Know the Front Door

The official EFF website is the home base for our mission, public programs, national resources, and the stories that show students they are not alone. Learn where each major experience begins so you can give students a clear link instead of vague directions.

Use the website when someone asks: “What is EFF?”, “How do I get involved?”, “Where can I find support?”, or “How does my campus start a chapter?”

**Practice:** Write a two-sentence message you could send to a new student introducing EFF and naming one page they should visit first.`,
'Which page should be your starting point when explaining EFF publicly?', 'The official Esther Funds Foundation website', 'A personal social-media post', 'An unofficial screenshot from a group chat'),
    lesson('eco-03', 'REACH: Match the Need to a Pathway', 'ecosystem-map', 3,
`# REACH: Match the Need to a Pathway

REACH helps students take action before challenges become reasons to leave school. Leaders should know the seven pathways:

- [Reach for Yourself](https://estherfundsfoundation.org/reach-yourself): personal support, scholarships, emergency aid, food, housing, hygiene, academic and mental-health resources.
- [Reach for a Friend](https://estherfundsfoundation.org/reach-a-friend): listen, encourage, connect, and follow up.
- [Reach Your Campus](https://estherfundsfoundation.org/reach-your-campus-1): host workshops, scholarship search parties, resource drives, and campus events.
- [Reach Your Community](https://estherfundsfoundation.org/reach-your-community): student-run projects and service.
- [Reach Beyond Your Campus](https://estherfundsfoundation.org/beyond-your-campus): advocacy, partnerships, chapters, and ambassadors.
- [Reach K-12](https://estherfundsfoundation.org/reach-k-12): mentoring, readiness workshops, tutoring, and family support.
- [Reach for Professionals](https://estherfundsfoundation.org/reach-for-professionals): mentors, sponsors, internships, and advisory support.

**Scenario:** A student says her groceries are running out and she is thinking about leaving campus. Explain what you would say first, and which pathway you would open with her.`,
'Which REACH pathway is built for a student seeking direct support for herself?', 'Reach for Yourself', 'Reach Your Campus', 'Reach for Professionals'),
    lesson('eco-04', 'REACH Action Hub: Turn Concern into Action', 'ecosystem-map', 4,
`# REACH Action Hub: Turn Concern into Action

The [REACH Action Hub](https://estherfundsfoundation.org/reach-action-hub) is where a concern turns into a practical action plan. Use it when your chapter needs to decide how to support a student, plan a campus activation, or connect a friend without trying to carry the whole situation alone.

Leaders should follow up after referring someone. A follow-up can be as simple as: “I am thinking of you. Were you able to open the resource? What would be helpful as your next step?”

Do not collect personal crisis details in a public group chat or promise confidentiality you cannot keep. In an immediate emergency, contact 911; for a mental-health crisis in the U.S., call or text 988.`,
'What should an EFF leader do after sharing a REACH resource?', 'Follow up respectfully and ask what next support would help', 'Assume the link fixed everything', 'Post the student’s situation publicly so others can advise'),
    lesson('eco-05', 'Esther’s Light: Ministry with Care', 'ecosystem-map', 5,
`# Esther’s Light: Ministry with Care

[Esther’s Light](https://esthers-light.vercel.app/) is a faith-centered place for reflection, Scripture, prayer, Bible plans, and encouragement. It can support a leader’s personal walk and help a chapter create spiritually grounded moments.

Ministry is not pressure. Invite students; do not shame them. Keep Scripture, personal reflection, and practical help distinct. Prayer can accompany a referral, but it is not a substitute for healthcare, counseling, emergency services, or campus support.

**Practice:** Draft a short invitation to a Bible study that is warm, optional, and welcoming to a student who is under stress.`,
'What is the healthiest way to offer a ministry resource?', 'Offer it as an invitation while respecting the student’s choice and practical needs', 'Use it to pressure every student to disclose personal struggles', 'Treat prayer as a replacement for urgent professional support'),
    lesson('eco-06', 'Pretty Girls Who Serve: Sisterhood with Purpose', 'ecosystem-map', 6,
`# Pretty Girls Who Serve: Sisterhood with Purpose

[Pretty Girls Who Serve](https://pretty-girls-who-serve.vercel.app/) is an EFF sisterhood branch focused on faith, service, confidence, leadership, and becoming women of purpose. Leaders should understand when it is the right invitation for someone seeking a women-centered community, mentorship, ministry, chapter connection, or self-esteem support.

Never use beauty language to exclude or rank people. The heart of this experience is dignity, service, confidence, and growth.

**Practice:** Compare a REACH referral and a PGWS invitation. Write one sentence explaining when you would use each.`,
'What should be at the center of a PGWS invitation?', 'Dignity, sisterhood, service, confidence, and purposeful growth', 'Competition over who looks best', 'Pressure to join before learning about the community'),
    lesson('eco-07', 'The Member Experience: Belonging Beyond One Event', 'ecosystem-map', 7,
`# The Member Experience: Belonging Beyond One Event

The [EFF Membership Hub](https://eff-membership-hub.vercel.app/) helps members continue their journey through national membership, the Esther Experience, service tracking, fundraising participation, scholarships, mentoring, community, and recognition.

Use the Membership Hub when a student asks what happens after joining, how to document service, how to stay engaged between meetings, or where to find national opportunities. It is not enough to recruit members—leaders must make the next step clear.

**Practice:** Create a first-week welcome checklist for a new member. Include one relationship-building action, one learning action, and one service action.`,
'What turns recruitment into retention?', 'A clear and caring next-step experience after someone joins', 'Only contacting members when you need volunteers', 'Giving members no place to grow after the first event'),
    lesson('eco-08', 'Chapter Hub: Start with Governance', 'chapter-hub', 1,
`# Chapter Hub: Start with Governance

The [EFF Chapter Resource Hub](https://estherfundsfoundation.org/eff-chapter-resources) is the operational home for chapters. Start with **Governance**: the National Bylaws, Chapter Constitution, Code of Conduct, Chapter Agreement, and expectations each chapter agrees to uphold.

These documents do not exist to make leadership difficult. They protect students, clarify authority, and create consistency across the national movement. Read them before building policies of your own.

**Practice:** Name one decision your board should never make without first checking the governing documents. Explain why.`,
'Which resources establish the foundation every EFF chapter is expected to uphold?', 'Bylaws, constitution, code of conduct, chapter agreement, and expectations', 'Only social-media templates', 'Only last year’s event flyers'),
    lesson('eco-09', 'Chapter Hub: Operations, Forms & Financial Order', 'chapter-hub', 2,
`# Chapter Hub: Operations, Forms & Financial Order

The **Operations & Forms** section of the Chapter Hub is your repeat-use toolbox: meeting agendas and minutes, financial tracking, event planning, officer applications and transitions, and recurring request forms.

Strong chapters document decisions while they are fresh. The secretary protects the record; the treasurer protects the financial trail; the president protects follow-through. Use the official forms rather than keeping critical information scattered across personal notes and chats.

**Practice:** Write the three documents you would prepare before a chapter event involving money.`,
'Why should chapters use the official operations forms?', 'They keep decisions, responsibilities, and financial records organized and consistent', 'They make meetings longer without a purpose', 'They remove the need for any board communication'),
    lesson('eco-10', 'Chapter Hub: Programming, Branding & Training', 'chapter-hub', 3,
`# Chapter Hub: Programming, Branding & Training

The Chapter Hub includes ready-to-use programming toolkits for tabling, fundraising, icebreakers, REACH Week, and campus programming. It also includes official brand guidance, social-media materials, templates, and leadership training.

Start with the mission and the student need—not the flyer. Then choose an official toolkit, create a simple plan, assign owners, and represent the EFF name with care.

**Practice:** Choose one student need on your campus. Write a three-part event concept: purpose, activity, and follow-up.`,
'What should come before designing an event flyer?', 'Identifying the student need and selecting the right mission-aligned toolkit', 'Posting a graphic before a plan exists', 'Choosing a theme with no student purpose'),
    lesson('eco-11', 'Chapter Hub: Compliance, Recruitment & Service', 'chapter-hub', 4,
`# Chapter Hub: Compliance, Recruitment & Service

The Chapter Hub connects you to semesterly compliance reporting, the good-standing checklist, advisor guidance, membership and recruitment materials, the Esther Experience, and community-service resources.

Compliance is not punishment. It is how national EFF knows a chapter is supported, active, accountable, and eligible for access to resources. Recruitment is not a one-day rush; it is a process of welcome, induction, training, and care.

**Practice:** Make a mini calendar with one compliance deadline, one recruitment moment, and one service action your board should track this semester.`,
'What is the purpose of compliance reporting?', 'To help chapters remain supported, accountable, and in good standing', 'To replace all chapter programming', 'To rank students by popularity'),
    lesson('eco-12', 'How to Run a Board Meeting that Moves Work Forward', 'board-excellence', 1,
`# How to Run a Board Meeting that Moves Work Forward

A strong board meeting has a written agenda, a clear facilitator, a timekeeper, notes, decisions, owners, and deadlines. The goal is not to talk the longest. The goal is to leave with work that can actually be completed.

**Simple meeting flow:** opening and purpose; review of previous action items; financial and program updates; decisions; upcoming dates; assignments; closing and follow-up.

Send the agenda early. Keep minutes during the meeting. End by reading each action item out loud: who owns it, what they will do, and by when.

**Practice:** Draft a 30-minute agenda for your next board meeting with at least four timed sections.`,
'What must every actionable board decision include?', 'An owner and a deadline', 'Only a general group agreement', 'A promise to remember it later'),
    lesson('eco-13', 'Board Communication: Decisions, Documentation & Accountability', 'board-excellence', 2,
`# Board Communication: Decisions, Documentation & Accountability

Healthy boards communicate in ways people can find later. Put final decisions, deadlines, meeting minutes, and approved files in the chapter’s agreed workspace. Do not rely on disappearing messages for important records.

Clarify the difference between brainstorming and a decision. A vote, officer authority, or national guidance may be required depending on the issue. When you are unsure, pause and check the bylaws or ask National EFF—not a public group chat.

**Practice:** Turn this vague message into an accountable action item: “Someone should work on the event soon.”`,
'Which message is an accountable action item?', 'Jordan will finalize the event room request by Friday at 5 p.m.', 'We should probably do the room request eventually', 'Everybody needs to figure it out'),
    lesson('eco-14', 'Conflict Resolution: Address It Early, Respectfully & Privately', 'board-excellence', 3,
`# Conflict Resolution: Address It Early, Respectfully & Privately

Conflict is normal; disrespect, avoidance, gossip, and public humiliation are not. Begin privately and directly when it is safe to do so. Describe the specific behavior, explain the impact, listen without interrupting, identify a shared next step, and document agreements when the issue affects chapter work.

Use the [EFF conflict-resolution resource](https://estherfundsfoundation.org/conflict-resolution) and Code of Conduct. Involve an advisor or National EFF when the issue is serious, ongoing, involves safety, harassment, discrimination, finances, or a conflict of interest. Do not investigate serious allegations alone.

**Practice:** Write a calm opening sentence for a private conversation with a board member who has missed two agreed deadlines.`,
'What is the best first step for a manageable board conflict?', 'Address the specific issue respectfully and privately when it is safe', 'Post about it in the chapter group chat', 'Ignore it until it becomes a larger problem'),
    lesson('eco-15', 'Board Excellence Capstone: Build Your Campus Resource Plan', 'board-excellence', 4,
`# Board Excellence Capstone: Build Your Campus Resource Plan

You now know the EFF ecosystem, the Chapter Hub, and the practices that make a board trustworthy. Complete this capstone as if your board were preparing for the next 30 days.

In your submission, include:

1. One student-support need and the EFF resource you would use.
2. One REACH action your chapter will take.
3. One Chapter Hub tool your board will use this month.
4. A date for your next board meeting, with an agenda owner.
5. One respectful step your board will take to prevent or address conflict.

This is a working leadership plan—not a perfect document. Keep it, bring it to your board, and update it as you lead.`,
'What does the capstone prove?', 'You can turn EFF resources into a clear, accountable campus action plan', 'You memorized a list of links without applying them', 'You can complete a lesson without making decisions')
  ]
};

data.courses = data.courses.filter((item) => item.id !== course.id);
data.courses.push(course);
data.generatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log(`Added ${course.title}: ${course.lessons.length} lessons.`);
