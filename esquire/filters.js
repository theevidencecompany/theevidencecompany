export const STUDY_DESIGN_FILTERS = {
"PubMed": [
{
title: "PubMed RCT filter",
query: "(randomizedcontrolledtrial[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed Review filter",
query: "(review[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed Case Reports",
query: "(casereports[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed Comparative Study",
query: "(comparativestudy[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed Observational Study",
query: "(observationalstudy[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed MA filter",
query: "(meta-analysis[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "PubMed SR filter",
query: "(systematicreview[Filter])",
ref: "https://www.nlm.nih.gov/oet/ed/pubmed/mesh/mod02/03-200.html"
},
{
title: "Cochrane HSSS (sensitivity-maximising)",
query: "(\"randomized controlled trial\"[Publication Type] OR \"controlled clinical trial\"[Publication Type] OR \"randomized\"[Title/Abstract] OR \"randomised\"[Title/Abstract] OR placebo[Title/Abstract] OR \"clinical trials as topic\"[MeSH Terms] OR randomly[Title/Abstract] OR trial[Title]) NOT (animals[MeSH Terms] NOT humans[MeSH Terms])",
ref: "https://handbook-5-1.cochrane.org/chapter_6/box_6_4_a_cochrane_hsss_2008_sensmax_pubmed.htm"
},
{
title: "Cochrane HSSS (sensitivity + precision)",
query: "(\"randomized controlled trial\"[Publication Type] OR (randomized[Title/Abstract] AND controlled[Title/Abstract] AND trial[Title/Abstract]) OR placebo[Title/Abstract]) NOT (animals[MeSH Terms] NOT humans[MeSH Terms])",
ref: "https://handbook-5-1.cochrane.org/chapter_6/box_6_4_b_cochrane_hsss_2008_sensprec_pubmed.htm"
},
{
title: "SR / MA / HTA / ITC – PubMed",
query: "(\"systematic\"[filter] OR \"meta-analysis\"[pt] OR \"meta-analysis as topic\"[mh] OR \"meta analy*\"[tw] OR metanaly*[tw] OR metaanaly*[tw] OR \"met analy*\"[tw] OR \"integrative research\"[tiab] OR \"integrative review*\"[tiab] OR \"integrative overview*\"[tiab] OR \"research integration*\"[tiab] OR \"research overview*\"[tiab] OR \"collaborative review*\"[tiab] OR \"collaborative overview*\"[tiab] OR \"systematic review\"[pt] OR \"systematic reviews as topic\"[mh] OR \"systematic review*\"[tiab] OR \"technology assessment*\"[tiab] OR \"technology overview*\"[tiab] OR \"technology appraisal*\"[tiab] OR \"Technology Assessment, Biomedical\"[mh] OR HTA[tiab] OR HTAs[tiab] OR \"comparative efficacy\"[tiab] OR \"comparative effectiveness\"[tiab] OR \"outcomes research\"[tiab] OR \"indirect comparison*\"[tiab] OR \"Bayesian comparison\"[tiab] OR ((\"indirect treatment\"[tiab] OR \"mixed-treatment\"[tiab]) AND comparison*[tiab]) OR Embase*[tiab] OR Cinahl*[tiab] OR \"systematic overview*\"[tiab] OR \"methodological overview*\"[tiab] OR \"methodologic overview*\"[tiab] OR \"methodological review*\"[tiab] OR \"methodologic review*\"[tiab] OR \"quantitative review*\"[tiab] OR \"quantitative overview*\"[tiab] OR \"quantitative synthes*\"[tiab] OR \"pooled analy*\"[tiab] OR Cochrane[tiab] OR Medline[tiab] OR Pubmed[tiab] OR Medlars[tiab] OR handsearch*[tiab] OR \"hand search*\"[tiab] OR \"meta-regression*\"[tiab] OR metaregression*[tiab] OR \"data synthes*\"[tiab] OR \"data extraction\"[tiab] OR \"data abstraction*\"[tiab] OR \"mantel haenszel\"[tiab] OR peto[tiab] OR \"der-simonian\"[tiab] OR dersimonian[tiab] OR \"fixed effect*\"[tiab] OR \"multiple treatment comparison\"[tiab] OR \"mixed treatment meta-analys*\"[tiab] OR \"umbrella review*\"[tiab] OR ((\"multiple paramet*\"[tiab]) AND (\"evidence synthesis\"[tiab])) OR ((\"multi-paramet*\"[tiab]) AND (\"evidence synthesis\"[tiab])) OR ((multiparameter*[tiab]) AND (\"evidence synthesis\"[tiab])) OR \"Cochrane Database Syst Rev\"[Journal] OR \"health technology assessment winchester, england\"[Journal] OR \"Evid Rep Technol Assess (Full Rep)\"[Journal] OR \"Evid Rep Technol Assess (Summ)\"[Journal] OR \"Int J Technol Assess Health Care\"[Journal] OR \"GMS Health Technol Assess\"[Journal] OR \"Health Technol Assess (Rockv)\"[Journal] OR \"Health Technol Assess Rep\"[Journal])",
ref: "https://searchfilters.cda-amc.ca/link/99"
},
{
title: "RCT / CCT – PubMed",
query: "(\"Randomized Controlled Trial\"[pt] OR \"Controlled Clinical Trial\"[pt] OR \"Pragmatic Clinical Trial\"[pt] OR \"Equivalence Trial\"[pt] OR \"Clinical Trial, Phase III\"[pt] OR \"Randomized Controlled Trials as Topic\"[mh] OR \"Controlled Clinical Trials as Topic\"[mh] OR \"Random Allocation\"[mh] OR \"Double-Blind Method\"[mh] OR \"Single-Blind Method\"[mh] OR Placebos[Mesh:NoExp] OR \"Control Groups\"[mh] OR (random*[tiab] OR sham[tiab] OR placebo*[tiab]) OR ((singl*[tiab] OR doubl*[tiab]) AND (blind*[tiab] OR dumm*[tiab] OR mask*[tiab])) OR ((tripl*[tiab] OR trebl*[tiab]) AND (blind*[tiab] OR dumm*[tiab] OR mask*[tiab])) OR (control*[tiab] AND (study[tiab] OR studies[tiab] OR trial*[tiab] OR group*[tiab])) OR (Nonrandom*[tiab] OR \"non random*\"[tiab] OR \"non-random*\"[tiab] OR \"quasi-random*\"[tiab] OR quasirandom*[tiab]) OR allocated[tiab] OR ((\"open label\"[tiab] OR \"open-label\"[tiab]) AND (study[tiab] OR studies[tiab] OR trial*[tiab])) OR ((equivalence[tiab] OR superiority[tiab] OR \"non-inferiority\"[tiab] OR noninferiority[tiab]) AND (study[tiab] OR studies[tiab] OR trial*[tiab])) OR (\"pragmatic study\"[tiab] OR \"pragmatic studies\"[tiab]) OR ((pragmatic[tiab] OR practical[tiab]) AND trial*[tiab]) OR ((quasiexperimental[tiab] OR \"quasi-experimental\"[tiab]) AND (study[tiab] OR studies[tiab] OR trial*[tiab])) OR (phase[ti] AND (III[ti] OR 3[ti]) AND (study[ti] OR studies[ti] OR trial*[ti])) OR (phase[ot] AND (III[ot] OR 3[ot]) AND (study[ot] OR studies[ot] OR trial*[ot])))",
ref: "https://searchfilters.cda-amc.ca/link/108"
},
],
"Embase": [
{
title: "Embase RCT filter",
query: "([randomized controlled trial]/lim)",
ref: ""
},
{
title: "Embase MA filter",
query: "([meta analysis]/lim)",
ref: ""
},
{
title: "Embase Controlled Clinical Trial",
query: "([controlled clinical trial]/lim)",
ref: ""
},
{
title: "Embase Systematic Review",
query: "([systematic review]/lim)",
ref: ""
},
{
title: "Embase Cochrane Review",
query: "([cochrane review]/lim)",
ref: ""
},
{
title: "Embase Clinical Trial",
query: "(‘clinical trial’/it)",
ref: ""
},
{
title: "Embase Cochrane HSS (sensitivity-maximising)",
query: "(‘randomized controlled trial’/exp OR ‘controlled clinical trial’/exp OR random*:ti,ab,tt OR placebo:ti,ab,tt OR (compare:ti,tt OR compared:ti,tt OR comparison:ti,tt OR compared with:ti,tt OR compared to:ti,tt) OR ((evaluated:ti OR evaluate:ti OR evaluating:ti OR assessed:ti OR assess:ti OR assessing:ti OR trial:ti OR trials:ti OR study:ti OR studies:ti OR experiment:ti OR experiments:ti) AND (random*:ti,ab,tt OR placebos:ti,ab,tt OR placebo:ti,ab,tt)) OR (random*:ti,ab,tt AND (allocat*:ti,ab,tt OR assign*:ti,ab,tt OR divid*:ti,ab,tt OR distribut*:ti,ab,tt OR allot*:ti,ab,tt)) OR ((allocat*:ti,ab,tt OR assign*:ti,ab,tt OR divid*:ti,ab,tt OR distribut*:ti,ab,tt OR allot*:ti,ab,tt) AND (random*:ti,ab,tt OR placebo:ti,ab,tt)) OR ((single blind*:ti,ab,tt OR double blind*:ti,ab,tt OR triple blind*:ti,ab,tt OR single mask*:ti,ab,tt OR double mask*:ti,ab,tt OR triple mask*:ti,ab,tt OR single dummy:ti,ab,tt OR double dummy:ti,ab,tt OR triple dummy:ti,ab,tt) AND (random*:ti,ab,tt OR placebo:ti,ab,tt)) OR ((blind*:ti,ab,tt OR mask*:ti,ab,tt OR dummy:ti,ab,tt) AND (random*:ti,ab,tt OR placebo:ti,ab,tt) AND (trial:ti,ab,tt OR trials:ti,ab,tt OR study:ti,ab,tt OR studies:ti,ab,tt OR experiment:ti,ab,tt OR experiments:ti,ab,tt)) OR ((cross over:ti,ab,tt OR crossover:ti,ab,tt OR cross-over:ti,ab,tt) AND (random*:ti,ab,tt OR placebo:ti,ab,tt OR (compare:ti,tt OR compared:ti,tt OR comparison:ti,tt))) OR ((controlled:ti,ab,tt AND trial:ti,ab,tt) OR (clinical:ti,ab,tt AND trial:ti,ab,tt)) OR (clinical trial:ti,ab,tt OR clinical trials:ti,ab,tt) OR ((trial:ti OR trials:ti OR study:ti OR studies:ti OR experiment:ti OR experiments:ti) AND (random*:ti,ab,tt OR placebo:ti,ab,tt OR (compare:ti,tt OR compared:ti,tt OR comparison:ti,tt))) OR (‘drug therapy’/de AND (random*:ti,ab,tt OR placebo:ti,ab,tt OR trial:ti OR trials:ti OR study:ti OR studies:ti OR experiment:ti OR experiments:ti)) OR ((random*:ti,ab,tt OR placebo:ti,ab,tt) AND (‘drug therapy’/de OR ‘clinical trial’/de OR ‘clinical trial’/it)) OR ((random*:ti,ab,tt OR placebo:ti,ab,tt) AND (‘clinical trial’/it OR ‘clinical trial’/de OR ‘crossover procedure’/de OR ‘randomized controlled trial’/de OR ‘double blind procedure’/de OR ‘single blind procedure’/de OR ‘triple blind procedure’/de OR ‘controlled clinical trial’/de OR ‘phase 3 clinical trial’/de OR ‘phase 4 clinical trial’/de)) OR ((allocat*:ti,ab,tt OR assign*:ti,ab,tt OR divid*:ti,ab,tt OR distribut*:ti,ab,tt OR allot*:ti,ab,tt) AND (‘randomized controlled trial’/de OR ‘controlled clinical trial’/de OR ‘clinical trial’/de OR ‘clinical trial’/it)) OR ((blind*:ti,ab,tt OR mask*:ti,ab,tt OR dummy:ti,ab,tt) AND (‘randomized controlled trial’/de OR ‘controlled clinical trial’/de OR ‘clinical trial’/de OR ‘clinical trial’/it)) OR ((cross over:ti,ab,tt OR crossover:ti,ab,tt OR cross-over:ti,ab,tt) AND (‘randomized controlled trial’/de OR ‘controlled clinical trial’/de OR ‘clinical trial’/de OR ‘clinical trial’/it)) OR (‘randomized controlled trial’/de OR ‘controlled clinical trial’/de OR ‘clinical trial’/de OR ‘clinical trial’/it OR ‘crossover procedure’/de OR ‘randomization’/de OR ‘placebo’/de OR ‘double blind procedure’/de OR ‘single blind procedure’/de OR ‘triple blind procedure’/de) NOT (‘animal experiment’/de OR ‘animal’/de OR rat:ti,tt OR rats:ti,tt OR mouse:ti,tt OR mice:ti,tt OR sheep:ti,tt OR pig:ti,tt OR pigs:ti,tt OR dog:ti,tt OR dogs:ti,tt OR cat:ti,tt OR cats:ti,tt OR hamster:ti,tt OR hamsters:ti,tt OR rabbit:ti,tt OR rabbits:ti,tt OR animal:ti,tt OR animals:ti,tt OR swine:ti,tt OR goat:ti,tt OR goats:ti,tt OR chicken:ti,tt OR chickens:ti,tt OR calf:ti,tt OR calves:ti,tt OR horse:ti,tt OR horses:ti,tt OR cow:ti,tt OR cows:ti,tt OR cattle:ti,tt OR bovine:ti,tt OR monkey:ti,tt OR monkeys:ti,tt OR ape:ti,tt OR apes:ti,tt OR primate:ti,tt OR primates:ti,tt OR fowl:ti,tt OR bird:ti,tt OR birds:ti,tt OR porcine:ti,tt OR murine:ti,tt OR canine:ti,tt OR feline:ti,tt OR ovine:ti,tt OR caprine:ti,tt OR equine:ti,tt) OR (‘animal experiment’/de NOT (‘human experiment’/de OR ‘human’/de))))",
ref: "https://handbook-5-1.cochrane.org/chapter_6/box_6_4_a_cochrane_hsss_2008_sensmax_pubmed.htm"
},
],
"Scopus": [
{
title: "Scopus Observational Studies",
query: "TITLE-ABS-KEY(observational W/3 (study OR studies OR design OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((multidimensional OR multi-dimensional) W/3 (study OR studies OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((cohort OR cohorts) W/3 (study OR studies OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((case AND control) W/3 (study OR studies OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((case OR cases) W/3 (report OR reports OR study OR studies OR histories )) OR TITLE-ABS-KEY((case W/3 series) AND (study OR studies OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((pilot W/3 (study OR studies OR analysis OR analyses OR data ))) OR TITLE-ABS-KEY((cross W/3 sectional) AND (study OR studies OR analysis OR analyses OR data )) OR TITLE-ABS-KEY((questionnaire W/3 (study OR studies OR analysis OR analyses OR data ))) OR TITLE-ABS-KEY((survey W/3 (study OR studies OR analysis OR analyses OR data ))) OR TITLE-ABS-KEY((census W/3 (study OR studies OR analysis OR analyses OR data ))) OR TITLE-ABS-KEY((database W/3 (study OR studies OR analysis OR analyses OR data ))) OR TITLE-ABS-KEY((retrospective OR (prospective W/3 cohort) OR (longitudinal W/3 cohort) OR (longitudinal W/3 study) OR (prospective W/3 study) OR (retrospective W/3 study) OR (retrospective W/3 cohort) OR ((follow W/3 up) W/3 (study OR studies OR analysis OR analyses OR data )) OR ((follow-up W/3 study) OR (follow-up W/3 cohort)) OR (follow-up W/3 (study OR studies OR analysis OR analyses OR data )) OR (\"follow up\" W/3 (study OR studies OR analysis OR analyses OR data )) OR (\"follow-up\" W/3 (study OR studies OR analysis OR analyses OR data ))))",
ref: "https://searchfilters.cda-amc.ca/link/107"
},
{
title: "SR / MA / HTA / ITC – Scopus",
query: "(TITLE-ABS-KEY((systematic* W/3 (review* OR overview* OR synthes* )) OR (methodologic* W/3 (review* OR overview*))) OR TITLE-ABS-KEY((quantitative W/3 (review* OR overview* OR synthes* )) OR (research W/3 (integrati* OR overview*))) OR TITLE-ABS-KEY((integrative W/3 (review* OR overview*)) OR (collaborative W/3 (review* OR overview*)) OR (pool* W/3 analy*)) OR TITLE-ABS-KEY(\"data synthes*\" OR \"data extraction\" OR \"data abstraction\" OR \"data extraction\" OR \"data abstraction\" OR \"data abstraction\") OR TITLE-ABS-KEY(handsearch* OR \"hand search*\") OR TITLE-ABS-KEY(\"mantel haenszel\" OR peto OR \"der simonian\" OR dersimonian OR \"fixed effect*\") OR TITLE-ABS-KEY((met AND analy*) OR metanaly* OR \"technology assessment\" OR HTA OR HTAs OR \"technology overview\" OR \"technology appraisal\") OR TITLE-ABS-KEY(\"meta regression\" OR metaregression*) OR TITLE-ABS-KEY(\"meta-analy*\" OR metaanaly*) OR TITLE-ABS-KEY(\"systematic review\" OR \"systematic reviews\") OR TITLE-ABS-KEY(\"biomedical technology assessment\" OR \"bio-medical technology assessment\") OR TITLE-ABS-KEY(comparative W/3 (efficacy OR effectiveness)) OR TITLE-ABS-KEY(\"outcomes research\" OR \"relative effectiveness\") OR TITLE-ABS-KEY((indirect OR \"indirect treatment\" OR \"mixed-treatment\" OR bayesian) W/3 comparison*) OR TITLE-ABS-KEY(multi* W/3 treatment W/3 comparison*) OR TITLE-ABS-KEY(mixed W/3 treatment W/3 (meta-analy* OR metaanaly*)) OR TITLE-ABS-KEY(\"umbrella review\") OR TITLE-ABS-KEY((multi* W/2 paramet* W/2 evidence W/2 synthesis) OR (multiparamet* W/2 evidence W/2 synthesis) OR (multi-paramet* W/2 evidence W/2 synthesis)))",
ref: "https://searchfilters.cda-amc.ca/link/105"
},
],
"Cochrane": [
{
title: "Observational Studies",
query: "(epidemiologic:ti,ab,kw OR \"case control\":ti,ab,kw OR \"case-control\":ti,ab,kw OR \"case series\":ti,ab,kw OR \"case report\":ti,ab,kw OR \"case reports\":ti,ab,kw OR \"case study\":ti,ab,kw OR \"case studies\":ti,ab,kw OR \"case history\":ti,ab,kw OR \"case histories\":ti,ab,kw OR \"clinical study\":ti,ab,kw OR \"clinical studies\":ti,ab,kw OR observational:ti,ab,kw OR uncontrolled:ti,ab,kw OR \"nonrandomied\":ti,ab,kw OR \"non-randomied\":ti,ab,kw OR \"real world\":ti,ab,kw OR \"real-world\":ti,ab,kw OR ((observational OR multicenter OR multi-center OR cohort OR cohorts OR epidemiologic OR epidemiological OR prospective OR retrospective OR longitudinal OR cross sectional OR cross-sectional OR survey OR surveys OR questionnaire OR questionnaires OR database OR databases OR registry OR registries OR \"follow up\" OR \"follow-up\" OR \"case control\" OR \"case-control\" OR \"case series\" OR \"case report\" OR \"case reports\" OR \"case study\" OR \"case studies\" OR \"case history\" OR \"case histories\" OR \"clinical study\" OR \"clinical studies\" OR observational OR uncontrolled OR \"nonrandomied\" OR \"non-randomied\" OR \"real world\" OR \"real-world\") NEAR/3 ((study OR studies OR design OR analysis OR analyses OR data OR report OR reports OR history OR histories OR search OR searches OR strategy OR strategies OR filter OR filters OR strat* OR filter* OR search strat* OR search filter*)) OR ((observational OR multicenter OR multi-center OR cohort OR cohorts OR epidemiologic OR epidemiological OR prospective OR retrospective OR longitudinal OR cross sectional OR cross-sectional OR survey OR surveys OR questionnaire OR questionnaires OR database OR databases OR registry OR registries OR \"follow up\" OR \"follow-up\" OR \"case control\" OR \"case-control\" OR \"case series\" OR \"case report\" OR \"case reports\" OR \"case study\" OR \"case studies\" OR \"case history\" OR \"case histories\" OR \"clinical study\" OR \"clinical studies\" OR observational OR uncontrolled OR \"nonrandomied\" OR \"non-randomied\" OR \"real world\" OR \"real-world\") NEXT ((study OR studies OR design OR analysis OR analyses OR data OR report OR reports OR history OR histories OR search OR searches OR strategy OR strategies OR filter OR filters OR strat* OR filter* OR search strat* OR search filter*)) OR ((observational OR multicenter OR multi-center OR cohort OR cohorts OR epidemiologic OR epidemiological OR prospective OR retrospective OR longitudinal OR cross sectional OR cross-sectional OR survey OR surveys OR questionnaire OR questionnaires OR database OR databases OR registry OR registries OR \"follow up\" OR \"follow-up\" OR \"case control\" OR \"case-control\" OR \"case series\" OR \"case report\" OR \"case reports\" OR \"case study\" OR \"case studies\" OR \"case history\" OR \"case histories\" OR \"clinical study\" OR \"clinical studies\" OR observational OR uncontrolled OR \"nonrandomied\" OR \"non-randomied\" OR \"real world\" OR \"real-world\") NEAR/3 ((search NEXT strat*) OR (search NEXT filter*)):ti,ab,kw))",
ref: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8103566/"
},
],
"Web of Science": [
],
};