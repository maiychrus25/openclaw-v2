# FEEDBACK.md — Revert Loopback Document

_When a handover is unclear, contradictory, or impossible to execute as specified._

---

## Header

```
Project:        {project-slug}
From Agent:     {feedback-sender-id}
To Agent:      {original-handover-sender-id}
Date:           {YYYY-MM-DD HH:MM UTC}
Feedback #:     {1, 2, 3...} (attempt count)
Severity:       BLOCKER | HIGH | MEDIUM
Handover Ref:   {HANDOVER.md date + description}
```

---

## Feedback Type

```
☐ Unclear requirement — cannot determine what to build
☐ Contradictory specification — two requirements conflict
☐ Technically impossible — as specified cannot be done
☐ Missing context — need more info to proceed
☐ Scope creep — task is significantly larger than specified
☐ Resource missing — API key, schema, endpoint not available
```

---

## Detailed Issue

### Issue 1: {short title}

```
Description:
{detailed description of what is unclear, missing, or contradictory}

Current understanding:
{what I believe needs to be built based on the handover}

Impact on implementation:
{how this blocks or changes my work}

Requested clarification:
{exactly what I need to proceed}
```

(Add more issues if multiple)

---

## Handover Content in Question

```
{handover excerpt or reference}
```

---

## Halt Status

```
Work is:  ☐ HALTED until clarified
          ☐ PROCEEDING with assumptions below
```

## Assumptions (if proceeding)

```
1. {assumption made to continue}
2.
```

---

## Master-Orbiter Alert

```
☐ Alerted to master-orchestrator: YES / NO
Date alerted: ________________
Resolution: __________________
```

---

## Response Required From

```
Agent: {original-handover-sender-id}
By:    {YYYY-MM-DD HH:MM UTC}
```

---

## Resolution (To be filled by receiving agent)

```
Clarification provided:
{full clarification}

Decision:
☐ Proceed as clarified
☐ Scope changed — update HANDOVER.md
☐ Block remains — escalated to master-orchestrator
```

```
Responded by: _________________  Date: ___________
```
