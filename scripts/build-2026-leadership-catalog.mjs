import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = JSON.parse(await fs.readFile(path.join(root, 'data', 'courses.json'), 'utf8'));

const curriculum = [
  {
    id: 'eff-2026-governance-fiduciary-duty',
    title: 'National Governance & Fiduciary Duty',
    category: '2026 Leadership Core', audience: 'Presidents, advisors, national and regional leaders', duration: '75 minutes',
    purpose: 'Lead within EFF authority, protect the mission, and make documented decisions with care.',
    concepts: ['the duty of care, loyalty, and obedience', 'the difference between national, chapter, advisor, and campus authority', 'conflicts of interest and recusal', 'minutes, approvals, and a defensible decision record'],
    scenario: 'A sponsor offers money but asks the chapter to promote a product that conflicts with EFF values. The president wants to accept before Nationals reviews the terms.',
    tool: 'one-page decision and escalation memo',
    right: 'Pause the commitment, document the offer and conflict, and send it through the authorized review path',
    wrong: ['Accept it because the chapter needs funds', 'Let one officer decide without a record']
  },
  {
    id: 'eff-2026-president-certification',
    title: 'Chapter President Certification',
    category: '2026 Leadership Core', audience: 'Chapter presidents and founders', duration: '90 minutes',
    purpose: 'Turn mission into a disciplined semester plan while leading people with clarity, accountability, and care.',
    concepts: ['the president’s weekly operating rhythm', 'delegation with owners and deadlines', 'executive-board accountability conversations', 'semester scorecards, succession, and officer continuity'],
    scenario: 'Two officers repeatedly miss deadlines, while the president quietly completes their work and begins to burn out.',
    tool: '30-60-90 day presidential operating plan',
    right: 'Reset expectations privately, assign clear owners and dates, document support, and escalate repeated nonperformance',
    wrong: ['Keep doing every task alone', 'Criticize the officers in the chapter group chat']
  },
  {
    id: 'eff-2026-treasurer-financial-stewardship',
    title: 'Treasurer & Financial Stewardship Certification',
    category: '2026 Leadership Core', audience: 'Treasurers, presidents, advisors, and finance reviewers', duration: '95 minutes',
    purpose: 'Protect chapter funds through budgets, approvals, receipts, reconciliation, and transparent reporting.',
    concepts: ['budgeting by approved program purpose', 'pre-approval, purchasing, reimbursement, and receipt controls', 'restricted versus unrestricted money', 'monthly reconciliation, exception review, and officer transition'],
    scenario: 'A member paid for an unapproved event purchase with a personal card and requests immediate reimbursement without an itemized receipt.',
    tool: 'monthly finance packet with budget-to-actual review',
    right: 'Follow the written reimbursement exception process and do not bypass documentation or approval controls',
    wrong: ['Reimburse from cash to avoid delay', 'Create a receipt after the fact']
  },
  {
    id: 'eff-2026-secretary-records-compliance',
    title: 'Secretary, Records & Chapter Compliance',
    category: '2026 Leadership Core', audience: 'Secretaries, presidents, compliance chairs, and advisors', duration: '70 minutes',
    purpose: 'Create accurate records that preserve decisions, protect members, and keep the chapter in good standing.',
    concepts: ['agenda and minutes standards', 'attendance, motions, votes, and action logs', 'secure records and retention', 'semester reporting and a compliance calendar'],
    scenario: 'A disputed spending decision was discussed verbally, but the minutes do not show a motion, vote, or approval.',
    tool: 'meeting record and compliance calendar packet',
    right: 'Record what is verifiable, flag the missing approval, and route the matter for proper review',
    wrong: ['Rewrite the minutes to imply approval', 'Delete the incomplete record']
  },
  {
    id: 'eff-2026-student-safety-privacy',
    title: 'Student Safety, Privacy & Crisis Escalation',
    category: '2026 Leadership Core', audience: 'All chapter and program leaders', duration: '100 minutes',
    purpose: 'Respond to sensitive concerns without investigating beyond role, promising secrecy, or delaying urgent help.',
    concepts: ['privacy, consent, and minimum-necessary information', 'urgent danger versus routine support', 'supportive listening without acting as a counselor', 'incident documentation and authorized escalation'],
    scenario: 'A student tells an officer she may be unsafe tonight and asks the officer to promise not to tell anyone.',
    tool: 'safety response and escalation checklist',
    right: 'Explain the limit of confidentiality, stay supportive, and connect the student to immediate authorized help',
    wrong: ['Promise complete secrecy', 'Investigate the situation alone before telling anyone']
  },
  {
    id: 'eff-2026-program-design-impact',
    title: 'Program Design & Impact Measurement',
    category: '2026 Leadership Core', audience: 'Program chairs, presidents, service chairs, and impact teams', duration: '85 minutes',
    purpose: 'Build mission-aligned programs with a real student outcome—not activity for activity’s sake.',
    concepts: ['needs statements and target participants', 'outcomes, outputs, and indicators', 'accessible program design and risk planning', 'feedback, evidence, and an honest impact story'],
    scenario: 'A chapter reports an event as successful because 80 people attended, but it collected no evidence that students received the intended benefit.',
    tool: 'program logic model and after-action report',
    right: 'Define the intended change, collect proportionate evidence, and report both reach and results',
    wrong: ['Treat attendance as proof of impact', 'Only collect flattering comments']
  },
  {
    id: 'eff-2026-financial-assistance-case-management',
    title: 'Financial Assistance Case Management',
    category: '2026 Leadership Core', audience: 'Help-desk staff, student-support leaders, reviewers, and program managers', duration: '110 minutes',
    purpose: 'Support students with dignity through consistent intake, verification, referrals, decisions, and follow-up.',
    concepts: ['trauma-aware intake and informed consent', 'eligibility evidence and equitable triage', 'warm referrals and case notes', 'decision notices, appeals, privacy, and closure'],
    scenario: 'Two students have urgent requests, but funds can cover only one. One student is personally known by a reviewer.',
    tool: 'case plan, referral log, and documented decision rubric',
    right: 'Use the approved criteria, disclose the conflict, recuse when required, and document the decision',
    wrong: ['Prioritize the student the reviewer knows', 'Share both cases in a volunteer group chat']
  },
  {
    id: 'eff-2026-fundraising-sponsors',
    title: 'Fundraising, Sponsors & Ethical Partnerships',
    category: '2026 Leadership Core', audience: 'Fundraising chairs, presidents, partnership teams, and national staff', duration: '95 minutes',
    purpose: 'Raise support with accurate claims, appropriate approvals, donor care, and mission-aligned partnerships.',
    concepts: ['case-for-support and specific funding needs', 'sponsor qualification and outreach', 'gift restrictions, benefits, and written agreements', 'donor stewardship and truthful tax language'],
    scenario: 'A chapter wants to advertise every campaign payment as tax-deductible before confirming the receiving entity and purpose.',
    tool: 'sponsor pipeline and gift-acceptance checklist',
    right: 'Use only approved donation language and verify the receiving entity, restriction, and acknowledgment process',
    wrong: ['Promise deductibility to increase conversions', 'Route funds through a personal payment account']
  },
  {
    id: 'eff-2026-brand-communications',
    title: 'Brand, Communications & Social Media Leadership',
    category: '2026 Leadership Core', audience: 'Communications chairs, social-media teams, presidents, and spokespersons', duration: '80 minutes',
    purpose: 'Represent EFF consistently while protecting student dignity, privacy, and organizational credibility.',
    concepts: ['brand hierarchy and approved visual identity', 'consent for stories, images, and testimonials', 'accessible content and editorial review', 'comments, complaints, corrections, and media escalation'],
    scenario: 'A volunteer posts a student’s hardship story and photo without documented permission because the story may attract donations.',
    tool: '30-day editorial calendar and content approval checklist',
    right: 'Remove or pause the content, protect the student, verify consent, and follow the correction process',
    wrong: ['Keep it live because engagement is high', 'Ask followers whether it should stay up']
  },
  {
    id: 'eff-2026-conflict-restorative-leadership',
    title: 'Conflict Resolution & Restorative Leadership',
    category: '2026 Leadership Core', audience: 'All officers, advisors, and people leaders', duration: '90 minutes',
    purpose: 'Address conflict early, fairly, privately, and without retaliation or public humiliation.',
    concepts: ['facts, impact, assumptions, and interests', 'private conversation and neutral facilitation', 'conduct concerns versus ordinary disagreement', 'written agreements, follow-up, and anti-retaliation'],
    scenario: 'Two officers trade accusations in GroupMe, and members begin choosing sides before either officer has been heard privately.',
    tool: 'conflict preparation worksheet and written resolution plan',
    right: 'Pause public debate, preserve relevant facts, meet through the proper pathway, and document agreed next steps',
    wrong: ['Hold a public vote on who is right', 'Remove an officer without process']
  },
  {
    id: 'eff-2026-volunteer-service-operations',
    title: 'Volunteer Management & Service Operations',
    category: '2026 Leadership Core', audience: 'Service chairs, volunteer coordinators, event leads, and chapter officers', duration: '80 minutes',
    purpose: 'Deliver safe, organized service through clear roles, preparation, supervision, documentation, and follow-up.',
    concepts: ['partner scope and service agreements', 'volunteer role descriptions and orientation', 'accessibility, safety, and incident readiness', 'hours verification, appreciation, and after-action review'],
    scenario: 'A community partner changes volunteer duties on arrival and asks students to perform tasks not covered in the chapter’s plan.',
    tool: 'service event operations packet',
    right: 'Pause, assess safety and scope, contact the authorized leader, and revise or decline duties as needed',
    wrong: ['Tell volunteers to comply with every request', 'Leave without documenting the change']
  },
  {
    id: 'eff-2026-transition-succession',
    title: 'Officer Transition, Succession & Chapter Continuity',
    category: '2026 Leadership Core', audience: 'Outgoing and incoming officers, founders, presidents, and advisors', duration: '75 minutes',
    purpose: 'Transfer knowledge, records, access, relationships, and responsibilities without losing chapter momentum.',
    concepts: ['transition timelines and overlap', 'records, passwords, assets, and access transfer', 'open obligations, risks, and stakeholder introductions', 'first-30-day priorities and leadership reflection'],
    scenario: 'An outgoing officer controls a chapter account through a personal email and does not respond after graduation.',
    tool: 'signed officer transition and access inventory',
    right: 'Use organization-controlled access, document the gap, and escalate recovery through the authorized process',
    wrong: ['Create a second unofficial account', 'Ask members to share personal passwords']
  }
];

