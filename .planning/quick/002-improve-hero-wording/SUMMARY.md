# Summary: Improve hero wording

## Task
The user requested elevating the "MovingCap: Sophisticated Motion. Radically Simple." slogan from a subtitle to the main hero headline, while providing a new, stronger technical subtitle and description based on MovingCap documentation (specifically highlighting the cabinet-free, integrated web/Python capabilities, all-in-one format, and absolute positioning).

## Changes Made
1. Swapped `hero_title` and `hero_subtitle` concepts in `src/components/i18n/translations.jsx`.
2. Kept the already high-quality translated slogans for the new `hero_title` across EN, DE, IT, and FR.
3. Created newly drafted `hero_subtitle` and `hero_description` that highlight technical properties like "Cabinet-free", "integrated Web, Python & Fieldbus", "absolute position instantly", and "masterless automation."
4. Applied translations for all four languages directly in `translations.jsx`.
5. Adjusted `hero_description` further to explicitly mention compatibility with classic PLCs as well as modern, open software frameworks.
6. Refined the visual design across the entire hero section in `Landing.jsx` to adopt Fullmo's light blue and light grey color scheme (moving away from the generic dark template look). 

## Result
The Landing Page hero section now has a punchier headline and clearly communicates the unique selling points (USPs) of the MovingCap servo drives, while correctly framing its broad integration capabilities. The newly bright and airy visuals matching Fullmo's proper corporate colors present as polished and authentic.