# Vertical Rhythm

Rhythm is a repeated pattern. The more consistent the pattern, the better the rhythm. In print design, the designer uses a baseline grid to set type in order to create vertical rhythm and give unity to the design. The concept is similar on the web. As the viewer’s eye descends the page, everything should be lined up on an imaginary grid of evenly spaced horizontal lines. This improves readability and helps to make the layout harmonious and organized.

## The Basics

Vertical Rhythm is usually (but not always) used on following CSS properties:

1. **Typography** _-_ `line-height`
2. **Spacing** _-_ `padding` (top and bottom), `margin` (top and bottom)
3. **Offsets** _-_ `top`, `bottom`
4. **Size** _-_ `height`, `min-height`, `max-height`

Notice how we don't use vertical rhythm for `font-size`? **Modular scale** is usually used for font sizes in typography. **Vertical rhythm** is only used for _spacing_ and _vertical size_.

### Vertical Rhythm and the `$base-sizing-unit`

As a means for consistency and good vertical rhythm, many measurements are based off the `$base-spacing-unit`, which is equal to the base `$line-height-ratio`. This way if the `$base-font-size` or `$base-line-height` is adjusted down the road, white space proportions are preserved. For example, unless you opt for using CSS Reset, most block-level elements (headings, lists, paragraphs, etc.) will have a bottom margin equal to `$base-spacing-unit`.

## Getting Started

### The "Who, What, Where?!" for Rhythm Units

First off, we need to determine the **rhythm unit**. This will act as a base for multiplication for calculating vertical ryhthm. Since vertical rhythm is tied with repetition, and the most repetitive spacing on any website is a body element's `line-height`, or rather the page's root/base `line-height`. We'll use this base `line-height` as our **rhythm unit**.

```css
html {
    /* Set parent font size */
    font-size: 18px;
}

body {
    /* Set base line-height aka rhythmUnit = 32px */
    line-height: 1.778rem;
}
```

Note that we are using `px` value for easier calculation, it's recommended to use relative values wherever you can. From this configuration, we can calculate **rhythm unit** value: `Rhythm unit = 18px * 1.778rem = 32px`. Alternatively, we can check the line-height of the body element in element inspector.

### Rhythm unit multipliers

Of course, we can't have only one spacing value. This is where rhythm unit multipliers come in.

Implementing Vertical Rhythm from this point on is simple. There are two rules:

1. Set the vertical white space between elements to a multiple of `18px`.
2. Set the line-height of all text elements to a multiple of `18px`.

```css
html {
    /* Set parent font size */
    font-size: 18px;
}

body {
    /* rhythmUnit = 32px */
    line-height: 1.778rem;
}

.spacing__vertical--1 {
    /* 1x rhythmUnit = 32px */
    padding-bottom: 1.778rem;
}

.spacing__vertical--2 {
    /* 2x rhythmUnit = 64px */
    padding-bottom: 3.556rem;
}

.spacing__vertical--3 {
    /* 3x rhythmUnit = 96px */
    padding-bottom: 5.334rem;
}
```

### Repition is Key

**Repetition** breeds familiarity. It has the ability to make things feel as if they belong together. It gives the feeling that someone has thought it all out, like it’s part of the plan.

Vertical Rhythm works for the same reason. We’re simply repeating the baseline throughout the entire page.

But there’s a trick with Vertical Rhythm. The trick lies in determining the baseline. Think about it. Why, of all numbers, did we choose `18px` as our baseline?

There’s only one reason: it’s the value that gets repeated the most on the page.

## Responsive Rythms

This is where things get a little trickier. We have established that `18px` is our base unit. We spaced everything out with multiples and produced a vertical rythm for all out text elements. _HOWEVER_ this base unit and scale may not look great on mobile devices, or 4k ultrawide monitors. This is where we start using `media queries` to alter our rythm unit and multiples based on the screen size. 

```css
/* TODO: Add Responsive Rythm Example */
```
