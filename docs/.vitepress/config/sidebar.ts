const components = [
  "layout",
  "schema-table",
  "schema-form",
]

export const ComponentSidebars = components.map(name => {
  return {
    text: name,
    link: `/component/${name}/`,
  }
})
