---
title: The Moon's Path
draft: true
---
# The Path of the Moon

I just found myself wondering about the path the moon takes on the surface of the Earth.  Let's see if we can work that out.

```js
Plot.plot({
    projection: {
        type: "orthographic",
        rotate: [110, -30]
    },
    marks: [
        Plot.graticule(),
        Plot.sphere(),
        Plot.geo(land, {stroke: "var(--theme-foreground-faint)"}),
    ]
})
```
