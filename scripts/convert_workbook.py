import json
import math
import re
from pathlib import Path
from urllib.parse import urlparse

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
WORKBOOK = ROOT / "learning_outcomes_initiatives_deep_dive.xlsx"
CONTENT = ROOT / "content"


POSITION_MAP = {
    "Whole language / balanced literacy vs phonics / Science of Reading": {
        "position": 78,
        "low": 66,
        "high": 88,
        "confidence": "high",
        "strength": "strong-causal",
        "explanation": "Strongly favors explicit code instruction, while keeping vocabulary, fluency, comprehension, and background knowledge in the model.",
        "topic": "Literacy",
    },
    "Screens harm development vs technology enables learning": {
        "position": 52,
        "low": 30,
        "high": 70,
        "confidence": "low",
        "strength": "mixed-conditional",
        "explanation": "Technology effects depend on what activity the tool replaces and whether adult-guided instructional design is present.",
        "topic": "Technology",
    },
    "Human tutoring vs AI tutoring": {
        "position": 25,
        "low": 12,
        "high": 45,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Human high-dosage tutoring has much stronger causal evidence; AI may scale practice and feedback but is not equivalent yet.",
        "topic": "Technology",
    },
    "Direct instruction vs inquiry/project-based learning": {
        "position": 68,
        "low": 54,
        "high": 80,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Novices usually need explicit modeling and practice; inquiry works best when content-rich and scaffolded.",
        "topic": "Curriculum",
    },
    "Knowledge-rich curriculum vs generic skills": {
        "position": 72,
        "low": 58,
        "high": 84,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Comprehension and reasoning depend heavily on domain knowledge; generic strategies alone are too thin.",
        "topic": "Curriculum",
    },
    "Central curriculum/HQIM vs teacher-created materials": {
        "position": 70,
        "low": 54,
        "high": 83,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Materials quality matters, but the effect depends on teacher use, adaptation, and implementation support.",
        "topic": "Curriculum",
    },
    "Standardization/accountability vs professional autonomy": {
        "position": 54,
        "low": 38,
        "high": 68,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Transparent standards and measurement help, but high-stakes systems narrow behavior and invite gaming.",
        "topic": "Accountability",
    },
    "Choice/markets vs common public system": {
        "position": 50,
        "low": 25,
        "high": 74,
        "confidence": "low",
        "strength": "mixed-conditional",
        "explanation": "Effects depend on school quality, accountability rules, admissions, transportation, and outcome definition.",
        "topic": "Governance",
    },
    "Remediation/readiness vs grade-level acceleration": {
        "position": 63,
        "low": 48,
        "high": 76,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Backfilling forever can trap students; access to grade-level work needs tutoring and scaffolding.",
        "topic": "Instruction",
    },
    "Tracking/acceleration vs detracking/inclusion": {
        "position": 50,
        "low": 30,
        "high": 70,
        "confidence": "low",
        "strength": "mixed-conditional",
        "explanation": "Detracking without support can fail, while tracking can institutionalize low expectations.",
        "topic": "Equity",
    },
    "Discipline/order vs restorative/relational climate": {
        "position": 55,
        "low": 38,
        "high": 70,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Reducing exclusion matters, but safety and instructional time cannot be waved away.",
        "topic": "School climate",
    },
    "SEL/whole-child vs academics-first": {
        "position": 58,
        "low": 42,
        "high": 72,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "SEL is strongest when it improves engagement and learning conditions, not when it substitutes for academics.",
        "topic": "School climate",
    },
    "Teacher incentives/evaluation vs trust/professionalism": {
        "position": 65,
        "low": 50,
        "high": 78,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Measurement can help, but coaching has more consistent developmental evidence than simple merit pay.",
        "topic": "Teacher workforce",
    },
    "Early academics vs play-based pre-K": {
        "position": 55,
        "low": 38,
        "high": 70,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "The evidence favors intentional instruction embedded in development, not worksheets or purely unstructured play.",
        "topic": "Early childhood",
    },
    "College-for-all vs CTE/career pathways": {
        "position": 58,
        "low": 42,
        "high": 72,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Strong career pathways avoid dead-end tracking by preserving rigor, credits, and portable credentials.",
        "topic": "Pathways",
    },
    "Small schools/personalization vs comprehensive breadth": {
        "position": 60,
        "low": 44,
        "high": 74,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "NYC small schools are a serious positive case, but smallness itself is not the whole mechanism.",
        "topic": "School design",
    },
    "Data-driven continuous improvement vs big-bang reform": {
        "position": 64,
        "low": 48,
        "high": 78,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Continuous improvement is strong for targeted problems; structural redesign may still be needed for systemic failures.",
        "topic": "Improvement",
    },
    "Integration/desegregation vs neighborhood/local control": {
        "position": 58,
        "low": 40,
        "high": 72,
        "confidence": "medium",
        "strength": "mixed-conditional",
        "explanation": "Test scores are not the only outcome; civic contact, peer composition, and access to resources also matter.",
        "topic": "Equity",
    },
    "Bilingual dual-language vs English immersion": {
        "position": 55,
        "low": 38,
        "high": 70,
        "confidence": "low",
        "strength": "mixed-conditional",
        "explanation": "The conclusion depends on time horizon and whether biliteracy itself is treated as an outcome.",
        "topic": "Language",
    },
    "More money/resources vs money does not matter": {
        "position": 76,
        "low": 62,
        "high": 88,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Sustained targeted dollars can improve outcomes, but spending category and implementation are decisive.",
        "topic": "Finance",
    },
    "More money/resources vs 'money does not matter'": {
        "position": 76,
        "low": 62,
        "high": 88,
        "confidence": "medium",
        "strength": "promising-causal-quasi",
        "explanation": "Sustained targeted dollars can improve outcomes, but spending category and implementation are decisive.",
        "topic": "Finance",
    },
    "Seat time vs mastery": {
        "position": 55,
        "low": 35,
        "high": 72,
        "confidence": "low",
        "strength": "limited-descriptive",
        "explanation": "Mastery is philosophically strong but hard to validate because credits and grades can change meaning.",
        "topic": "School design",
    },
}