const esc = value => String(value).replace(/[&<>]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[char]));
const quiz = (question, correct, wrong) => ({ questions: [{ question, answers: [correct, ...wrong], correct_answers: [correct] }] });

function createCourse(spec) {
  const modules = [
    { id: `${spec.id}-foundation`, title: 'Foundation & role clarity', position: 1 },
    { id: `${spec.id}-practice`, title: 'Practice, judgment & documentation', position: 2 },
    { id: `${spec.id}-certification`, title: 'Certification & field application', position: 3 }
  ];
  const lesson = (suffix, sectionId, position, title, markdown, q) => ({
    id: `${spec.id}-${suffix}`, sectionId, position, title, markdown, assets: [], quizzes: [q]
  });
  const [a,b,c,d] = spec.concepts;
  const lessons = [
    lesson('standard', modules[0].id, 1, `The EFF standard for ${spec.title}`,
      `## Purpose\n${spec.purpose}\n\n## By the end of this course\nYou will be able to explain ${a}; apply ${b}; recognize ${c}; and produce ${d}.\n\n## Leadership standard\nAn EFF leader acts within role, protects student dignity, uses approved policy and resources, documents decisions, and escalates concerns that exceed chapter authority. Speed never replaces safety, fairness, or a reliable record.`,
      quiz('Which statement best reflects the EFF leadership standard?', 'Act within role, document decisions, and escalate when authority or safety requires it', ['Move quickly even when approval is unclear', 'Keep important decisions verbal to preserve flexibility'])),
    lesson('roles', modules[0].id, 2, 'Roles, authority & non-negotiable boundaries',
      `## Know what belongs to your role\nBefore acting, identify: who owns the decision, what policy controls it, whose consent or approval is required, and where the record belongs.\n\n### Apply these four questions\n1. Is this within my assigned authority?\n2. Could this affect safety, money, privacy, legal rights, or chapter standing?\n3. What written approval or record is required?\n4. Who must be informed, consulted, or asked to decide?\n\n### Course-specific boundary\nFor ${spec.title}, leaders must be especially fluent in ${a} and ${b}. When facts are incomplete or consequences are significant, pause and escalate rather than improvise.`,
      quiz('What should a leader do when authority is unclear and the decision could affect chapter standing?', 'Pause, document the question, and use the authorized escalation path', ['Assume authority if the deadline is close', 'Ask social media followers what to do'])),
    lesson('playbook', modules[1].id, 3, 'The field playbook',
      `## A repeatable workflow\n**Prepare.** Define the need, intended outcome, people affected, policy, owner, deadline, approvals, risks, and evidence of completion.\n\n**Act.** Communicate roles and expectations; use the approved tool; protect access and private information; record material decisions as they occur.\n\n**Review.** Compare the result with the intended outcome; reconcile open items; report exceptions; assign follow-up; store the record in the approved location.\n\n### Your course tool\nBuild a ${spec.tool}. It should be usable by another trained leader without relying on your memory. Include an owner, date, status, approval evidence, unresolved issues, and next action.`,
      quiz(`Which deliverable best demonstrates readiness in ${spec.title}?`, `A completed ${spec.tool} with owners, approvals, status, and follow-up`, ['A verbal summary with no supporting record', 'A promotional graphic announcing success'])),
    lesson('scenario', modules[1].id, 4, 'Scenario lab: make the defensible decision',
      `## Situation\n${spec.scenario}\n\n## Work the decision\nWrite the known facts separately from assumptions. Name the people affected, immediate risk, controlling policy or standard, decision owner, required consultation, and the record that must be preserved.\n\n## Model response\n${spec.right}. Communicate respectfully and share only the minimum information needed with authorized people. Set a follow-up date; do not treat escalation as abandonment.\n\n## Debrief\nThe strongest decision is not merely the fastest or most popular. It is mission-aligned, within authority, proportionate to risk, consistent with policy, and supported by a clear record.`,
      quiz('What is the strongest response to this scenario?', spec.right, spec.wrong)),
    lesson('capstone', modules[2].id, 5, 'Certification capstone & 30-day application',
      `## Capstone\nComplete your ${spec.tool} for a real or realistic chapter situation. Remove unnecessary private information, but make the work specific enough for an authorized reviewer to assess.\n\n## Required elements\n- the need and mission connection;\n- applicable role, policy, or boundary;\n- decision owner and approvals;\n- step-by-step workflow with deadlines;\n- risk and escalation triggers;\n- evidence of completion and follow-up.\n\n## Thirty-day commitment\nName one practice you will begin, one practice you will stop, and one record or control you will strengthen. Revisit the commitment with your president, advisor, supervisor, or national liaison within 30 days.\n\nCertification confirms course completion; it does not expand a learner’s authority beyond current EFF policy or assigned role.`,
      quiz('What does this certification authorize?', 'It verifies learning but does not expand authority beyond current policy or assigned role', ['It permits the learner to override chapter policy', 'It replaces required national approval'])),
  ];
  return { ...spec, description: spec.purpose, version: '2026.1', updatedAt: '2026-08-30', modules, lessons };
}

const retained = source.courses.map(course => ({ ...course, category: course.category || 'Foundational EFF Training' }));
const courses = [...retained, ...curriculum.map(createCourse)];
const output = JSON.stringify({ generatedAt: new Date().toISOString(), version: '2026.1', courses }, null, 2);

for (const target of [path.join(root, 'data', 'courses.json'), path.join(root, 'eff-leadership-academy', 'data', 'courses.json')]) {
  await fs.writeFile(target, output);
  console.log(`Wrote ${courses.length} courses to ${target}`);
}
