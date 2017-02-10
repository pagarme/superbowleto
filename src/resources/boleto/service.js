import { models } from '../../database'

export const create = data => models.boleto.create(data)

export const show = (id = Math.random()) => new Promise((resolve) => {
  resolve({
    id: `bol_${id}`,
    public_url: `https://superbowleto.pagar.me/boletos/token_${id}`
  })
})