SHOCK_CARDS = [
    {
        "claim": "Reading First changed instruction, but not broad comprehension scores.",
        "caveat": "Explicit foundational skills matter, but reading is not phonics only.",
        "slugHint": "Whole language / balanced literacy vs phonics / Science of Reading",
    },
    {
        "claim": "Money can matter. The question is what it buys.",
        "caveat": "Sustained targeted dollars are different from undifferentiated spending.",
        "slugHint": "More money/resources vs 'money does not matter'",
    },
    {
        "claim": "Some voucher lotteries produced worse test scores.",
        "caveat": "Choice effects depend on the schools available and the rules around them.",
        "slugHint": "Choice/markets vs common public system",
    },
    {
        "claim": "High-dosage tutoring is one of the clearest K-12 bets.",
        "caveat": "The dosage, attendance, tutor quality, and school-day integration matter.",
        "slugHint": "Human tutoring vs AI tutoring",
    },
    {
        "claim": "Teacher coaching beats generic professional development, but scaling weakens effects.",
        "caveat": "Large programs often produce smaller effects than tightly run trials.",
        "slugHint": "Teacher incentives/evaluation vs trust/professionalism",
    },
    {
        "claim": "The Gates teacher-effectiveness bet did not deliver the hoped-for student gains.",
        "caveat": "Measurement systems are not the same thing as instructional improvement.",
        "slugHint": "Teacher incentives/evaluation vs trust/professionalism",
    },
    {
        "claim": "The Gates-backed small-schools story is different.",
        "caveat": "The positive case is about design, admissions context, and personalization.",
        "slugHint": "Small schools/personalization vs comprehensive breadth",
    },
    {
        "claim": "AI schools are running ahead of the evidence.",
        "caveat": "K-12 generative AI evidence is still early and thin on long-run outcomes.",
        "slugHint": "Human tutoring vs AI tutoring",
    },
]

METHOD_LABELS = [
    ("random", "RCT"),
    ("rct", "RCT"),
    ("lottery", "Lottery"),
    ("regression discontinuity", "Regression discontinuity"),
    ("difference-in-differences", "Difference-in-differences"),
    ("event study", "Event study"),
    ("matched", "Matched comparison"),
    ("meta", "Meta-analysis"),
    ("systematic", "Systematic review"),
    ("descriptive", "Descriptive"),
    ("trend", "Descriptive"),
    ("value-added", "Matched comparison"),
]


