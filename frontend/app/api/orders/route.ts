import { forward } from '../_forward'

export async function POST(request: Request) {
  return forward(request, 'orders', 'ORD')
}
