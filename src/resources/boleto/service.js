export const create = (data = { id: Math.random() }) => new Promise((resolve) => {
  const { id } = data

  resolve({
    id: `bol_${id}`,
    data,
    message: 'Boleto created successfully'
  })
})

export const show = (id = Math.random()) => new Promise((resolve) => {
  resolve({
    id: `bol_${id}`,
    public_url: `https://superbowleto.pagar.me/boletos/token_${id}`
  })
})