def clean(value):
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return str(value).strip()


def slugify(value):
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def split_semicolon(value):
    return [part.strip() for part in clean(value).split(";") if part.strip()]


def split_poles(value):
    text = clean(value)
    if " vs " in text:
        left, right = text.split(" vs ", 1)
        return left.strip(), right.strip()
    if " and " in text:
        left, right = text.split(" and ", 1)
        return left.strip(), right.strip()
    return text, "Alternative model"


def evidence_strength(value):
    text = clean(value).lower()
    if "strong" in text:
        return "strong-causal"
    if "promising" in text or "quasi" in text:
        return "promising-causal-quasi"
    if "mixed" in text:
        return "mixed-conditional"
    if "not an outcome" in text:
        return "not-outcome-intervention"
    return "limited-descriptive"


def method_tags(value):
    lower = clean(value).lower()
    tags = []
    for needle, label in METHOD_LABELS:
        if needle in lower and label not in tags:
            tags.append(label)
    return tags or ["Descriptive"]


def domain_title(url):
    parsed = urlparse(url)
    host = parsed.netloc.replace("www.", "")
    path = parsed.path.strip("/").split("/")[-1].replace("-", " ").replace("_", " ")
    if path and len(path) > 4:
        title = path[:90].strip().title()
    else:
        title = host
    return f"{title} ({host})"


def add_source(source_by_url, url, context="", method=None, strength=None):
    url = clean(url)
    if not url:
        return ""
    if url not in source_by_url:
        host = urlparse(url).netloc.replace("www.", "")
        source_by_url[url] = {
            "id": f"src-{len(source_by_url) + 1:03d}",
            "title": domain_title(url),
            "authors": host,
            "year": "",
            "method": method or "Descriptive",
            "outcomeTags": ["Achievement", "Implementation"],
            "evidenceStrength": strength or "limited-descriptive",
            "finding": context or "Source used in the workbook evidence map.",
            "caveat": "Review the original source for sample, design, and outcome definitions.",
            "url": url,
        }
    else:
        current = source_by_url[url]
        if context and len(current["finding"]) < 80:
            current["finding"] = context
        if method and current["method"] == "Descriptive":
            current["method"] = method
        if strength and current["evidenceStrength"] == "limited-descriptive":
            current["evidenceStrength"] = strength
    return source_by_url[url]["id"]


def title_from_url_overrides(sources):
    overrides = {
        "nichd.nih.gov": ("Report of the National Reading Panel", "NICHD"),
        "ies.ed.gov/use-work/resource-library/report/evaluation-report/reading-first-impact-study-final-report": (
            "Reading First Impact Study: Final Report",
            "IES",
        ),
        "nber.org/papers/w20847": (
            "The Effects of School Spending on Educational and Economic Outcomes",
            "NBER",
        ),
        "nber.org/papers/w21839": ("Free to Choose: Can School Choice Reduce Student Achievement?", "NBER"),
        "nber.org/papers/w28531": ("Not Too Late: Improving Academic Outcomes Among Adolescents", "NBER"),
        "rand.org/pubs/research_reports/RR2242.html": (
            "Improving Teaching Effectiveness: Final Report",
            "RAND",
        ),
        "mdrc.org/work/projects/new-york-city-small-schools-choice-evaluation": (
            "New York City Small Schools of Choice Evaluation",
            "MDRC",
        ),
        "frontiersin.org/journals/education/articles/10.3389/feduc.2025.1647573/full": (
            "Generative AI Use in K-12 Education: A Systematic Review",
            "Frontiers in Education",
        ),
        "annenberg.brown.edu/publications/effect-teacher-coaching-instruction-and-achievement-meta-analysis-causal-evidence": (
            "The Effect of Teacher Coaching on Instruction and Achievement",
            "Annenberg Institute",
        ),
        "nces.ed.gov/nationsreportcard": ("National Assessment of Educational Progress", "NCES"),
        "cepa.stanford.edu/seda2/data-download": ("Stanford Education Data Archive", "Stanford CEPA"),
    }
    for src in sources:
        for needle, (title, authors) in overrides.items():
            if needle in src["url"]:
                src["title"] = title
                src["authors"] = authors


