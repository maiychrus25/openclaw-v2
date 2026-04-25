# Website Personality & Design Ingredients Guidelines

Before setting up any UI tokens or style guides, the UI Designer Agent MUST determine the target **Website Personality** and select design ingredients (Colors, Typography, Whitespace, etc.) accordingly.

## 0. Website Personalities Overview

Different personalities have different traits. Choices for design ingredients must strictly align with these traits:

1. **Serious/Elegant:** For luxury and elegance. Based on thin serif typefaces, golden or pastel colors, and big, high-quality images.
2. **Minimalist/Simple:** Focuses on essential text content. Uses small or medium-sized sans-serif black text, bold lines, and very few images/icons.
3. **Plain/Neutral:** Design that gets out of the way. Uses neutral and small typefaces, highly structured layout. Common in large enterprise corporations.
4. **Bold/Confident:** Makes an impact. Features big, bold typography paired with confident layout shifts and large, bright colored blocks.
5. **Calm/Peaceful:** For products/services that care. Uses calming pastel colors, soft serif headings, and matching images/illustrations.
6. **Startup/Upbeat:** Widely used in tech startups. Features medium-sized sans-serif typefaces, light-grey text/backgrounds, and slightly rounded elements.
7. **Playful/Fun:** Colorful and extremely round designs. Powered by creative elements like hand-drawn icons/illustrations, bouncy animations, and fun language.

---

## 1. Typography
1. Use only good, popular typefaces. Play it safe.
2. It’s okay to use just one typeface per page! If you need more, limit to a maximum of 2 typefaces.
3. Choose the right typeface according to the website personality.
4. When choosing font sizes, limit choices! Use a "type scale" tool or predefined range (e.g., modular scale).
5. Use a font size between 16px and 32px for "normal" body text. (For long reading blocks like articles, try 20px+).
6. For headlines, go really big (50px+) and bold (600+), depending on the chosen personality.
7. For any text, never use a font weight under 400 (regular).
8. Restrict line lengths to less than 75 characters per line to maintain ideal readability.
9. For normal text, line root height should be between 1.5 and 2. For big headline text, go below 1.5.
10. Decrease letter spacing (tracking) in huge headlines if it looks unnatural. Experiment with all-caps for short sub-titles: make them small, bold, and drastically increase letter-spacing.
11. Mostly, avoid justified text. Do not center long text blocks (centering 1-3 lines is fine).

## 2. Colors
1. The main color must convey the meaning of the website's personality.
2. Choose a curated color tone. Avoid random Hex values or default CSS named colors (like `red`, `blue`).
3. Core palette requirement: At least a primary (main) color and a neutral (grey) scale. Add accent (secondary) colors carefully.
4. For visual diversity, pre-calculate lighter and darker versions (tints and shades) of your primary color.
5. Use the main color strategically to draw attention to the most important CTAs or make sections stand out.
6. On dark-colored backgrounds, use a bright tint of the background color for text. Text should rarely be #000000 pure black (lighten it up if it feels heavy).
7. Never make text too light! Always guarantee WCAG contrast ratios.

## 3. Images and Illustrations
1. Use relevant images (product photos, storytelling lifestyle photos, patterns) to support the message natively.
2. Prefer original-looking stock images over generic corporate stock. Show real people to trigger emotions.
3. When placing text over images: Darken/brighten the image via gradient overlay, find a neutral empty area, or put the text inside an opaque box.
4. Always compress images and ensure side-by-side images share exact aspect ratios.

## 4. Icons
1. Stick to a single, high-quality icon pack (SVG format). Do NOT mix icon styles or use bitmap (.jpg/.png).
2. Sync icon styles with personality (e.g., thick/rounded icons match bold typography, thin/outlined icons match elegant serif).
3. Keep icons neutral (same color as surrounding text) unless specifically intended to draw attention.
4. Do not arbitrarily scale icons beyond their intended viewBox size; encapsulate them in standard shapes if needed.

## 5. Shadows
1. Shadows are purely optional. Only apply them if fitting the personality (e.g., Startup/Upbeat, but avoid in Minimalist).
2. Go light on shadows—never make them heavily opaque or harsh dark `#000`.
3. Small shadows: for tiny clickable elements. Medium shadows: for floating cards. Large shadows: for modals aggressively floating above the interface.
4. Experiment with hover state interactions and colored glows (a softened shadow matched to the element's background color).

## 6. Border-radius
1. Border-radius drastically increases the playfulness of the design.
2. Typeface synergy: If your typeface is highly rounded, your border-radius should match that exact roundness!
3. Maintain exact consistency across buttons, cards, and input fields based on the generic design token.

## 7. Whitespace
1. Use TONS of whitespace between macro sections. Use generous whitespace between logical groups.
2. Law of Proximity: The more elements belong together, the closer they should be.
3. Set a hard mathematical rule for spacing (e.g., standard 16px or 8px multi-scale grid).
4. Match your whitespace volume to your typography sizes (Huge typography demands huge margins).

## 8. Visual Hierarchy
1. Position critical goal-oriented elements closer to the top of the page.
2. Utilize font size, visual font weight, color contrast, and whitespace to loudly dictate what should be read first.
3. Use background colors or boundary borders to emphasize a hero component (Testimonials, CTAs, Pricing tiers) over a secondary component.

## 9. User Experience (UX)
1. Do not invent complicated maze-like layouts. Use standardized UI patterns that users intuitively know.
2. Make Call-To-Action (CTA) buttons visually dominant with highly descriptive verbs (e.g., "Start Free Trial" instead of "Click Here").
3. Blue and underlined text should strictly be reserved for actionable links.
4. UI animations must serve a purpose and resolve quickly (between 200ms and 500ms).
5. In forms, stack labels vertically above fields for fastest scanning. Always provide clear visual feedback for success and error states.
6. Headers should be keyword-focused and clear—cut out corporate fluff. Use simple human words.

## 10. Elements and Components
1. Standardize base elements before assembling complex components.
2. Ensure components flow logically across breakpoints to guarantee responsivenes.
