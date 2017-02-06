export const create = (data = { id: Math.random() }) => new Promise((resolve) => {
  const { id } = data

  resolve({
    id: `queue_${id}`,
    data,
    message: 'Queue created successfully'
  })
})