def key_initiative_slugs(text, initiatives):
    normalized = clean(text).lower()
    matches = []
    for item in initiatives:
        name = item["name"].lower()
        if len(name) > 5 and (name in normalized or any(part in normalized for part in name.split("/")[:1])):
            matches.append(item["slug"])
    if matches:
        return matches[:5]
    keywords = {
        "phonics": "literacy",
        "reading": "literacy",
        "tutoring": "tutoring",
        "teacher": "teacher",
        "choice": "voucher",
        "voucher": "voucher",
        "standards": "standards",
        "accountability": "accountability",
        "small": "small",
        "pre-k": "pre-k",
        "money": "finance",
        "funding": "finance",
        "technology": "technology",
        "ai": "technology",
    }
    for needle, tag in keywords.items():
        if needle in normalized:
            matches = [i["slug"] for i in initiatives if tag in (i["tags"] + " " + i["category"]).lower()]
            if matches:
                return matches[:5]
    return [initiatives[0]["slug"]] if initiatives else []


def main():
    CONTENT.mkdir(exist_ok=True)
    initiatives_df = pd.read_excel(WORKBOOK, sheet_name="Initiatives Matrix")
    dichotomies_df = pd.read_excel(WORKBOOK, sheet_name="Dichotomies")
    input_schema_df = pd.read_excel(WORKBOOK, sheet_name="Input Schema")
    output_schema_df = pd.read_excel(WORKBOOK, sheet_name="Output Schema")
    methods_df = pd.read_excel(WORKBOOK, sheet_name="Sources & Methods")

    source_by_url = {}
    initiatives = []
    used_slugs = set()

    for _, row in initiatives_df.iterrows():
        name = clean(row["Initiative / program / policy"])
        if not name:
            continue
        base_slug = slugify(name)
        slug = base_slug
        n = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{n}"
            n += 1
        used_slugs.add(slug)
        strength = evidence_strength(row["Evidence signal"])
        methods = method_tags(row["Common evaluation designs"])
        source_ids = [
            add_source(
                source_by_url,
                url,
                context=clean(row["One-line finding"]),
                method=methods[0],
                strength=strength,
            )
            for url in split_semicolon(row["Source URLs"])
        ]
        initiatives.append(
            {
                "slug": slug,
                "id": int(row["ID"]) if not math.isnan(float(row["ID"])) else len(initiatives) + 1,
                "name": name,
                "years": clean(row["Years / scale"]),
                "category": clean(row["Category"]),
                "theoryOfAction": clean(row["Core theory of action"]),
                "inputVariablesChanged": clean(row["Input variables changed"]),
                "targetPopulation": clean(row["Target population / setting"]),
                "evaluationDesigns": clean(row["Common evaluation designs"]),
                "methodTags": methods,
                "evidenceStrength": strength,
                "outputsMeasured": clean(row["Outputs measured"]),
                "normalizationIssues": clean(row["Fair comparison / normalization issues"]),
                "oneLineFinding": clean(row["One-line finding"]),
                "sourceIds": source_ids,
                "tags": clean(row["Tags"]),
                "relatedDichotomySlugs": [],
            }
        )

    dichotomies = []
    for idx, row in dichotomies_df.iterrows():
        title = clean(row["Dichotomy / debate"])
        if not title:
            continue
        left, right = split_poles(row["Poles"])
        placement = POSITION_MAP.get(title, {})
        slug = slugify(title)
        source_ids = [
            add_source(
                source_by_url,
                url,
                context=clean(row["What the evidence suggests"]),
                method="Systematic review" if "review" in clean(row["Representative initiatives / sources"]).lower() else "Descriptive",
                strength=placement.get("strength", "mixed-conditional"),
            )
            for url in split_semicolon(row["Source URLs"])
        ]
        key_slugs = key_initiative_slugs(row["Representative initiatives / sources"], initiatives)
        dichotomy = {
            "slug": slug,
            "title": title,
            "dek": clean(row["Better synthesis question"]),
            "topic": placement.get("topic", "Education reform"),
            "philosophicalDisagreement": clean(row["Philosophical disagreement"]),
            "continuum": {
                "leftPole": left,
                "rightPole": right,
                "position": placement.get("position", 50),
                "uncertaintyLow": placement.get("low", 35),
                "uncertaintyHigh": placement.get("high", 65),
                "confidence": placement.get("confidence", "low"),
                "explanation": placement.get("explanation", clean(row["What the evidence suggests"])),
            },
            "evidenceStrength": placement.get("strength", "mixed-conditional"),
            "whatEvidenceSuggests": clean(row["What the evidence suggests"]),
            "betterQuestion": clean(row["Better synthesis question"]),
            "commonMisreadings": [
                f"{right} is not a magic phrase; the mechanism and implementation still matter.",
                f"{left} is not automatically wrong in every context; outcomes and students differ.",
            ],
            "whatWouldChangeOurMind": "Comparable causal evidence across settings showing durable gains on achievement, progression, and implementation quality would move this synthesis.",
            "keyInitiativeSlugs": key_slugs,
            "sourceIds": source_ids,
            "landingPriority": idx + 1,
        }
        dichotomies.append(dichotomy)
        for item in initiatives:
            if item["slug"] in key_slugs and slug not in item["relatedDichotomySlugs"]:
                item["relatedDichotomySlugs"].append(slug)

    for item in initiatives:
        if not item["relatedDichotomySlugs"]:
            category = item["category"].lower()
            if "literacy" in category:
                item["relatedDichotomySlugs"].append(slugify("Whole language / balanced literacy vs phonics / Science of Reading"))
            elif "teacher" in category:
                item["relatedDichotomySlugs"].append(slugify("Teacher incentives/evaluation vs trust/professionalism"))
            elif "governance" in category or "choice" in item["name"].lower() or "voucher" in item["name"].lower():
                item["relatedDichotomySlugs"].append(slugify("Choice/markets vs common public system"))
            elif "standards" in category:
                item["relatedDichotomySlugs"].append(slugify("Standardization/accountability vs professional autonomy"))

    sources = list(source_by_url.values())
    title_from_url_overrides(sources)
    sources.sort(key=lambda x: x["id"])

    methods = []
    for _, row in methods_df.iterrows():
        methods.append(
            {
                "section": clean(row["Section"]),
                "item": clean(row["Item"]),
                "definition": clean(row["Definition / use"]),
                "urls": split_semicolon(row["Primary URLs"]),
            }
        )
    for _, row in input_schema_df.iterrows():
        methods.append(
            {
                "section": "Input variable",
                "item": clean(row["Variable family"]),
                "definition": clean(row["How researchers normalize or harmonize"]),
                "urls": split_semicolon(row["Example source URLs"]),
            }
        )
    for _, row in output_schema_df.iterrows():
        methods.append(
            {
                "section": "Outcome",
                "item": clean(row["Outcome family"]),
                "definition": clean(row["Normalization / comparability"]),
                "urls": split_semicolon(row["Example source URLs"]),
            }
        )

    glossary = [
        {
            "term": m["item"],
            "definition": m["definition"],
            "section": m["section"],
        }
        for m in methods
        if m["item"] and m["definition"]
    ]

    shock_cards = []
    by_title = {d["title"]: d for d in dichotomies}
    for card in SHOCK_CARDS:
        d = by_title.get(card["slugHint"])
        if d:
            shock_cards.append(
                {
                    "claim": card["claim"],
                    "caveat": card["caveat"],
                    "dichotomySlug": d["slug"],
                    "sourceIds": d["sourceIds"][:2],
                    "evidenceStrength": d["evidenceStrength"],
                }
            )

    files = {
        "dichotomies.json": dichotomies,
        "initiatives.json": initiatives,
        "sources.json": sources,
        "methods.json": methods,
        "glossary.json": glossary,
        "landing-cards.json": shock_cards,
    }
    for name, payload in files.items():
        (CONTENT / name).write_text(json.dumps(payload, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"Wrote {len(dichotomies)} dichotomies, {len(initiatives)} initiatives, {len(sources)} sources.")


if __name__ == "__main__":
    main()
