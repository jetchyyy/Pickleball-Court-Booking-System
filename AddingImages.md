# How to Add Court Images

1.  **Save your images** into the `public/images` folder in your project.
    *   Example: `public/images/court-1.jpg`

2.  **Update the data** in `src/data/courts.js`.
    *   Change the `image` property to match your file path (starting with `/`).

## Example:

```javascript
export const courts = [
  {
    id: 1,
    name: 'Center Court',
    // ...
    image: '/images/court-1.jpg', // <--- Update this line
    // ...
  },
  // ...
];
```

*Note: You do not need to restart the server. The images will appear automatically.*
